from __future__ import annotations

from pathlib import Path

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from api.config import settings

# Use DATABASE_URL from settings (env var or default).
# Default for local dev: sqlite+aiosqlite:///api/portfolio.db (relative to cwd).
# On Fly.io: sqlite+aiosqlite:////data/portfolio.db (absolute, on persistent volume).
_DB_URL = settings.DATABASE_URL

# If the URL points to a local file path, ensure the parent directory exists.
if _DB_URL.startswith("sqlite"):
    # Extract the file path from the URL (after sqlite+aiosqlite:///)
    _path_part = _DB_URL.split("///", 1)[-1]
    if _path_part:
        Path(_path_part).parent.mkdir(parents=True, exist_ok=True)

engine = create_async_engine(
    _DB_URL,
    echo=False,
    connect_args={"check_same_thread": False},
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


class Base(DeclarativeBase):
    pass


async def init_db() -> None:
    """Create all tables. Called once on startup."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
