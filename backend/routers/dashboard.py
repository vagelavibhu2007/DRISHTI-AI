from fastapi import APIRouter, Depends, Query
from typing import Optional
from backend.data.project_repository import project_repository
from backend.models.user_model import User
from backend.utils.dependencies import get_optional_current_user, get_user_authorized_state

router = APIRouter(prefix="", tags=["Dashboard & Risk Analytics"])

@router.get("/dashboard/summary")
def get_dashboard_summary(
    state: Optional[str] = Query(None, description="Optional State filter"),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    GET /api/dashboard/summary
    Aggregated portfolio metrics and KPI statistics computed from ML outputs.
    Enforces State Authority RBAC if authenticated.
    """
    auth_state = get_user_authorized_state(current_user)
    if auth_state:
        state = auth_state
    return project_repository.get_kpi_summary(state=state)

@router.get("/risk/distribution")
def get_risk_distribution(
    state: Optional[str] = Query(None, description="Optional State filter"),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    GET /api/risk/distribution
    Portfolio risk level breakdown and dynamic cost/time distributions.
    """
    auth_state = get_user_authorized_state(current_user)
    if auth_state:
        state = auth_state

    summary = project_repository.get_kpi_summary(state=state)
    projects = project_repository.get_all(state=state)
    total_proj = len(projects)

    crit_pct = f"{round((summary['criticalProjects'] / (total_proj or 1)) * 100, 1)}%"
    high_pct = f"{round((summary['highRisk'] / (total_proj or 1)) * 100, 1)}%"
    med_pct = f"{round((summary['mediumRisk'] / (total_proj or 1)) * 100, 1)}%"
    low_pct = f"{round((summary['lowRisk'] / (total_proj or 1)) * 100, 1)}%"

    # Dynamic cost and time risk distributions
    c_0_20 = sum(1 for p in projects if p["costRisk"] <= 20)
    c_21_40 = sum(1 for p in projects if 20 < p["costRisk"] <= 40)
    c_41_60 = sum(1 for p in projects if 40 < p["costRisk"] <= 60)
    c_61_80 = sum(1 for p in projects if 60 < p["costRisk"] <= 80)
    c_81_100 = sum(1 for p in projects if p["costRisk"] > 80)

    t_0_20 = sum(1 for p in projects if p["timeRisk"] <= 20)
    t_21_40 = sum(1 for p in projects if 20 < p["timeRisk"] <= 40)
    t_41_60 = sum(1 for p in projects if 40 < p["timeRisk"] <= 60)
    t_61_80 = sum(1 for p in projects if 60 < p["timeRisk"] <= 80)
    t_81_100 = sum(1 for p in projects if p["timeRisk"] > 80)

    return {
        "distribution": [
            {"name": "Critical", "value": summary["criticalProjects"], "color": "#EF4444", "level": "CRITICAL", "percentage": crit_pct},
            {"name": "High", "value": summary["highRisk"], "color": "#F97316", "level": "HIGH", "percentage": high_pct},
            {"name": "Medium", "value": summary["mediumRisk"], "color": "#F59E0B", "level": "MEDIUM", "percentage": med_pct},
            {"name": "Low", "value": summary["lowRisk"], "color": "#10B981", "level": "LOW", "percentage": low_pct}
        ],

        "costRiskDistribution": [
            {"range": "0-20%", "count": c_0_20, "label": "Minimal (0-20%)"},
            {"range": "21-40%", "count": c_21_40, "label": "Low (21-40%)"},
            {"range": "41-60%", "count": c_41_60, "label": "Moderate (41-60%)"},
            {"range": "61-80%", "count": c_61_80, "label": "High (61-80%)"},
            {"range": "81-100%", "count": c_81_100, "label": "Severe (81-100%)"}
        ],
        "timeRiskDistribution": [
            {"range": "0-20%", "count": t_0_20, "label": "On Schedule"},
            {"range": "21-40%", "count": t_21_40, "label": "Minor Delay"},
            {"range": "41-60%", "count": t_41_60, "label": "Moderate Delay"},
            {"range": "61-80%", "count": t_61_80, "label": "High Delay"},
            {"range": "81-100%", "count": t_81_100, "label": "Severe Delay"}
        ]
    }

@router.get("/risk/trends")
def get_risk_trends(
    state: Optional[str] = Query(None, description="Optional State filter"),
    sector: Optional[str] = Query(None, description="Optional Sector filter"),
    ministry: Optional[str] = Query(None, description="Optional Ministry filter"),
    horizon: Optional[str] = Query("12M", description="Time horizon (6M, 12M, 24M Forecast)"),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    GET /api/risk/trends
    Longitudinal historical & projected risk trends.
    Longitudinal historical & projected risk trends filtered dynamically by
    State (enforcing State Authority RBAC), Sector, Ministry, and Horizon.
    """
    auth_state = get_user_authorized_state(current_user)
    if auth_state:
        state = auth_state

    return project_repository.get_risk_trends(
        state=state,
        sector=sector,
        ministry=ministry,
        horizon=horizon
    )


