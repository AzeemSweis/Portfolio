import json
from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.database import Base


def _now() -> datetime:
    return datetime.now(timezone.utc)


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_now, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_now, onupdate=_now, server_default=func.now()
    )


class AdminUser(TimestampMixin, Base):
    __tablename__ = "admin_user"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)


class SiteConfig(TimestampMixin, Base):
    __tablename__ = "site_config"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    key: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    value: Mapped[str] = mapped_column(Text, nullable=False)


class SocialLink(TimestampMixin, Base):
    __tablename__ = "social_link"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    url: Mapped[str] = mapped_column(Text, nullable=False)
    icon: Mapped[str] = mapped_column(Text, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class SkillCategory(TimestampMixin, Base):
    __tablename__ = "skill_category"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    skills: Mapped[List["Skill"]] = relationship(
        "Skill",
        back_populates="category",
        cascade="all, delete-orphan",
        order_by="Skill.sort_order",
    )


class Skill(TimestampMixin, Base):
    __tablename__ = "skill"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    category_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("skill_category.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(Text, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    category: Mapped["SkillCategory"] = relationship("SkillCategory", back_populates="skills")


class Project(TimestampMixin, Base):
    __tablename__ = "project"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    tags: Mapped[str] = mapped_column(Text, nullable=False, default="[]")
    live_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    repo_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    @property
    def tags_list(self) -> List[str]:
        return json.loads(self.tags)

    @tags_list.setter
    def tags_list(self, value: List[str]) -> None:
        self.tags = json.dumps(value)


class Experience(TimestampMixin, Base):
    __tablename__ = "experience"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    role: Mapped[str] = mapped_column(Text, nullable=False)
    company: Mapped[str] = mapped_column(Text, nullable=False)
    period: Mapped[str] = mapped_column(Text, nullable=False)
    is_current: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    bullets: Mapped[str] = mapped_column(Text, nullable=False, default="[]")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    @property
    def bullets_list(self) -> List[str]:
        return json.loads(self.bullets)

    @bullets_list.setter
    def bullets_list(self, value: List[str]) -> None:
        self.bullets = json.dumps(value)


class Trip(TimestampMixin, Base):
    __tablename__ = "trip"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    location: Mapped[str] = mapped_column(Text, nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    subtitle: Mapped[str] = mapped_column(Text, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    stops: Mapped[List["TripStop"]] = relationship(
        "TripStop",
        back_populates="trip",
        cascade="all, delete-orphan",
        order_by="TripStop.sort_order",
    )


class TripStop(TimestampMixin, Base):
    __tablename__ = "trip_stop"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    trip_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("trip.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(Text, nullable=False)
    paragraphs: Mapped[str] = mapped_column(Text, nullable=False, default="[]")
    images: Mapped[str] = mapped_column(Text, nullable=False, default="[]")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    trip: Mapped["Trip"] = relationship("Trip", back_populates="stops")

    @property
    def paragraphs_list(self) -> List[str]:
        return json.loads(self.paragraphs)

    @paragraphs_list.setter
    def paragraphs_list(self, value: List[str]) -> None:
        self.paragraphs = json.dumps(value)

    @property
    def images_list(self) -> List[str]:
        return json.loads(self.images)

    @images_list.setter
    def images_list(self, value: List[str]) -> None:
        self.images = json.dumps(value)
