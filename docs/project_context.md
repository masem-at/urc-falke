---
project_name: 'urc-falke'
user_name: 'Mario'
date: '2025-12-23'
sections_completed: ['technology_stack', 'language_specific', 'framework_specific', 'naming_conventions', 'critical_rules']
status: 'complete'
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## QUALITY FIRST MANDATE (2025-12-23)

**Priority: CRITICAL - All agents MUST follow**

This mandate was established after multiple production bugs were discovered that should have been caught by basic testing. Mario's time is precious - every bug found in production is a process failure.

### Mandatory Quality Gates

- **NO code merged without passing tests** - Every PR must have green CI
- **NO API routes without integration tests** covering at least the happy path
- **NO frontend pages without API contract verification** - test that frontend calls match API expectations
- **Red-Green-Refactor is MANDATORY** - Write failing test first, then implementation
- **Every bug found in production = process failure** - Document in retro and add test to prevent recurrence

### Test Coverage Requirements

| Layer | Minimum Coverage | Focus Areas |
|-------|------------------|-------------|
| API Routes | 100% happy path | Request validation, response format, auth checks |
| Services | 80%+ | Business logic, edge cases, error handling |
| Frontend Pages | Integration tests | Form submissions, API calls, redirects |
| Shared Schemas | 100% | Zod validation, type exports |

### Bugs Found Today (2025-12-23) - NEVER REPEAT

1. **set-password page**: POST vs PUT method mismatch - would have been caught by integration test
2. **set-password page**: `newPassword` vs `password` field name - would have been caught by contract test
3. **onboard-existing page**: Page didn't exist - would have been caught by e2e test
4. **complete-profile page**: Page didn't exist - would have been caught by e2e test

### Quality Checklist Before Any PR

- [ ] All new code has corresponding tests
- [ ] All tests pass locally (`pnpm test`)
- [ ] API routes have integration tests
- [ ] Frontend forms test actual API calls (not mocked)
- [ ] Error paths are tested, not just happy paths
- [ ] German error messages are verified

---

## Technology Stack & Versions

### Build System & Monorepo
- **Turborepo** (latest stable) - Build orchestration for monorepo
- **pnpm** (latest) - Package manager (NOT npm or yarn)
- **4 Workspaces:** `apps/web`, `apps/api`, `packages/shared`, `packages/ui`
- **CRITICAL:** Use `pnpm turbo <command>` for all builds, NOT `npm` or `yarn`

### Frontend Stack
- **Vite 5.x** - Build tool (NOT webpack or CRA)
- **React 18.x** - Framework with concurrent features
- **TypeScript 5.x** - Strict mode enabled
- **TanStack Router v1.x** - File-based routing (NOT React Router)
- **TanStack Query 5.90.12** - Server state management
- **Zustand 5.0.9** - Client state management
- **Radix UI Primitives** - Unstyled accessible components (NOT Material UI or Ant Design)
- **Tailwind CSS 3.x** - Utility-first CSS (NO styled-components or CSS-in-JS)
- **vite-plugin-pwa 0.17+** - PWA with Workbox

### Backend Stack
- **Node.js 20.x LTS** - Runtime (NOT Bun or Deno)
- **Express 4.x** - Web framework
- **PostgreSQL 16** - Database via NeonDB (NOT MySQL or MongoDB)
- **Drizzle ORM 0.45.1** - Type-safe ORM (NOT Prisma or TypeORM)
- **jose 6.1.3** - JWT library (NOT jsonwebtoken)
- **bcrypt 5.x** - Password hashing (12 rounds)

### External Services
- **Anthropic Claude API** - Haiku model for chat (NOT GPT or other LLMs)
- **NeonDB** - Serverless Postgres hosting
- **Vercel** - Deployment platform (NOT AWS, Netlify, or Railway)

### Version Constraints
- **CRITICAL:** PostgreSQL 16+ required for specific features
- **CRITICAL:** Drizzle ORM 0.45.1+ required for type inference improvements
- **CRITICAL:** TanStack Query 5.90.12+ required for offline mode fixes
- **CRITICAL:** jose 6.1.3+ required for ES modules support

## Critical Implementation Rules

### Language-Specific Rules (TypeScript)

#### TypeScript Configuration
- **Strict Mode:** ALWAYS enabled - no `any` types without explicit justification
- **Project References:** Monorepo uses TS Project References for workspace boundaries
- **Module Resolution:** `"bundler"` mode for Vite compatibility
- **CRITICAL:** Use `type` imports for types only: `import type { User } from '@/types'`
- **CRITICAL:** DO NOT use `import { type User }` syntax (old style)

#### Null vs Undefined Usage
- **API/Backend:** Use `null` for missing/absent data in JSON responses
- **UI State/Frontend:** Use `undefined` for optional properties or uninitialized state
- **Database:** Drizzle ORM uses `null` for nullable columns
- **NEVER mix:** Pick `null` OR `undefined` per context, don't alternate

#### Async Error Handling
- **ALWAYS use try-catch:** `try { await fn() } catch (error) { ... }`
- **NEVER use .catch():** No `.catch()` chains on promises
- **Rationale:** try-catch is more maintainable and handles sync errors too
- **Error Types:** Always narrow error type: `if (error instanceof ApiError)`

#### Import/Export Patterns
- **Type Imports:** `import type { T } from './types'` for types only
- **Named Exports:** Prefer named exports over default exports
- **Barrel Files:** Use `index.ts` for public API of each module
- **Path Aliases:** Use `@/` for workspace root imports (configured in tsconfig)

#### Type Inference Best Practices
- **Drizzle ORM:** Let Drizzle infer types from schema, don't manually type queries
- **TanStack Query:** Let Query infer types from query function return
- **Zustand:** Let Zustand infer types from store definition
- **AVOID:** Over-typing when inference is sufficient

#### Common TypeScript Gotchas
- **NEVER:** Use `as any` - refactor code instead
- **NEVER:** Disable strict checks with `// @ts-ignore` or `// @ts-nocheck`
- **ALWAYS:** Use `unknown` instead of `any` for truly unknown types
- **ALWAYS:** Validate `unknown` types with type guards before usage

### Framework-Specific Rules

#### React Patterns

**Component Structure:**
- **Functional Components Only:** No class components
- **Named Exports:** `export function EventCard() { }` (NOT default exports)
- **Props Interface:** Define props type inline or as separate interface
- **File Location:** Components in `features/{feature}/components/`

**Hooks Usage:**
- **Custom Hooks:** Prefix with `use`, place in `features/{feature}/hooks/`
- **useEffect Dependencies:** ALWAYS include all dependencies, no eslint-disable
- **Conditional Hooks:** NEVER call hooks conditionally
- **Hook Order:** Same order every render (React rules of hooks)

**Performance:**
- **React.memo:** Use for expensive components that re-render often
- **useMemo/useCallback:** Use for expensive computations or stable references
- **AVOID:** Premature optimization - profile first
- **Code Splitting:** Use React.lazy() for route-level splitting

#### TanStack Query Patterns

**Query Keys Structure (CRITICAL):**
```typescript
// ALWAYS use hierarchical structure:
export const queryKeys = {
  events: {
    all: ['events'] as const,
    lists: () => [...queryKeys.events.all, 'list'] as const,
    list: (filters: EventFilters) => [...queryKeys.events.lists(), filters] as const,
    detail: (id: number) => [...queryKeys.events.all, 'detail', id] as const,
  }
}
```
- **NEVER:** Flat strings like `'events'`, `'event-detail-123'`
- **ALWAYS:** Hierarchical arrays for cache invalidation

**Optimistic Updates:**
- **ALWAYS:** Implement for mutations (event registration, chat messages)
- **Pattern:** Update cache immediately, rollback on error
- **CRITICAL:** Use `onMutate`, `onError`, `onSettled` callbacks

**Offline Mode:**
- **Enable:** `networkMode: 'offlineFirst'` for PWA
- **Retry Logic:** Configure retries for failed mutations
- **Persist:** Use `persistQueryClient` for offline data

#### Zustand Store Patterns

**Store Structure (CRITICAL):**
- **One Store Per Domain:** Separate stores for auth, offline queue, chat
- **NO Global Store:** Avoid single monolithic store
- **File Location:** `features/{feature}/stores/{domain}Store.ts`

**Store Definition:**
```typescript
// ALWAYS use this pattern:
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: 'auth-storage' }
  )
);
```

**Persist Middleware:**
- **ALWAYS use:** For offline queue, auth state, UI preferences
- **NEVER use:** For server data (use TanStack Query instead)
- **Storage:** IndexedDB for large data, localStorage for small data

#### Drizzle ORM Patterns

**Schema Definition (CRITICAL):**
```typescript
// ALWAYS use this pattern in packages/shared/src/db/schema/
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  created_at: timestamp('created_at').defaultNow()
});

// Let Drizzle infer types:
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

**Naming Conventions:**
- **Tables:** Plural `snake_case` (users, event_registrations)
- **Columns:** `snake_case` (created_at, is_active, usv_number)
- **Boolean Columns:** Prefix with `is_`, `has_`, `can_`
- **Foreign Keys:** Suffix with `_id` (user_id, event_id)

**Migrations:**
- **ALWAYS generate:** `pnpm drizzle-kit generate:pg` after schema changes
- **File Location:** `packages/shared/drizzle/migrations/`
- **NEVER:** Manual SQL migrations

**Query Patterns:**
- **Type Inference:** Let Drizzle infer, don't manually type queries
- **Joins:** Use Drizzle relational queries, not raw SQL joins
- **Transactions:** Use `db.transaction()` for multi-step operations

#### Radix UI Patterns

**Component Composition:**
- **ALWAYS:** Use Radix primitives as foundation
- **Style with Tailwind:** NO inline styles or CSS modules
- **Accessibility:** Radix handles ARIA, don't override unless necessary
- **Example:**
```tsx
<Dialog.Root>
  <Dialog.Trigger asChild>
    <button className="btn-primary">Open</button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="overlay" />
    <Dialog.Content className="dialog-content">
      {/* content */}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

**Key Packages:**
- `@radix-ui/react-dialog` for modals
- `@radix-ui/react-dropdown-menu` for dropdowns
- `@radix-ui/react-select` for selects
- `@radix-ui/react-toast` for notifications

#### TanStack Router Patterns

**File-Based Routing:**
- **Route Files:** `apps/web/src/routes/*.tsx`
- **Layout Routes:** `_layout.tsx` for nested layouts
- **Index Routes:** `index.tsx` for default routes
- **Dynamic Routes:** `$eventId.tsx` for params

**Route Definition:**
```typescript
// ALWAYS use this pattern:
export const Route = createFileRoute('/events/$eventId')({
  loader: async ({ params }) => {
    // Load data here
  },
  component: EventDetailPage,
});
```

**Type-Safe Navigation:**
- **ALWAYS use:** `<Link to="/events/$eventId" params={{ eventId: 123 }}>`
- **NEVER use:** String literals without type checking

#### Express Backend Patterns

**Middleware Order (CRITICAL):**
```typescript
// ALWAYS this order:
app.use(helmet()); // Security headers first
app.use(cors(corsOptions)); // CORS second
app.use(express.json()); // Body parser third
app.use(rateLimiter); // Rate limiting fourth
app.use(authMiddleware); // Auth last (routes need body)
```

**Error Handling:**
- **ALWAYS:** Use RFC 7807 Problem Details format
- **Error Middleware:** Last middleware in chain
- **NEVER:** Send raw error messages to client

**JWT Authentication:**
```typescript
// ALWAYS use HttpOnly cookies:
res.cookie('access_token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000 // 15 minutes
});
```

### Naming Conventions & Code Organization

#### Database Naming (PostgreSQL + Drizzle)
- **Tables:** Plural `snake_case` - `users`, `events`, `event_registrations`, `chat_messages`
- **Columns:** `snake_case` - `created_at`, `updated_at`, `usv_number`, `max_participants`
- **Boolean Columns:** Prefix with `is_`, `has_`, `can_` - `is_active`, `has_discount`, `can_register`
- **Foreign Keys:** Suffix with `_id` - `user_id`, `event_id`, `created_by_id`
- **Join Tables:** Combine entity names - `event_registrations`, `user_roles`
- **NEVER:** camelCase or PascalCase in database schema

#### API Naming (REST-like JSON)
- **URLs:** `kebab-case` - `/api/v1/event-registrations`, `/api/v1/chat-messages`
- **HTTP Methods:** Standard REST - GET (read), POST (create), PUT/PATCH (update), DELETE (delete)
- **API Version:** Prefix with `/api/v1/` for all endpoints
- **Request Body:** `camelCase` JSON fields (transformed from snake_case DB)
- **Response Body:** `camelCase` JSON fields (transformed from snake_case DB)

**CRITICAL API Transform:**
```typescript
// Database: snake_case
{ user_id: 1, created_at: "2025-12-22", is_active: true }

// JSON API: camelCase (transform required)
{ userId: 1, createdAt: "2025-12-22", isActive: true }
```

#### TypeScript Code Naming
- **Variables:** `camelCase` - `eventList`, `maxParticipants`, `isLoading`
- **Functions:** `camelCase` - `fetchEvents()`, `registerForEvent()`, `formatDate()`
- **Classes:** `PascalCase` - `EventService`, `UserRepository`, `ApiError`
- **Interfaces/Types:** `PascalCase` - `User`, `Event`, `EventFilters`, `ApiResponse<T>`
- **Constants:** `UPPER_SNAKE_CASE` - `MAX_PARTICIPANTS`, `API_BASE_URL`, `JWT_SECRET`
- **Enums:** `PascalCase` enum, `UPPER_SNAKE_CASE` values
```typescript
enum UserRole {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN'
}
```

#### React Component Naming
- **Components:** `PascalCase` - `EventCard`, `LoginForm`, `ChatMessage`, `AdminDashboard`
- **Component Files:** `PascalCase.tsx` - `EventCard.tsx`, `LoginForm.tsx`
- **Custom Hooks:** `camelCase` with `use` prefix - `useEventList()`, `useAuth()`, `useOfflineQueue()`
- **Hook Files:** `camelCase.ts` - `useEventList.ts`, `useAuth.ts`
- **Props Types:** Component name + `Props` - `EventCardProps`, `LoginFormProps`

#### File & Directory Naming
- **Files:** `kebab-case` - `event-card.tsx`, `use-event-list.ts`, `auth-service.ts`
- **Directories:** `kebab-case` - `event-management/`, `user-authentication/`, `offline-queue/`
- **EXCEPTION:** React components use `PascalCase.tsx` for quick identification
- **Test Files:** Same name + `.test.ts` or `.spec.ts` - `event-card.test.tsx`

#### Code Organization (Monorepo Structure)

**Workspace Boundaries:**
```
apps/
  web/          # Frontend PWA (React + Vite)
  api/          # Backend API (Express)
packages/
  shared/       # Shared types, DB schema, constants
  ui/           # Shared React components (Radix UI wrappers)
```

**Frontend Organization (Feature-Based):**
```
apps/web/src/
  features/
    events/
      components/    # EventCard, EventList, EventFilters
      hooks/         # useEventList, useEventRegistration
      services/      # eventService (API calls)
      stores/        # eventStore (if needed)
      types/         # EventFilters, EventFormData
    auth/
      components/    # LoginForm, RegisterForm
      hooks/         # useAuth, useLogin
      services/      # authService
      stores/        # authStore
    chat/
      components/    # ChatMessage, ChatInput
      hooks/         # useChatMessages, useChatWebSocket
      stores/        # chatStore
    admin/
      components/    # AdminDashboard, UserTable
      hooks/         # useAdminStats
    profile/
      components/    # ProfileForm, ProfileHeader
      hooks/         # useProfile
  routes/          # TanStack Router file-based routes
  lib/             # Shared utilities (query-keys, api-client)
```

**Backend Organization (Layer-Based):**
```
apps/api/src/
  routes/          # Express route definitions
    events/        # Event-related routes
    auth/          # Auth-related routes
    chat/          # Chat-related routes
  services/        # Business logic layer
    eventService.ts
    authService.ts
    chatService.ts
  repositories/    # Data access layer (Drizzle queries)
    eventRepository.ts
    userRepository.ts
  middleware/      # Express middleware
    authMiddleware.ts
    errorMiddleware.ts
  types/           # Backend-specific types
  utils/           # Shared utilities
```

**Shared Package Organization:**
```
packages/shared/src/
  db/
    schema/        # Drizzle schema definitions
      users.ts
      events.ts
      chat.ts
    index.ts       # Export all schemas
  types/           # Shared TypeScript types
    api.ts         # API request/response types
    events.ts      # Event-related types
  constants/       # Shared constants
    api.ts         # API URLs, error codes
```

#### Import Path Aliases
- **Root Alias:** `@/` for workspace root imports
- **Example:** `import { queryKeys } from '@/lib/query-keys'`
- **Configured in:** `tsconfig.json` paths

#### Module Exports (Barrel Files)
- **ALWAYS:** Use `index.ts` for public API of each module
- **Example:** `features/events/index.ts` exports public components/hooks
- **Internal:** Files prefixed with `_` are module-private
- **NEVER:** Import from internal files outside module

### Critical Don't-Miss Rules

#### Security Rules (CRITICAL)

**Authentication & Authorization:**
- **NEVER store JWT in localStorage** - ALWAYS use HttpOnly cookies (XSS protection)
- **ALWAYS validate JWT signature** on every protected endpoint
- **ALWAYS check user role** in middleware before allowing admin actions
- **NEVER trust client-side role checks** - validate on backend
- **Password Hashing:** ALWAYS use bcrypt with 12 rounds, NEVER plain text or MD5

**Two-Track Onboarding System (CRITICAL):**
- **Track A (Existing Members):** Pre-seeded users with personalized `onboarding_token`
- **Track B (New Members):** Standard registration form
- **NEVER confuse the two tracks** - they use different endpoints and flows
- **Onboarding Token Rules:**
  - Tokens are **single-use** - ALWAYS clear `onboarding_token` after successful login
  - Tokens are **time-limited** - validate `onboarding_token_expires > NOW()`
  - Tokens are **status-gated** - MUST check `onboarding_status === 'pre_seeded'` before allowing token-based login
  - **NEVER** allow token reuse - check if already used and redirect to standard login
- **Force Password Change Flow:**
  - Pre-seeded users MUST change password on first login (`must_change_password: true`)
  - **ALWAYS** check `must_change_password` flag in auth middleware
  - **ALWAYS** redirect to `/onboard-existing/set-password` if flag is `true`
  - **NEVER** allow access to protected routes while `must_change_password` is `true`
- **Onboarding Status Lifecycle:**
  ```
  Track A: NULL → pre_seeded → password_changed → completed
  Track B: NULL → completed (direct)
  ```
- **Database Fields to Check:**
  - `onboarding_token` (text, unique, nullable)
  - `onboarding_token_expires` (timestamp, nullable)
  - `onboarding_status` (text: 'pre_seeded' | 'password_changed' | 'completed')
  - `must_change_password` (boolean, default false)
- **API Endpoint Separation:**
  - Track A: `POST /api/v1/auth/onboard-existing` (token-based)
  - Track B: `POST /api/v1/auth/register` (standard)
  - **NEVER** mix authentication logic between tracks
- **Pre-Seed CLI Tool:**
  - Command: `pnpm seed:members --csv ./data/existing-members.csv`
  - Generates tokens, creates pre-seeded users, outputs QR codes
  - **ALWAYS** validate CSV format before processing (email, first_name, last_name, usv_number)
  - **NEVER** skip duplicate email checks - log warnings for skipped entries
- **Error Handling:**
  - Expired token → Show error page with contact info, NOT generic 404
  - Already used token → Redirect to `/login` with friendly message
  - Invalid token → 404 with helpful "Check your QR code" message
- **Testing Critical Paths:**
  - Test token expiration edge cases (90 days)
  - Test force password change enforcement
  - Test single-use token enforcement (prevent replay)
  - Test both tracks independently (no cross-contamination)

**SQL Injection Prevention:**
- **ALWAYS use Drizzle parameterized queries** - NEVER string concatenation
- **NEVER use raw SQL** unless absolutely necessary and parameterized
- **Example (SAFE):**
```typescript
// CORRECT: Drizzle parameterized
await db.select().from(users).where(eq(users.id, userId));

// WRONG: String concatenation
await db.execute(sql`SELECT * FROM users WHERE id = ${userId}`); // Still safe with sql tag
await db.execute(`SELECT * FROM users WHERE id = ${userId}`); // DANGEROUS!
```

**XSS Prevention:**
- **React escapes by default** - rely on this
- **NEVER use dangerouslySetInnerHTML** unless content is sanitized
- **NEVER interpolate user input into SQL/HTML** without escaping
- **Sanitize user input** for chat messages (Falki AI context)

**CORS Configuration:**
- **Vercel Frontend:** Only allow frontend origin
- **Development:** `http://localhost:5173` (Vite default)
- **Production:** `https://urc-falke.app` (or actual domain)
- **NEVER:** Allow `*` wildcard in production

**Rate Limiting (CRITICAL for Chat):**
- **Anthropic API:** Limit chat messages per user per minute
- **Login Endpoint:** Limit failed login attempts (prevent brute force)
- **Registration:** Limit account creation per IP
- **Implementation:** Use `express-rate-limit` middleware

**DSGVO Compliance (German Law):**
- **NEVER store unnecessary personal data**
- **Cookie Consent:** Required for analytics (NOT required for functional cookies like JWT)
- **User Data Export:** Users can request their data (implement export endpoint)
- **User Data Deletion:** Users can request deletion (soft delete, GDPR right to be forgotten)
- **Privacy Policy:** Must be accessible and in German

#### Anti-Patterns to AVOID

**React Anti-Patterns:**
- **NEVER mutate state directly** - use setState/store setters
```typescript
// WRONG:
user.name = 'New Name';

// CORRECT:
setUser({ ...user, name: 'New Name' });
```
- **NEVER use index as key** in lists (breaks reconciliation)
- **NEVER call hooks inside conditions/loops** (breaks React rules)
- **AVOID prop drilling** - use context or state management for deep trees

**TanStack Query Anti-Patterns:**
- **NEVER fetch in useEffect** - use TanStack Query hooks
- **NEVER manually manage loading/error states** - Query provides these
- **NEVER use flat query keys** - always hierarchical arrays
- **AVOID over-fetching** - use query select to transform data

**Zustand Anti-Patterns:**
- **NEVER use Zustand for server data** - use TanStack Query
- **NEVER create global God store** - separate stores per domain
- **AVOID complex nested state** - flatten when possible

**Drizzle Anti-Patterns:**
- **NEVER use TypeORM or Prisma** - project uses Drizzle
- **NEVER manually write types** - use `$inferSelect` and `$inferInsert`
- **NEVER skip migrations** - always generate and run migrations
- **AVOID N+1 queries** - use joins or batch queries

**General Anti-Patterns:**
- **NEVER use `var`** - use `const` or `let`
- **NEVER use `==`** - use `===` for comparisons
- **NEVER ignore TypeScript errors** - fix them, don't `@ts-ignore`
- **AVOID premature optimization** - profile first

#### PWA & Offline-First Edge Cases

**Service Worker Gotchas:**
- **Service Worker cache can be stale** - implement update prompts
- **NEVER cache API responses indefinitely** - use Network-First for API
- **Cache-First for static assets** - HTML/CSS/JS/images
- **Handle SW update race conditions** - use `skipWaiting()` carefully

**Offline Queue Patterns:**
- **ALWAYS show offline indicator** when no network
- **ALWAYS validate before queuing** - don't queue invalid requests
- **Handle conflicts on sync** - last-write-wins or manual resolution
- **Example:** Event registration while offline
```typescript
// Queue for Background Sync if offline
if (!navigator.onLine) {
  offlineQueue.add({ eventId, userId });
  showToast('Anmeldung wird synchronisiert, sobald du online bist');
} else {
  await registerForEvent(eventId);
}
```

**IndexedDB Edge Cases:**
- **ALWAYS handle quota exceeded errors** - IndexedDB has storage limits
- **NEVER block main thread** - IndexedDB operations are async
- **Handle corruption** - IndexedDB can corrupt, have fallback strategy

#### Performance Gotchas

**React Performance:**
- **AVOID large lists without virtualization** - use `@tanstack/react-virtual` for >100 items
- **AVOID inline function props** - use useCallback for expensive children
- **AVOID unnecessary re-renders** - use React DevTools Profiler
- **Code split routes** - use React.lazy() for route-level chunks

**TanStack Query Performance:**
- **Use staleTime wisely** - reduce re-fetches for stable data
- **Implement query cancellation** - cancel on unmount for expensive queries
- **Batch mutations** - use mutation batching for bulk operations

**Database Performance:**
- **ALWAYS add indexes** on frequently queried columns (email, usv_number, event start_date)
- **AVOID SELECT \*** - select only needed columns
- **Use database-level constraints** - NOT NULL, UNIQUE, foreign keys
- **Implement pagination** - NEVER fetch all records for large tables

#### Error Handling Best Practices

**User-Facing Errors (CRITICAL - German Language):**
- **ALWAYS show errors in German** - this is German-speaking user base
- **Use RFC 7807 format** with German `title` and `detail`
- **Provide actionable messages** - tell users what to do next
```typescript
{
  type: "https://urc-falke.app/errors/event-full",
  title: "Veranstaltung ist voll",  // German!
  detail: "Die maximale Teilnehmeranzahl wurde erreicht.",
  status: 409,
  action: {
    label: "Auf Warteliste setzen",
    href: "/api/v1/events/123/waitlist"
  }
}
```

**Error Logging:**
- **ALWAYS log errors server-side** - use structured logging
- **Include context** - user ID, request ID, stack trace
- **NEVER log sensitive data** - passwords, tokens, PII
- **Rate limit error notifications** - avoid alert fatigue

**Error Boundaries:**
- **ALWAYS wrap routes in Error Boundaries** - prevent white screen
- **Provide fallback UI** - show friendly error message
- **Log errors to backend** - track errors in production

#### Date & Time Handling

**Timezone Rules:**
- **ALWAYS store dates in UTC** in database (PostgreSQL `timestamp`)
- **Convert to local timezone in UI** - use `Intl.DateTimeFormat` or date-fns
- **German date format:** `DD.MM.YYYY` (NOT MM/DD/YYYY)
- **Example:**
```typescript
// Database: UTC
created_at: '2025-12-22T10:00:00Z'

// UI Display: German format
const formatter = new Intl.DateTimeFormat('de-DE', {
  dateStyle: 'short',
  timeStyle: 'short'
});
formatter.format(new Date(createdAt)); // "22.12.2025, 11:00"
```

#### Environment Variables

**Sensitive Data (CRITICAL):**
- **NEVER commit `.env` to git** - use `.env.example` as template
- **NEVER expose secrets to frontend** - prefix public vars with `VITE_`
- **Backend secrets:** `JWT_SECRET`, `DATABASE_URL`, `ANTHROPIC_API_KEY`
- **Frontend public:** `VITE_API_URL`, `VITE_APP_NAME`
- **Vercel deployment:** Set env vars in Vercel Dashboard

#### Testing Edge Cases

**Critical Test Scenarios:**
- **Test offline functionality** - mock `navigator.onLine`
- **Test auth expiration** - JWT expires after 15 minutes
- **Test rate limiting** - ensure limits are enforced
- **Test DSGVO compliance** - data export, deletion endpoints
- **Test German date formats** - ensure DD.MM.YYYY in UI
- **Test concurrent registrations** - event capacity edge case
- **Test service worker updates** - ensure SW updates properly

---

## Usage Guidelines

**For AI Agents:**

- **ALWAYS read this file** before implementing any code in this project
- **Follow ALL rules exactly** as documented - no exceptions without explicit approval
- **When in doubt,** prefer the more restrictive/conservative option
- **Cross-reference** with architecture document (`docs/architecture.md`) for broader context
- **Update this file** if new patterns emerge during implementation that should be standardized

**For Humans (Project Maintainers):**

- **Keep this file lean** - focused on non-obvious rules that AI agents need reminders about
- **Update immediately** when technology stack changes (new versions, new frameworks)
- **Review quarterly** for outdated rules that can be removed
- **Remove rules** that become obvious over time or are well-established in codebase
- **Add new rules** when you discover patterns that agents consistently miss

**Maintenance Schedule:**

- **After major architecture changes:** Review all sections for updates
- **Quarterly:** Remove outdated/obvious rules, add newly discovered patterns
- **After technology upgrades:** Update all version numbers and compatibility notes

---

**Last Updated:** 2025-12-23
**Total Rules:** 100+ critical implementation patterns (Quality First Mandate added)
**Status:** Complete and optimized for LLM consumption
