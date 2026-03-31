# Overview

WhatsApp order automation system for fast food restaurants. Customers place orders in natural language via WhatsApp; an LLM interprets and processes them automatically. Restaurant staff manages and monitors orders in real time through a web dashboard.

## Architecture

Monorepo using pnpm workspaces with two main applications: `api` (backend) and `web` (frontend).

### API (`apps/api`)

NestJS application following a modular architecture:

| Module | Responsibility |
|---|---|
| `auth` | JWT-based authentication |
| `orders` | Order lifecycle management |
| `menu` | Menu management |
| `menu-items` | Menu item management |
| `menu-categories` | Menu category management |
| `users` | User management |
| `whatsapp` | Meta WhatsApp Cloud API integration |
| `ai` | OpenAI integration for order interpretation |
| `storage` | Cloudflare R2 file storage |
| `shared` | Shared utilities and types |

### Web (`apps/web`)

React application following a screaming (feature-based) architecture, mirroring the API module structure.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | NestJS + TypeScript |
| Frontend | React + Vite + TypeScript |
| Database | PostgreSQL via Prisma ORM |
| Real-time | Socket.io (WebSockets) |
| Authentication | JWT (`@nestjs/passport`) |
| Messaging | Meta WhatsApp Cloud API |
| AI | OpenAI `gpt-4o-mini` |
| Storage | Cloudflare R2 |
| Styles | Tailwind CSS |
| Deploy | Railway |

## Development

```bash
pnpm dev          # Run api and web in parallel
pnpm dev:api      # Run api only
pnpm dev:web      # Run web only
pnpm build        # Build all packages
```

## Testing

- **API** (`apps/api`): Jest + Supertest
- **Web** (`apps/web`): Vitest + Testing Library

```bash
pnpm test         # Run all tests (api: jest, web: vitest run)
pnpm test:watch   # Run tests in watch mode
pnpm test:e2e     # Run API end-to-end tests only
```

Coverage report (API only):

```bash
pnpm --filter api test:cov
```

## Version Control

Commits must follow Conventional Commits in English:

```
type(scope): description
```

Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
