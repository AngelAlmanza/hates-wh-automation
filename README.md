# WhatsApp Order Automation

WhatsApp order automation system for fast food restaurants. Customers place orders in natural language via WhatsApp; an LLM interprets and registers them automatically. Staff manages and updates orders in real time from a web dashboard.

## Stack

| Layer | Technology |
|---|---|
| Backend | NestJS + TypeScript |
| Frontend | React + Vite + TypeScript |
| Database | PostgreSQL (Prisma ORM) |
| Real-time | Socket.io (WebSockets) |
| Authentication | JWT (@nestjs/passport) |
| Messaging | Meta WhatsApp Cloud API |
| AI | OpenAI gpt-4o-mini |
| Storage | Cloudflare R2 (menu images) |
| Styles | Tailwind CSS |
| Deploy | Railway |

Repository structure (monorepo with pnpm workspaces):

```
/
├── apps/
│   ├── api/          (NestJS — :3000)
│   └── web/          (React + Vite — :5173)
├── packages/
│   └── shared/       (shared TypeScript types)
├── docker-compose.yml
├── pnpm-workspace.yaml
└── package.json
```

## Requirements

- Node.js >= 20
- pnpm >= 10 — `npm install -g pnpm`
- Docker (for the local development database)
- Meta for Developers account (WhatsApp Cloud API)
- OpenAI API key
- Cloudflare R2 account (menu images)

## Environment variables

Copy the example file and adjust values as needed:

```bash
cp apps/api/.env.example apps/api/.env
```

Required variables in `apps/api/.env`:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/wh_automatation"

# JWT
JWT_SECRET="change_this_to_a_secure_secret_min_32_chars"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# Server
PORT=3000

# WhatsApp Cloud API (for later)
WHATSAPP_TOKEN="your_token"
WHATSAPP_PHONE_NUMBER_ID="your_phone_number_id"
WHATSAPP_VERIFY_TOKEN="your_verify_token"

# OpenAI (for later)
OPENAI_API_KEY="your_api_key"

# Cloudflare R2 (for later)
R2_ACCOUNT_ID="your_account_id"
R2_ACCESS_KEY_ID="your_access_key"
R2_SECRET_ACCESS_KEY="your_secret_key"
R2_BUCKET_NAME="your_bucket"
```

## Running in development

**1. Install dependencies**

```bash
pnpm install
```

**2. Start the database**

```bash
docker compose up -d
```

**3. Run migrations and seed**

```bash
# Apply database schema
pnpm --filter api db:migrate

# Seed the default user (username: pariente, password: $Demo1234, only for development)
pnpm --filter api npx prisma db seed
```

**4. Start the projects**

```bash
# Backend and frontend in parallel
pnpm dev

# Or separately
pnpm dev:api   # NestJS at localhost:3000
pnpm dev:web   # Vite at localhost:5173
```

The frontend proxies `/api` requests to the backend automatically in development.

## Database commands

```bash
# Run pending migrations
pnpm --filter api db:migrate

# Push schema changes without creating a migration (dev only)
pnpm --filter api db:push

# Regenerate Prisma Client after schema changes
pnpm --filter api db:generate

# Open Prisma Studio (visual DB editor)
pnpm --filter api npx prisma studio

# Seed the database
pnpm --filter api npx prisma db seed
```

## Running tests

```bash
# All backend unit tests
pnpm --filter api test

# Backend e2e tests (requires running database)
pnpm --filter api test:e2e

# Frontend tests
pnpm --filter web test

# Watch mode
pnpm --filter api test:watch
pnpm --filter web test:watch
```

## API documentation

Swagger UI is available at [http://localhost:3000/api/docs](http://localhost:3000/api/docs) when the API is running.

## Adding dependencies

```bash
# Backend dependency
pnpm --filter api add <package>

# Backend dev dependency
pnpm --filter api add -D <package>

# Frontend dependency
pnpm --filter web add <package>

# Shared package dependency (types)
pnpm --filter @repo/shared add -D <package>

# Root dependency (monorepo-wide tooling)
pnpm add -D -w <package>
```

## Removing dependencies

```bash
# From the backend
pnpm --filter api remove <package>

# From the frontend
pnpm --filter web remove <package>

# From the shared package
pnpm --filter @repo/shared remove <package>

# From the root
pnpm remove -w <package>
```

## Deploy on Railway

### Prerequisites

- [Railway](https://railway.app) account
- Railway CLI: `npm install -g @railway/cli` → `railway login`

### Database

1. In Railway, create a new project and add the **PostgreSQL** plugin.
2. Copy the generated `DATABASE_URL` and set it as a service environment variable.

### Main service (NestJS)

Railway deploys a single service that serves both the API and the static frontend (`@nestjs/serve-static` points to `apps/web/dist`).

**Railway configuration (Settings → Build & Deploy):**

| Field | Value |
|---|---|
| Build Command | `pnpm install && pnpm --filter web build && pnpm --filter api build` |
| Start Command | `node apps/api/dist/main` |
| Root Directory | `/` |

**Environment variables in Railway:**

Add all variables from `apps/api/.env` in the service *Variables* panel (Railway injects `DATABASE_URL` automatically when using its PostgreSQL plugin).

### Manual deploy via CLI

```bash
railway link        # link the local project
railway up          # build and deploy
```

### Automatic deploy (recommended)

Connect the GitHub repository in Railway (*New Project → Deploy from GitHub repo*). Every push to `main` triggers an automatic deploy.
