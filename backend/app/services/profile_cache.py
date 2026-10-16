import logging

from app.core.redis import redis_client

logger = logging.getLogger(__name__)


async def invalidate_user_profile_cache(user_id: str) -> None:
    try:
        await redis_client.delete(f"user:profile:{user_id}")
    except Exception:
        logger.warning("Failed to invalidate user profile cache", exc_info=True)