from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from backend.config import settings
from backend.ml.model_loader import model_loader
from backend.db.database import init_db
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
    Production health check endpoint reporting service status and loaded ML models.
    """
    return {
        "status": "ok",
        "service": "DRISHTI AI Backend",
        "version": settings.APP_VERSION,
        "ml_mode": settings.ML_MODE,
        "models_loaded": {
            "cost_classifier": model_loader.is_cost_classifier_ready,
            "time_classifier": model_loader.is_time_classifier_ready,
            "cost_regressor": model_loader.cost_regressor is not None,
            "time_regressor": model_loader.time_regressor is not None
        }
    }



