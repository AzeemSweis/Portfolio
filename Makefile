.PHONY: help dev build preview test lint clean

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
