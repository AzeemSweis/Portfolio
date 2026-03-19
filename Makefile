.PHONY: help dev build preview test lint clean \
        api-install api-dev api-seed api-create-admin \
        fly-deploy fly-secrets

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

dev: ## Start Vite dev server
	npm run dev

build: ## Production build to dist/
	npm run build

preview: ## Preview production build locally
	npm run preview

test: ## Run linter (no test suite for static portfolio)
	npm run lint

lint: ## Run ESLint
	npm run lint

clean: ## Remove dist/ and node_modules/
	rm -rf dist node_modules

# ---------------------------------------------------------------------------
# Backend
# ---------------------------------------------------------------------------
api-install: ## Install Python dependencies from api/requirements.txt
	python3 -m pip install -r api/requirements.txt

api-dev: ## Start FastAPI dev server on port 8000 (with reload)
	python3 -m uvicorn api.main:app --reload --port 8000

api-seed: ## Seed SQLite from current static data files
	python3 -m api.cli seed-from-static

api-create-admin: ## Create (or update) the admin user interactively
	python3 -m api.cli create-admin

# ---------------------------------------------------------------------------
# Fly.io deployment
# ---------------------------------------------------------------------------
fly-deploy: ## Deploy the API to Fly.io (runs fly deploy)
	fly deploy

fly-secrets: ## Print the fly secrets set commands needed for the API
	@echo "Run the following to configure secrets on Fly.io:"
	@echo ""
	@echo "  fly secrets set JWT_SECRET=\$$(python3 -c \"import secrets; print(secrets.token_hex(32))\")"
	@echo "  fly secrets set CLOUDINARY_CLOUD_NAME=<name>"
	@echo "  fly secrets set CLOUDINARY_API_KEY=<key>"
	@echo "  fly secrets set CLOUDINARY_API_SECRET=<secret>"
	@echo "  fly secrets set CORS_ORIGINS=https://azeemsw.com,https://www.azeemsw.com"
