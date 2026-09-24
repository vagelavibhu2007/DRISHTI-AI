from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional

from backend.db.database import get_db
from backend.models.user_model import User
from backend.utils.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/auth/login', auto_error=False)

def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Could not validate credentials or session has expired.',
        headers={'WWW-Authenticate': 'Bearer'},
    )
    if not token:
        raise credentials_exception

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    username: str = payload.get('sub')
    if username is None:
        raise credentials_exception

    user = db.query(User).filter(func.lower(User.username) == username.strip().lower()).first()
    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Your account is currently inactive. Please contact the administrator.'
        )

    return user

def get_optional_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    if not token:
        return None
    payload = decode_access_token(token)
    if payload is None:
        return None
    username = payload.get('sub')
    if not username:
        return None
    user = db.query(User).filter(func.lower(User.username) == username.strip().lower()).first()
    if user and user.is_active:
        return user
    return None


def is_state_authority(user: Optional[User]) -> bool:
    if not user:
        return False
    atype = str(user.authority_type or "").strip().upper().replace(" ", "_")
    return atype == "STATE_AUTHORITY" and bool(user.state and user.state.strip())

def is_central_authority(user: Optional[User]) -> bool:
    if not user:
        return False
    atype = str(user.authority_type or "").strip().upper().replace(" ", "_")
    return atype == "CENTRAL_AUTHORITY"

def get_user_authorized_state(user: Optional[User]) -> Optional[str]:
    if is_state_authority(user) and user.state:
        return user.state.strip()
    return None

def require_central_authority(
    current_user: User = Depends(get_current_user)
) -> User:
    if not is_central_authority(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Access restricted. Central Authority privileges required.'
        )
    return current_user

def require_state_authority(
    current_user: User = Depends(get_current_user)
) -> User:
    if not is_state_authority(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Access restricted. State Authority privileges required.'
        )
    return current_user


def is_highest_rank_central_authority(user: Optional[User]) -> bool:
    """
    Checks whether the user is the highest-rank Central Authority.
    Includes positions such as Chief Project Officer, Chief Project Director, Director General, etc.
    """
    if not user or not is_central_authority(user):
        return False
    if hasattr(user, 'is_highest_rank') and user.is_highest_rank:
        return True
    pos = (user.position or "").strip().lower()
    uname = (user.username or "").strip().lower()
    highest_keywords = [
        "chief project officer",
        "chief project director",
        "director general",
        "chief executive officer",
        "cpo",
        "cpd",
        "dg",
        "ceo",
        "chief",
        "head"
    ]
    return any(k in pos for k in highest_keywords) or uname in ("vibhu", "aarav_sharma")


def require_highest_rank_central_authority(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    RBAC Gate: Strictly allows only highest-rank Central Authority (e.g. Chief Project Officer).
    Rejects State Authorities and lower-rank officials with HTTP 403 Forbidden.
    """
    if not is_highest_rank_central_authority(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted. Only the highest-rank Central Authority (Chief Project Officer) is authorized to access Civilian Feedback & Ground Issues."
        )
    return current_user


