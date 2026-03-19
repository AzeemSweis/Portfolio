# syntax=docker/dockerfile:1
#
# Build context is the REPO ROOT (fly.toml sets dockerfile = "api/Dockerfile"
# which keeps the context at the repo root). All COPY paths are relative to
# the repo root.

# ---------------------------------------------------------------------------
# Stage 1: build — install dependencies into an isolated prefix
# ---------------------------------------------------------------------------
FROM python:3.12-slim AS builder

WORKDIR /build

# Only copy the requirements file to maximise layer cache reuse
COPY api/requirements.txt .

RUN pip install --upgrade pip \
    && pip install --no-cache-dir --prefix=/install -r requirements.txt


# ---------------------------------------------------------------------------
# Stage 2: runtime
# ---------------------------------------------------------------------------
FROM python:3.12-slim AS runtime

# Non-root user
RUN addgroup --system app && adduser --system --ingroup app app

# WORKDIR is the PARENT of the api/ package so that `python -m api.cli`
# and `uvicorn api.main:app` both resolve the `api` package correctly.
WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy only the api/ Python package — the frontend src/, public/, node_modules/
# etc. are excluded by .dockerignore at the repo root.
COPY api/ /app/api/

# Copy the startup script to /app (sibling of the api/ package)
COPY api/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# The SQLite db lives on a mounted persistent volume; ensure the dir exists
# and is writable by the non-root user before we drop privileges.
RUN mkdir -p /data && chown app:app /data

ENV DATABASE_URL="sqlite+aiosqlite:////data/portfolio.db"
ENV PYTHONPATH="/app"
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

USER app

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/health')"

CMD ["/app/start.sh"]
