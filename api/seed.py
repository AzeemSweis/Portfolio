"""
Seed script — populates SQLite with the current static content.

Run via: python -m api.cli seed-from-static
"""

import asyncio
import json
import logging
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.database import AsyncSessionLocal, init_db
from api.models import (
    Experience,
    Project,
    SiteConfig,
    Skill,
    SkillCategory,
    SocialLink,
    Trip,
    TripStop,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Static data (transcribed from src/data/* and component files)
# ---------------------------------------------------------------------------

SITE_CONFIG: dict[str, str] = {
    "hero_title": "Hey, I'm Azeem",
    "hero_subtitle": "DevOps Engineer",
    "hero_tagline": (
        "Architecting scalable infrastructure and automating the future. "
        "I specialize in cloud-native ecosystems, Kubernetes orchestration, "
        "and seamless CI/CD pipelines at Houzz."
    ),
    "bio_paragraph_1": (
        "Azeem is a DevOps Engineer at Houzz based in Las Vegas. "
        "He manages Kubernetes clusters (EKS, kops), CI/CD systems (Jenkins, GitHub Actions, "
        "ArgoCD), and cloud infrastructure on AWS. Background in systems administration evolving "
        "into modern Site Reliability Engineering."
    ),
    "bio_paragraph_2": (
        "Passionate about automating everything and building resilient, scalable systems that can "
        "withstand the pressures of high-traffic production environments."
    ),
    "profile_photo_url": "/images/pfp.png",
    "rotating_words": json.dumps(["learn.", "explore.", "create."]),
}

SOCIALS: list[dict] = [
    {"name": "GitHub",      "url": "https://github.com/AzeemSweis",                    "icon": "Github",    "sort_order": 0},
    {"name": "LinkedIn",    "url": "https://www.linkedin.com/in/azeem-sweis/",          "icon": "Linkedin",  "sort_order": 1},
    {"name": "Instagram",   "url": "https://www.instagram.com/a_sweis/",               "icon": "Instagram", "sort_order": 2},
    {"name": "X / Twitter", "url": "https://twitter.com/azeem_sweis",                  "icon": "Twitter",   "sort_order": 3},
]

SKILL_CATEGORIES: list[dict] = [
    {
        "name": "Cloud & Infrastructure",
        "sort_order": 0,
        "skills": ["AWS", "Terraform", "Kubernetes", "Docker", "Helm"],
    },
    {
        "name": "CI/CD",
        "sort_order": 1,
        "skills": ["Jenkins", "GitHub Actions", "CircleCI", "ArgoCD"],
    },
    {
        "name": "Observability",
        "sort_order": 2,
        "skills": ["Prometheus", "VictoriaMetrics", "Grafana", "Istio"],
    },
    {
        "name": "Languages & Tools",
        "sort_order": 3,
        "skills": ["Python", "Bash", "Go", "Git"],
    },
]

PROJECTS: list[dict] = [
    {
        "slug": "portfolio",
        "title": "This Portfolio",
        "description": (
            "A full rebuild of my personal portfolio site — migrated from a ~2020 static HTML/CSS/jQuery "
            "site to a modern React SPA with TypeScript, Tailwind CSS, Framer Motion animations, and "
            "client-side routing."
        ),
        "image_url": "/images/WorkSnips/mysite.png",
        "tags": json.dumps(["React", "Vite", "TypeScript", "Tailwind", "Framer Motion"]),
        "live_url": "/",
        "repo_url": "https://github.com/AzeemSweis",
        "sort_order": 0,
    },
    {
        "slug": "petra",
        "title": "Petra Commercial Building",
        "description": (
            "Freelance contract to build a landing site for a commercial building in Oakland, CA. "
            "Incorporated Google Maps API and focused on multi-device responsiveness with Bootstrap grid."
        ),
        "image_url": "/images/WorkSnips/pbo.png",
        "tags": json.dumps(["HTML", "CSS", "Bootstrap", "Google Maps API"]),
        "live_url": "https://azeemsweis.github.io/PetraBuildingOakland/",
        "repo_url": "https://github.com/AzeemSweis/PetraBuildingOakland",
        "sort_order": 1,
    },
    {
        "slug": "bookkeeping",
        "title": "Sweis Bookkeeping",
        "description": (
            "Freelance site built for my father's side bookkeeping business. My first post-graduation "
            "frontend project — practiced Bootstrap components, carousel, cards, and responsive layout."
        ),
        "image_url": "/images/WorkSnips/swsbook.png",
        "tags": json.dumps(["HTML", "CSS", "Bootstrap"]),
        "live_url": "https://azeemsweis.github.io/Sweis-Bookkeeping/",
        "repo_url": "https://github.com/AzeemSweis/Sweis-Bookkeeping",
        "sort_order": 2,
    },
]

EXPERIENCE: list[dict] = [
    {
        "role": "DevOps Engineer",
        "company": "Houzz",
        "period": "2024 - PRESENT",
        "is_current": True,
        "bullets": json.dumps([
            "Managing EKS and kops Kubernetes clusters across production environments",
            "CI/CD pipelines via Jenkins, GitHub Actions, CircleCI, and ArgoCD",
            "Infrastructure-as-code with Terraform and Helm on AWS",
            "Observability stack: Prometheus, VictoriaMetrics, Grafana, Istio service mesh",
        ]),
        "sort_order": 0,
    },
    {
        "role": "SWE & DevOps",
        "company": "Earlier Roles",
        "period": "2021 - 2024",
        "is_current": False,
        "bullets": json.dumps([
            "Graduated UNR CS, worked on infrastructure, automation, and cloud migrations",
            "Scripting and automation with Python and Bash",
            "Transitioned into cloud-native DevOps work",
        ]),
        "sort_order": 1,
    },
]

TRIPS: list[dict] = [
    {
        "slug": "grand-staircase-escalante",
        "location": "Utah",
        "name": "Grand Staircase Escalante",
        "subtitle": (
            "This was a camping trip my father and I took together in June. Located in Southern Utah, "
            "The Grand Staircase Escalante is a marvelous place, unlike any other I've seen. "
            "And I've been looking forward to going back since I left."
        ),
        "sort_order": 0,
        "stops": [
            {
                "name": "Calf Creek Falls",
                "sort_order": 0,
                "paragraphs": json.dumps([
                    "Starting in Las Vegas, Nevada, my father and I drove up the I-15. A 6-hour drive ahead of us, we were excited to figure out and make use of the Jeep Wrangler we rented. Our destination was Lower Calf Creek Falls, a campsite located next to — what we were going to find out — is located next to one of the most beautiful trails in the National Park.",
                    "After 5 hours we began our journey into the park. Before we even reached our campsite we were already in awe at what we were seeing. Huge swaths of land as far as the eye could see, different ecosystems ranging from mountains, to lush green valleys, to desert were all next to each other before we began our descent into the park. Underestimating how busy our campsite was going to be, we were able to secure a spot due to sheer luck of catching a group leaving as soon as we arrived.",
                    "After setting up our campsite and having lunch we prepared for our first hike, which was located right next the camp. Calf Creek Falls is a 6 mile hike with a rewarding waterfall at the end. Although I had hiked often before, I had never been on a hike quite like this. With the elevation changes as well as being directly next to the river that the waterfall fed, we got to experience various scenery. Ranging from marshy and green near the river, to red and dry at higher elevations. Arriving at the waterfall, my father and I were greeted with one of the most spectacular sights I've ever seen. The ice cold water felt amazing on our feet and knees after a rigorous hike, and lunch with that scenic view was amazing.",
                    "The hike back was just as beautiful although we were retracing our steps. Reaching the end, we got ourselves cleaned up, and started to prepare dinner. It was getting dark out and seeing the stars were marvelous. We didn't bring sleeping bags with us, but fortunately it was mid-summer and we had loads of blankets just in case. In the morning we prepared a breakfast of bacon, potatoes and eggs and prepared for the various hikes we were going to do around the park.",
                ]),
                "images": json.dumps([
                    "/images/GrandStairs/GSE2.jpg",
                    "/images/GrandStairs/GSE6.jpg",
                    "/images/GrandStairs/GSE3.jpg",
                    "/images/GrandStairs/GSE4.jpg",
                    "/images/GrandStairs/GSE5.jpg",
                    "/images/GrandStairs/GSE1.jpg",
                ]),
            },
            {
                "name": "Spooky Canyon Loop",
                "sort_order": 1,
                "paragraphs": json.dumps([
                    "From the 3 hikes we did our second day at the park, this one was my absolute favorite. The Spooky Canyon Loop began with an almost 2 mile hike to what would be a long, steep descent into the Canyon. This hike is certainly not intended for the impatient. With the sun bearing down it is important to stay hydrated. After the descent there were two gulches that could be tackled, one following the other, before leading back to the beginning — where the ascent to the first 2-mile leg was. We chose to do \"Peek-a-boo\" gulch first and the formations I saw were unlike anything I had seen before in my life. The picture below shows my dad walking to the gulches after the descent. After balancing our way down the steep mountainside, we were eager to be on flat ground again. The massive wall to the left of him leads us to the open valleys where the gulches are located.",
                    "Peek-a-boo gulch was breathtaking — between the magnificent rock formations and the tight places to squeeze between, it was a hiking experience like no other. After about 30 minutes of \"crawling\" through the gulch and taking as many pictures as we could, we found an open area where we could rest and eat. Another father and son hiking duo came across our little picnic and after a friendly exchange of words, they went on their way. After we finished our food, we began to hike again and we quickly came to the end of the first gulch. Unfortunately we became disoriented and had to turn back. After making it back to the beginning of the valley and to the ascent, we realized we had underestimated the difficulty of the climb up and spent most of our energy making it back to the top. After hydrating and resting at the top of the climb, we made the 2-mile hike back to the car.",
                ]),
                "images": json.dumps([
                    "/images/GrandStairs/GSE9.jpg",
                    "/images/GrandStairs/GSE10.jpg",
                    "/images/GrandStairs/GSE7.jpg",
                    "/images/GrandStairs/GSE8.jpg",
                ]),
            },
            {
                "name": "Hell's Backbone Rd",
                "sort_order": 2,
                "paragraphs": json.dumps([
                    "On our final day we decided to take the 38-mile long, scenic road between the towns of Boulder and Escalante. Easily my favorite leg of the trip, the elevation climb led to some of the most beautiful forest scenes and sights I had seen in a long time. Although unpaved, there were a good amount of people also checking out the route — although not too many to hinder the experience in any way — and for the most part we remained by ourselves in our vehicle during the drive. Below is my favorite photo from the entire camping trip and a picture of me near Hell's Backbone Bridge, with a 1,500+ foot drop around me.",
                ]),
                "images": json.dumps([
                    "/images/GrandStairs/GSE13.jpg",
                    "/images/GrandStairs/GSE11.jpg",
                    "/images/GrandStairs/GSE12.jpg",
                ]),
            },
        ],
    },
]


# ---------------------------------------------------------------------------
# Seed logic
# ---------------------------------------------------------------------------

async def seed(db: AsyncSession, force: bool = False) -> None:
    """Insert all seed data. Skips rows that already exist (by natural key).

    Args:
        db: An open AsyncSession.
        force: If True, truncate all content tables first (re-seed from scratch).
    """
    if force:
        logger.info("Force mode — clearing existing data")
        for model in [TripStop, Trip, Experience, Project, Skill, SkillCategory, SocialLink, SiteConfig]:
            rows = (await db.execute(select(model))).scalars().all()
            for row in rows:
                await db.delete(row)
        await db.commit()

    # --- site_config ---
    for key, value in SITE_CONFIG.items():
        existing = (await db.execute(select(SiteConfig).where(SiteConfig.key == key))).scalar_one_or_none()
        if existing is None:
            db.add(SiteConfig(key=key, value=value))
            logger.info(f"  site_config: inserting key={key!r}")
        else:
            logger.info(f"  site_config: key={key!r} already exists, skipping")
    await db.commit()

    # --- social_links ---
    for idx, s in enumerate(SOCIALS):
        existing = (await db.execute(select(SocialLink).where(SocialLink.name == s["name"]))).scalar_one_or_none()
        if existing is None:
            db.add(SocialLink(**s))
            logger.info(f"  social: inserting {s['name']!r}")
    await db.commit()

    # --- skill categories + skills ---
    for cat_data in SKILL_CATEGORIES:
        skill_names = cat_data["skills"]
        cat_dict = {k: v for k, v in cat_data.items() if k != "skills"}
        existing_cat = (await db.execute(
            select(SkillCategory).where(SkillCategory.name == cat_dict["name"])
        )).scalar_one_or_none()
        if existing_cat is None:
            cat = SkillCategory(**cat_dict)
            db.add(cat)
            await db.flush()
            logger.info(f"  skill_category: inserting {cat.name!r}")
        else:
            cat = existing_cat
            logger.info(f"  skill_category: {cat.name!r} already exists, skipping")
        for skill_idx, name in enumerate(skill_names):
            existing_skill = (await db.execute(
                select(Skill).where(Skill.category_id == cat.id, Skill.name == name)
            )).scalar_one_or_none()
            if existing_skill is None:
                db.add(Skill(category_id=cat.id, name=name, sort_order=skill_idx))
                logger.info(f"    skill: inserting {name!r}")
    await db.commit()

    # --- projects ---
    for proj in PROJECTS:
        existing = (await db.execute(select(Project).where(Project.slug == proj["slug"]))).scalar_one_or_none()
        if existing is None:
            db.add(Project(**proj))
            logger.info(f"  project: inserting {proj['slug']!r}")
    await db.commit()

    # --- experience ---
    for exp in EXPERIENCE:
        existing = (await db.execute(
            select(Experience).where(Experience.role == exp["role"], Experience.company == exp["company"])
        )).scalar_one_or_none()
        if existing is None:
            db.add(Experience(**exp))
            logger.info(f"  experience: inserting {exp['role']!r} @ {exp['company']!r}")
    await db.commit()

    # --- trips + stops ---
    for trip_data in TRIPS:
        stops = trip_data["stops"]
        trip_dict = {k: v for k, v in trip_data.items() if k != "stops"}
        existing_trip = (await db.execute(
            select(Trip).where(Trip.slug == trip_dict["slug"])
        )).scalar_one_or_none()
        if existing_trip is None:
            trip = Trip(**trip_dict)
            db.add(trip)
            await db.flush()
            logger.info(f"  trip: inserting {trip.slug!r}")
        else:
            trip = existing_trip
            logger.info(f"  trip: {trip.slug!r} already exists, skipping stops")
            continue
        for stop_data in stops:
            db.add(TripStop(trip_id=trip.id, **stop_data))
            logger.info(f"    stop: inserting {stop_data['name']!r}")
    await db.commit()

    logger.info("Seed complete.")


async def run_seed(force: bool = False) -> None:
    await init_db()
    async with AsyncSessionLocal() as db:
        await seed(db, force=force)


if __name__ == "__main__":
    import sys
    force = "--force" in sys.argv
    asyncio.run(run_seed(force=force))
