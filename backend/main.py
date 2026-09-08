import sys
import os

# Ensure portable import resolution in any deployment context (root or backend subdirectory)
_current_dir = os.path.dirname(os.path.abspath(__file__))
_parent_dir = os.path.dirname(_current_dir)
if _parent_dir not in sys.path:
    sys.path.insert(0, _parent_dir)
if _current_dir not in sys.path:
    sys.path.insert(0, _current_dir)

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from backend.config import settings
from backend.ml.model_loader import model_loader
from backend.db.database import init_db, check_db_connection
from backend.models.user_model import User
from backend.utils.dependencies import get_current_user
from backend.routers import (
    predict,
    projects,
    dashboard,
    risk,
    explain,
    model_info,
    alerts,
    auth
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("drishti.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"ML Execution Mode: {settings.ML_MODE.upper()}")
    # Initialize SQLite Authentication Database & Tables
    init_db()
    logger.info("SQLite Authentication database initialized.")
    yield
    logger.info(f"Shutting down {settings.APP_NAME}")

app = FastAPI(
    title="DRISHTI AI — Infrastructure Intelligence API",
    description="Production-grade Machine Learning & Predictive Risk Analytics API for Infrastructure Assets across India. Exposes risk forecasting, SHAP explainability, authority RBAC, and spatial intelligence.",
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=settings.CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(predict.router, prefix=settings.API_PREFIX)
app.include_router(projects.router, prefix=settings.API_PREFIX)
app.include_router(dashboard.router, prefix=settings.API_PREFIX)
app.include_router(risk.router, prefix=settings.API_PREFIX)
app.include_router(explain.router, prefix=settings.API_PREFIX)
app.include_router(model_info.router, prefix=settings.API_PREFIX)
app.include_router(alerts.router, prefix=settings.API_PREFIX)

@app.get("/", tags=["System"])
def root():
    return {
        "platform": "DRISHTI AI",
        "tagline": "Don't Just Monitor Projects — Predict Their Risks.",
        "status": "ok",
        "service": "DRISHTI AI Backend",
        "version": settings.APP_VERSION,
        "ml_mode": settings.ML_MODE,
        "cost_threshold": settings.COST_CLASSIFICATION_THRESHOLD,
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "openapi_url": "/openapi.json"
    }

@app.get("/health", tags=["System"])
@app.get("/api/health", tags=["System"])
def health_check():
    """
    GET /health & GET /api/health
    Production health check endpoint reporting service status, database connectivity, and loaded ML models.
    Never exposes database credentials or connection strings.
    """
    db_check = check_db_connection()
    return {
        "status": "ok",
        "service": "DRISHTI AI Backend",
        "version": settings.APP_VERSION,
        "database": {
            "connected": db_check.get("connected", False),
            "dialect": db_check.get("dialect", "unknown")
        },
        "database_dialect": db_check.get("dialect", "unknown"),
        "ml_mode": settings.ML_MODE,
        "models_loaded": {
            "cost_classifier": model_loader.is_cost_classifier_ready,
            "time_classifier": model_loader.is_time_classifier_ready,
            "cost_regressor": model_loader.cost_regressor is not None,
            "time_regressor": model_loader.time_regressor is not None
        }
    }

@app.post("/api/admin/migrate-projects", tags=["Admin"])
def admin_migrate_projects(current_user: User = Depends(get_current_user)):
    """
    POST /api/admin/migrate-projects
    Secure administrative endpoint to trigger atomic project data migration to PostgreSQL.
    Strictly restricted to authenticated CENTRAL_AUTHORITY administrators.
    """
    if current_user.authority_type != "CENTRAL_AUTHORITY":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Migration requires Central Authority administrative privileges."
        )
    from backend.scripts.migrate_data_to_postgres import run_project_migration
    from backend.db.database import SessionLocal
    from backend.models import Project, RiskPrediction, Alert, ReportMetadata

    success = run_project_migration(commit=True, allow_sqlite=True)
    if not success:
        raise HTTPException(status_code=500, detail="Project data migration failed.")
    
    db = SessionLocal()
    try:
        p_count = db.query(Project).count()
        r_count = db.query(RiskPrediction).count()
        a_count = db.query(Alert).count()
        rep_count = db.query(ReportMetadata).count()
        return {
            "status": "success",
            "message": "Project data migration completed successfully.",
            "dialect": db.bind.dialect.name,
            "projects_count": p_count,
            "risk_predictions_count": r_count,
            "alerts_count": a_count,
            "reports_count": rep_count
        }
    finally:
        db.close()

@app.post("/api/admin/migrate-predictions", tags=["Admin"])
def admin_migrate_predictions(current_user: User = Depends(get_current_user)):
    """
    POST /api/admin/migrate-predictions
    Secure administrative endpoint to trigger atomic ML risk predictions migration to PostgreSQL.
    Strictly restricted to authenticated CENTRAL_AUTHORITY administrators.
    """
    if current_user.authority_type != "CENTRAL_AUTHORITY":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Migration requires Central Authority administrative privileges."
        )
    from backend.scripts.migrate_predictions_to_postgres import run_predictions_migration
    from backend.db.database import SessionLocal
    from backend.models import Project, RiskPrediction, Alert, ReportMetadata

    success = run_predictions_migration(commit=True, allow_sqlite=True)
    if not success:
        raise HTTPException(status_code=500, detail="ML Risk Predictions migration failed.")
    
    db = SessionLocal()
    try:
        p_count = db.query(Project).count()
        r_count = db.query(RiskPrediction).count()
        a_count = db.query(Alert).count()
        rep_count = db.query(ReportMetadata).count()
        return {
            "status": "success",
            "message": "ML Risk Predictions migration completed successfully.",
            "dialect": db.bind.dialect.name,
            "projects_count": p_count,
            "risk_predictions_count": r_count,
            "alerts_count": a_count,
            "reports_count": rep_count
        }
    finally:
        db.close()

@app.get("/api/admin/users", tags=["Admin"])
def admin_get_users(current_user: User = Depends(get_current_user)):
    """
    GET /api/admin/users
    Read-only administrative endpoint to view registered users in PostgreSQL.
    Strictly restricted to CENTRAL_AUTHORITY administrators.
    Never exposes passwords, password hashes, JWT secrets, or ID documents.
    """
    if current_user.authority_type != "CENTRAL_AUTHORITY":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Viewing registered users requires Central Authority administrative privileges."
        )
    from backend.db.database import SessionLocal
    from backend.models.user_model import User as UserModel

    db = SessionLocal()
    try:
        users = db.query(UserModel).order_by(UserModel.id.asc()).all()
        user_list = []
        central_count = 0
        state_count = 0
        state_breakdown = {}

        for u in users:
            # Mask mobile number: keep last 4 digits
            raw_mob = str(u.mobile_number or "")
            if len(raw_mob) >= 4:
                masked_mob = "******" + raw_mob[-4:]
            else:
                masked_mob = "******"

            auth_type = u.authority_type or "UNKNOWN"
            if auth_type == "CENTRAL_AUTHORITY":
                central_count += 1
            elif auth_type == "STATE_AUTHORITY":
                state_count += 1
                st = u.state or "Unassigned"
                state_breakdown[st] = state_breakdown.get(st, 0) + 1

            user_list.append({
                "id": u.id,
                "username": u.username,
                "first_name": u.first_name,
                "last_name": u.last_name,
                "email": u.email,
                "mobile": masked_mob,
                "position": u.position,
                "authority_type": u.authority_type,
                "state": u.state,
                "created_at": u.created_at.strftime("%Y-%m-%d %H:%M:%S UTC") if u.created_at else None
            })

        return {
            "dialect": db.bind.dialect.name,
            "total_users": len(user_list),
            "central_authority_count": central_count,
            "state_authority_count": state_count,
            "state_breakdown": state_breakdown,
            "users": user_list
        }
    finally:
        db.close()






