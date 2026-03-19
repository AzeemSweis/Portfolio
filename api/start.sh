#!/bin/bash
# Startup script for the Portfolio API on Fly.io.
# 1. Initialises DB tables (idempotent via SQLAlchemy create_all)
# 2. Warns if no admin user exists
# 3. Starts uvicorn
set -euo pipefail

echo "[start] Initialising database tables..."
python -c "
import asyncio
from api.database import init_db
asyncio.run(init_db())
"
echo "[start] Database ready."

# Check whether an admin user row exists. Prints the count (0 or 1).
ADMIN_COUNT=$(python -c "
import asyncio
from sqlalchemy import select, func
from api.database import AsyncSessionLocal
from api.models import AdminUser

async def count():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(func.count()).select_from(AdminUser))
        return result.scalar_one()

print(asyncio.run(count()))
" 2>/dev/null || echo "0")

if [ "$ADMIN_COUNT" = "0" ]; then
    echo "[start] WARNING: No admin user found."
    echo "[start] To create one, run:"
    echo "[start]   fly ssh console -C 'python -m api.cli create-admin'"
fi

echo "[start] Starting uvicorn on 0.0.0.0:8080..."
exec uvicorn api.main:app --host 0.0.0.0 --port 8080
