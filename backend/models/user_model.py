import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Text
from backend.db.database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    mobile_number = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    authority_type = Column(String(50), nullable=False)  # CENTRAL_AUTHORITY or STATE_AUTHORITY
    state = Column(String(100), nullable=True)          # Required if STATE_AUTHORITY
    position = Column(String(150), nullable=False)      # Position / Designation
    
    # Identity Verification
    id_proof_type = Column(String(100), nullable=False) # e.g. Aadhaar Card, PAN Card, etc.
    id_proof_number = Column(String(100), nullable=False)
    id_proof_file_path = Column(String(500), nullable=False)
    profile_photo_path = Column(String(500), nullable=True)

    # Credentials
    username = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    # Password Recovery
    reset_token = Column(String(255), nullable=True)
    reset_token_expiry = Column(DateTime, nullable=True)

    # Status & Timestamps
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)
    last_login = Column(DateTime, nullable=True)

    @property
    def full_name(self) -> str:
        return f'{self.first_name} {self.last_name}'

    @property
    def masked_id_number(self) -> str:
        if not self.id_proof_number:
            return 'XXXX'
        cleaned = self.id_proof_number.strip()
        if len(cleaned) <= 4:
            return 'XXXX'
        last4 = cleaned[-4:]
        prefix_len = len(cleaned) - 4
        # Format as grouped masks: e.g. XXXX XXXX 1234
        if len(cleaned) == 12: # Aadhaar
            return f'XXXX XXXX {last4}'
        elif len(cleaned) == 10: # PAN
            return f'XXXXXX{last4}'
        return ('X' * prefix_len) + last4

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': self.full_name,
            'email': self.email,
            'mobile_number': self.mobile_number,
            'authority_type': self.authority_type,
            'state': self.state,
            'position': self.position,
            'id_proof_type': self.id_proof_type,
            'masked_id_proof_number': self.masked_id_number,
            'has_profile_photo': bool(self.profile_photo_path),
            'profile_photo_url': f'/api/auth/profile-photo/{self.username}' if self.profile_photo_path else None,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
