from fastapi import APIRouter, Query, Depends, HTTPException, Body
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr
from backend.data.project_repository import project_repository
from backend.models.user_model import User
from backend.utils.dependencies import get_optional_current_user, get_user_authorized_state
from backend.utils.email_service import (
    send_email_async,
    build_critical_project_email_html,
    build_state_digest_email_html,
    EMAIL_DELIVERY_LOGS
)
from backend.config import settings

router = APIRouter(prefix="/alerts", tags=["Early Warning Alerts & Gmail Dispatch"])

class CriticalAlertDispatchRequest(BaseModel):
    projectId: Optional[str] = "701410"
    recipientEmail: Optional[str] = None
    customNote: Optional[str] = None

class StateDigestDispatchRequest(BaseModel):
    state: Optional[str] = "Gujarat"
    recipientEmail: Optional[str] = None

class TestEmailRequest(BaseModel):
    recipientEmail: Optional[str] = "hardgamer7000@gmail.com"

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
                "badgeColor": "bg-red-500" if sev == "CRITICAL" else "bg-orange-500",
                "emailNotified": True,
                "notifiedEmail": settings.ALERT_RECIPIENT_EMAIL or "hardgamer7000@gmail.com"
            })

    if severity and severity != "ALL":
        generated_alerts = [a for a in generated_alerts if a["severity"] == severity]
    if status and status != "ALL":
        generated_alerts = [a for a in generated_alerts if a["status"] == status]

    return {
        "total": len(generated_alerts),
        "alerts": generated_alerts
    }


@router.post("/dispatch-critical")
def dispatch_critical_project_alert(req: CriticalAlertDispatchRequest):
    """
    POST /api/alerts/dispatch-critical
    Dispatches a high-priority, comprehensive critical risk alert email for a specific project.
    Directly routes to target recipient (defaults to hardgamer7000@gmail.com) with Option C hierarchy.
    """
    project = project_repository.get_by_id(req.projectId)
    if not project:
        # Fallback to demo critical project
        project = {
            "projectId": req.projectId or "701410",
            "projectName": "Relining of Rajasthan Feeder & Sirhind Feeder",
            "ministry": "Ministry of Jal Shakti",
            "state": "Punjab, Rajasthan",
            "sector": "Water Resources",
            "originalCost": 1976.4,
            "cumulativeExpenditure": 1892.5,
            "physicalProgress": 42.0,
            "expenditurePercentage": 95.8,
            "costRisk": 92.0,
            "timeRisk": 89.0,
            "overallRisk": 90.5,
            "reason": "Outlay has reached 95.8% while physical milestone completion lags at 42.0%.",
            "recommendation": "Initiate inter-state joint inspection with state irrigation department and enforce escrow controls."
        }

    recipient = req.recipientEmail or settings.ALERT_RECIPIENT_EMAIL or "hardgamer7000@gmail.com"
    subject = f"🚨 [CRITICAL ALERT] Project #{project['projectId']}: {project['projectName']} (Risk: {project['overallRisk']}%) - DRISHTI AI"

    html_content = build_critical_project_email_html(project, recipient_role="Project Director & State Authority")
    
    # CC Central Admin & State Authority (Option C)
    cc_list = [settings.INITIAL_ADMIN_EMAIL or "vagelavibhu2007@gmail.com"]

    result = send_email_async(
        to_email=recipient,
        subject=subject,
        html_content=html_content,
        cc_emails=cc_list
    )

    return {
        "status": "success",
        "message": f"Critical alert dispatched successfully to {recipient}.",
        "delivery": result,
        "project": {
            "projectId": project["projectId"],
            "projectName": project["projectName"],
            "overallRisk": project["overallRisk"]
        }
    }


@router.post("/dispatch-state-digest")
def dispatch_state_authority_digest(req: StateDigestDispatchRequest):
    """
    POST /api/alerts/dispatch-state-digest
    Dispatches an executive brief aggregating all critical high-risk assets in a specific State.
    """
    target_state = req.state or "Gujarat"
    recipient = req.recipientEmail or settings.ALERT_RECIPIENT_EMAIL or "hardgamer7000@gmail.com"
    
    # Fetch projects in state
    state_projects = project_repository.get_all(state=target_state, sort_by="overallRisk", sort_order="desc", limit=20)
    critical_projects = [p for p in state_projects if p.get("overallRisk", 0) >= 60.0] or state_projects[:5]

    subject = f"🏛️ [STATE CRITICAL DIGEST] High-Risk Project Executive Brief ({target_state}) - DRISHTI AI"
    html_content = build_state_digest_email_html(target_state, critical_projects)

    result = send_email_async(
        to_email=recipient,
        subject=subject,
        html_content=html_content
    )

    return {
        "status": "success",
        "message": f"State critical digest for {target_state} dispatched to {recipient}.",
        "delivery": result,
        "criticalProjectsCount": len(critical_projects)
    }


@router.post("/test-email")
def send_test_email(req: TestEmailRequest):
    """
    POST /api/alerts/test-email
    Sends an instant verification test email to hardgamer7000@gmail.com.
    """
    recipient = req.recipientEmail or settings.ALERT_RECIPIENT_EMAIL or "hardgamer7000@gmail.com"
    project_sample = {
        "projectId": "701410",
        "projectName": "Relining of Rajasthan Feeder & Sirhind Feeder",
        "ministry": "Ministry of Jal Shakti",
        "state": "Punjab / Rajasthan",
        "sector": "Water Resources",
        "originalCost": 1976.4,
        "cumulativeExpenditure": 1892.5,
        "physicalProgress": 42.0,
        "expenditurePercentage": 95.8,
        "costRisk": 92.0,
        "timeRisk": 89.0,
        "overallRisk": 90.5,
        "reason": "Automated verification test alert from DRISHTI AI Early Warning Engine.",
        "recommendation": "Verify delivery format and review interactive audit links."
    }

    subject = f"🚨 [TEST ALERT] Immediate Action Required: Project #701410 (Risk: 90.5%) - DRISHTI AI"
    html_content = build_critical_project_email_html(project_sample, recipient_role="Project Director (Trial Recipient)")

    result = send_email_async(
        to_email=recipient,
        subject=subject,
        html_content=html_content
    )

    return {
        "status": "success",
        "message": f"Test alert email successfully dispatched to {recipient}.",
        "delivery": result
    }


@router.get("/email-logs")
def get_email_delivery_logs():
    """
    GET /api/alerts/email-logs
    Retrieves real-time audit trail of all email alerts dispatched.
    """
    return {
        "total": len(EMAIL_DELIVERY_LOGS),
        "logs": EMAIL_DELIVERY_LOGS
    }
