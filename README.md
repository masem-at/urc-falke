# URC Falke - USV Falkensteiner Radclub Event Management PWA

## Tech Stack

- **Monorepo:** Turborepo + pnpm workspaces
- **Frontend:** Vite 5 + React 18 + TypeScript 5 + Radix UI + Tailwind CSS
- **Backend:** Express 4 + TypeScript 5
- **Database:** PostgreSQL 16 (NeonDB) + Drizzle ORM 0.45.1
- **State Management:** TanStack Query 5.90.12 + Zustand 5.0.9
- **Routing:** TanStack Router v1.x
- **Authentication:** JWT (jose 6.1.3) + bcrypt 5.x
- **PWA:** vite-plugin-pwa 0.17+ (Workbox)

## Project Structure

```
urc-falke/
├── apps/
│   ├── web/              # Frontend PWA (Vite + React)
│   └── api/              # Backend API (Express)
├── packages/
│   ├── shared/           # Shared types + Drizzle schema
│   └── ui/               # Shared Radix UI components
├── turbo.json            # Turborepo config
├── pnpm-workspace.yaml   # pnpm workspaces
└── drizzle.config.ts     # Drizzle migrations config
```

## Setup

### Prerequisites
- Node.js 20.x LTS
- pnpm (latest): `npm install -g pnpm`
- PostgreSQL 16 (NeonDB account)

### Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment variables:**
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

   Edit `apps/api/.env` with your database connection:
   ```env
   DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/database?sslmode=require"
   JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
   NODE_ENV="development"
   FRONTEND_URL="http://localhost:5173"
   PORT=3000
   ```

3. **Generate database migration:**
   ```bash
   pnpm db:generate
   ```

4. **Apply migration to database:**
   ```bash
   pnpm db:push
   ```

### Development

Start all workspaces in parallel:
```bash
pnpm turbo dev
```

Start individual workspaces:
```bash
pnpm turbo dev --filter=@urc-falke/web   # Frontend only (port 5173)
pnpm turbo dev --filter=@urc-falke/api   # Backend only (port 3000)
```

### Database Commands

```bash
pnpm db:generate  # Generate migration from schema changes
pnpm db:push      # Push schema to database (dev mode)
pnpm db:migrate   # Apply migrations (production mode)
```

### Testing

```bash
pnpm test         # Run all tests
pnpm test:watch   # Run tests in watch mode
```

### Build

```bash
pnpm turbo build  # Build all workspaces
```

## Workspace Overview

### apps/web (Frontend)
- **Port:** 5173
- **Tech:** Vite + React 18 + TypeScript + Tailwind CSS
- **Features:** PWA, Offline-first, Hot reload
- **Path alias:** `@/` for `./src/*`

### apps/api (Backend)
- **Port:** 3000
- **Tech:** Express + TypeScript + Drizzle ORM
- **Features:** JWT auth, CORS, Helmet security
- **Health check:** `http://localhost:3000/health`

### packages/shared
- **Exports:** Database schemas, shared types
- **Critical:** Complete users schema with 17 columns (including Two-Track Onboarding fields)

### packages/ui
- **Exports:** Radix UI component wrappers
- **Tech:** React + Radix UI + Tailwind CSS

## Database Schema

### Users Table (17 columns)

All fields required for Two-Track Onboarding System:

1. **id** - Serial primary key
2. **email** - Unique, not null (authentication)
3. **password_hash** - Not null (bcrypt 12 rounds)
4. **usv_number** - Unique, nullable (USV membership verification)
5. **is_usv_verified** - Boolean, default false
6. **profile_image_url** - Nullable
7. **first_name** - Nullable
8. **last_name** - Nullable
9. **role** - Default 'member' (RBAC: 'member' | 'admin')
10. **is_founding_member** - Default false (pre-seeded users)
11. **lottery_registered** - Default false
12. **onboarding_token** - Unique, nullable (Track A: existing members)
13. **onboarding_token_expires** - Nullable timestamp (90-day expiry)
14. **onboarding_status** - Nullable text ('pre_seeded' | 'password_changed' | 'completed')
15. **must_change_password** - Default false (force password change)
16. **created_at** - Default now()
17. **updated_at** - Default now()

## Documentation

- **Architecture:** [docs/architecture.md](docs/architecture.md)
- **Project Context:** [docs/project_context.md](docs/project_context.md)
- **UX Design:** [docs/ux-design-specification.md](docs/ux-design-specification.md)
- **Epics & Stories:** [docs/epics.md](docs/epics.md)
- **Sprint Artifacts:** [docs/sprint-artifacts/](docs/sprint-artifacts/)

## Common Commands

```bash
# Development
pnpm turbo dev                    # Start all dev servers
pnpm turbo dev --filter=@urc-falke/web   # Frontend only
pnpm turbo dev --filter=@urc-falke/api   # Backend only

# Building
pnpm turbo build                  # Build all workspaces
pnpm turbo build --filter=@urc-falke/web # Build frontend only

# Testing
pnpm test                         # Run all tests
pnpm test:watch                   # Run tests in watch mode

# Database
pnpm db:generate                  # Generate migrations
pnpm db:push                      # Push schema to DB (dev)
pnpm db:migrate                   # Apply migrations (prod)

# Linting
pnpm turbo lint                   # Lint all workspaces
```

## Troubleshooting

### Port Already in Use
- Frontend (5173): Change in `apps/web/vite.config.ts`
- Backend (3000): Change `PORT` in `apps/api/.env`

### TypeScript Errors
```bash
# Clear build cache
pnpm turbo run build --force

# Rebuild TypeScript project references
pnpm tsc --build --force
```

### Database Connection Issues
- Verify `DATABASE_URL` in `apps/api/.env`
- Ensure NeonDB project is active
- Check connection string includes `?sslmode=require`

### pnpm Workspace Issues
```bash
# Reinstall dependencies
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

## Story 1.1 Completion Status

- ✅ Turborepo monorepo initialized
- ✅ Frontend workspace (apps/web) created
- ✅ Backend workspace (apps/api) created
- ✅ Shared package with complete users schema (17 columns)
- ✅ UI package created
- ✅ TypeScript project references configured
- ✅ Drizzle ORM + NeonDB connection setup
- ✅ Migration configuration ready
- ✅ Testing infrastructure setup
- ✅ Documentation complete

## Next Steps

1. Run `pnpm install` to install all dependencies
2. Configure `apps/api/.env` with your NeonDB connection
3. Run `pnpm db:generate` to generate initial migration
4. Run `pnpm db:push` to apply schema to database
5. Run `pnpm turbo dev` to start development servers
6. Proceed to Story 1.0 (Pre-Seed CLI) or Story 1.2 (Registration)

---

**Last Updated:** 2025-12-22
**Status:** Monorepo Foundation Complete (Story 1.1)
