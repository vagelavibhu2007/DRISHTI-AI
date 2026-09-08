import os
import uuid
import datetime
import secrets
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import Optional

from backend.config import settings
from backend.db.database import get_db, init_db
from backend.models.user_model import User
from backend.schemas.auth_schema import (
    LoginRequest,
    TokenResponse,
    UserProfileResponse,
    UpdateProfileRequest,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    RegistrationSuccessResponse
)
from backend.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    validate_password_strength,
    validate_indian_mobile,
    validate_email_format,
    INDIAN_STATES_AND_UTS
)
from backend.utils.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

os.makedirs(settings.ID_PROOFS_DIR, exist_ok=True)
os.makedirs(settings.PROFILE_PHOTOS_DIR, exist_ok=True)

ALLOWED_ID_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
ALLOWED_PHOTO_EXTENSIONS = {".jpg", ".jpeg", ".png"}

@router.get("/states", response_model=list[str])
def get_supported_states():
    """
    GET /api/auth/states
    Returns the standardized list of Indian States and Union Territories for registration and filtering.
    """
    return INDIAN_STATES_AND_UTS


@router.post("/register", response_model=RegistrationSuccessResponse)
async def register_user(
    first_name: str = Form(..., description="First name"),
    last_name: str = Form(..., description="Last name"),
    mobile_number: str = Form(..., description="10-digit Indian mobile number"),
    email: str = Form(..., description="Official email address"),
    authority_type: str = Form(..., description="CENTRAL_AUTHORITY or STATE_AUTHORITY"),
    state: Optional[str] = Form(None, description="State for State Authority"),
    position: str = Form(..., description="Designation / Position"),
    id_proof_type: str = Form(..., description="ID Proof Type"),
    id_proof_number: str = Form(..., description="ID Proof Number"),
    username: str = Form(..., description="Unique username"),
    password: str = Form(..., description="Password meeting strength requirements"),
    confirm_password: str = Form(..., description="Confirm password"),
    id_proof_file: UploadFile = File(..., description="ID Proof document PDF/JPG/PNG"),
    profile_photo: Optional[UploadFile] = File(None, description="Profile photo JPG/PNG"),
    db: Session = Depends(get_db)
):
    first_name = first_name.strip()
    last_name = last_name.strip()
    mobile_number = mobile_number.strip()
    email = email.strip().lower()
    username = username.strip().lower()
    position = position.strip()
    id_proof_number = id_proof_number.strip()
    authority_type = authority_type.strip().upper()

    if not first_name or not last_name:
        raise HTTPException(status_code=400, detail="First name and last name are required.")
    
    if not validate_indian_mobile(mobile_number):
        raise HTTPException(status_code=400, detail="Invalid mobile number. Please provide a valid 10-digit Indian mobile number.")

    if not validate_email_format(email):
        raise HTTPException(status_code=400, detail="Invalid email address format.")

    if authority_type not in {"CENTRAL_AUTHORITY", "STATE_AUTHORITY"}:
        raise HTTPException(status_code=400, detail="Authority type must be either CENTRAL_AUTHORITY or STATE_AUTHORITY.")

    if authority_type == "STATE_AUTHORITY":
        if not state or state.strip() not in INDIAN_STATES_AND_UTS:
            raise HTTPException(status_code=400, detail="A valid Indian State or UT is required for State Authority registration.")
        state = state.strip()
    else:
        state = None

    if len(username) < 3 or len(username) > 30:
        raise HTTPException(status_code=400, detail="Username must be between 3 and 30 characters.")
    if not username.replace("_", "").replace(".", "").isalnum():
        raise HTTPException(status_code=400, detail="Username may only contain letters, numbers, underscores, and dots.")

    if db.query(User).filter(func.lower(User.username) == username).first():
        raise HTTPException(status_code=400, detail=f"Username '{username}' is already taken. Please choose another username.")

    if db.query(User).filter(func.lower(User.email) == email).first():
        raise HTTPException(status_code=400, detail=f"Email address '{email}' is already registered.")

    clean_mobile = mobile_number[-10:]
    existing_mobile = db.query(User).filter(User.mobile_number.like(f"%{clean_mobile}")).first()
    if existing_mobile:
        raise HTTPException(status_code=400, detail="This mobile number is already registered.")

    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    is_strong, pwd_err = validate_password_strength(password)
    if not is_strong:
        raise HTTPException(status_code=400, detail=pwd_err)

    id_ext = os.path.splitext(id_proof_file.filename)[1].lower() if id_proof_file.filename else ""
    if id_ext not in ALLOWED_ID_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid ID proof file format. Supported formats: PDF, JPG, JPEG, PNG.")

    id_content = await id_proof_file.read()
    if len(id_content) > settings.MAX_ID_PROOF_SIZE:
        raise HTTPException(status_code=400, detail="ID proof file size exceeds maximum limit of 5 MB.")

    os.makedirs(settings.ID_PROOFS_DIR, exist_ok=True)
    id_filename = str(uuid.uuid4().hex) + id_ext
    id_path = os.path.join(settings.ID_PROOFS_DIR, id_filename)
    with open(id_path, "wb") as f:
        f.write(id_content)

    photo_path = None
    if profile_photo and profile_photo.filename:
        photo_ext = os.path.splitext(profile_photo.filename)[1].lower()
        if photo_ext not in ALLOWED_PHOTO_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Invalid profile photo format. Supported formats: JPG, JPEG, PNG.")
        photo_content = await profile_photo.read()
        if len(photo_content) > settings.MAX_PROFILE_PHOTO_SIZE:
            raise HTTPException(status_code=400, detail="Profile photo file size exceeds maximum limit of 2 MB.")
        os.makedirs(settings.PROFILE_PHOTOS_DIR, exist_ok=True)
        photo_filename = username + "_" + str(uuid.uuid4().hex[:8]) + photo_ext
        photo_path = os.path.join(settings.PROFILE_PHOTOS_DIR, photo_filename)
        with open(photo_path, "wb") as f:
            f.write(photo_content)

    pwd_hash = hash_password(password)

    new_user = User(
        first_name=first_name,
        last_name=last_name,
        mobile_number=clean_mobile,
        email=email,
        authority_type=authority_type,
        state=state,
        position=position,
        id_proof_type=id_proof_type,
        id_proof_number=id_proof_number,
        id_proof_file_path=id_path,
        profile_photo_path=photo_path,
        username=username,
        password_hash=pwd_hash,
        is_active=True,
        created_at=datetime.datetime.utcnow()
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    display_authority = "Central Authority" if authority_type == "CENTRAL_AUTHORITY" else f"State Authority — {state}"

    return RegistrationSuccessResponse(
        message="Account created successfully.",
        username=new_user.username,
        full_name=new_user.full_name,
        authority_type=display_authority,
        state=new_user.state,
        position=new_user.position
    )

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    clean_identifier = request.username.strip()
    password = request.password

    user = db.query(User).filter(
        or_(
            func.lower(User.username) == clean_identifier.lower(),
            func.lower(User.email) == clean_identifier.lower()
        )
    ).first()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is currently inactive. Please contact the administrator."
        )

    user.last_login = datetime.datetime.utcnow()
    db.commit()

    token_data = {
        "sub": user.username,
        "user_id": user.id,
        "authority_type": user.authority_type,
        "state": user.state
    }
    access_token = create_access_token(data=token_data)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user.to_dict()
    )

@router.get("/me", response_model=dict)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user.to_dict()

@router.put("/profile", response_model=dict)
def update_profile(
    request: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if request.first_name and request.first_name.strip():
        current_user.first_name = request.first_name.strip()
    if request.last_name and request.last_name.strip():
        current_user.last_name = request.last_name.strip()
    if request.position and request.position.strip():
        current_user.position = request.position.strip()
    if request.mobile_number and request.mobile_number.strip():
        if not validate_indian_mobile(request.mobile_number):
            raise HTTPException(status_code=400, detail="Invalid mobile number format.")
        current_user.mobile_number = request.mobile_number.strip()[-10:]

    current_user.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(current_user)
    return current_user.to_dict()

@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    old_pwd = request.get_old_password()
    if not old_pwd or not verify_password(old_pwd, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect current password.")

    if request.new_password != request.confirm_password:
        raise HTTPException(status_code=400, detail="New password and confirmation do not match.")

    is_strong, pwd_err = validate_password_strength(request.new_password)
    if not is_strong:
        raise HTTPException(status_code=400, detail=pwd_err)

    current_user.password_hash = hash_password(request.new_password)
    current_user.updated_at = datetime.datetime.utcnow()
    db.commit()
    return {"message": "Password changed successfully."}

@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    ident = request.get_identifier().strip()
    user = db.query(User).filter(
        or_(
            func.lower(User.username) == ident.lower(),
            func.lower(User.email) == ident.lower()
        )
    ).first()

    success_msg = "If the account exists, password recovery instructions have been initiated."

    if not user:
        return {"message": success_msg, "recovery_initiated": True, "token": "SEC-TOKEN-SIMULATED"}

    if request.mobile_last4:
        if not user.mobile_number.endswith(request.mobile_last4.strip()):
            raise HTTPException(status_code=400, detail="Mobile number verification mismatch.")

    reset_code = str(secrets.randbelow(900000) + 100000)
    user.reset_token = reset_code
    user.reset_token_expiry = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    db.commit()

    return {
        "message": f"Password reset token issued: {reset_code}",
        "recovery_initiated": True,
        "username": user.username,
        "token": reset_code,
        "reset_token_hint": reset_code
    }

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    ident = request.get_identifier().strip()
    token_str = request.get_token().strip()

    if not token_str:
        raise HTTPException(status_code=400, detail="Reset token is required.")

    if ident:
        user = db.query(User).filter(
            or_(
                func.lower(User.username) == ident.lower(),
                func.lower(User.email) == ident.lower()
            ),
            User.reset_token == token_str
        ).first()
    else:
        user = db.query(User).filter(User.reset_token == token_str).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired password reset token.")

    if user.reset_token_expiry and datetime.datetime.utcnow() > user.reset_token_expiry:
        raise HTTPException(status_code=400, detail="Password reset token has expired. Please request a new one.")

    if request.new_password != request.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    is_strong, pwd_err = validate_password_strength(request.new_password)
    if not is_strong:
        raise HTTPException(status_code=400, detail=pwd_err)

    user.password_hash = hash_password(request.new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    user.updated_at = datetime.datetime.utcnow()
    db.commit()

    return {"message": "Password has been reset successfully. You can now login with your new password."}

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully."}

@router.get("/profile-photo/{username}")
def get_profile_photo(username: str, db: Session = Depends(get_db)):
    clean_uname = username.strip()
    user = db.query(User).filter(func.lower(User.username) == clean_uname.lower()).first()
    if not user or not user.profile_photo_path or not os.path.exists(user.profile_photo_path):
        raise HTTPException(status_code=404, detail="Profile photo not found.")
    
    ext = os.path.splitext(user.profile_photo_path)[1].lower()
    media_type = "image/png" if ext == ".png" else "image/jpeg"
    return FileResponse(user.profile_photo_path, media_type=media_type)

@router.get("/id-proof")
def get_user_id_proof(current_user: User = Depends(get_current_user)):
    if not current_user.id_proof_file_path or not os.path.exists(current_user.id_proof_file_path):
        raise HTTPException(status_code=404, detail="ID proof document not found.")
    
    ext = os.path.splitext(current_user.id_proof_file_path)[1].lower()
    media_type = "application/pdf" if ext == ".pdf" else ("image/png" if ext == ".png" else "image/jpeg")
    return FileResponse(
        current_user.id_proof_file_path,
        media_type=media_type,
        filename=f"id_proof_{current_user.username}{ext}"
    )
