# Tech Stack

## Repository Structure

Monorepo with `pnpm workspaces`:

```
/
├── apps/
│   ├── api/        (NestJS)
│   └── web/        (React + Vite)
├── packages/
│   └── shared/     (shared TypeScript types)
├── pnpm-workspace.yaml
└── package.json
```

The frontend compiles to static files (`apps/web/dist`) and NestJS serves them directly with `@nestjs/serve-static`. A single service on Railway.

---

## Backend (`apps/api`)

| Technology | Role |
|---|---|
| NestJS | Main framework — modular, native TypeScript, async by default |
| @nestjs/platform-express | HTTP adapter |
| @nestjs/serve-static | Serves the frontend build (`apps/web/dist`) |
| @nestjs/websockets + socket.io | WebSocket gateway for real-time updates |
| @nestjs/passport + @nestjs/jwt | Staff authentication (JWT) |
| @nestjs/config | Environment variable management |
| Prisma | ORM — declarative migrations, auto-generated TypeScript types |

## Frontend (`apps/web`)

| Technology | Role |
|---|---|
| React + TypeScript | Staff dashboard |
| Vite | Build tool |
| React Router | SPA navigation |
| TanStack Query | Data fetching, caching and synchronization |
| socket.io-client | Real-time order updates |
| Tailwind CSS | Styles — responsive, high contrast, large typography |

## Shared (`packages/shared`)

Types and enums shared between `api` and `web`:

- `Order`, `OrderItem`, `ItemModification`
- `OrderStatus` (Pending → In preparation → Ready → Delivered / Cancelled)
- `DeliveryMode` (Pick up / Deliver)

## Database

| Technology | Role |
|---|---|
| PostgreSQL | Main database (orders, menu, customers) |

## Artificial Intelligence

| Technology | Role |
|---|---|
| OpenAI gpt-4o-mini | Structured order extraction from natural language |

Model rationale: low cost (~$0.15/1M input tokens), acceptable latency, and sufficient capability for bounded extraction (items, modifications, delivery mode, customer name).

## Messaging

| Technology | Role |
|---|---|
| Meta WhatsApp Cloud API | Receiving and sending messages via webhook |

## File Storage

| Technology | Role |
|---|---|
| Cloudflare R2 | Menu product images |
| @aws-sdk/client-s3 | R2 integration (S3-compatible API) |

## Deploy

| Technology | Role |
|---|---|
| Railway | NestJS service hosting (serves API + static frontend) |
| Railway PostgreSQL | Managed database |

## Component Diagram

```
WhatsApp Client
     │
     ▼
Meta Cloud API ──webhook POST──► NestJS
                                      │
                          ┌───────────┼───────────┐
                          ▼           ▼           ▼
                     Async handler  PostgreSQL   OpenAI
                     processes      (Prisma)     gpt-4o-mini
                     order          stores       extracts data
                          │
                          ▼
                   Socket.io Gateway
                          │
                          ▼
                   React Dashboard ──WS──► Real-time UI
                          │
                          ▼
                   Meta Cloud API
                   (reply to customer)
```

## Main Dependencies

### `apps/api`
```
@nestjs/core
@nestjs/common
@nestjs/platform-express
@nestjs/serve-static
@nestjs/websockets
@nestjs/platform-socket.io
@nestjs/passport
@nestjs/jwt
@nestjs/config
passport
passport-jwt
prisma
@prisma/client
openai
@aws-sdk/client-s3
```

### `apps/web`
```
react
react-dom
react-router-dom
@tanstack/react-query
socket.io-client
axios
tailwindcss
vite
typescript
```

### `packages/shared`
```
typescript
```
