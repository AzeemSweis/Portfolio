from __future__ import annotations

import json
import logging
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Query, Response, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from api.deps import get_current_user, get_db
from api.models import (
    AdminUser,
    Experience,
    Project,
    SiteConfig,
    Skill,
    SkillCategory,
    SocialLink,
    Trip,
    TripStop,
)
from api.schemas import (
    ExperienceCreate,
    ExperienceOut,
    ExperienceUpdate,
    ProjectCreate,
    ProjectOut,
    ProjectUpdate,
    SkillCategoryCreate,
    SkillCategoryOut,
    SkillCategoryUpdate,
    SkillCreate,
    SkillOut,
    SkillUpdate,
    SocialLinkCreate,
    SocialLinkOut,
    SocialLinkUpdate,
    TripCreate,
    TripOut,
    TripStopCreate,
    TripStopOut,
    TripStopUpdate,
    TripUpdate,
    UploadResponse,
)
from api.services.cloudinary import delete_image, upload_image

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/admin",
    tags=["admin"],
    dependencies=[Depends(get_current_user)],
)

_MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB
_ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}


# ---------------------------------------------------------------------------
# Site Config
# ---------------------------------------------------------------------------

@router.get("/site-config")
async def admin_get_site_config(db: AsyncSession = Depends(get_db)) -> dict[str, str]:
    result = await db.execute(select(SiteConfig))
    return {row.key: row.value for row in result.scalars().all()}


@router.put("/site-config")
async def admin_update_site_config(
    updates: dict[str, str],
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    for key, value in updates.items():
        result = await db.execute(select(SiteConfig).where(SiteConfig.key == key))
        row = result.scalar_one_or_none()
        if row is None:
            db.add(SiteConfig(key=key, value=value))
        else:
            row.value = value
    await db.commit()
    result = await db.execute(select(SiteConfig))
    return {row.key: row.value for row in result.scalars().all()}


# ---------------------------------------------------------------------------
# Socials
# ---------------------------------------------------------------------------

@router.get("/socials", response_model=list[SocialLinkOut])
async def admin_list_socials(db: AsyncSession = Depends(get_db)) -> list[SocialLink]:
    result = await db.execute(select(SocialLink).order_by(SocialLink.sort_order))
    return list(result.scalars().all())


@router.post("/socials", response_model=SocialLinkOut, status_code=status.HTTP_201_CREATED)
async def admin_create_social(
    body: SocialLinkCreate, db: AsyncSession = Depends(get_db)
) -> SocialLink:
    row = SocialLink(**body.model_dump())
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


@router.put("/socials/{social_id}", response_model=SocialLinkOut)
async def admin_update_social(
    social_id: int, body: SocialLinkUpdate, db: AsyncSession = Depends(get_db)
) -> SocialLink:
    result = await db.execute(select(SocialLink).where(SocialLink.id == social_id))
    row = result.scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Social link not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    await db.commit()
    await db.refresh(row)
    return row


@router.delete("/socials/{social_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_social(social_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SocialLink).where(SocialLink.id == social_id))
    row = result.scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Social link not found")
    await db.delete(row)
    await db.commit()


# ---------------------------------------------------------------------------
# Skill Categories
# ---------------------------------------------------------------------------

@router.get("/skills", response_model=list[SkillCategoryOut])
async def admin_list_skills(db: AsyncSession = Depends(get_db)) -> list[SkillCategory]:
    result = await db.execute(
        select(SkillCategory)
        .options(selectinload(SkillCategory.skills))
        .order_by(SkillCategory.sort_order)
    )
    return list(result.scalars().all())


@router.post(
    "/skill-categories", response_model=SkillCategoryOut, status_code=status.HTTP_201_CREATED
)
async def admin_create_skill_category(
    body: SkillCategoryCreate, db: AsyncSession = Depends(get_db)
) -> SkillCategory:
    row = SkillCategory(**body.model_dump())
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


@router.put("/skill-categories/{category_id}", response_model=SkillCategoryOut)
async def admin_update_skill_category(
    category_id: int, body: SkillCategoryUpdate, db: AsyncSession = Depends(get_db)
) -> SkillCategory:
    result = await db.execute(
        select(SkillCategory)
        .options(selectinload(SkillCategory.skills))
        .where(SkillCategory.id == category_id)
    )
    row = result.scalar_one_or_none()
    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Skill category not found"
        )
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    await db.commit()
    await db.refresh(row)
    return row


@router.delete("/skill-categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_skill_category(
    category_id: int, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(SkillCategory).where(SkillCategory.id == category_id)
    )
    row = result.scalar_one_or_none()
    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Skill category not found"
        )
    await db.delete(row)
    await db.commit()


# ---------------------------------------------------------------------------
# Skills
# ---------------------------------------------------------------------------

@router.post("/skills", response_model=SkillOut, status_code=status.HTTP_201_CREATED)
async def admin_create_skill(
    body: SkillCreate, db: AsyncSession = Depends(get_db)
) -> Skill:
    # Verify category exists
    cat_result = await db.execute(
        select(SkillCategory).where(SkillCategory.id == body.category_id)
    )
    if cat_result.scalar_one_or_none() is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Skill category not found"
        )
    row = Skill(**body.model_dump())
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


@router.put("/skills/{skill_id}", response_model=SkillOut)
async def admin_update_skill(
    skill_id: int, body: SkillUpdate, db: AsyncSession = Depends(get_db)
) -> Skill:
    result = await db.execute(select(Skill).where(Skill.id == skill_id))
    row = result.scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    await db.commit()
    await db.refresh(row)
    return row


@router.delete("/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_skill(skill_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Skill).where(Skill.id == skill_id))
    row = result.scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")
    await db.delete(row)
    await db.commit()


# ---------------------------------------------------------------------------
# Projects
# ---------------------------------------------------------------------------

@router.get("/projects", response_model=list[ProjectOut])
async def admin_list_projects(db: AsyncSession = Depends(get_db)) -> list[Project]:
    result = await db.execute(select(Project).order_by(Project.sort_order))
    return list(result.scalars().all())


@router.post("/projects", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
async def admin_create_project(
    body: ProjectCreate, db: AsyncSession = Depends(get_db)
) -> Project:
    data = body.model_dump()
    data["tags"] = json.dumps(data["tags"])
    row = Project(**data)
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


@router.put("/projects/{project_id}", response_model=ProjectOut)
async def admin_update_project(
    project_id: int, body: ProjectUpdate, db: AsyncSession = Depends(get_db)
) -> Project:
    result = await db.execute(select(Project).where(Project.id == project_id))
    row = result.scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    updates = body.model_dump(exclude_unset=True)
    if "tags" in updates:
        updates["tags"] = json.dumps(updates["tags"])
    for field, value in updates.items():
        setattr(row, field, value)
    await db.commit()
    await db.refresh(row)
    return row


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_project(project_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    row = result.scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    await db.delete(row)
    await db.commit()


# ---------------------------------------------------------------------------
# Experience
# ---------------------------------------------------------------------------

@router.get("/experience", response_model=list[ExperienceOut])
async def admin_list_experience(db: AsyncSession = Depends(get_db)) -> list[Experience]:
    result = await db.execute(select(Experience).order_by(Experience.sort_order))
    return list(result.scalars().all())


@router.post("/experience", response_model=ExperienceOut, status_code=status.HTTP_201_CREATED)
async def admin_create_experience(
    body: ExperienceCreate, db: AsyncSession = Depends(get_db)
) -> Experience:
    data = body.model_dump()
    data["bullets"] = json.dumps(data["bullets"])
    row = Experience(**data)
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


@router.put("/experience/{exp_id}", response_model=ExperienceOut)
async def admin_update_experience(
    exp_id: int, body: ExperienceUpdate, db: AsyncSession = Depends(get_db)
) -> Experience:
    result = await db.execute(select(Experience).where(Experience.id == exp_id))
    row = result.scalar_one_or_none()
    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Experience entry not found"
        )
    updates = body.model_dump(exclude_unset=True)
    if "bullets" in updates:
        updates["bullets"] = json.dumps(updates["bullets"])
    for field, value in updates.items():
        setattr(row, field, value)
    await db.commit()
    await db.refresh(row)
    return row


@router.delete("/experience/{exp_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_experience(exp_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Experience).where(Experience.id == exp_id))
    row = result.scalar_one_or_none()
    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Experience entry not found"
        )
    await db.delete(row)
    await db.commit()


# ---------------------------------------------------------------------------
# Trips
# ---------------------------------------------------------------------------

@router.get("/trips", response_model=list[TripOut])
async def admin_list_trips(db: AsyncSession = Depends(get_db)) -> list[Trip]:
    result = await db.execute(
        select(Trip).options(selectinload(Trip.stops)).order_by(Trip.sort_order)
    )
    return list(result.scalars().all())


@router.post("/trips", response_model=TripOut, status_code=status.HTTP_201_CREATED)
async def admin_create_trip(
    body: TripCreate, db: AsyncSession = Depends(get_db)
) -> Trip:
    row = Trip(**body.model_dump())
    db.add(row)
    await db.commit()
    # Refresh with stops eager-loaded
    result = await db.execute(
        select(Trip).options(selectinload(Trip.stops)).where(Trip.id == row.id)
    )
    return result.scalar_one()


@router.put("/trips/{trip_id}", response_model=TripOut)
async def admin_update_trip(
    trip_id: int, body: TripUpdate, db: AsyncSession = Depends(get_db)
) -> Trip:
    result = await db.execute(
        select(Trip).options(selectinload(Trip.stops)).where(Trip.id == trip_id)
    )
    row = result.scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    await db.commit()
    await db.refresh(row)
    return row


@router.delete("/trips/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_trip(trip_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Trip).where(Trip.id == trip_id))
    row = result.scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    await db.delete(row)
    await db.commit()


# ---------------------------------------------------------------------------
# Trip Stops
# ---------------------------------------------------------------------------

@router.post(
    "/trips/{trip_id}/stops",
    response_model=TripStopOut,
    status_code=status.HTTP_201_CREATED,
)
async def admin_create_trip_stop(
    trip_id: int, body: TripStopCreate, db: AsyncSession = Depends(get_db)
) -> TripStop:
    trip_result = await db.execute(select(Trip).where(Trip.id == trip_id))
    if trip_result.scalar_one_or_none() is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    data = body.model_dump()
    data["paragraphs"] = json.dumps(data["paragraphs"])
    data["images"] = json.dumps(data["images"])
    row = TripStop(trip_id=trip_id, **data)
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


@router.put("/trip-stops/{stop_id}", response_model=TripStopOut)
async def admin_update_trip_stop(
    stop_id: int, body: TripStopUpdate, db: AsyncSession = Depends(get_db)
) -> TripStop:
    result = await db.execute(select(TripStop).where(TripStop.id == stop_id))
    row = result.scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip stop not found")
    updates = body.model_dump(exclude_unset=True)
    if "paragraphs" in updates:
        updates["paragraphs"] = json.dumps(updates["paragraphs"])
    if "images" in updates:
        updates["images"] = json.dumps(updates["images"])
    for field, value in updates.items():
        setattr(row, field, value)
    await db.commit()
    await db.refresh(row)
    return row


@router.delete("/trip-stops/{stop_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_trip_stop(stop_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TripStop).where(TripStop.id == stop_id))
    row = result.scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip stop not found")
    await db.delete(row)
    await db.commit()


# ---------------------------------------------------------------------------
# Image Upload
# ---------------------------------------------------------------------------

@router.post("/upload", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def admin_upload_image(
    file: UploadFile = File(...),
    folder: str = Query(default="projects", regex="^(trips|projects|profile)$"),
    _: AdminUser = Depends(get_current_user),
) -> UploadResponse:
    if file.content_type not in _ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file.content_type!r} is not allowed. Use JPEG, PNG, or WebP.",
        )

    data = await file.read()
    if len(data) > _MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File exceeds the 10 MB limit.",
        )

    try:
        result = await upload_image(data, folder=folder)
    except Exception as exc:
        logger.error("Cloudinary upload failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Image upload to Cloudinary failed.",
        )

    return UploadResponse(url=result["url"], public_id=result["public_id"])


@router.delete("/upload/{public_id:path}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_image(
    public_id: str,
    _: AdminUser = Depends(get_current_user),
):
    try:
        await delete_image(public_id)
    except Exception as exc:
        logger.error("Cloudinary delete failed for %s: %s", public_id, exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Image deletion from Cloudinary failed.",
        )
