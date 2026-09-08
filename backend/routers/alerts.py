from fastapi import APIRouter, Query, Depends
from typing import Optional
from backend.data.project_repository import project_repository
from backend.models.user_model import User
from backend.utils.dependencies import get_optional_current_user, get_user_authorized_state

router = APIRouter(prefix="/alerts", tags=["Early Warning Alerts"])

@router.get("")
def list_alerts(
    severity: Optional[str] = Query(None, description="CRITICAL, HIGH, or MEDIUM"),
    status: Optional[str] = Query(None, description="New, Under Review, Action Initiated, Resolved"),
    state: Optional[str] = Query(None, description="State filter"),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    GET /api/alerts
    Retrieves dynamic AI-generated early warnings based on ML project risk probabilities.
    For State Authority, restricts alerts to projects involving their state.
    """
    auth_state = get_user_authorized_state(current_user)
    if auth_state:
        state = auth_state

    # Build alerts dynamically from high-risk projects matching state
    projects = project_repository.get_all(sort_by="overallRisk", sort_order="desc", limit=50, state=state)
    
    generated_alerts = []
    for idx, p in enumerate(projects):
        if p["overallRisk"] >= 75.0 or p["costRisk"] >= 80.0 or p["timeRisk"] >= 80.0:
            sev = "CRITICAL" if p["overallRisk"] >= 80.0 else "HIGH"
            
            reason = ""
            risk_type = ""
            if p["costRisk"] >= 80.0 and p["timeRisk"] >= 80.0:
                risk_type = "Cost Escalation & Schedule Delay"
                reason = f"Expenditure reached {p['expenditurePercentage']}% while physical delivery is {p['physicalProgress']}%. Combined ML hazard exceeds critical threshold."
            elif p["costRisk"] >= 80.0:
                risk_type = "Severe Cost Overrun Risk"
                reason = f"High predicted probability ({p['costRisk']}%) of budget escalation above sanctioned outlay."
            else:
                risk_type = "Significant Time Drift"
                reason = f"Predicted schedule delay hazard ({p['timeRisk']}%) with estimated milestone postponement."

            status_val = "New" if idx < 3 else "Under Review" if idx < 8 else "Action Initiated" if idx < 15 else "Resolved"

            generated_alerts.append({
                "alertId": f"ALT-2026-{880 - idx}",
                "projectId": p["projectId"],
                "projectName": p["projectName"],
                "ministry": p["ministry"],
                "state": p["state"],
                "riskType": risk_type,
                "severity": sev,
                "probability": int(max(p["costRisk"], p["timeRisk"])),
                "reason": reason,
                "recommendation": "Enforce milestone-linked escrow drawdown and schedule joint technical review.",
                "created": f"0{max(1, 4 - (idx // 3))} Sep 2026, 0{8 + (idx % 8)}:30 AM",
                "status": status_val,
                "badgeColor": "bg-red-500" if sev == "CRITICAL" else "bg-orange-500"
            })

    if severity and severity != "ALL":
        generated_alerts = [a for a in generated_alerts if a["severity"] == severity]
    if status and status != "ALL":
        generated_alerts = [a for a in generated_alerts if a["status"] == status]

    return {
        "total": len(generated_alerts),
        "alerts": generated_alerts
    }

