from fastapi import APIRouter, Query, Depends
from typing import Optional
from backend.data.project_repository import project_repository
from backend.models.user_model import User
from backend.utils.dependencies import get_optional_current_user

router = APIRouter(prefix="/risk", tags=["Risk Rankings"])

@router.get("/high-risk")
def get_high_risk_projects(
    risk_level: Optional[str] = Query(None, description="CRITICAL or HIGH"),
    ministry: Optional[str] = Query(None, description="Ministry filter"),
    sector: Optional[str] = Query(None, description="Sector filter"),
    state: Optional[str] = Query(None, description="State filter"),
    limit: Optional[int] = Query(100, description="Max results"),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    GET /api/risk/high-risk
    Identifies and returns projects with Overall Risk Score >= 50, strictly sorted DESC.
    For authenticated State Authority users, automatically restricts to assigned state.
    """
    if current_user and current_user.authority_type == "STATE_AUTHORITY" and current_user.state:
        state = current_user.state

    projects = project_repository.get_all(
        sort_by="overallRisk",
        sort_order="desc",
        limit=None,
        ministry=ministry,
        sector=sector,
        state=state
    )

    if risk_level == "CRITICAL":
        high_risk = [p for p in projects if p["riskLevel"] == "CRITICAL"]
    elif risk_level == "HIGH":
        high_risk = [p for p in projects if p["riskLevel"] == "HIGH"]
    else:
        high_risk = [p for p in projects if p["riskLevel"] in ["CRITICAL", "HIGH"]]

    if limit:
        high_risk = high_risk[:limit]

    return {
        "total": len(high_risk),
        "highRiskProjects": high_risk
    }

