import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.db.database import Base

class Alert(Base):
    __tablename__ = 'alerts'

    alert_id = Column(String(50), primary_key=True, index=True)
    project_id = Column(String(50), ForeignKey('projects.project_id'), index=True, nullable=False)
    project_name = Column(Text, nullable=False)
    ministry = Column(String(255), nullable=False)
    state = Column(String(500), nullable=False, index=True)
    risk_type = Column(String(100), nullable=False)
    severity = Column(String(20), nullable=False, index=True) # CRITICAL, HIGH, MEDIUM
    probability = Column(Integer, nullable=False)
    reason = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=True)
    status = Column(String(50), default="New", nullable=False, index=True) # New, Under Review, Action Initiated, Resolved
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False, index=True)
    resolved_at = Column(DateTime, nullable=True)

    # Relationship back to project
    project = relationship("Project", back_populates="alerts")

    def to_dict(self) -> dict:
        return {
            "alertId": self.alert_id,
            "projectId": str(self.project_id),
            "projectName": self.project_name,
            "ministry": self.ministry,
            "state": self.state,
            "riskType": self.risk_type,
            "severity": self.severity,
            "probability": self.probability,
            "reason": self.reason,
            "recommendation": self.recommendation,
            "status": self.status,
            "created": self.created_at.strftime("%d %b %Y, %I:%M %p") if self.created_at else None,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "resolvedAt": self.resolved_at.isoformat() if self.resolved_at else None,
            "badgeColor": "bg-red-500" if self.severity == "CRITICAL" else "bg-orange-500"
        }
