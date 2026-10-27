from fastapi import Response
from app.core.config import settings


def set_auth_cookies(
    response: Response,
    access: str,
    refresh: str,
):
    is_prod = settings.ENVIRONMENT == "production"

    domain = ".vercel.app" if is_prod else None
    secure = True if is_prod else False
    samesite = "none" if is_prod else "lax"

    cookie_params = {
        "httponly": True,
        "secure": secure,
        "samesite": samesite,
        "path": "/",
    }

    if domain:
        cookie_params["domain"] = domain

    response.set_cookie(
        key="access_token",
        value=access,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        **cookie_params
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        **cookie_params
    )
