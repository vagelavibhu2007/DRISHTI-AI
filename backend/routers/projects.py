import pandas as pd
from fastapi import APIRouter, HTTPException, Query, Depends, status
from typing import Optional
from backend.data.project_repository import project_repository, project_matches_state
from backend.ml.explainer import shap_explainer
from backend.models.user_model import User
from backend.utils.dependencies import get_optional_current_user, get_user_authorized_state

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("")
def list_projects(
    risk_level: Optional[str] = Query(None, description="Filter by risk level (CRITICAL, HIGH, MEDIUM, LOW)"),
    ministry: Optional[str] = Query(None, description="Filter by Ministry"),
    sector: Optional[str] = Query(None, description="Filter by Sector"),
    state: Optional[str] = Query(None, description="Filter by State"),
    search: Optional[str] = Query(None, description="Search term for ID, name, or state"),
    sort_by: str = Query("overallRisk", description="Field to sort by"),
    sort_order: str = Query("desc", description="Sort order: asc or desc"),
    limit: Optional[int] = Query(None, description="Max number of items to return"),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    GET /api/projects
    Retrieves filtered and sorted infrastructure projects with ML risk scores.
    If authenticated as a State Authority, strictly enforces state filtering to user's assigned state.
    """
    try:
        # Enforce State Authority RBAC filter (server-side security override)
        auth_state = get_user_authorized_state(current_user)
        if auth_state:
            state = auth_state

        projects = project_repository.get_all(
            sort_by=sort_by,
            sort_order=sort_order,
            limit=limit,
            risk_level=risk_level,
            ministry=ministry,
            sector=sector,
            state=state,
            search=search
        )
        return {
            "total": len(projects),
            "projects": projects
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching projects: {str(e)}")

@router.get("/{project_id}")
def get_project_detail(
    project_id: str,
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    GET /api/projects/{project_id}
    Retrieves comprehensive project record, ML risk assessments, and SHAP factors.
    Strictly forbids access if State Authority attempts to view a project outside assigned state.
    """
    project = project_repository.get_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project with ID #{project_id} not found in intelligence repository.")

    # Server-side RBAC verification for State Authority
    auth_state = get_user_authorized_state(current_user)
    if auth_state:
        if not project_matches_state(project.get("state", ""), auth_state):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: Project #{project_id} does not belong to your authorized state jurisdiction ({auth_state})."
            )

    # Compute live SHAP factors for this project
    df_feat = pd.DataFrame([{
        "Original_Cost_Cr": project["originalCost"],
        "Cumulative_Expenditure_Cr": project["cumulativeExpenditure"],
        "Physical_Progress_Pct": project["physicalProgress"],
        "Expenditure_Pct_of_Original_Cost": project["expenditurePercentage"],
        "Ministry": project["ministry"],
        "Sector": project["sector"],
        "State": project["state"]
    }])

    shap_factors = shap_explainer.explain(
        df_features=df_feat,
        project_id=project["projectId"],
        project_name=project["projectName"]
    )

    return {
        **project,
        "shapFactors": [
            {
                "name": f.display_name,
                "contribution": f.impact,
                "type": "increase" if f.direction == "increases_risk" else "decrease",
                "detail": f.detail
            }
            for f in shap_factors
        ]
    }

