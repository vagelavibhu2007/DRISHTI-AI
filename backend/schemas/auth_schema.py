from pydantic import BaseModel, Field
from typing import Optional

class LoginRequest(BaseModel):
    username: str = Field(..., description='Unique registered username')
    password: str = Field(..., description='Account password')

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: dict

class UserProfileResponse(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    full_name: str
    email: str
    mobile_number: str
    authority_type: str
    state: Optional[str] = None
    position: str
    id_proof_type: str
    masked_id_proof_number: str
    has_profile_photo: bool
    profile_photo_url: Optional[str] = None
    is_active: bool
    created_at: Optional[str] = None
    last_login: Optional[str] = None

class UpdateProfileRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    mobile_number: Optional[str] = None
    position: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    old_password: Optional[str] = None
    current_password: Optional[str] = None
    new_password: str = Field(..., description="New secure password")
    confirm_password: str = Field(..., description="Confirm new password")

    def get_old_password(self) -> str:
        return self.old_password or self.current_password or ""

class ForgotPasswordRequest(BaseModel):
    identifier: Optional[str] = Field(None, description="Registered username or email address")
    email: Optional[str] = Field(None, description="Registered email address")
    mobile_last4: Optional[str] = Field(None, description="Last 4 digits of registered mobile number")

    def get_identifier(self) -> str:
        return self.email or self.identifier or ""

class ResetPasswordRequest(BaseModel):
    identifier: Optional[str] = None
    email: Optional[str] = None
    reset_token: Optional[str] = None
    token: Optional[str] = None
    new_password: str = Field(..., description="New password")
    confirm_password: str = Field(..., description="Confirm new password")

    def get_token(self) -> str:
        return self.token or self.reset_token or ""

    def get_identifier(self) -> str:
        return self.email or self.identifier or ""

class RegistrationSuccessResponse(BaseModel):
    message: str
    username: str
    full_name: str
    authority_type: str
    state: Optional[str] = None
    position: str
