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
    # 1. Query Feedbacks with User eager loaded
    fb_query = db.query(CivilianFeedback).options(joinedload(CivilianFeedback.user))
    # 2. Query Issues with User eager loaded
    issue_query = db.query(CivilianIssue).options(joinedload(CivilianIssue.user))

    fb_records = fb_query.all()
    issue_records = issue_query.all()

    # Serialize all to unified dictionary items
    unified_items = []

    # Process feedbacks
    for fb in fb_records:
        unified_items.append(fb.to_dict())

    # Process issues
    for iss in issue_records:
        unified_items.append(iss.to_dict())

    # Calculate global metrics before filters
    total_items = len(unified_items)
    pending_review_count = sum(1 for item in unified_items if item.get("status") in ("Submitted", "Under Review"))
    reviewed_count = sum(1 for item in unified_items if item.get("status") == "Reviewed")
    in_progress_count = sum(1 for item in unified_items if item.get("status") == "In Progress")
    resolved_count = sum(1 for item in unified_items if item.get("status") in ("Resolved", "Closed"))
    feedback_total = len(fb_records)
    issue_total = len(issue_records)

    # Distinct states, districts, and projects for filter dropdowns
    available_states = sorted(list({item.get("state") for item in unified_items if item.get("state")}))
    available_districts = sorted(list({item.get("district") for item in unified_items if item.get("district")}))
    
    seen_pids = set()
    available_projects = []
    for item in unified_items:
        pid = item.get("projectId")
        pname = item.get("projectName")
        if pid and pid not in seen_pids and pid != "N/A":
            seen_pids.add(pid)
            available_projects.append({"projectId": pid, "projectName": pname or f"Project #{pid}"})

    # Apply In-Memory Filtering for precision
    filtered_items = unified_items

    # 1. Item Type Filter
    if item_type and item_type.upper() != "ALL":
        t_clean = item_type.strip().upper()
        if t_clean in ("FEEDBACK", "FEEDBACKS"):
            filtered_items = [i for i in filtered_items if i.get("itemType") == "FEEDBACK"]
        elif t_clean in ("ISSUE", "ISSUES", "GROUND_ISSUE", "GROUND_ISSUES"):
            filtered_items = [i for i in filtered_items if i.get("itemType") == "ISSUE"]

    # 2. State Filter
    if state and state.upper() != "ALL" and state != "All States":
        s_clean = state.strip().lower()
        filtered_items = [
            i for i in filtered_items
            if s_clean in str(i.get("state", "")).lower()
        ]

    # 3. District Filter
    if district and district.upper() != "ALL" and district != "All Districts":
        d_clean = district.strip().lower()
        filtered_items = [
            i for i in filtered_items
            if d_clean in str(i.get("district", "")).lower()
        ]

    # 4. Project Filter
    if project_id and project_id.upper() != "ALL" and project_id != "All Projects":
        p_clean = project_id.strip().lower()
        filtered_items = [
            i for i in filtered_items
            if p_clean == str(i.get("projectId", "")).lower()
            or p_clean in str(i.get("projectName", "")).lower()
        ]

    # 5. Status Filter
    if status_filter and status_filter.upper() != "ALL" and status_filter != "All Statuses":
        st_clean = status_filter.strip().lower()
        if st_clean in ("waiting", "pending", "submitted"):
            filtered_items = [i for i in filtered_items if str(i.get("status", "")).lower() in ("submitted", "under review", "pending")]
        else:
            filtered_items = [i for i in filtered_items if st_clean in str(i.get("status", "")).lower()]

    # 6. Search Filter
    if search and search.strip():
        q = search.strip().lower()
        filtered_items = [
            i for i in filtered_items
            if q in str(i.get("civilianName", "")).lower()
            or q in str(i.get("projectName", "")).lower()
            or q in str(i.get("projectId", "")).lower()
            or q in str(i.get("category", "")).lower()
            or q in str(i.get("message", "")).lower()
            or q in str(i.get("state", "")).lower()
            or q in str(i.get("district", "")).lower()
        ]

    # 7. Sorting
    if sort_by == "oldest":
        filtered_items.sort(key=lambda x: str(x.get("createdAt") or ""))
    else:
        filtered_items.sort(key=lambda x: str(x.get("createdAt") or ""), reverse=True)

    return {
        "status": "success",
        "summary": {
            "totalSubmissions": total_items,
            "waitingReviewCount": pending_review_count,
            "reviewedCount": reviewed_count,
            "inProgressCount": in_progress_count,
            "resolvedCount": resolved_count,
            "feedbackTotal": feedback_total,
            "issueTotal": issue_total
        },
        "filters": {
            "availableStates": available_states,
            "availableDistricts": available_districts,
            "availableProjects": available_projects
        },
        "count": len(filtered_items),
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
    fb_pending = db.query(CivilianFeedback).filter(
        or_(
            CivilianFeedback.status == "Submitted",
            CivilianFeedback.status == "Under Review",
            CivilianFeedback.status == None
        )
    ).count()

    issue_pending = db.query(CivilianIssue).filter(
        or_(
            CivilianIssue.status == "Submitted",
            CivilianIssue.status == "Under Review",
            CivilianIssue.status == None
        )
    ).count()

    total_pending = fb_pending + issue_pending
    total_feedbacks = db.query(CivilianFeedback).count()
    total_issues = db.query(CivilianIssue).count()

    return {
        "status": "success",
        "waitingReviewCount": total_pending,
        "feedbackPending": fb_pending,
        "issuePending": issue_pending,
        "totalSubmissions": total_feedbacks + total_issues
    }


@router.patch("/{item_type}/{item_id}/status", status_code=status.HTTP_200_OK)
def update_civilian_item_status(
    item_type: str,
    item_id: int,
    payload: StatusUpdatePayload,
    current_user: User = Depends(require_highest_rank_central_authority),
    db: Session = Depends(get_db)
):
    """
    PATCH /api/admin/civilian-feedback/{item_type}/{item_id}/status
    Updates the administrative status of a feedback or ground issue.
    Permitted statuses: Reviewed, In Progress, Resolved, Submitted
    """
    target_status = payload.status.strip()
    if target_status not in VALID_STATUSES:
        status_map = {
            "reviewed": "Reviewed",
            "in progress": "In Progress",
            "in_progress": "In Progress",
            "resolved": "Resolved",
            "submitted": "Submitted",
            "under review": "Under Review",
            "under_review": "Under Review",
            "closed": "Closed"
        }
        mapped = status_map.get(target_status.lower())
        if not mapped:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status '{target_status}'. Must be one of: {list(VALID_STATUSES)}"
            )
        target_status = mapped

    clean_type = item_type.strip().lower()

    if clean_type in ("feedback", "feedbacks"):
        item = db.query(CivilianFeedback).options(joinedload(CivilianFeedback.user)).filter(CivilianFeedback.id == item_id).first()
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Feedback #{item_id} not found.")
        item.status = target_status
        item.updated_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(item)
        logger.info(f"Civilian Feedback #{item_id} status updated to '{target_status}' by Central Authority ({current_user.username}).")
        return {
            "status": "success",
            "message": f"Feedback #{item_id} marked as '{target_status}'.",
            "item": item.to_dict()
        }

    elif clean_type in ("issue", "issues", "ground_issue", "ground_issues"):
        item = db.query(CivilianIssue).options(joinedload(CivilianIssue.user)).filter(CivilianIssue.id == item_id).first()
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Ground Issue #{item_id} not found.")
        item.status = target_status
        item.updated_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(item)
        logger.info(f"Civilian Ground Issue #{item_id} status updated to '{target_status}' by Central Authority ({current_user.username}).")
        return {
            "status": "success",
            "message": f"Ground Issue #{item_id} marked as '{target_status}'.",
            "item": item.to_dict()
        }

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid item_type '{item_type}'. Must be 'feedback' or 'issue'."
        )
