import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.config import settings

# Ensure sqlite directory exists
if settings.DATABASE_URL.startswith('sqlite'):
    db_path = settings.DATABASE_URL.replace('sqlite:///', '')
    db_dir = os.path.dirname(db_path)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)

connect_args = {'check_same_thread': False} if settings.DATABASE_URL.startswith('sqlite') else {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    from backend.models.user_model import User
    from backend.utils.security import hash_password
    Base.metadata.create_all(bind=engine)
    
    # Ensure default accounts are provisioned
    db = SessionLocal()
    try:
        vibhu_user = db.query(User).filter(User.username == 'vibhu').first()
        if not vibhu_user:
            vibhu_user = User(
                first_name='Vibhu',
                last_name='Vagela',
                mobile_number='9876543210',
                email='vagelavibhu2007@gmail.com',
                authority_type='CENTRAL_AUTHORITY',
                state=None,
                position='Chief Project Officer (Central)',
                id_proof_type='Aadhaar Card',
                id_proof_number='123456789012',
                id_proof_file_path='uploads/id_proofs/default_central.pdf',
                profile_photo_path=None,
                username='vibhu',
                password_hash=hash_password('Vibhu@127'),
                is_active=True
            )
            db.add(vibhu_user)
        else:
            vibhu_user.password_hash = hash_password('Vibhu@127')
            vibhu_user.authority_type = 'CENTRAL_AUTHORITY'
            vibhu_user.is_active = True

        priya_user = db.query(User).filter(User.username == 'priya_patel').first()
        if not priya_user:
            priya_user = User(
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
            db.add(priya_user)

        db.commit()
    except Exception as e:
        db.rollback()
    finally:
        db.close()

