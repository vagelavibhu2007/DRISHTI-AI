import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from backend.db.database import Base

class ReportMetadata(Base):
    __tablename__ = 'report_metadata'

    report_id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)
    
    generated_by_user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    state_scope = Column(String(100), nullable=True, index=True) # None/null = National
    
    file_format = Column(String(50), default="PDF", nullable=False)
    file_size = Column(String(50), nullable=True)
    file_path = Column(String(500), nullable=True)
    badge = Column(String(50), nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False, index=True)

    def to_dict(self) -> dict:
        return {
            "id": self.report_id,
            "title": self.title,
            "category": self.category,
            "description": self.description,
            "generatedByUserId": self.generated_by_user_id,
            "stateScope": self.state_scope,
            "format": self.file_format,
            "fileSize": self.file_size,
            "filePath": self.file_path,
            "badge": self.badge,
            "generatedDate": self.created_at.strftime("%d %b %Y") if self.created_at else None,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }
