from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from api.deps import get_db
from api.models import Experience, Project, SiteConfig, SkillCategory, SocialLink, Trip
from api.schemas import (
    ExperienceOut,
    ProjectOut,
    SkillCategoryOut,
    SocialLinkOut,
    TripOut,
)

router = APIRouter(prefix="/api/content", tags=["content"])


@router.get("/site-config")
async def get_site_config(db: AsyncSession = Depends(get_db)) -> dict[str, str]:
    result = await db.execute(select(SiteConfig))
    rows = result.scalars().all()
    return {row.key: row.value for row in rows}


@router.get("/socials", response_model=list[SocialLinkOut])
async def get_socials(db: AsyncSession = Depends(get_db)) -> list[SocialLink]:
    result = await db.execute(select(SocialLink).order_by(SocialLink.sort_order))
    return list(result.scalars().all())


@router.get("/skills", response_model=list[SkillCategoryOut])
async def get_skills(db: AsyncSession = Depends(get_db)) -> list[SkillCategory]:
    result = await db.execute(
        select(SkillCategory)
        .options(selectinload(SkillCategory.skills))
        .order_by(SkillCategory.sort_order)
    )
    return list(result.scalars().all())


@router.get("/projects", response_model=list[ProjectOut])
async def get_projects(db: AsyncSession = Depends(get_db)) -> list[Project]:
    result = await db.execute(select(Project).order_by(Project.sort_order))
    return list(result.scalars().all())


@router.get("/experience", response_model=list[ExperienceOut])
async def get_experience(db: AsyncSession = Depends(get_db)) -> list[Experience]:
    result = await db.execute(select(Experience).order_by(Experience.sort_order))
    return list(result.scalars().all())


@router.get("/trips", response_model=list[TripOut])
async def get_trips(db: AsyncSession = Depends(get_db)) -> list[Trip]:
    result = await db.execute(
        select(Trip)
        .options(selectinload(Trip.stops))
        .order_by(Trip.sort_order)
    )
    return list(result.scalars().all())
