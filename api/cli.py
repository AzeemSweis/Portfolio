"""CLI entry point for admin management commands.

Usage:
    python -m api.cli create-admin
    python -m api.cli seed-from-static
    python -m api.cli seed-from-static --force
"""

import asyncio
import logging

import click

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)


@click.group()
def cli() -> None:
    """Portfolio CMS management commands."""


@cli.command("create-admin")
@click.option("--username", prompt="Admin username", default="azeem", show_default=True)
@click.option("--password", prompt=True, hide_input=True, confirmation_prompt=True)
def create_admin(username: str, password: str) -> None:
    """Create the admin user (or update the password if it already exists)."""
    if len(password) < 12:
        raise click.UsageError("Password must be at least 12 characters.")

    asyncio.run(_create_admin(username, password))


async def _create_admin(username: str, password: str) -> None:
    from sqlalchemy import select

    from api.auth import hash_password
    from api.database import AsyncSessionLocal, init_db
    from api.models import AdminUser

    await init_db()

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(AdminUser).where(AdminUser.username == username))
        existing = result.scalar_one_or_none()

        if existing is None:
            user = AdminUser(username=username, password_hash=hash_password(password))
            db.add(user)
            await db.commit()
            click.echo(f"Admin user {username!r} created.")
        else:
            existing.password_hash = hash_password(password)
            await db.commit()
            click.echo(f"Admin user {username!r} password updated.")


@cli.command("seed-from-static")
@click.option(
    "--force",
    is_flag=True,
    default=False,
    help="Truncate all content tables before seeding (full re-seed).",
)
def seed_from_static(force: bool) -> None:
    """Populate SQLite with the current hardcoded static content."""
    from api.seed import run_seed

    if force:
        click.confirm(
            "This will DELETE all existing content and re-seed from scratch. Continue?",
            abort=True,
        )

    asyncio.run(run_seed(force=force))
    click.echo("Done.")


def main() -> None:
    cli()


if __name__ == "__main__":
    main()
