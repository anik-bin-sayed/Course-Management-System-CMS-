from fastapi import Response
from app.core.config import settings

COOKIE_DOMAIN = None if settings.ENVIRONMENT == "development" else ".vercel.com"


def set_auth_cookies(
    response: Response,
    access: str,
    refresh: str,
):
    is_secure = settings.ENVIRONMENT != "development"
    same_site_policy = "none" if is_secure else "lax"

    response.set_cookie(
        key="access_token",
        value=access,
        httponly=True,
        secure=is_secure,
        samesite=same_site_policy,
        path="/",
        domain=COOKIE_DOMAIN,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh,
        httponly=True,
        secure=is_secure,
        samesite=same_site_policy,
        path="/",
        domain=COOKIE_DOMAIN,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
    )
