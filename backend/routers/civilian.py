import datetime
import logging
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query, Header
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.db.database import get_db
from backend.models.civilian_model import CivilianUser, CivilianFeedback, CivilianIssue
from backend.models.project_model import Project
from backend.data.project_repository import project_repository
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
# PYDANTIC SCHEMAS
# -------------------------------------------------------------

class CivilianRegisterRequest(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    mobile: str = Field(..., min_length=10, max_length=15)
    email: str = Field(..., min_length=5, max_length=255)
    aadhaar: str = Field(..., min_length=12, max_length=14)
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)
    confirm_password: str = Field(..., min_length=8)
    address: str = Field(..., min_length=3)
    pincode: str = Field(..., min_length=6, max_length=10)
    state: str = Field(..., min_length=2, max_length=100)
    district: str = Field(..., min_length=2, max_length=100)
    sub_district: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class CivilianLoginRequest(BaseModel):
    username: str
    password: str

class CivilianProfileUpdateRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    mobile: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    pincode: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    sub_district: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class CivilianForgotPasswordRequest(BaseModel):
    identifier: str # Username or Email or Mobile

class CivilianFeedbackRequest(BaseModel):
    project_id: Optional[str] = None
    project_name: Optional[str] = None
    category: str
    rating: Optional[int] = Field(None, ge=1, le=5)
    feedback_text: str = Field(..., min_length=10)

class CivilianIssueRequest(BaseModel):
    project_id: Optional[str] = None
    project_name: Optional[str] = None
    category: str
    description: str = Field(..., min_length=15)
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    photo_path: Optional[str] = None
    contact_mobile: Optional[str] = None
    contact_email: Optional[str] = None


# -------------------------------------------------------------
# AUTHENTICATION DEPENDENCY FOR CIVILIANS
# -------------------------------------------------------------

def get_current_civilian_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> CivilianUser:
    """
    Validates Bearer JWT token specifically for registered Civilian users.
    Enforces strict role separation from administrative / government users.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Civilian authentication required. Please login to your JanNirikshan account.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not authorization or not authorization.startswith("Bearer "):
        raise credentials_exception

    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise credentials_exception

    username = payload.get("sub")
    role = payload.get("role")
    if not username or role != "CIVILIAN":
        raise credentials_exception

    user = db.query(CivilianUser).filter(func.lower(CivilianUser.username) == username.strip().lower()).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Civilian account not found or deactivated."
        )

    return user

def get_optional_civilian_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> Optional[CivilianUser]:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or payload.get("role") != "CIVILIAN":
        return None
    username = payload.get("sub")
    if not username:
        return None
    return db.query(CivilianUser).filter(func.lower(CivilianUser.username) == username.strip().lower()).first()


# -------------------------------------------------------------
# CIVILIAN REGISTRATION & LOGIN ENDPOINTS
# -------------------------------------------------------------

@router.post("/auth/register", status_code=status.HTTP_201_CREATED)
def register_civilian(
    req: CivilianRegisterRequest,
    db: Session = Depends(get_db)
):
    """
    POST /api/civilian/auth/register
    Registers a new civilian user on JanNirikshan.
    - Encrypts Aadhaar at rest using Fernet
    - Hashes password using bcrypt
    - Derives geographic coordinates for 25 km radius discovery
    """
    # 1. Password confirmation check
    if req.password != req.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password and Confirm Password do not match."
        )

    # 2. Password complexity validation
    is_valid_pwd, pwd_msg = validate_password_strength(req.password)
    if not is_valid_pwd:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=pwd_msg)

    # 3. Mobile format validation
    if not validate_indian_mobile(req.mobile):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter a valid 10-digit Indian mobile number."
        )

    # 4. Email format validation
    if not validate_email_format(req.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid email address."
        )

    # 5. Aadhaar format validation & encryption
    is_valid_aadhaar, aadhaar_msg = validate_aadhaar_format(req.aadhaar)
    if not is_valid_aadhaar:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=aadhaar_msg)

    clean_aadhaar = "".join(filter(str.isdigit, req.aadhaar))
    aadhaar_last4 = clean_aadhaar[-4:]
    aadhaar_encrypted = encrypt_aadhaar(clean_aadhaar)

    # 6. Check unique constraints (username, email, mobile)
    existing_user = db.query(CivilianUser).filter(
        (func.lower(CivilianUser.username) == req.username.strip().lower()) |
        (func.lower(CivilianUser.email) == req.email.strip().lower()) |
        (CivilianUser.mobile == req.mobile.strip())
    ).first()

    if existing_user:
        if existing_user.username.lower() == req.username.strip().lower():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already registered. Please choose another username.")
        if existing_user.email.lower() == req.email.strip().lower():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email address is already in use.")
        if existing_user.mobile == req.mobile.strip():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Mobile number is already registered.")

    # 7. Coordinate resolution (lat, lng)
    lat = req.latitude
    lng = req.longitude
    if lat is None or lng is None or (lat == 0.0 and lng == 0.0):
        resolved_lat, resolved_lng, _ = resolve_location(
            district=req.district,
            state=req.state,
            sub_district=req.sub_district,
            query_text=f"{req.address} {req.pincode}"
        )
        lat = resolved_lat
        lng = resolved_lng

    # 8. Create user record
    new_civilian = CivilianUser(
        first_name=req.first_name.strip(),
        last_name=req.last_name.strip(),
        mobile=req.mobile.strip(),
        email=req.email.strip().lower(),
        username=req.username.strip(),
        password_hash=hash_password(req.password),
        aadhaar_encrypted=aadhaar_encrypted,
        aadhaar_last4=aadhaar_last4,
        address=req.address.strip(),
        pincode=req.pincode.strip(),
        state=req.state.strip(),
        district=req.district.strip(),
        sub_district=req.sub_district.strip() if req.sub_district else None,
        latitude=float(lat),
        longitude=float(lng),
        role="CIVILIAN",
        is_active=True,
        last_login=datetime.datetime.utcnow()
    )

    db.add(new_civilian)
    db.commit()
    db.refresh(new_civilian)

    # 9. Issue JWT token
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
        "tokenType": "bearer",
        "user": new_civilian.to_dict()
    }


@router.post("/auth/login")
def login_civilian(
    req: CivilianLoginRequest,
    db: Session = Depends(get_db)
):
    """
    POST /api/civilian/auth/login
    Authenticates a registered civilian user.
    """
    user = db.query(CivilianUser).filter(
        func.lower(CivilianUser.username) == req.username.strip().lower()
    ).first()

    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password. Please check your credentials."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your civilian account is deactivated. Please contact portal support."
        )

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
        "tokenType": "bearer",
        "user": user.to_dict()
    }


@router.get("/auth/me")
def get_my_civilian_profile(
    current_user: CivilianUser = Depends(get_current_civilian_user)
):
    """
    GET /api/civilian/auth/me
    Retrieves logged-in civilian user's sanitized profile with masked Aadhaar.
    """
    return {
        "status": "success",
        "user": current_user.to_dict()
    }


@router.put("/auth/profile")
def update_civilian_profile(
    req: CivilianProfileUpdateRequest,
    current_user: CivilianUser = Depends(get_current_civilian_user),
    db: Session = Depends(get_db)
):
    """
    PUT /api/civilian/auth/profile
    Updates civilian profile or location. Recalculates coordinates if address fields changed.
    """
    if req.first_name:
        current_user.first_name = req.first_name.strip()
    if req.last_name:
        current_user.last_name = req.last_name.strip()
    if req.mobile:
        if not validate_indian_mobile(req.mobile):
            raise HTTPException(status_code=400, detail="Invalid mobile number format.")
        current_user.mobile = req.mobile.strip()
    if req.email:
        if not validate_email_format(req.email):
            raise HTTPException(status_code=400, detail="Invalid email format.")
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
    if req.sub_district is not None:
        current_user.sub_district = req.sub_district.strip() if req.sub_district else None
        address_changed = True

    # Check if explicit coordinates were passed
    if req.latitude is not None and req.longitude is not None and req.latitude != 0:
        current_user.latitude = float(req.latitude)
        current_user.longitude = float(req.longitude)
    elif address_changed:
        # Automatically recalculate coordinates based on new location
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
        "message": "Profile and geographic location updated successfully.",
        "user": current_user.to_dict()
    }


@router.post("/auth/forgot-password")
def forgot_password_civilian(
    req: CivilianForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    POST /api/civilian/auth/forgot-password
    Handles password recovery request for civilians.
    """
    ident = req.identifier.strip().lower()
    user = db.query(CivilianUser).filter(
        (func.lower(CivilianUser.username) == ident) |
        (func.lower(CivilianUser.email) == ident) |
        (CivilianUser.mobile == ident)
    ).first()

    # Always return a safe generic message to prevent account enumeration
    return {
        "status": "success",
        "message": "If an account matches the provided identifier, password reset instructions have been dispatched to your registered contact channel."
    }


# -------------------------------------------------------------
# LOCATION-BASED PROJECT DISCOVERY (25 KM RADIUS)
# -------------------------------------------------------------

@router.get("/projects/nearby")
def get_nearby_projects(
    lat: float = Query(..., description="Civilian latitude"),
    lng: float = Query(..., description="Civilian longitude"),
    radius_km: float = Query(25.0, description="Discovery search radius in kilometers (default 25 km)"),
    search: Optional[str] = Query(None, description="Search keyword in project name, sector, agency"),
    sector: Optional[str] = Query(None, description="Filter by sector / category"),
    limit: Optional[int] = Query(200, description="Max results")
):
    """
    GET /api/civilian/projects/nearby
    Calculates great-circle Haversine distances to all infrastructure projects
    and filters projects within the specified radius (default 25 km).
    Separates results into Ongoing and Completed project collections.
    """
    all_raw_projects = project_repository.get_all(limit=None)
    
    nearby_list = []
    
    for p in all_raw_projects:
        p_lat, p_lng, loc_label = resolve_project_coordinates(p)
        distance = haversine_distance(lat, lng, p_lat, p_lng)
        
        if distance <= radius_km:
            phys_prog = float(p.get("physicalProgress", 0.0) or 0.0)
            raw_status = str(p.get("status", "Under Progress"))
            
            # Determine public status and completion classification
            is_completed = (phys_prog >= 99.5 or "completed" in raw_status.lower())
            completion_status = "Completed" if is_completed else "Ongoing"
            public_status = "Completed" if is_completed else ("Under Progress" if phys_prog < 90 else "Nearing Completion")
            
            # Format public safe project object
            project_entry = {
                "projectId": str(p.get("projectId")),
                "projectName": str(p.get("projectName")),
                "category": str(p.get("sector", "General Infrastructure")),
                "sector": str(p.get("sector", "General Infrastructure")),
                "ministry": str(p.get("ministry", "Government of India")),
                "implementingAgency": str(p.get("ministry", "National Infrastructure Agency")),
                "state": str(p.get("state", "")),
                "district": str(p.get("district", loc_label)),
                "location": f"{loc_label}, {p.get('state', '')}".strip(", "),
                "locationLabel": loc_label,
                "status": public_status,
                "completionStatus": completion_status,
                "isCompleted": is_completed,
                "physicalProgress": round(phys_prog, 1),
                "progressPercent": int(round(phys_prog)),
                "budget": f"₹{float(p.get('originalCost', 0.0)):.2f} Cr" if p.get('originalCost') else "Tender Sanctioned",
                "originalCostCr": float(p.get("originalCost", 0.0)),
                "startDate": str(p.get("startDate") or "01-Jan-2022"),
                "targetDate": str(p.get("expectedCompletion") or "31-Dec-2027"),
                "expectedCompletion": str(p.get("expectedCompletion") or "31-Dec-2027"),
                "latitude": p_lat,
                "longitude": p_lng,
                "distanceKm": distance,
                "distanceDisplay": f"{distance} km from your location"
            }
            nearby_list.append(project_entry)

    # Apply search filter if provided
    if search and search.strip():
        q = search.strip().lower()
        nearby_list = [
            p for p in nearby_list
            if q in p["projectName"].lower()
            or q in p["projectId"].lower()
            or q in p["sector"].lower()
            or q in p["district"].lower()
            or q in p["location"].lower()
            or q in p["ministry"].lower()
        ]

    # Apply sector filter if provided
    if sector and sector != "ALL" and sector != "All Sectors":
        s_clean = sector.lower()
        nearby_list = [p for p in nearby_list if s_clean in p["sector"].lower()]

    # Sort strictly by distance ascending
    nearby_list.sort(key=lambda x: x["distanceKm"])

    if limit:
        nearby_list = nearby_list[:limit]

    # Partition into Ongoing and Completed
    ongoing_projects = [p for p in nearby_list if not p["isCompleted"]]
    completed_projects = [p for p in nearby_list if p["isCompleted"]]

    return {
        "status": "success",
        "civilianLocation": {
            "latitude": lat,
            "longitude": lng,
            "radiusKm": radius_km
        },
        "totalProjectsFound": len(nearby_list),
        "ongoingCount": len(ongoing_projects),
        "completedCount": len(completed_projects),
        "ongoingProjects": ongoing_projects,
        "completedProjects": completed_projects,
        "allProjects": nearby_list
    }


@router.get("/projects/{project_id}")
def get_public_project_detail(
    project_id: str,
    lat: Optional[float] = Query(None, description="Civilian latitude for distance calculation"),
    lng: Optional[float] = Query(None, description="Civilian longitude for distance calculation")
):
    """
    GET /api/civilian/projects/{project_id}
    Retrieves public-safe information for a single infrastructure project.
    Strictly excludes internal government and ML parameters.
    """
    project = project_repository.get_by_id(project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project #{project_id} not found in public transparency portal."
        )

    p_lat, p_lng, loc_label = resolve_project_coordinates(project)
    distance = None
    if lat is not None and lng is not None:
        distance = haversine_distance(lat, lng, p_lat, p_lng)

    phys_prog = float(project.get("physicalProgress", 0.0) or 0.0)
    raw_status = str(project.get("status", "Under Progress"))
    is_completed = (phys_prog >= 99.5 or "completed" in raw_status.lower())

    return {
        "status": "success",
        "project": {
            "projectId": str(project.get("projectId")),
            "projectName": str(project.get("projectName")),
            "category": str(project.get("sector", "General Infrastructure")),
            "sector": str(project.get("sector", "General Infrastructure")),
            "ministry": str(project.get("ministry", "Government of India")),
            "implementingAgency": str(project.get("ministry", "National Infrastructure Agency")),
            "state": str(project.get("state", "")),
            "district": str(project.get("district", loc_label)),
            "location": f"{loc_label}, {project.get('state', '')}".strip(", "),
            "locationLabel": loc_label,
            "status": "Completed" if is_completed else ("Under Progress" if phys_prog < 90 else "Nearing Completion"),
            "completionStatus": "Completed" if is_completed else "Ongoing",
            "isCompleted": is_completed,
            "physicalProgress": round(phys_prog, 1),
            "progressPercent": int(round(phys_prog)),
            "budget": f"₹{float(project.get('originalCost', 0.0)):.2f} Cr" if project.get('originalCost') else "Tender Sanctioned",
            "originalCostCr": float(project.get("originalCost", 0.0)),
            "startDate": str(project.get("startDate") or "01-Jan-2022"),
            "targetDate": str(project.get("expectedCompletion") or "31-Dec-2027"),
            "expectedCompletion": str(project.get("expectedCompletion") or "31-Dec-2027"),
            "latitude": p_lat,
            "longitude": p_lng,
            "distanceKm": distance,
            "distanceDisplay": f"{distance} km from your location" if distance is not None else None
        }
    }


# -------------------------------------------------------------
# CIVILIAN FEEDBACK ENDPOINTS
# -------------------------------------------------------------

@router.post("/feedback", status_code=status.HTTP_201_CREATED)
def submit_civilian_feedback(
    req: CivilianFeedbackRequest,
    current_user: CivilianUser = Depends(get_current_civilian_user),
    db: Session = Depends(get_db)
):
    """
    POST /api/civilian/feedback
    Submits citizen feedback for a public infrastructure project.
    """
    # Link project name if not provided
    p_name = req.project_name
    if not p_name and req.project_id:
        p_obj = project_repository.get_by_id(req.project_id)
        if p_obj:
            p_name = p_obj.get("projectName")

    new_feedback = CivilianFeedback(
        civilian_user_id=current_user.id,
        project_id=req.project_id,
        project_name=p_name or f"Project #{req.project_id or 'General'}",
        category=req.category,
        rating=req.rating,
        feedback_text=req.feedback_text.strip(),
        created_at=datetime.datetime.utcnow()
    )

    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)

    return {
        "status": "success",
        "message": "Your feedback has been submitted successfully.",
        "feedback": new_feedback.to_dict()
    }


@router.get("/my-feedback")
def get_my_feedback(
    current_user: CivilianUser = Depends(get_current_civilian_user),
    db: Session = Depends(get_db)
):
    """
    GET /api/civilian/my-feedback
    Lists all feedback submitted by the authenticated civilian user.
    """
    records = db.query(CivilianFeedback).filter(
        CivilianFeedback.civilian_user_id == current_user.id
    ).order_by(CivilianFeedback.created_at.desc()).all()

    return {
        "status": "success",
        "total": len(records),
        "feedback": [r.to_dict() for r in records]
    }


# -------------------------------------------------------------
# CIVILIAN ISSUE REPORTING ENDPOINTS
# -------------------------------------------------------------

@router.post("/issues", status_code=status.HTTP_201_CREATED)
def submit_civilian_issue(
    req: CivilianIssueRequest,
    current_user: CivilianUser = Depends(get_current_civilian_user),
    db: Session = Depends(get_db)
):
    """
    POST /api/civilian/issues
    Reports a ground issue/grievance related to an infrastructure project.
    """
    p_name = req.project_name
    if not p_name and req.project_id:
        p_obj = project_repository.get_by_id(req.project_id)
        if p_obj:
            p_name = p_obj.get("projectName")

    issue_lat = req.latitude or current_user.latitude
    issue_lng = req.longitude or current_user.longitude

    new_issue = CivilianIssue(
        civilian_user_id=current_user.id,
        project_id=req.project_id,
        project_name=p_name or f"Project #{req.project_id or 'General'}",
        category=req.category,
        description=req.description.strip(),
        location_name=req.location_name or current_user.district,
        latitude=issue_lat,
        longitude=issue_lng,
        photo_path=req.photo_path,
        status="Submitted",
        contact_mobile=req.contact_mobile or current_user.mobile,
        contact_email=req.contact_email or current_user.email,
        created_at=datetime.datetime.utcnow(),
        updated_at=datetime.datetime.utcnow()
    )

    db.add(new_issue)
    db.commit()
    db.refresh(new_issue)

    return {
        "status": "success",
        "message": "Your issue report has been lodged successfully with reference ID #" + str(new_issue.id),
        "issue": new_issue.to_dict()
    }


@router.get("/my-issues")
def get_my_issues(
    current_user: CivilianUser = Depends(get_current_civilian_user),
    db: Session = Depends(get_db)
):
    """
    GET /api/civilian/my-issues
    Lists all issues reported by the authenticated civilian with their live status.
    """
    records = db.query(CivilianIssue).filter(
        CivilianIssue.civilian_user_id == current_user.id
    ).order_by(CivilianIssue.created_at.desc()).all()

    return {
        "status": "success",
        "total": len(records),
        "issues": [r.to_dict() for r in records]
    }

