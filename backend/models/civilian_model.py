import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.db.database import Base
from backend.utils.aadhaar_security import mask_aadhaar

class CivilianUser(Base):
    __tablename__ = 'civilian_users'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    mobile = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    
    # Encrypted Aadhaar at rest & last 4 digits for masked display
    aadhaar_encrypted = Column(Text, nullable=False)
    aadhaar_last4 = Column(String(4), nullable=False)

    # Address & Location Details
    address = Column(Text, nullable=False)
    pincode = Column(String(10), nullable=False)
    state = Column(String(100), nullable=False, index=True)
    district = Column(String(100), nullable=False, index=True)
    sub_district = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    # Role & Access Control
    role = Column(String(20), default="CIVILIAN", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Audit Timestamps
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)
    last_login = Column(DateTime, nullable=True)

    # Relationships
    feedbacks = relationship("CivilianFeedback", back_populates="user", cascade="all, delete-orphan")
    issues = relationship("CivilianIssue", back_populates="user", cascade="all, delete-orphan")

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

    @property
    def masked_aadhaar(self) -> str:
        return mask_aadhaar(self.aadhaar_last4)

    def to_dict(self) -> dict:
        """
        Public-safe serialization of civilian user profile.
        Strictly excludes passwords, password hashes, and raw/encrypted Aadhaar tokens.
        """
        return {
            "id": self.id,
            "username": self.username,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "fullName": self.full_name,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "full_name": self.full_name,
            "mobile": self.mobile,
            "email": self.email,
            "maskedAadhaar": self.masked_aadhaar,
            "masked_aadhaar": self.masked_aadhaar,
            "address": self.address,
            "pincode": self.pincode,
            "state": self.state,
            "district": self.district,
            "subDistrict": self.sub_district,
            "sub_district": self.sub_district,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "role": self.role,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "lastLogin": self.last_login.isoformat() if self.last_login else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "last_login": self.last_login.isoformat() if self.last_login else None
        }


class CivilianFeedback(Base):
    __tablename__ = 'civilian_feedback'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    civilian_user_id = Column(Integer, ForeignKey('civilian_users.id', ondelete='CASCADE'), nullable=False, index=True)
    project_id = Column(String(50), ForeignKey('projects.project_id', ondelete='SET NULL'), nullable=True, index=True)
    project_name = Column(String(255), nullable=True)
    category = Column(String(100), nullable=False) # Progress Update, Quality, Public Impact, Accessibility, General Feedback
    rating = Column(Integer, nullable=True) # 1 to 5
    feedback_text = Column(Text, nullable=False)
    status = Column(String(50), default="Submitted", nullable=True) # Submitted, Reviewed, In Progress, Resolved
    state = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=True)

    # Relationships
    user = relationship("CivilianUser", back_populates="feedbacks")

    def to_dict(self) -> dict:
        civ_name = self.user.full_name if self.user else "Citizen Contributor"
        state_val = self.state or (self.user.state if self.user else None)
        district_val = self.user.district if self.user else None
        
        return {
            "id": self.id,
            "itemType": "FEEDBACK",
            "typeLabel": "Civilian Feedback",
            "userId": self.civilian_user_id,
            "civilianName": civ_name,
            "userName": civ_name,
            "civilianMobile": self.user.mobile if self.user else None,
            "civilianEmail": self.user.email if self.user else None,
            "projectId": self.project_id or "N/A",
            "projectName": self.project_name or "General Project Feedback",
            "category": self.category,
            "rating": self.rating,
            "feedbackText": self.feedback_text,
            "message": self.feedback_text,
            "description": self.feedback_text,
            "state": state_val or "National / General",
            "district": district_val or "All Districts",
            "status": self.status or "Submitted",
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None
        }


class CivilianIssue(Base):
    __tablename__ = 'civilian_issues'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    civilian_user_id = Column(Integer, ForeignKey('civilian_users.id', ondelete='CASCADE'), nullable=False, index=True)
    project_id = Column(String(50), ForeignKey('projects.project_id', ondelete='SET NULL'), nullable=True, index=True)
    project_name = Column(String(255), nullable=True)
    category = Column(String(100), nullable=False) # Work Quality, Safety Concern, Project Delay, Damaged Infrastructure, Construction Issue, Environmental Concern, Other
    description = Column(Text, nullable=False)
    location_name = Column(String(255), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    photo_path = Column(Text, nullable=True)
    status = Column(String(50), default="Submitted", nullable=False) # Submitted, Under Review, In Progress, Resolved, Closed
    contact_mobile = Column(String(20), nullable=True)
    contact_email = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("CivilianUser", back_populates="issues")

    def to_dict(self) -> dict:
        civ_name = self.user.full_name if self.user else "Citizen Reporter"
        state_val = self.user.state if self.user else None
        district_val = self.user.district if self.user else None
        
        return {
            "id": self.id,
            "itemType": "ISSUE",
            "typeLabel": "Ground Issue / Complaint",
            "userId": self.civilian_user_id,
            "civilianName": civ_name,
            "userName": civ_name,
            "civilianMobile": self.contact_mobile or (self.user.mobile if self.user else None),
            "civilianEmail": self.contact_email or (self.user.email if self.user else None),
            "projectId": self.project_id or "N/A",
            "projectName": self.project_name or "Ground Level Issue",
            "category": self.category,
            "description": self.description,
            "message": self.description,
            "locationName": self.location_name,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "photoPath": self.photo_path,
            "state": state_val or "National / General",
            "district": district_val or "All Districts",
            "status": self.status or "Submitted",
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None
        }

