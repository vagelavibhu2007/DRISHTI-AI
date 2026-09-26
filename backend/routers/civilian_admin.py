import datetime
import logging
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, or_, desc, asc

from backend.db.database import get_db
from backend.models.user_model import User
from backend.models.civilian_model import CivilianUser, CivilianFeedback, CivilianIssue
from backend.utils.dependencies import require_highest_rank_central_authority

logger = logging.getLogger("drishti.civilian_admin")

router = APIRouter(prefix="/admin/civilian-feedback", tags=["Civilian Feedback & Ground Issues Admin"])

class StatusUpdatePayload(BaseModel):
    status: str = Field(..., description="Target status: Reviewed, In Progress, Resolved, or Submitted")
    notes: Optional[str] = Field(None, description="Optional administrative action note")

VALID_STATUSES = {"Submitted", "Reviewed", "Under Review", "In Progress", "Resolved", "Closed"}

def serialize_feedback_item(fb: CivilianFeedback) -> dict:
    u = fb.user
    full_name = u.full_name if u else "Citizen Contributor"
    state = u.state if u else "Gujarat"
    district = u.district if u else "Ahmedabad"
    created_iso = fb.created_at.isoformat() if fb.created_at else datetime.datetime.utcnow().isoformat()
    return {
        "id": fb.id,
        "item_type": "FEEDBACK",
        "itemType": "FEEDBACK",
        "type": "FEEDBACK",
        "civilian_name": full_name,
        "civilianName": full_name,
        "name": full_name,
        "user_id": fb.civilian_user_id,
        "userId": fb.civilian_user_id,
        "state": state,
        "district": district,
        "location_name": f"{district}, {state}",
        "locationName": f"{district}, {state}",
        "project_id": fb.project_id,
        "projectId": fb.project_id,
        "project_name": fb.project_name or f"Project #{fb.project_id}",
        "projectName": fb.project_name or f"Project #{fb.project_id}",
        "category": fb.category,
        "rating": fb.rating,
        "description": fb.feedback_text,
        "message": fb.feedback_text,
        "feedback_text": fb.feedback_text,
        "feedbackText": fb.feedback_text,
        "status": "Reviewed",
        "created_at": created_iso,
        "createdAt": created_iso,
        "updated_at": created_iso,
        "updatedAt": created_iso
    }

def serialize_issue_item(iss: CivilianIssue) -> dict:
    u = iss.user
    full_name = u.full_name if u else "Citizen Reporter"
    state = u.state if u else "Gujarat"
    district = iss.location_name or (u.district if u else "Ahmedabad")
    created_iso = iss.created_at.isoformat() if iss.created_at else datetime.datetime.utcnow().isoformat()
    updated_iso = iss.updated_at.isoformat() if iss.updated_at else created_iso
    return {
        "id": iss.id,
        "item_type": "ISSUE",
        "itemType": "ISSUE",
        "type": "ISSUE",
        "civilian_name": full_name,
        "civilianName": full_name,
        "name": full_name,
        "user_id": iss.civilian_user_id,
        "userId": iss.civilian_user_id,
        "state": state,
        "district": district,
        "location_name": iss.location_name or district,
        "locationName": iss.location_name or district,
        "latitude": iss.latitude,
        "longitude": iss.longitude,
        "project_id": iss.project_id,
        "projectId": iss.project_id,
        "project_name": iss.project_name or f"Project #{iss.project_id}",
        "projectName": iss.project_name or f"Project #{iss.project_id}",
        "category": iss.category,
        "rating": None,
        "description": iss.description,
        "message": iss.description,
        "status": iss.status or "Submitted",
        "photo_path": iss.photo_path,
        "photoPath": iss.photo_path,
        "contact_mobile": iss.contact_mobile,
        "contactMobile": iss.contact_mobile,
        "contact_email": iss.contact_email,
        "contactEmail": iss.contact_email,
        "created_at": created_iso,
        "createdAt": created_iso,
        "updated_at": updated_iso,
        "updatedAt": updated_iso
    }


@router.get("", status_code=status.HTTP_200_OK)
def get_all_civilian_feedback_and_issues(
    state: Optional[str] = Query(None, description="Filter by state name"),
    district: Optional[str] = Query(None, description="Filter by district name"),
    project_id: Optional[str] = Query(None, description="Filter by project ID or name"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status"),
    item_type: Optional[str] = Query("ALL", description="Filter by item type: ALL, FEEDBACK, ISSUE"),
    search: Optional[str] = Query(None, description="Search keyword in civilian name, project name, ID, message"),
    sort_by: Optional[str] = Query("newest", description="Sorting: newest, oldest"),
    current_user: User = Depends(require_highest_rank_central_authority),
    db: Session = Depends(get_db)
):
    """
    GET /api/admin/civilian-feedback
    Retrieves all civilian feedbacks and ground issues reported via JanNirikshan portal.
    Strictly restricted to the highest-rank Central Authority user (Chief Project Officer).
    """
    fb_records = db.query(CivilianFeedback).options(joinedload(CivilianFeedback.user)).all()
    issue_records = db.query(CivilianIssue).options(joinedload(CivilianIssue.user)).all()

    unified_items = []
    for fb in fb_records:
        unified_items.append(serialize_feedback_item(fb))
    for iss in issue_records:
        unified_items.append(serialize_issue_item(iss))

    # Sort unified items newest first by default
    unified_items.sort(key=lambda x: str(x.get("created_at") or ""), reverse=(sort_by != "oldest"))

    total_items = len(unified_items)
    pending_review_count = sum(1 for item in unified_items if item.get("status") in ("Submitted", "Under Review", "Pending"))
    reviewed_count = sum(1 for item in unified_items if item.get("status") == "Reviewed")
    in_progress_count = sum(1 for item in unified_items if item.get("status") == "In Progress")
    resolved_count = sum(1 for item in unified_items if item.get("status") in ("Resolved", "Closed"))
    feedback_total = len(fb_records)
    issue_total = len(issue_records)

    filtered_items = unified_items

    # 1. Item Type Filter
    if item_type and item_type.upper() != "ALL":
        t_clean = item_type.strip().upper()
        if t_clean in ("FEEDBACK", "FEEDBACKS"):
            filtered_items = [i for i in filtered_items if i.get("item_type") == "FEEDBACK"]
        elif t_clean in ("ISSUE", "ISSUES", "GROUND_ISSUE", "GROUND_ISSUES"):
            filtered_items = [i for i in filtered_items if i.get("item_type") == "ISSUE"]

    # 2. State Filter
    if state and state.upper() != "ALL" and state != "All States":
        s_clean = state.strip().lower()
        filtered_items = [
            i for i in filtered_items
            if s_clean in str(i.get("state", "")).lower()
        ]

    # 3. Status Filter
    if status_filter and status_filter.upper() != "ALL" and status_filter != "All Statuses":
        st_clean = status_filter.strip().lower()
        if st_clean in ("waiting", "pending", "submitted", "under review", "under_review"):
            filtered_items = [i for i in filtered_items if str(i.get("status", "")).lower() in ("submitted", "under review", "pending")]
        elif st_clean in ("in progress", "in_progress"):
            filtered_items = [i for i in filtered_items if str(i.get("status", "")).lower() in ("in progress", "in_progress")]
        else:
            filtered_items = [i for i in filtered_items if st_clean in str(i.get("status", "")).lower()]

    # 4. Search Filter
    if search and search.strip():
        q = search.strip().lower()
        filtered_items = [
            i for i in filtered_items
            if q in str(i.get("civilian_name", "")).lower()
            or q in str(i.get("project_name", "")).lower()
            or q in str(i.get("project_id", "")).lower()
            or q in str(i.get("category", "")).lower()
            or q in str(i.get("description", "")).lower()
            or q in str(i.get("state", "")).lower()
            or q in str(i.get("district", "")).lower()
        ]

    summary = {
        "total": total_items,
        "totalSubmissions": total_items,
        "unreviewed": pending_review_count,
        "waitingReviewCount": pending_review_count,
        "reviewed": reviewed_count,
        "reviewedCount": reviewed_count,
        "in_progress": in_progress_count,
        "inProgressCount": in_progress_count,
        "resolved": resolved_count,
        "resolvedCount": resolved_count,
        "feedback_count": feedback_total,
        "feedbackTotal": feedback_total,
        "issues_count": issue_total,
        "issueTotal": issue_total
    }

    return {
        "status": "success",
        "success": True,
        "summary": summary,
        "stats": summary,
        "count": len(filtered_items),
        "data": filtered_items,
        "items": filtered_items
    }


@router.get("/stats", status_code=status.HTTP_200_OK)
def get_civilian_feedback_stats(
    current_user: User = Depends(require_highest_rank_central_authority),
    db: Session = Depends(get_db)
):
    """
    GET /api/admin/civilian-feedback/stats
    Returns lightweight notification counter for highest-rank Central Authority sidebar badge.
    """
    issue_pending = db.query(CivilianIssue).filter(
        or_(
            CivilianIssue.status == "Submitted",
            CivilianIssue.status == "Under Review",
            CivilianIssue.status == "Pending",
            CivilianIssue.status == None
        )
    ).count()

    issue_in_progress = db.query(CivilianIssue).filter(
        or_(
            CivilianIssue.status == "In Progress",
            CivilianIssue.status == "in_progress"
        )
    ).count()

    issue_resolved = db.query(CivilianIssue).filter(
        or_(
            CivilianIssue.status == "Resolved",
            CivilianIssue.status == "Closed"
        )
    ).count()

    total_feedbacks = db.query(CivilianFeedback).count()
    total_issues = db.query(CivilianIssue).count()
    total_submissions = total_feedbacks + total_issues

    res = {
        "total": total_submissions,
        "totalSubmissions": total_submissions,
        "unreviewed": issue_pending,
        "waitingReviewCount": issue_pending,
        "in_progress": issue_in_progress,
        "inProgressCount": issue_in_progress,
        "resolved": issue_resolved,
        "resolvedCount": issue_resolved,
        "feedback_count": total_feedbacks,
        "feedbackTotal": total_feedbacks,
        "issues_count": total_issues,
        "issueTotal": total_issues
    }

    return {
        "status": "success",
        "success": True,
        "data": res,
        **res
    }


@router.patch("/{item_type}/{item_id}/status", status_code=status.HTTP_200_OK)
@router.patch("/issues/{item_id}/status", status_code=status.HTTP_200_OK)
def update_civilian_item_status(
    item_id: int,
    payload: StatusUpdatePayload,
    item_type: Optional[str] = "issue",
    current_user: User = Depends(require_highest_rank_central_authority),
    db: Session = Depends(get_db)
):
    """
    PATCH /api/admin/civilian-feedback/{item_type}/{item_id}/status
    PATCH /api/admin/civilian-feedback/issues/{item_id}/status
    Updates the administrative status of a ground issue.
    """
    target_status = payload.status.strip()
    status_map = {
        "reviewed": "Reviewed",
        "in progress": "In Progress",
        "in_progress": "In Progress",
        "resolved": "Resolved",
        "submitted": "Submitted",
        "under review": "Under Review",
        "under_review": "Under Review",
        "pending": "Under Review",
        "closed": "Closed"
    }
    mapped = status_map.get(target_status.lower(), target_status)

    item = db.query(CivilianIssue).options(joinedload(CivilianIssue.user)).filter(CivilianIssue.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Ground Issue #{item_id} not found.")
    item.status = mapped
    item.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(item)
    logger.info(f"Civilian Ground Issue #{item_id} status updated to '{mapped}' by Central Authority ({current_user.username}).")
    return {
        "status": "success",
        "success": True,
        "message": f"Ground Issue #{item_id} marked as '{mapped}'.",
        "item": serialize_issue_item(item),
        "data": serialize_issue_item(item)
    }
