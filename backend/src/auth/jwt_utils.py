from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta, timezone
import uuid
from typing import Dict, Optional, Tuple, Annotated
from jose import jwt, JWTError
from config.loader import settings
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


def generate_jti() -> str:
    """Return a random unique token id (JWT ID)."""
    return str(uuid.uuid4())


def create_access_token(subject: int, * , issuer: Optional[str] = None) -> Tuple[str, str]:
    """
    Create a signed JWT access token and return (token, jti).
    Access tokens are meant to be short-lived.
    """
    expires_minutes = settings.ACCESS_TOKEN_EXPIRES_MIN
    iat = _now_utc()
    exp = iat + timedelta(minutes=expires_minutes)
    jti = generate_jti()

    payload = {
        "sub": subject,
        "iat": int(iat.timestamp()),
        "exp": int(exp.timestamp()),
        "jti": jti,
    }
    if issuer:
        payload["iss"] = issuer

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return token, jti


def create_refresh_token(subject: int, issuer: Optional[str] = None) -> Tuple[str, str, datetime]:
    """
    Create a signed refresh token and return (token, jti, expires_at).
    Refresh tokens are long lived and should have their `jti` stored server-side for rotation & revocation.
    """
    expires_days: int = 7
    iat = _now_utc()
    exp = iat + timedelta(days=expires_days)
    jti = generate_jti()

    payload = {
        "sub": subject,
        "iat": int(iat.timestamp()),
        "exp": int(exp.timestamp()),
        "jti": jti,
        "typ": "refresh",
    }
    if issuer:
        payload["iss"] = issuer

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return token, jti, exp


def decode_token(token: str, verify_exp: bool = True) -> Dict:
    """
    Decode & verify a token. Raises jose.JWTError if invalid.
    Returns the token payload dict (claims).
    """
    options = {"verify_exp": verify_exp}
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM], options=options)
        return payload
    except JWTError as e:
        # Caller should catch this and map to HTTP 401 / 403
        raise 


def get_jti_from_token(token: str) -> str:
    """Extract jti from token, raises JWTError on invalid token."""
    payload = decode_token(token, verify_exp=False)
    jti = payload.get("jti")
    if not jti:
        raise JWTError("missing jti")
    return jti

