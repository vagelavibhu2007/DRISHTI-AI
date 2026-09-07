import os
from pydantic_settings import BaseSettings

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def resolve_path(path_str: str) -> str:
    if os.path.isabs(path_str):
        return path_str
    return os.path.join(BASE_DIR, path_str)

is_vercel = bool(os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"))
default_db_path = "/tmp/drishti_auth.db" if is_vercel else resolve_path("backend/data/drishti_auth.db")
default_upload_dir = "/tmp/uploads" if is_vercel else resolve_path("uploads")

class Settings(BaseSettings):
    APP_NAME: str = "DRISHTI AI - Infrastructure Risk Backend"
    APP_VERSION: str = "4.2.0"
    API_PREFIX: str = "/api"
    
    # ML Mode: "real" or "mock"
    ML_MODE: str = os.getenv("ML_MODE", "real")
    
    # Classification Threshold for Cost Overrun
    COST_CLASSIFICATION_THRESHOLD: float = 0.40
    
    # Model Artifact Paths
    COST_CLASSIFIER_PATH: str = os.getenv("COST_CLASSIFIER_PATH", resolve_path("backend/models/cost_model/cost_classifier_xgb.joblib"))
    COST_REGRESSOR_PATH: str = os.getenv("COST_REGRESSOR_PATH", resolve_path("backend/models/cost_model/cost_regressor.joblib"))
    COST_METADATA_PATH: str = os.getenv("COST_METADATA_PATH", resolve_path("backend/models/cost_model/metadata.json"))
    
    TIME_CLASSIFIER_PATH: str = os.getenv("TIME_CLASSIFIER_PATH", resolve_path("backend/models/time_model/time_classifier_rf.joblib"))
    TIME_REGRESSOR_PATH: str = os.getenv("TIME_REGRESSOR_PATH", resolve_path("backend/models/time_model/time_regressor_rf.joblib"))
    TIME_METADATA_PATH: str = os.getenv("TIME_METADATA_PATH", resolve_path("backend/models/time_model/metadata.json"))

    # Dataset Path
    DATASET_PATH: str = os.getenv("DATASET_PATH", resolve_path("backend/data/ML_READY.csv"))

    # Feature List matching training
    NUMERIC_FEATURES: list[str] = [
        "Original_Cost_Cr",
        "Cumulative_Expenditure_Cr",
        "Physical_Progress_Pct",
        "Expenditure_Pct_of_Original_Cost"
    ]
    CATEGORICAL_FEATURES: list[str] = ["Ministry", "Sector", "State"]
    ALL_FEATURES: list[str] = NUMERIC_FEATURES + CATEGORICAL_FEATURES

    CORS_ORIGINS: list[str] = [
        origin.strip() for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173,http://localhost:8000,http://127.0.0.1:8000"
        ).split(",") if origin.strip()
    ]
    CORS_ORIGIN_REGEX: str = os.getenv("CORS_ORIGIN_REGEX", r"^https:\/\/.*\.vercel\.app$|^https:\/\/.*\.onrender\.com$|^https:\/\/.*\.railway\.app$")

    # Authentication & Security Settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{default_db_path}")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "drishti-ai-secure-secret-key-national-infra-2026-auth")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")) # 24 hours
    
    # Storage paths
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", default_upload_dir)
    ID_PROOFS_DIR: str = os.getenv("ID_PROOFS_DIR", os.path.join(default_upload_dir, "id_proofs"))
    PROFILE_PHOTOS_DIR: str = os.getenv("PROFILE_PHOTOS_DIR", os.path.join(default_upload_dir, "profile_photos"))
    
    # File limits
    MAX_ID_PROOF_SIZE: int = 5 * 1024 * 1024  # 5 MB
    MAX_PROFILE_PHOTO_SIZE: int = 2 * 1024 * 1024  # 2 MB

    class Config:
        env_file = ".env"

settings = Settings()

