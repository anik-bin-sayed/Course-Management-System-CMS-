from logging.config import fileConfig
import asyncio

from sqlalchemy import pool
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

from app.core.config import settings
from app.db.base import Base
from app.db.database import DATABASE_URL

# এইটি Alembic Config অবজেক্ট, যা .ini ফাইলের মান দেয়
config = context.config
config.set_main_option("sqlalchemy.url", DATABASE_URL.replace("%", "%%"))

# লগিং কনফিগার
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """'offline' মোডে মাইগ্রেশন চালান।"""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection) -> None:
    """সিঙ্ক্রোনাস কানেকশনে মাইগ্রেশন চালান।"""
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """অ্যাসিঙ্ক্রোনাস ইঞ্জিন তৈরি করে মাইগ্রেশন চালান।"""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        connect_args={"ssl": "require"},  # Neon-এর জন্য SSL বাধ্যতামূলক
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """'online' মোডে মাইগ্রেশন চালান (async)।"""
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
