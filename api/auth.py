from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
from jose import JWTError, jwt

from api.config import settings

_ACCESS_TOKEN_EXPIRE_MINUTES = 30
_REFRESH_TOKEN_EXPIRE_DAYS = 7
_ALGORITHM = "HS256"


# ---------------------------------------------------------------------------
# Password hashing
# ---------------------------------------------------------------------------

def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


# ---------------------------------------------------------------------------
# JWT
# ---------------------------------------------------------------------------

def _create_token(data: dict[str, Any], expires_delta: timedelta) -> str:
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + expires_delta
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=_ALGORITHM)


def create_access_token(subject: str) -> str:
    return _create_token(
        {"sub": subject, "type": "access"},
        timedelta(minutes=_ACCESS_TOKEN_EXPIRE_MINUTES),
    )


def create_refresh_token(subject: str) -> str:
    return _create_token(
        {"sub": subject, "type": "refresh"},
        timedelta(days=_REFRESH_TOKEN_EXPIRE_DAYS),
    )


def decode_access_token(token: str) -> str:
    """Return the subject (username) from a valid access token.

    Raises JWTError on any validation failure.
    """
    payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[_ALGORITHM])
    if payload.get("type") != "access":
        raise JWTError("Not an access token")
    sub: str | None = payload.get("sub")
    if sub is None:
        raise JWTError("Missing subject")
    return sub


def decode_refresh_token(token: str) -> str:
    """Return the subject (username) from a valid refresh token.

    Raises JWTError on any validation failure.
    """
    payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[_ALGORITHM])
    if payload.get("type") != "refresh":
        raise JWTError("Not a refresh token")
    sub: str | None = payload.get("sub")
    if sub is None:
        raise JWTError("Missing subject")
    return sub
