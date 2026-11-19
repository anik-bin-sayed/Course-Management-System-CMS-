from datetime import datetime, timedelta, UTC

from jose import jwt, JWTError, ExpiredSignatureError

from app.core.config import settings


def create_access_token(data: dict):
    payload = data.copy()

    payload["type"] = "access"

    payload["exp"] = datetime.now(UTC) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def create_refresh_token(data: dict, remember_me: bool = False):
    payload = data.copy()

    payload["type"] = "refresh"
    payload["rm"] = remember_me

    expiry_days = (
        settings.REMEMBER_ME_REFRESH_TOKEN_EXPIRE_DAYS
        if remember_me
        else settings.REFRESH_TOKEN_EXPIRE_DAYS
    )

    payload["exp"] = datetime.now(UTC) + timedelta(days=expiry_days)

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def decode_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        return payload

    except (ExpiredSignatureError, JWTError):
        return None
