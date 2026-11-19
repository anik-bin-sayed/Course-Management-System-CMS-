from fastapi import Response

from app.core.config import settings


def set_auth_cookies(
    response: Response,
    access: str,
    refresh: str,
    remember_me: bool = False,
):
    is_prod = settings.ENVIRONMENT == "production"

    cookie_params = {
        "httponly": True,
        "secure": is_prod,
        "samesite": "none" if is_prod else "lax",
        "path": "/",
    }

    response.set_cookie(
        key="access_token",
        value=access,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        **cookie_params,
    )

    if remember_me:
        response.set_cookie(
            key="refresh_token",
            value=refresh,
            max_age=(settings.REMEMBER_ME_REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60),
            **cookie_params,
        )
    else:
        response.set_cookie(
            key="refresh_token",
            value=refresh,
            **cookie_params,
        )
