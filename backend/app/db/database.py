import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.engine import make_url

from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL

if Path("/.dockerenv").exists() and not os.getenv("DATABASE_URL_DOCKER"):
    database_url = make_url(DATABASE_URL)
    if database_url.host in {"localhost", "127.0.0.1", "::1"}:
        DATABASE_URL = database_url.set(host="host.docker.internal").render_as_string(
            hide_password=False
        )

engine_url = make_url(DATABASE_URL)
connect_args = {"ssl": "require"}
if engine_url.drivername == "postgresql+asyncpg":
    engine_url = engine_url.set(drivername="postgresql+psycopg2")
    connect_args = {"sslmode": "require"}

engine = create_engine(
    engine_url,
    connect_args=connect_args,
    pool_pre_ping=True,
)
