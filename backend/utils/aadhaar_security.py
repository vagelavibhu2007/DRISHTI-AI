import os
import re
import base64
import hashlib
from typing import Tuple
from cryptography.fernet import Fernet
from backend.config import settings

def _get_fernet_key() -> bytes:
    """
    Derives a consistent 32-byte urlsafe base64-encoded key for Fernet encryption
    from environment secret or settings.JWT_SECRET_KEY.
    """
    raw_secret = os.getenv("AADHAAR_ENCRYPTION_SECRET") or settings.JWT_SECRET_KEY or "drishti-aadhaar-vault-secret-key-2026"
    derived_32bytes = hashlib.sha256(raw_secret.encode('utf-8')).digest()
    return base64.urlsafe_b64encode(derived_32bytes)

_fernet_instance = Fernet(_get_fernet_key())

def encrypt_aadhaar(plain_aadhaar: str) -> str:
    """
    Encrypts a 12-digit Aadhaar number string at rest using Fernet (AES-128-CBC + HMAC-SHA256).
    """
    cleaned = re.sub(r'[\s\-]', '', str(plain_aadhaar).strip())
    if not cleaned:
        return ""
    encrypted_bytes = _fernet_instance.encrypt(cleaned.encode('utf-8'))
    return encrypted_bytes.decode('utf-8')

def decrypt_aadhaar(encrypted_aadhaar: str) -> str:
    """
    Decrypts an encrypted Aadhaar string for authorized internal operations only.
    """
    if not encrypted_aadhaar:
        return ""
    try:
        decrypted_bytes = _fernet_instance.decrypt(encrypted_aadhaar.encode('utf-8'))
        return decrypted_bytes.decode('utf-8')
    except Exception:
        return ""

def mask_aadhaar(aadhaar_or_last4: str) -> str:
    """
    Formats an Aadhaar representation safely for civilian UI display:
    e.g. 'XXXX-XXXX-1234'
    Never reveals the first 8 digits.
    """
    if not aadhaar_or_last4:
        return "XXXX-XXXX-XXXX"
    cleaned = re.sub(r'[\s\-]', '', str(aadhaar_or_last4).strip())
    if len(cleaned) == 4:
        return f"XXXX-XXXX-{cleaned}"
    elif len(cleaned) >= 4:
        last4 = cleaned[-4:]
        return f"XXXX-XXXX-{last4}"
    return "XXXX-XXXX-XXXX"

def validate_aadhaar_format(aadhaar_str: str) -> Tuple[bool, str]:
    """
    Validates that the input is a valid 12-digit numeric Aadhaar number.
    Verifies that it doesn't start with 0 or 1 per UIDAI standard numbering guidelines.
    """
    cleaned = re.sub(r'[\s\-]', '', str(aadhaar_str).strip())
    if not cleaned:
        return False, "Aadhaar number is required."
    if not re.match(r'^\d{12}$', cleaned):
        return False, "Aadhaar number must consist of exactly 12 numeric digits."
    if cleaned.startswith('0') or cleaned.startswith('1'):
        return False, "Invalid Aadhaar number format: UIDAI numbers cannot begin with 0 or 1."
    if len(set(cleaned)) == 1:
        return False, "Invalid Aadhaar number: repetitive digits sequence detected."
    return True, ""

