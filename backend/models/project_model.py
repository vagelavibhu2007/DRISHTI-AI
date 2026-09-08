import datetime
from sqlalchemy import Column, String, Float, Integer, Text, DateTime
from sqlalchemy.orm import relationship
from backend.db.database import Base

class Project(Base):
    __tablename__ = 'projects'

    # Canonical Identifier matching ML_READY.csv Project_ID
    project_id = Column(String(50), primary_key=True, index=True)
    project_name = Column(Text, nullable=False)
    ministry = Column(String(255), nullable=False, index=True)
    sector = Column(String(150), nullable=False, index=True)
    state = Column(String(500), nullable=False, index=True) # Supports single and multi-state strings
    
    # Timeline fields from source CSV
    start_date = Column(String(50), nullable=True)
    target_doc = Column(String(50), nullable=True)
    revised_doc = Column(String(50), nullable=True)

    # Cost metrics from source CSV
    original_cost_cr = Column(Float, nullable=False)
    cumulative_expenditure_cr = Column(Float, nullable=False)
    physical_progress_pct = Column(Float, nullable=True)
    expenditure_pct_of_original_cost = Column(Float, nullable=True)
    revised_cost_cr = Column(Float, nullable=True)
    cost_overrun_cr = Column(Float, nullable=True)
    cost_overrun_pct = Column(Float, nullable=True)
    cost_overrun_flag = Column(Integer, nullable=True)

    # Schedule drift metrics from source CSV
    time_overrun_days = Column(Float, nullable=True)
    time_overrun_months = Column(Float, nullable=True)
    time_overrun_flag = Column(Integer, nullable=True)

    # Audit timestamps
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    # Logical Relationships (Safe, non-cascade deletion)
    predictions = relationship("RiskPrediction", back_populates="project", lazy="select", order_by="desc(RiskPrediction.prediction_timestamp)")
    alerts = relationship("Alert", back_populates="project", lazy="select", order_by="desc(Alert.created_at)")

    def to_dict(self) -> dict:
        return {
            "projectId": str(self.project_id),
            "projectName": self.project_name,
            "ministry": self.ministry,
            "sector": self.sector,
            "state": self.state,
            "startDate": self.start_date,
            "targetDoc": self.target_doc,
            "revisedDoc": self.revised_doc,
            "originalCost": self.original_cost_cr,
            "cumulativeExpenditure": self.cumulative_expenditure_cr,
            "physicalProgress": self.physical_progress_pct,
            "expenditurePercentage": self.expenditure_pct_of_original_cost,
            "revisedCost": self.revised_cost_cr,
            "costOverrun": self.cost_overrun_cr,
            "costOverrunPct": self.cost_overrun_pct,
            "costOverrunFlag": self.cost_overrun_flag,
            "timeOverrunDays": self.time_overrun_days,
            "timeOverrunMonths": self.time_overrun_months,
            "timeOverrunFlag": self.time_overrun_flag,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None
        }
