import os
import unittest
from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import patch

for setting_name, setting_value in {
    "APP_NAME": "test-app",
    "APP_VERSION": "test",
    "ENVIRONMENT": "test",
    "DATABASE_URL": "sqlite://",
    "SECRET_KEY": "remember-me-test-secret",
    "ALGORITHM": "HS256",
    "ACCESS_TOKEN_EXPIRE_MINUTES": "15",
    "REFRESH_TOKEN_EXPIRE_DAYS": "7",
    "CLOUDINARY_CLOUD_NAME": "test",
    "CLOUDINARY_API_KEY": "test",
    "CLOUDINARY_API_SECRET": "test",
    "SMTP_PASSWORD": "test",
    "SMTP_GMAIL": "test@example.test",
    "SSLCOMMERZ_STORE_ID": "test",
    "SSLCOMMERZ_STORE_PASSWORD": "test",
    "REDIS_URL": "redis://localhost:6379/15",
}.items():
    os.environ.setdefault(setting_name, setting_value)

from fastapi import Response

from app.core.config import settings
from app.api import auth as auth_api
from app.schemas.user import UserLogin
from app.services.user_service import UserService
from app.utils.cookies import set_auth_cookies
from app.utils.jwt import create_refresh_token, decode_token


def cookie_header(response: Response, cookie_name: str) -> str:
    for name, value in response.raw_headers:
        if name.lower() == b"set-cookie" and value.decode().startswith(
            f"{cookie_name}="
        ):
            return value.decode()
    raise AssertionError(f"{cookie_name} cookie was not set")


class RememberMeTokenTests(unittest.TestCase):
    def setUp(self):
        self.user = SimpleNamespace(
            id="user-1",
            email="user@example.com",
            role="student",
            password="hashed-password",
            is_verified=True,
        )

    def test_login_issues_persistent_refresh_token_only_when_requested(self):
        for remember_me in (False, True):
            with self.subTest(remember_me=remember_me):
                expected_days = (
                    settings.REMEMBER_ME_REFRESH_TOKEN_EXPIRE_DAYS
                    if remember_me
                    else settings.REFRESH_TOKEN_EXPIRE_DAYS
                )
                request = UserLogin(
                    email=self.user.email,
                    password="password",
                    remember_me=remember_me,
                )
                with (
                    patch(
                        "app.services.user_service.UserRepository.get_by_email",
                        return_value=self.user,
                    ),
                    patch(
                        "app.services.user_service.verify_password",
                        return_value=True,
                    ),
                    patch(
                        "app.services.user_service.UserRepository.update_refresh_token"
                    ),
                ):
                    _, refresh_token = UserService.login(object(), request)

                claims = decode_token(refresh_token)
                self.assertEqual(claims["rm"], remember_me)
                self.assertEqual(claims["type"], "refresh")
                self.assertEqual(claims["sub"], self.user.id)
                expires_at = datetime.fromtimestamp(claims["exp"], timezone.utc)
                remaining_days = (expires_at - datetime.now(timezone.utc)).total_seconds() / 86400
                self.assertGreater(remaining_days, expected_days - 0.01)
                self.assertLessEqual(remaining_days, expected_days)

    def test_refresh_rotation_preserves_remember_me_choice(self):
        for remember_me in (False, True):
            with self.subTest(remember_me=remember_me):
                old_refresh = create_refresh_token(
                    {"sub": self.user.id}, remember_me=remember_me
                )
                with (
                    patch(
                        "app.services.user_service.UserRepository.get_by_refresh_token",
                        return_value=self.user,
                    ),
                    patch(
                        "app.services.user_service.UserRepository.update_refresh_token"
                    ),
                ):
                    _, new_refresh, rotated_remember_me = UserService.refresh(
                        object(), old_refresh
                    )

                claims = decode_token(new_refresh)
                self.assertEqual(rotated_remember_me, remember_me)
                self.assertEqual(claims["rm"], remember_me)

    def test_persistent_cookie_matches_remember_me_refresh_lifetime(self):
        response = Response()
        with patch.object(settings, "ENVIRONMENT", "test"):
            set_auth_cookies(response, "access", "refresh", remember_me=True)

        refresh_cookie = cookie_header(response, "refresh_token")
        self.assertIn(
            f"Max-Age={settings.REMEMBER_ME_REFRESH_TOKEN_EXPIRE_DAYS * 86400}",
            refresh_cookie,
        )
        self.assertIn("HttpOnly", refresh_cookie)
        self.assertIn("SameSite=lax", refresh_cookie)

    def test_normal_refresh_cookie_is_a_browser_session_cookie(self):
        response = Response()
        with patch.object(settings, "ENVIRONMENT", "test"):
            set_auth_cookies(response, "access", "refresh", remember_me=False)

        refresh_cookie = cookie_header(response, "refresh_token")
        self.assertNotIn("Max-Age=", refresh_cookie)
        self.assertNotIn("Expires=", refresh_cookie)

    def test_login_endpoint_carries_remember_me_into_cookie_settings(self):
        response = Response()
        request_data = UserLogin(
            email=self.user.email,
            password="password",
            remember_me=True,
        )
        with (
            patch.object(settings, "ENVIRONMENT", "test"),
            patch.object(
                auth_api.UserService,
                "login",
                return_value=("access-token", "refresh-token"),
            ) as login,
        ):
            result = auth_api.login(request_data, response, object())

        self.assertEqual(result["message"], "Login successful")
        self.assertTrue(login.call_args.args[1].remember_me)
        self.assertIn(
            f"Max-Age={settings.REMEMBER_ME_REFRESH_TOKEN_EXPIRE_DAYS * 86400}",
            cookie_header(response, "refresh_token"),
        )

    def test_refresh_endpoint_keeps_persistent_cookie_after_rotation(self):
        from starlette.requests import Request

        request = Request(
            {
                "type": "http",
                "method": "POST",
                "path": "/api/auth/refresh",
                "headers": [(b"cookie", b"refresh_token=old-token")],
                "query_string": b"",
                "server": ("testserver", 80),
                "client": ("testclient", 50000),
                "scheme": "http",
            }
        )
        response = Response()
        db = object()
        with (
            patch.object(settings, "ENVIRONMENT", "test"),
            patch.object(
                auth_api.UserService,
                "refresh",
                return_value=("new-access", "new-refresh", True),
            ) as refresh,
        ):
            result = auth_api.refresh(request, response, db)

        self.assertEqual(result["message"], "Access token refreshed")
        refresh.assert_called_once_with(db, "old-token")
        self.assertIn(
            f"Max-Age={settings.REMEMBER_ME_REFRESH_TOKEN_EXPIRE_DAYS * 86400}",
            cookie_header(response, "refresh_token"),
        )


if __name__ == "__main__":
    unittest.main()
