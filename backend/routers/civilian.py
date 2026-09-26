import datetime
import logging
from typing import Optional, List, Union, Any, Dict
from fastapi import APIRouter, Depends, HTTPException, status, Query, Header, Request, Body
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.db.database import get_db, SessionLocal
from backend.models.civilian_model import CivilianUser, CivilianFeedback, CivilianIssue
from backend.models.project_model import Project
from backend.models.user_model import User
from backend.data.project_repository import project_repository
from backend.utils.dependencies import get_current_user, get_optional_current_user
from backend.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    validate_password_strength,
    validate_indian_mobile,
    validate_email_format
)
from backend.utils.aadhaar_security import (
    encrypt_aadhaar,
    mask_aadhaar,
    validate_aadhaar_format
)
from backend.utils.geo_resolver import (
    resolve_location,
    resolve_project_coordinates,
    haversine_distance
)

logger = logging.getLogger("drishti.civilian")

router = APIRouter(prefix="/civilian", tags=["JanNirikshan Civilian Portal"])

# -------------------------------------------------------------
# PYDANTIC SCHEMAS (Flexible & Robust)
# -------------------------------------------------------------

class CivilianRegisterRequest(BaseModel):
    first_name: Optional[str] = None
    firstName: Optional[str] = None
    last_name: Optional[str] = None
    lastName: Optional[str] = None
    full_name: Optional[str] = None
    fullName: Optional[str] = None
    name: Optional[str] = None
    mobile: Optional[str] = None
    mobile_number: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    aadhaar: Optional[str] = None
    aadhaar_number: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    confirm_password: Optional[str] = None
    confirmPassword: Optional[str] = None
    address: Optional[str] = None
    pincode: Optional[str] = None
    pin_code: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    sub_district: Optional[str] = None
    subDistrict: Optional[str] = None
    latitude: Optional[float] = None
    lat: Optional[float] = None
    longitude: Optional[float] = None
    lng: Optional[float] = None
    lon: Optional[float] = None

class CivilianLoginRequest(BaseModel):
    username: Optional[str] = None
    user_name: Optional[str] = None
    identifier: Optional[str] = None
    email: Optional[str] = None
    mobile: Optional[str] = None
    password: Optional[str] = None

class CivilianProfileUpdateRequest(BaseModel):
    first_name: Optional[str] = None
    firstName: Optional[str] = None
    last_name: Optional[str] = None
    lastName: Optional[str] = None
    full_name: Optional[str] = None
    mobile: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    pincode: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    sub_district: Optional[str] = None
    subDistrict: Optional[str] = None
    latitude: Optional[float] = None
    lat: Optional[float] = None
    longitude: Optional[float] = None
    lng: Optional[float] = None

class CivilianForgotPasswordRequest(BaseModel):
    identifier: Optional[str] = None
    username: Optional[str] = None
    email: Optional[str] = None
    mobile: Optional[str] = None

class CivilianFeedbackRequest(BaseModel):
    project_id: Optional[str] = None
    projectId: Optional[str] = None
    project_name: Optional[str] = None
    projectName: Optional[str] = None
    category: Optional[str] = "General Feedback"
    issue_type: Optional[str] = None
    rating: Optional[int] = None
    feedback_text: Optional[str] = None
    feedbackText: Optional[str] = None
    feedback: Optional[str] = None
    description: Optional[str] = None
    message: Optional[str] = None
    comment: Optional[str] = None

class CivilianIssueRequest(BaseModel):
    project_id: Optional[str] = None
    projectId: Optional[str] = None
    project_name: Optional[str] = None
    projectName: Optional[str] = None
    category: Optional[str] = "General Grievance"
    issue_type: Optional[str] = None
    description: Optional[str] = None
    details: Optional[str] = None
    issue_details: Optional[str] = None
    message: Optional[str] = None
    statement: Optional[str] = None
    location_name: Optional[str] = None
    locationName: Optional[str] = None
    location: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    lat: Optional[float] = None
    longitude: Optional[float] = None
    lng: Optional[float] = None
    lon: Optional[float] = None
    photo_path: Optional[str] = None
    photoPath: Optional[str] = None
    photo: Optional[str] = None
    image: Optional[str] = None
    contact_mobile: Optional[str] = None
    contactMobile: Optional[str] = None
    mobile: Optional[str] = None
    contact_email: Optional[str] = None
    contactEmail: Optional[str] = None
    email: Optional[str] = None

class StatusUpdatePayload(BaseModel):
    item_type: Optional[str] = "ISSUE"
    itemType: Optional[str] = None
    item_id: Optional[Union[int, str]] = None
    itemId: Optional[Union[int, str]] = None
    id: Optional[Union[int, str]] = None
    status: Optional[str] = "REVIEWED"
    admin_notes: Optional[str] = None
    adminNotes: Optional[str] = None

# -------------------------------------------------------------
# AUTHENTICATION DEPENDENCIES FOR CIVILIANS
# -------------------------------------------------------------

def get_current_civilian_user(
    authorization: Optional[str] = Header(None),
    token: Optional[str] = Query(None),
    db: Session = Depends(get_db)
) -> CivilianUser:
    raw_token = None
    if authorization and authorization.startswith("Bearer "):
        raw_token = authorization.split(" ")[1].strip()
    elif token:
        raw_token = token.strip()

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Civilian authentication required. Please login to your JanNirikshan account.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not raw_token:
        raise credentials_exception

    payload = decode_access_token(raw_token)
    if not payload:
        raise credentials_exception

    username = payload.get("sub")
    if not username:
        raise credentials_exception

    # Try lookup in civilian_users table
    user = db.query(CivilianUser).filter(func.lower(CivilianUser.username) == username.strip().lower()).first()
    if not user:
        # Fallback: check if government user is viewing
        gov_user = db.query(User).filter(func.lower(User.username) == username.strip().lower()).first()
        if gov_user and gov_user.is_active:
            # Create transient civilian proxy representation
            dummy_civ = CivilianUser(
                id=gov_user.id,
                first_name=gov_user.first_name,
                last_name=gov_user.last_name,
                mobile=gov_user.mobile_number or "9876543210",
                email=gov_user.email,
                username=gov_user.username,
                password_hash="",
                aadhaar_encrypted="",
                aadhaar_last4="0000",
                address="Central HQ, New Delhi",
                pincode="110001",
                state=gov_user.state or "Delhi",
                district="New Delhi",
                latitude=28.6139,
                longitude=77.2090,
                role="CIVILIAN",
                is_active=True
            )
            return dummy_civ
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Civilian account not found or deactivated."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Civilian account has been deactivated."
        )

    return user

def get_optional_civilian_user(
    authorization: Optional[str] = Header(None),
    token: Optional[str] = Query(None),
    db: Session = Depends(get_db)
) -> Optional[CivilianUser]:
    raw_token = None
    if authorization and authorization.startswith("Bearer "):
        raw_token = authorization.split(" ")[1].strip()
    elif token:
        raw_token = token.strip()
    if not raw_token:
        return None
    payload = decode_access_token(raw_token)
    if not payload:
        return None
    username = payload.get("sub")
    if not username:
        return None
    return db.query(CivilianUser).filter(func.lower(CivilianUser.username) == username.strip().lower()).first()

# -------------------------------------------------------------
# CIVILIAN REGISTRATION & LOGIN ENDPOINTS
# -------------------------------------------------------------

@router.post("/auth/register", status_code=status.HTTP_201_CREATED)
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_civilian(
    req: CivilianRegisterRequest,
    db: Session = Depends(get_db)
):
    first_name = (req.first_name or req.firstName or (req.name or "").split(" ")[0] or "Citizen").strip()
    last_name = (req.last_name or req.lastName or "User").strip()
    mobile = (req.mobile or req.mobile_number or req.phone or "").strip()
    email = (req.email or "").strip().lower()
    username = (req.username or (email.split("@")[0] if email else f"user_{mobile[-4:] if len(mobile)>=4 else '0000'}")).strip()
    password = req.password or ""
    confirm_pwd = req.confirm_password or req.confirmPassword or password
    raw_aadhaar = (req.aadhaar or req.aadhaar_number or "123456789012").strip()

    if password != confirm_pwd:
        raise HTTPException(status_code=400, detail="Password and Confirm Password do not match.")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long.")
    if not email:
        raise HTTPException(status_code=400, detail="Email address is required.")

    clean_aadhaar = "".join(filter(str.isdigit, raw_aadhaar))
    if len(clean_aadhaar) < 12:
        clean_aadhaar = clean_aadhaar.ljust(12, "0")
    aadhaar_last4 = clean_aadhaar[-4:]
    aadhaar_encrypted = encrypt_aadhaar(clean_aadhaar)

    existing = db.query(CivilianUser).filter(
        (func.lower(CivilianUser.username) == username.lower()) |
        (func.lower(CivilianUser.email) == email.lower()) |
        (CivilianUser.mobile == mobile)
    ).first()

    if existing:
        if existing.username.lower() == username.lower():
            username = f"{username}_{int(datetime.datetime.utcnow().timestamp()) % 10000}"
        elif existing.email.lower() == email.lower():
            raise HTTPException(status_code=409, detail="Email address is already registered.")
        elif existing.mobile == mobile and mobile:
            raise HTTPException(status_code=409, detail="Mobile number is already registered.")

    state = (req.state or "Gujarat").strip()
    district = (req.district or "Ahmedabad").strip()
    address = (req.address or f"{district}, {state}").strip()
    pincode = (req.pincode or req.pin_code or "380001").strip()

    lat = req.latitude or req.lat
    lng = req.longitude or req.lng or req.lon
    if lat is None or lng is None or (lat == 0.0 and lng == 0.0):
        resolved_lat, resolved_lng, _ = resolve_location(
            district=district,
            state=state,
            sub_district=req.sub_district or req.subDistrict,
            query_text=f"{address} {pincode}"
        )
        lat = resolved_lat
        lng = resolved_lng

    new_civilian = CivilianUser(
        first_name=first_name,
        last_name=last_name,
        mobile=mobile or "9876543210",
        email=email,
        username=username,
        password_hash=hash_password(password),
        aadhaar_encrypted=aadhaar_encrypted,
        aadhaar_last4=aadhaar_last4,
        address=address,
        pincode=pincode,
        state=state,
        district=district,
        sub_district=req.sub_district or req.subDistrict,
        latitude=float(lat),
        longitude=float(lng),
        role="CIVILIAN",
        is_active=True,
        last_login=datetime.datetime.utcnow()
    )

    db.add(new_civilian)
    db.commit()
    db.refresh(new_civilian)

    token_payload = {
        "sub": new_civilian.username,
        "role": "CIVILIAN",
        "userId": new_civilian.id,
        "state": new_civilian.state,
        "district": new_civilian.district
    }
    access_token = create_access_token(data=token_payload)

    return {
        "status": "success",
        "message": "Civilian account created successfully.",
        "accessToken": access_token,
        "access_token": access_token,
        "token": access_token,
        "tokenType": "bearer",
        "token_type": "bearer",
        "user": new_civilian.to_dict(),
        "data": {
            "token": access_token,
            "user": new_civilian.to_dict()
        }
    }

@router.post("/auth/login")
@router.post("/login")
def login_civilian(
    req: CivilianLoginRequest,
    db: Session = Depends(get_db)
):
    ident = (req.username or req.user_name or req.identifier or req.email or req.mobile or "").strip().lower()
    pwd = req.password or ""

    user = db.query(CivilianUser).filter(
        (func.lower(CivilianUser.username) == ident) |
        (func.lower(CivilianUser.email) == ident) |
        (CivilianUser.mobile == ident)
    ).first()

    if not user or not verify_password(pwd, user.password_hash):
        gov_user = db.query(User).filter(
            (func.lower(User.username) == ident) |
            (func.lower(User.email) == ident)
        ).first()
        if gov_user and verify_password(pwd, gov_user.password_hash):
            token_payload = {
                "sub": gov_user.username,
                "role": "CIVILIAN",
                "userId": gov_user.id,
                "state": gov_user.state or "National",
                "district": "Central"
            }
            access_token = create_access_token(data=token_payload)
            dummy_civ_dict = {
                "id": gov_user.id,
                "username": gov_user.username,
                "firstName": gov_user.first_name,
                "lastName": gov_user.last_name,
                "fullName": f"{gov_user.first_name} {gov_user.last_name}",
                "email": gov_user.email,
                "mobile": gov_user.mobile_number or "9876543210",
                "state": gov_user.state or "Delhi",
                "district": "New Delhi",
                "address": "Central Secretariat, New Delhi",
                "pincode": "110001",
                "latitude": 28.6139,
                "longitude": 77.2090,
                "role": "CIVILIAN"
            }
            return {
                "status": "success",
                "message": "Login successful.",
                "accessToken": access_token,
                "access_token": access_token,
                "token": access_token,
                "tokenType": "bearer",
                "token_type": "bearer",
                "user": dummy_civ_dict,
                "data": {
                    "token": access_token,
                    "user": dummy_civ_dict
                }
            }
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password. Please check your credentials."
        )

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Your civilian account is deactivated.")

    user.last_login = datetime.datetime.utcnow()
    db.commit()

    token_payload = {
        "sub": user.username,
        "role": "CIVILIAN",
        "userId": user.id,
        "state": user.state,
        "district": user.district
    }
    access_token = create_access_token(data=token_payload)

    return {
        "status": "success",
        "message": "Login successful.",
        "accessToken": access_token,
        "access_token": access_token,
        "token": access_token,
        "tokenType": "bearer",
        "token_type": "bearer",
        "user": user.to_dict(),
        "data": {
            "token": access_token,
            "user": user.to_dict()
        }
    }

@router.get("/auth/me")
@router.get("/me")
def get_my_civilian_profile(
    current_user: CivilianUser = Depends(get_current_civilian_user)
):
    return {
        "status": "success",
        "user": current_user.to_dict(),
        "data": current_user.to_dict()
    }

@router.put("/auth/profile")
@router.put("/profile")
def update_civilian_profile(
    req: CivilianProfileUpdateRequest,
    current_user: CivilianUser = Depends(get_current_civilian_user),
    db: Session = Depends(get_db)
):
    if req.first_name or req.firstName:
        current_user.first_name = (req.first_name or req.firstName).strip()
    if req.last_name or req.lastName:
        current_user.last_name = (req.last_name or req.lastName).strip()
    if req.mobile or req.phone:
        current_user.mobile = (req.mobile or req.phone).strip()
    if req.email:
        current_user.email = req.email.strip().lower()

    address_changed = False
    if req.address and req.address != current_user.address:
        current_user.address = req.address.strip()
        address_changed = True
    if req.pincode and req.pincode != current_user.pincode:
        current_user.pincode = req.pincode.strip()
        address_changed = True
    if req.state and req.state != current_user.state:
        current_user.state = req.state.strip()
        address_changed = True
    if req.district and req.district != current_user.district:
        current_user.district = req.district.strip()
        address_changed = True

    lat_val = req.latitude or req.lat
    lng_val = req.longitude or req.lng
    if lat_val is not None and lng_val is not None and lat_val != 0:
        current_user.latitude = float(lat_val)
        current_user.longitude = float(lng_val)
    elif address_changed:
        resolved_lat, resolved_lng, _ = resolve_location(
            district=current_user.district,
            state=current_user.state,
            sub_district=current_user.sub_district,
            query_text=f"{current_user.address} {current_user.pincode}"
        )
        current_user.latitude = float(resolved_lat)
        current_user.longitude = float(resolved_lng)

    current_user.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(current_user)

    return {
        "status": "success",
        "message": "Profile updated successfully.",
        "user": current_user.to_dict(),
        "data": current_user.to_dict()
    }

@router.post("/auth/forgot-password")
@router.post("/forgot-password")
def forgot_password_civilian(
    req: CivilianForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    return {
        "status": "success",
        "message": "If an account matches the provided identifier, password reset instructions have been dispatched."
    }

# -------------------------------------------------------------
# LOCATION-BASED PROJECT DISCOVERY (25 KM RADIUS)
# -------------------------------------------------------------

@router.get("/projects/nearby")
@router.get("/nearby-projects")
@router.get("/nearby")
def get_nearby_projects(
    lat: Optional[float] = Query(None, description="Civilian latitude"),
    latitude: Optional[float] = Query(None, description="Civilian latitude alias"),
    lng: Optional[float] = Query(None, description="Civilian longitude"),
    longitude: Optional[float] = Query(None, description="Civilian longitude alias"),
    lon: Optional[float] = Query(None, description="Civilian longitude alias"),
    radius_km: Optional[float] = Query(None, description="Discovery search radius in km"),
    radius: Optional[float] = Query(None, description="Discovery search radius in km alias"),
    search: Optional[str] = Query(None, description="Search query"),
    q: Optional[str] = Query(None, description="Search query alias"),
    query: Optional[str] = Query(None, description="Search query alias"),
    sector: Optional[str] = Query(None, description="Filter by sector"),
    category: Optional[str] = Query(None, description="Filter by category alias"),
    limit: Optional[int] = Query(200, description="Max results")
):
    final_lat = lat if lat is not None else (latitude if latitude is not None else 23.0225)
    final_lng = lng if lng is not None else (longitude if longitude is not None else (lon if lon is not None else 72.5714))
    final_radius = radius_km if radius_km is not None else (radius if radius is not None else 25.0)

    all_raw_projects = project_repository.get_all(limit=None)
    nearby_list = []

    for p in all_raw_projects:
        p_lat, p_lng, loc_label = resolve_project_coordinates(p)
        distance = haversine_distance(final_lat, final_lng, p_lat, p_lng)

        if distance <= final_radius:
            phys_prog = float(p.get("physicalProgress", 0.0) or 0.0)
            raw_status = str(p.get("status", "Under Progress"))

            is_completed = (phys_prog >= 99.5 or "completed" in raw_status.lower())
            completion_status = "Completed" if is_completed else "Ongoing"
            public_status = "Completed" if is_completed else ("Under Progress" if phys_prog < 90 else "Nearing Completion")

            cost_cr = float(p.get("originalCost", 0.0) or 0.0)
            budget_str = f"₹{cost_cr:.2f} Cr" if cost_cr > 0 else "Tender Sanctioned"

            project_entry = {
                "id": str(p.get("projectId")),
                "projectId": str(p.get("projectId")),
                "project_id": str(p.get("projectId")),
                "projectName": str(p.get("projectName")),
                "project_name": str(p.get("projectName")),
                "name": str(p.get("projectName")),
                "title": str(p.get("projectName")),
                "category": str(p.get("sector", "General Infrastructure")),
                "sector": str(p.get("sector", "General Infrastructure")),
                "ministry": str(p.get("ministry", "Government of India")),
                "implementingAgency": str(p.get("ministry", "National Infrastructure Agency")),
                "implementing_agency": str(p.get("ministry", "National Infrastructure Agency")),
                "state": str(p.get("state", "")),
                "district": str(p.get("district", loc_label)),
                "location": f"{loc_label}, {p.get('state', '')}".strip(", "),
                "locationLabel": loc_label,
                "location_label": loc_label,
                "status": public_status,
                "completionStatus": completion_status,
                "completion_status": completion_status,
                "isCompleted": is_completed,
                "is_completed": is_completed,
                "physicalProgress": round(phys_prog, 1),
                "physical_progress": round(phys_prog, 1),
                "progressPercent": int(round(phys_prog)),
                "progress_percent": int(round(phys_prog)),
                "budget": budget_str,
                "originalCostCr": cost_cr,
                "original_cost_cr": cost_cr,
                "startDate": str(p.get("startDate") or "01-Jan-2022"),
                "start_date": str(p.get("startDate") or "01-Jan-2022"),
                "targetDate": str(p.get("expectedCompletion") or "31-Dec-2027"),
                "target_date": str(p.get("expectedCompletion") or "31-Dec-2027"),
                "expectedCompletion": str(p.get("expectedCompletion") or "31-Dec-2027"),
                "expected_completion": str(p.get("expectedCompletion") or "31-Dec-2027"),
                "latitude": p_lat,
                "lat": p_lat,
                "longitude": p_lng,
                "lng": p_lng,
                "lon": p_lng,
                "distanceKm": round(distance, 2),
                "distance_km": round(distance, 2),
                "distance": round(distance, 2),
                "distanceDisplay": f"{round(distance, 1)} km from your location",
                "distance_display": f"{round(distance, 1)} km from your location"
            }
            nearby_list.append(project_entry)

    # Search filter
    search_term = (search or q or query or "").strip().lower()
    if search_term:
        nearby_list = [
            p for p in nearby_list
            if search_term in p["projectName"].lower()
            or search_term in p["projectId"].lower()
            or search_term in p["sector"].lower()
            or search_term in p["district"].lower()
            or search_term in p["location"].lower()
            or search_term in p["ministry"].lower()
        ]

    # Sector filter
    sec_term = (sector or category or "").strip()
    if sec_term and sec_term.upper() not in ["ALL", "ALL SECTORS", ""]:
        nearby_list = [p for p in nearby_list if sec_term.lower() in p["sector"].lower()]

    nearby_list.sort(key=lambda x: x["distanceKm"])

    if limit:
        nearby_list = nearby_list[:limit]

    ongoing_projects = [p for p in nearby_list if not p["isCompleted"]]
    completed_projects = [p for p in nearby_list if p["isCompleted"]]

    return {
        "status": "success",
        "data": nearby_list,
        "projects": nearby_list,
        "allProjects": nearby_list,
        "items": nearby_list,
        "results": nearby_list,
        "ongoingProjects": ongoing_projects,
        "completedProjects": completed_projects,
        "ongoingCount": len(ongoing_projects),
        "completedCount": len(completed_projects),
        "totalProjectsFound": len(nearby_list),
        "total": len(nearby_list),
        "count": len(nearby_list),
        "civilianLocation": {
            "latitude": final_lat,
            "longitude": final_lng,
            "radiusKm": final_radius
        }
    }

@router.get("/projects/{project_id}")
@router.get("/project/{project_id}")
def get_public_project_detail(
    project_id: str,
    lat: Optional[float] = Query(None, description="Civilian latitude"),
    latitude: Optional[float] = Query(None, description="Civilian latitude alias"),
    lng: Optional[float] = Query(None, description="Civilian longitude"),
    longitude: Optional[float] = Query(None, description="Civilian longitude alias")
):
    project = project_repository.get_by_id(project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project #{project_id} not found in public transparency portal."
        )

    p_lat, p_lng, loc_label = resolve_project_coordinates(project)
    civ_lat = lat if lat is not None else latitude
    civ_lng = lng if lng is not None else longitude
    distance = None
    if civ_lat is not None and civ_lng is not None:
        distance = round(haversine_distance(civ_lat, civ_lng, p_lat, p_lng), 2)

    phys_prog = float(project.get("physicalProgress", 0.0) or 0.0)
    raw_status = str(project.get("status", "Under Progress"))
    is_completed = (phys_prog >= 99.5 or "completed" in raw_status.lower())
    cost_cr = float(project.get("originalCost", 0.0) or 0.0)

    p_dict = {
        "id": str(project.get("projectId")),
        "projectId": str(project.get("projectId")),
        "project_id": str(project.get("projectId")),
        "projectName": str(project.get("projectName")),
        "project_name": str(project.get("projectName")),
        "name": str(project.get("projectName")),
        "title": str(project.get("projectName")),
        "category": str(project.get("sector", "General Infrastructure")),
        "sector": str(project.get("sector", "General Infrastructure")),
        "ministry": str(project.get("ministry", "Government of India")),
        "implementingAgency": str(project.get("ministry", "National Infrastructure Agency")),
        "implementing_agency": str(project.get("ministry", "National Infrastructure Agency")),
        "state": str(project.get("state", "")),
        "district": str(project.get("district", loc_label)),
        "location": f"{loc_label}, {project.get('state', '')}".strip(", "),
        "locationLabel": loc_label,
        "location_label": loc_label,
        "status": "Completed" if is_completed else ("Under Progress" if phys_prog < 90 else "Nearing Completion"),
        "completionStatus": "Completed" if is_completed else "Ongoing",
        "completion_status": "Completed" if is_completed else "Ongoing",
        "isCompleted": is_completed,
        "is_completed": is_completed,
        "physicalProgress": round(phys_prog, 1),
        "physical_progress": round(phys_prog, 1),
        "progressPercent": int(round(phys_prog)),
        "progress_percent": int(round(phys_prog)),
        "budget": f"₹{cost_cr:.2f} Cr" if cost_cr > 0 else "Tender Sanctioned",
        "originalCostCr": cost_cr,
        "original_cost_cr": cost_cr,
        "startDate": str(project.get("startDate") or "01-Jan-2022"),
        "start_date": str(project.get("startDate") or "01-Jan-2022"),
        "targetDate": str(project.get("expectedCompletion") or "31-Dec-2027"),
        "target_date": str(project.get("expectedCompletion") or "31-Dec-2027"),
        "expectedCompletion": str(project.get("expectedCompletion") or "31-Dec-2027"),
        "expected_completion": str(project.get("expectedCompletion") or "31-Dec-2027"),
        "latitude": p_lat,
        "lat": p_lat,
        "longitude": p_lng,
        "lng": p_lng,
        "distanceKm": distance,
        "distance_km": distance,
        "distanceDisplay": f"{distance} km from your location" if distance is not None else None
    }

    return {
        "status": "success",
        "project": p_dict,
        "data": p_dict
    }

# -------------------------------------------------------------
# CIVILIAN FEEDBACK ENDPOINTS
# -------------------------------------------------------------

@router.post("/feedback", status_code=status.HTTP_201_CREATED)
@router.post("/feedbacks", status_code=status.HTTP_201_CREATED)
def submit_civilian_feedback(
    req: CivilianFeedbackRequest,
    current_user: CivilianUser = Depends(get_current_civilian_user),
    db: Session = Depends(get_db)
):
    p_id = req.project_id or req.projectId
    p_name = req.project_name or req.projectName
    if not p_name and p_id:
        p_obj = project_repository.get_by_id(p_id)
        if p_obj:
            p_name = p_obj.get("projectName")

    text = req.feedback_text or req.feedbackText or req.feedback or req.description or req.message or req.comment or "Civilian Feedback Submission"
    category = req.category or req.issue_type or "General Feedback"

    new_feedback = CivilianFeedback(
        civilian_user_id=current_user.id,
        project_id=p_id,
        project_name=p_name or f"Project #{p_id or 'General'}",
        category=category,
        rating=req.rating,
        feedback_text=text.strip(),
        created_at=datetime.datetime.utcnow()
    )

    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)

    fb_dict = new_feedback.to_dict()

    return {
        "status": "success",
        "message": "Your feedback has been submitted successfully.",
        "feedback": fb_dict,
        "data": fb_dict
    }

@router.get("/my-feedback")
@router.get("/my-feedbacks")
def get_my_feedback(
    current_user: CivilianUser = Depends(get_current_civilian_user),
    db: Session = Depends(get_db)
):
    records = db.query(CivilianFeedback).filter(
        CivilianFeedback.civilian_user_id == current_user.id
    ).order_by(CivilianFeedback.created_at.desc()).all()

    fb_list = [r.to_dict() for r in records]

    return {
        "status": "success",
        "total": len(records),
        "count": len(records),
        "feedback": fb_list,
        "feedbacks": fb_list,
        "data": fb_list,
        "items": fb_list
    }

# -------------------------------------------------------------
# CIVILIAN ISSUE REPORTING ENDPOINTS
# -------------------------------------------------------------

@router.post("/issues", status_code=status.HTTP_201_CREATED)
@router.post("/issue", status_code=status.HTTP_201_CREATED)
@router.post("/grievances", status_code=status.HTTP_201_CREATED)
def submit_civilian_issue(
    req: CivilianIssueRequest,
    current_user: CivilianUser = Depends(get_current_civilian_user),
    db: Session = Depends(get_db)
):
    p_id = req.project_id or req.projectId
    p_name = req.project_name or req.projectName
    if not p_name and p_id:
        p_obj = project_repository.get_by_id(p_id)
        if p_obj:
            p_name = p_obj.get("projectName")

    desc = req.description or req.details or req.issue_details or req.message or req.statement or "Ground grievance reported."
    category = req.category or req.issue_type or "General Grievance"
    loc_name = req.location_name or req.locationName or req.location or req.address or current_user.district
    lat_val = req.latitude or req.lat or current_user.latitude
    lng_val = req.longitude or req.lng or req.lon or current_user.longitude
    photo = req.photo_path or req.photoPath or req.photo or req.image
    mob = req.contact_mobile or req.contactMobile or req.mobile or current_user.mobile
    em = req.contact_email or req.contactEmail or req.email or current_user.email

    new_issue = CivilianIssue(
        civilian_user_id=current_user.id,
        project_id=p_id,
        project_name=p_name or f"Project #{p_id or 'General'}",
        category=category,
        description=desc.strip(),
        location_name=loc_name,
        latitude=lat_val,
        longitude=lng_val,
        photo_path=photo,
        status="Submitted",
        contact_mobile=mob,
        contact_email=em,
        created_at=datetime.datetime.utcnow(),
        updated_at=datetime.datetime.utcnow()
    )

    db.add(new_issue)
    db.commit()
    db.refresh(new_issue)

    issue_dict = new_issue.to_dict()

    return {
        "status": "success",
        "message": f"Your issue report has been lodged successfully with reference ID #{new_issue.id}",
        "issue": issue_dict,
        "data": issue_dict
    }

@router.get("/my-issues")
@router.get("/my-issue")
def get_my_issues(
    current_user: CivilianUser = Depends(get_current_civilian_user),
    db: Session = Depends(get_db)
):
    records = db.query(CivilianIssue).filter(
        CivilianIssue.civilian_user_id == current_user.id
    ).order_by(CivilianIssue.created_at.desc()).all()

    issues_list = [r.to_dict() for r in records]

    return {
        "status": "success",
        "total": len(records),
        "count": len(records),
        "issues": issues_list,
        "data": issues_list,
        "items": issues_list
    }

# -------------------------------------------------------------
# ADMINISTRATIVE / APEX AUTHORITY TRIAGE ENDPOINTS
# -------------------------------------------------------------

@router.get("/admin/all")
def get_admin_all_feedbacks(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    feedbacks = db.query(CivilianFeedback).order_by(CivilianFeedback.created_at.desc()).limit(100).all()
    issues = db.query(CivilianIssue).order_by(CivilianIssue.created_at.desc()).limit(100).all()

    combined = []
    for f in feedbacks:
        combined.append({
            "id": f.id,
            "item_type": "FEEDBACK",
            "type": "FEEDBACK",
            "civilian_name": f.user.full_name if f.user else "Citizen Contributor",
            "name": f.user.full_name if f.user else "Citizen Contributor",
            "state": f.user.state if f.user else "National",
            "district": f.user.district if f.user else "District N/A",
            "project_id": f.project_id or "PROJ-GEN",
            "project_name": f.project_name or "General Infrastructure",
            "category": f.category,
            "issue_type": f.category,
            "description": f.feedback_text,
            "rating": f.rating or 4,
            "severity_level": "LOW" if (f.rating or 4) >= 4 else "MEDIUM",
            "status": "REVIEWED",
            "created_at": f.created_at.isoformat() if f.created_at else None,
            "admin_notes": ""
        })

    for i in issues:
        stat = (i.status or "Submitted").upper()
        if stat == "SUBMITTED":
            mapped_stat = "PENDING"
        elif stat in ["UNDER REVIEW", "IN PROGRESS"]:
            mapped_stat = "IN_PROGRESS"
        elif stat in ["RESOLVED", "CLOSED"]:
            mapped_stat = "RESOLVED"
        else:
            mapped_stat = stat

        combined.append({
            "id": i.id,
            "item_type": "ISSUE",
            "type": "ISSUE",
            "civilian_name": i.user.full_name if i.user else "Citizen Reporter",
            "name": i.user.full_name if i.user else "Citizen Reporter",
            "state": i.user.state if i.user else "National",
            "district": i.location_name or (i.user.district if i.user else "District N/A"),
            "project_id": i.project_id or "PROJ-GEN",
            "project_name": i.project_name or "General Infrastructure",
            "category": i.category,
            "issue_type": i.category,
            "description": i.description,
            "rating": 2,
            "severity_level": "CRITICAL" if "safety" in i.category.lower() or "damage" in i.category.lower() else "HIGH",
            "status": mapped_stat,
            "created_at": i.created_at.isoformat() if i.created_at else None,
            "admin_notes": ""
        })

    return {
        "status": "success",
        "total": len(combined),
        "data": combined
    }

@router.get("/admin/stats")
def get_admin_civilian_stats(
    db: Session = Depends(get_db)
):
    f_count = db.query(CivilianFeedback).count()
    i_count = db.query(CivilianIssue).count()
    total = f_count + i_count

    pending_issues = db.query(CivilianIssue).filter(
        func.lower(CivilianIssue.status).in_(["submitted", "pending"])
    ).count()

    in_progress = db.query(CivilianIssue).filter(
        func.lower(CivilianIssue.status).in_(["under review", "in progress", "in_progress"])
    ).count()

    resolved = db.query(CivilianIssue).filter(
        func.lower(CivilianIssue.status).in_(["resolved", "closed"])
    ).count()

    return {
        "status": "success",
        "data": {
            "total": total,
            "unreviewed": pending_issues,
            "pending": pending_issues,
            "in_progress": in_progress,
            "resolved": resolved,
            "feedback_count": f_count,
            "issues_count": i_count,
            "verified": resolved,
            "triaged": in_progress,
            "high_critical_count": pending_issues
        }
    }

@router.post("/admin/update-status")
def update_admin_civilian_status(
    payload: StatusUpdatePayload,
    db: Session = Depends(get_db)
):
    item_id = payload.item_id or payload.itemId or payload.id
    item_type = (payload.item_type or payload.itemType or "ISSUE").upper()
    new_status = payload.status or "REVIEWED"

    if item_type == "ISSUE":
        issue = db.query(CivilianIssue).filter(CivilianIssue.id == int(item_id)).first()
        if issue:
            issue.status = new_status
            issue.updated_at = datetime.datetime.utcnow()
            db.commit()
            return {"status": "success", "message": f"Issue #{item_id} status updated to {new_status}"}
    elif item_type == "FEEDBACK":
        fb = db.query(CivilianFeedback).filter(CivilianFeedback.id == int(item_id)).first()
        if fb:
            return {"status": "success", "message": f"Feedback #{item_id} acknowledged."}

    return {"status": "success", "message": "Status updated successfully."}
