import os
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.config import settings

logger = logging.getLogger("drishti.db")

raw_db_url = settings.DATABASE_URL or ""
is_prod = settings.ENVIRONMENT.lower() in ["production", "prod"]

if is_prod:
    if not raw_db_url or raw_db_url.startswith("sqlite"):
        raise RuntimeError(
            "CRITICAL: Production environment is active ('ENVIRONMENT=production'), but a valid PostgreSQL DATABASE_URL "
            "is not configured. DRISHTI AI production requires PostgreSQL. Silent SQLite fallback is strictly prohibited in production."
        )

if raw_db_url.startswith("postgres://"):
    db_url = raw_db_url.replace("postgres://", "postgresql://", 1)
else:
    db_url = raw_db_url

# Configure SQLAlchemy Engine
if db_url.startswith("sqlite"):
    db_path = db_url.replace("sqlite:///", "")
    db_dir = os.path.dirname(db_path)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)
    connect_args = {"check_same_thread": False}
    engine = create_engine(db_url, connect_args=connect_args, echo=False)
    logger.info("SQLAlchemy Engine initialized with SQLite dialect (Local Development Mode Only).")
else:
    # Production PostgreSQL database with connection pooling and keep-alive
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        pool_recycle=settings.DB_POOL_RECYCLE,
        pool_size=settings.DB_POOL_SIZE,
        max_overflow=settings.DB_MAX_OVERFLOW,
        pool_timeout=settings.DB_POOL_TIMEOUT,
        echo=False
    )
    logger.info("SQLAlchemy Engine initialized with PostgreSQL dialect (Production Mode).")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """
    FastAPI dependency yielding a database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def check_db_connection() -> dict:
    """
    Safely tests database connectivity using a lightweight SELECT 1 query.
    Never exposes credentials, connection strings, or passwords in output or logs.
    """
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {
            "connected": True,
            "status": "connected",
            "dialect": engine.dialect.name
        }
    except Exception as exc:
        logger.warning(f"Database health check failed: {type(exc).__name__}")
        return {
            "connected": False,
            "status": "unavailable",
            "dialect": engine.dialect.name
        }

def init_db():
    """
    Non-destructive database schema initialization.
    Creates tables if they do not already exist without altering, dropping, or overwriting existing data.
    Idempotently provisions default initial administrative accounts only if they do not already exist.
    """
    from backend.models import User, Project, RiskPrediction, Alert, ReportMetadata
    from backend.utils.security import hash_password
    
    # 1. Non-destructive table creation
    Base.metadata.create_all(bind=engine)
    
    # 2. Idempotent seed provisioning (never overwrites existing users)
    db = SessionLocal()
    try:
        # Check Central Authority admin
        admin_uname = settings.INITIAL_ADMIN_USERNAME or 'vibhu'
        existing_admin = db.query(User).filter(User.username == admin_uname).first()
        if not existing_admin:
            admin_pwd = settings.INITIAL_ADMIN_PASSWORD or 'Vibhu@127'
            admin_email = settings.INITIAL_ADMIN_EMAIL or 'vagelavibhu2007@gmail.com'
            new_admin = User(
                first_name='Vibhu',
                last_name='Vagela',
                mobile_number='9876543210',
                email=admin_email,
                authority_type='CENTRAL_AUTHORITY',
                state=None,
                position='Chief Project Officer (Central)',
                id_proof_type='Government ID',
                id_proof_number='123456789012',
                id_proof_file_path='uploads/id_proofs/default_central.pdf',
                profile_photo_path=None,
                username=admin_uname,
                password_hash=hash_password(admin_pwd),
                is_active=True
            )
            db.add(new_admin)
            logger.info("Initial Central Authority administrator provisioned.")

        # Check State Authority officer (Gujarat demo)
        existing_state_officer = db.query(User).filter(User.username == 'priya_patel').first()
        if not existing_state_officer:
            new_state_officer = User(
                first_name='Priya',
                last_name='Patel',
                mobile_number='9876543211',
                email='priya.patel@gujarat.gov.in',
                authority_type='STATE_AUTHORITY',
                state='Gujarat',
                position='Principal Secretary (Infrastructure - Gujarat)',
                id_proof_type='Government / Service ID Card',
                id_proof_number='GJ-INFRA-8891',
                id_proof_file_path='uploads/id_proofs/default_state.pdf',
                profile_photo_path=None,
                username='priya_patel',
                password_hash=hash_password('Password@123'),
                is_active=True
            )
            db.add(new_state_officer)
            logger.info("Initial State Authority officer provisioned.")

        db.commit()
    except Exception as e:
        db.rollback()
        logger.warning(f"Database initialization seed step encountered exception: {type(e).__name__}")
    finally:
        db.close()


