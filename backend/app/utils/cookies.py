from fastapi import Response

from app.core.config import settings

COOKIE_DOMAIN = ".vercel.app"


def set_auth_cookies(
    response: Response,
    access: str,
    refresh: str,
):
    response.set_cookie(
        key="access_token",
        value=access,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        domain=COOKIE_DOMAIN,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        domain=COOKIE_DOMAIN,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
    )
