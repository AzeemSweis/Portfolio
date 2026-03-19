import asyncio
import io
from typing import Any

import cloudinary
import cloudinary.uploader

from api.config import settings


def _configure() -> None:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )


def _upload_sync(data: bytes, folder: str) -> dict[str, Any]:
    _configure()
    result = cloudinary.uploader.upload(
        io.BytesIO(data),
        folder=f"portfolio/{folder}",
        resource_type="image",
    )
    return {"url": result["secure_url"], "public_id": result["public_id"]}


def _delete_sync(public_id: str) -> None:
    _configure()
    cloudinary.uploader.destroy(public_id, resource_type="image")


async def upload_image(data: bytes, folder: str = "projects") -> dict[str, Any]:
    """Upload image bytes to Cloudinary. Returns {"url": ..., "public_id": ...}."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _upload_sync, data, folder)


async def delete_image(public_id: str) -> None:
    """Delete an image from Cloudinary by its public_id."""
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, _delete_sync, public_id)
