import os
import unittest
from datetime import datetime
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

from fastapi import HTTPException
from starlette.requests import Request

for setting_name, setting_value in {
    "APP_NAME": "test-app",
    "APP_VERSION": "test",
    "ENVIRONMENT": "test",
    "DATABASE_URL": "sqlite://",
    "SECRET_KEY": "test-secret",
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

from app.api import profile as profile_api
from app.core import dependencies as auth_dependencies
from app.schemas.user import UserResponse
from app.services.profile_cache import invalidate_user_profile_cache


def make_user(role="student"):
    return SimpleNamespace(
        id="user-1",
        name="Test User",
        email="user@example.test",
        phone=None,
        avatar=None,
        bio=None,
        gender=None,
        date_of_birth=None,
        address=None,
        city=None,
        country=None,
        website=None,
        github=None,
        linkedin=None,
        role=role,
        is_verified=True,
        created_at=datetime(2026, 1, 1),
    )


class UserProfileCacheTests(unittest.IsolatedAsyncioTestCase):
    async def test_cache_miss_fetches_database_and_writes_with_configured_ttl(self):
        user = make_user()
        redis_get = AsyncMock(return_value=None)
        redis_set = AsyncMock()

        with (
            patch.object(profile_api.redis_client, "get", redis_get),
            patch.object(profile_api.redis_client, "set", redis_set),
            patch.object(
                profile_api.UserRepository,
                "get_by_id",
                return_value=user,
            ) as get_by_id,
        ):
            response = await profile_api.get_user_profile("user-1", object())

        self.assertEqual(response["id"], "user-1")
        get_by_id.assert_called_once()
        redis_set.assert_awaited_once()
        self.assertEqual(
            redis_set.await_args.kwargs["ex"],
            profile_api.settings.USER_PROFILE_CACHE_TTL_SECONDS,
        )

    async def test_cache_hit_skips_database_query(self):
        cached_profile = UserResponse.model_validate(make_user()).model_dump_json()

        with (
            patch.object(
                profile_api.redis_client,
                "get",
                new=AsyncMock(return_value=cached_profile),
            ),
            patch.object(
                profile_api.UserRepository,
                "get_by_id",
                side_effect=AssertionError("database should not be queried"),
            ) as get_by_id,
        ):
            response = await profile_api.get_user_profile("user-1", object())

        self.assertEqual(response["id"], "user-1")
        get_by_id.assert_not_called()

    async def test_expired_cache_miss_fetches_database_again(self):
        redis_get = AsyncMock(return_value=None)

        with (
            patch.object(profile_api.redis_client, "get", redis_get),
            patch.object(profile_api.redis_client, "set", new=AsyncMock()),
            patch.object(
                profile_api.UserRepository,
                "get_by_id",
                return_value=make_user(),
            ) as get_by_id,
        ):
            await profile_api.get_user_profile("user-1", object())

        get_by_id.assert_called_once()

    async def test_malformed_cache_is_deleted_and_refetched(self):
        redis_delete = AsyncMock()

        with (
            patch.object(
                profile_api.redis_client,
                "get",
                new=AsyncMock(return_value="{malformed-json"),
            ),
            patch.object(profile_api.redis_client, "delete", redis_delete),
            patch.object(profile_api.redis_client, "set", new=AsyncMock()),
            patch.object(
                profile_api.UserRepository,
                "get_by_id",
                return_value=make_user(),
            ) as get_by_id,
        ):
            response = await profile_api.get_user_profile("user-1", object())

        self.assertEqual(response["id"], "user-1")
        redis_delete.assert_awaited_once_with("user:profile:user-1")
        get_by_id.assert_called_once()

    async def test_schema_invalid_cache_is_deleted_and_refetched(self):
        redis_delete = AsyncMock()

        with (
            patch.object(
                profile_api.redis_client,
                "get",
                new=AsyncMock(return_value='{"id":"user-1"}'),
            ),
            patch.object(profile_api.redis_client, "delete", redis_delete),
            patch.object(profile_api.redis_client, "set", new=AsyncMock()),
            patch.object(
                profile_api.UserRepository,
                "get_by_id",
                return_value=make_user(),
            ) as get_by_id,
        ):
            response = await profile_api.get_user_profile("user-1", object())

        self.assertEqual(response["id"], "user-1")
        redis_delete.assert_awaited_once_with("user:profile:user-1")
        get_by_id.assert_called_once()

    async def test_redis_failure_falls_back_to_database(self):
        with (
            patch.object(
                profile_api.redis_client,
                "get",
                new=AsyncMock(side_effect=ConnectionError("Redis unavailable")),
            ),
            patch.object(
                profile_api.redis_client,
                "set",
                new=AsyncMock(side_effect=ConnectionError("Redis unavailable")),
            ),
            patch.object(
                profile_api.UserRepository,
                "get_by_id",
                return_value=make_user(),
            ) as get_by_id,
        ):
            response = await profile_api.get_user_profile("user-1", object())

        self.assertEqual(response["id"], "user-1")
        get_by_id.assert_called_once()

    async def test_missing_user_returns_not_found_after_cache_miss(self):
        with (
            patch.object(
                profile_api.redis_client,
                "get",
                new=AsyncMock(return_value=None),
            ),
            patch.object(
                profile_api.UserRepository,
                "get_by_id",
                return_value=None,
            ),
        ):
            with self.assertRaises(HTTPException) as error:
                await profile_api.get_user_profile("missing-user", object())

        self.assertEqual(error.exception.status_code, 404)

    async def test_profile_cache_invalidation_uses_user_key(self):
        with patch.object(
            profile_api.redis_client,
            "delete",
            new=AsyncMock(),
        ) as redis_delete:
            await invalidate_user_profile_cache("user-1")

        redis_delete.assert_awaited_once_with("user:profile:user-1")

    async def test_profile_update_invalidates_cache_after_database_commit(self):
        from app.schemas.profile import UpdateProfileSchema

        events = []
        current_user = make_user()
        db = SimpleNamespace(
            commit=lambda: events.append("commit"),
            refresh=lambda user: events.append("refresh"),
            rollback=lambda: events.append("rollback"),
        )

        async def invalidate(user_id):
            events.append(f"invalidate:{user_id}")

        with patch.object(profile_api, "invalidate_user_profile_cache", invalidate):
            response = await profile_api.update_profile(
                "user-1",
                UpdateProfileSchema(name="Updated Name"),
                current_user,
                db,
            )

        self.assertEqual(response["user"].name, "Updated Name")
        self.assertEqual(events, ["commit", "refresh", "invalidate:user-1"])


class AuthenticationCacheSafetyTests(unittest.TestCase):
    def test_current_user_and_role_guard_use_database_user(self):
        request = Request(
            {
                "type": "http",
                "headers": [(b"cookie", b"access_token=signed-token")],
            }
        )
        database_user = make_user(role="student")

        with (
            patch.object(
                auth_dependencies,
                "decode_token",
                return_value={"type": "access", "sub": "user-1"},
            ),
            patch.object(
                auth_dependencies.UserRepository,
                "get_by_id",
                return_value=database_user,
            ) as get_by_id,
        ):
            current_user = auth_dependencies.get_current_user(request, object())

        get_by_id.assert_called_once()
        self.assertEqual(current_user.role, "student")
        with self.assertRaises(HTTPException) as error:
            auth_dependencies.admin_required(current_user)
        self.assertEqual(error.exception.status_code, 403)


if __name__ == "__main__":
    unittest.main()
