from fastapi import Response

from app.core.config import settings

IS_PRODUCTION = settings.ENVIRONMENT.lower() == "production"


def set_auth_cookies(
    response: Response,
    access: str,
    refresh: str,
) -> None:

    cookie_options = {
        "httponly": True,
        "secure": IS_PRODUCTION,
        "samesite": "none" if IS_PRODUCTION else "lax",
        "path": "/",
    }

    # Access Token Cookie
    response.set_cookie(
        key="access_token",
        value=access,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        **cookie_options,
    )

    # Refresh Token Cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        **cookie_options,
    )
