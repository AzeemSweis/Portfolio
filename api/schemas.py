from __future__ import annotations

import json
from typing import Any, List, Optional

from pydantic import BaseModel, field_validator


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _parse_json_list(v: Any) -> List:
    if isinstance(v, list):
        return v
    if isinstance(v, str):
        return json.loads(v)
    raise ValueError(f"Expected list or JSON string, got {type(v)}")


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class AccessTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------------------------------------------------------------------------
# SocialLink
# ---------------------------------------------------------------------------

class SocialLinkBase(BaseModel):
    name: str
    url: str
    icon: str
    sort_order: int = 0


class SocialLinkCreate(SocialLinkBase):
    pass


class SocialLinkUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[str] = None
    sort_order: Optional[int] = None


class SocialLinkOut(SocialLinkBase):
    id: int

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# SkillCategory / Skill
# ---------------------------------------------------------------------------

class SkillBase(BaseModel):
    name: str
    sort_order: int = 0


class SkillCreate(SkillBase):
    category_id: int


class SkillUpdate(BaseModel):
    category_id: Optional[int] = None
    name: Optional[str] = None
    sort_order: Optional[int] = None


class SkillOut(SkillBase):
    id: int
    category_id: int

    model_config = {"from_attributes": True}


class SkillCategoryBase(BaseModel):
    name: str
    sort_order: int = 0


class SkillCategoryCreate(SkillCategoryBase):
    pass


class SkillCategoryUpdate(BaseModel):
    name: Optional[str] = None
    sort_order: Optional[int] = None


class SkillCategoryOut(SkillCategoryBase):
    id: int
    skills: List[SkillOut] = []

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Project
# ---------------------------------------------------------------------------

class ProjectBase(BaseModel):
    slug: str
    title: str
    description: str
    image_url: Optional[str] = None
    tags: List[str] = []
    live_url: Optional[str] = None
    repo_url: Optional[str] = None
    sort_order: int = 0

    @field_validator("tags", mode="before")
    @classmethod
    def parse_tags(cls, v: Any) -> List[str]:
        return _parse_json_list(v)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    slug: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    tags: Optional[List[str]] = None
    live_url: Optional[str] = None
    repo_url: Optional[str] = None
    sort_order: Optional[int] = None

    @field_validator("tags", mode="before")
    @classmethod
    def parse_tags(cls, v: Any) -> Optional[List[str]]:
        if v is None:
            return None
        return _parse_json_list(v)


class ProjectOut(BaseModel):
    id: int
    slug: str
    title: str
    description: str
    image_url: Optional[str]
    tags: List[str]
    live_url: Optional[str]
    repo_url: Optional[str]
    sort_order: int

    model_config = {"from_attributes": True}

    @field_validator("tags", mode="before")
    @classmethod
    def parse_tags(cls, v: Any) -> List[str]:
        return _parse_json_list(v)


# ---------------------------------------------------------------------------
# Experience
# ---------------------------------------------------------------------------

class ExperienceBase(BaseModel):
    role: str
    company: str
    period: str
    is_current: bool = False
    bullets: List[str] = []
    sort_order: int = 0

    @field_validator("bullets", mode="before")
    @classmethod
    def parse_bullets(cls, v: Any) -> List[str]:
        return _parse_json_list(v)


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(BaseModel):
    role: Optional[str] = None
    company: Optional[str] = None
    period: Optional[str] = None
    is_current: Optional[bool] = None
    bullets: Optional[List[str]] = None
    sort_order: Optional[int] = None

    @field_validator("bullets", mode="before")
    @classmethod
    def parse_bullets(cls, v: Any) -> Optional[List[str]]:
        if v is None:
            return None
        return _parse_json_list(v)


class ExperienceOut(BaseModel):
    id: int
    role: str
    company: str
    period: str
    is_current: bool
    bullets: List[str]
    sort_order: int

    model_config = {"from_attributes": True}

    @field_validator("bullets", mode="before")
    @classmethod
    def parse_bullets(cls, v: Any) -> List[str]:
        return _parse_json_list(v)


# ---------------------------------------------------------------------------
# Trip / TripStop
# ---------------------------------------------------------------------------

class TripStopBase(BaseModel):
    name: str
    paragraphs: List[str] = []
    images: List[str] = []
    sort_order: int = 0

    @field_validator("paragraphs", "images", mode="before")
    @classmethod
    def parse_list_fields(cls, v: Any) -> List[str]:
        return _parse_json_list(v)


class TripStopCreate(TripStopBase):
    pass


class TripStopUpdate(BaseModel):
    name: Optional[str] = None
    paragraphs: Optional[List[str]] = None
    images: Optional[List[str]] = None
    sort_order: Optional[int] = None

    @field_validator("paragraphs", "images", mode="before")
    @classmethod
    def parse_list_fields(cls, v: Any) -> Optional[List[str]]:
        if v is None:
            return None
        return _parse_json_list(v)


class TripStopOut(BaseModel):
    id: int
    trip_id: int
    name: str
    paragraphs: List[str]
    images: List[str]
    sort_order: int

    model_config = {"from_attributes": True}

    @field_validator("paragraphs", "images", mode="before")
    @classmethod
    def parse_list_fields(cls, v: Any) -> List[str]:
        return _parse_json_list(v)


class TripBase(BaseModel):
    slug: str
    location: str
    name: str
    subtitle: str
    sort_order: int = 0


class TripCreate(TripBase):
    pass


class TripUpdate(BaseModel):
    slug: Optional[str] = None
    location: Optional[str] = None
    name: Optional[str] = None
    subtitle: Optional[str] = None
    sort_order: Optional[int] = None


class TripOut(TripBase):
    id: int
    stops: List[TripStopOut] = []

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Image upload
# ---------------------------------------------------------------------------

class UploadResponse(BaseModel):
    url: str
    public_id: str
