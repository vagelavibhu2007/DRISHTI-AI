import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.db.database import Base

class RiskPrediction(Base):
    __tablename__ = 'risk_predictions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    # Logical foreign key to projects.project_id (non-unique to support prediction history)
    project_id = Column(String(50), ForeignKey('projects.project_id'), index=True, nullable=False)
    
    # ML Model Risk Probabilities
    cost_overrun_probability = Column(Float, nullable=False)
    predicted_cost_overrun = Column(Integer, nullable=False) # 0 or 1 flag
    time_overrun_probability = Column(Float, nullable=False)
    predicted_time_overrun = Column(Integer, nullable=False) # 0 or 1 flag
    overall_risk_score = Column(Float, nullable=False, index=True)
    risk_level = Column(String(20), nullable=False, index=True) # LOW, MEDIUM, HIGH, CRITICAL

    # Regression predictions
    predicted_cost_overrun_cr = Column(Float, nullable=True)
    estimated_revised_cost_cr = Column(Float, nullable=True)
    predicted_delay_days = Column(Float, nullable=True)

    # Metadata & Execution provenance
    model_version = Column(String(50), default="4.2.0", nullable=False)
    execution_mode = Column(String(50), default="ML_REAL", nullable=False)
    prediction_timestamp = Column(DateTime, default=datetime.datetime.utcnow, nullable=False, index=True)

    # Relationship back to project
    project = relationship("Project", back_populates="predictions")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "projectId": str(self.project_id),
            "costRisk": self.cost_overrun_probability,
            "predictedCostOverrun": self.predicted_cost_overrun,
            "timeRisk": self.time_overrun_probability,
            "predictedTimeOverrun": self.predicted_time_overrun,
            "overallRisk": self.overall_risk_score,
            "riskLevel": self.risk_level,
            "predictedCostOverrunCr": self.predicted_cost_overrun_cr,
            "estimatedRevisedCostCr": self.estimated_revised_cost_cr,
            "predictedDelayDays": self.predicted_delay_days,
            "modelVersion": self.model_version,
            "executionMode": self.execution_mode,
            "predictionTimestamp": self.prediction_timestamp.isoformat() if self.prediction_timestamp else None
        }
