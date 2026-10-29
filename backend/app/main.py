import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager

from app.api.routes import api_router
from app.core.redis import redis_client

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await redis_client.ping()
    except Exception:
        logger.warning(
            "Redis unavailable at startup; continuing without cache",
            exc_info=True,
        )

    try:
        yield
    finally:
        try:
            await redis_client.aclose()
        except Exception:
            logger.warning("Failed to close Redis connection cleanly", exc_info=True)


# initialize app
app = FastAPI(title="Course Management API", lifespan=lifespan)

# cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://localhost:4173",
        "http://127.0.0.1:5173",
        "https://course-management-system-cms-pi.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# router
app.include_router(api_router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Course Management API Running"}
