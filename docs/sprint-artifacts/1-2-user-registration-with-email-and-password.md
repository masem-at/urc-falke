# Story 1.2: User Registration with Email & Password

**Story ID:** 1.2
**Story Key:** 1-2-user-registration-with-email-and-password
**Epic:** Epic 1 - User Onboarding & Authentication
**Status:** ready-for-dev

---

## Story

As a **new user**,
I want to register an account with my email and password,
So that I can access the platform and participate in events.

---

## Acceptance Criteria

### AC1: Successful Registration Flow

**Given** I am on the registration page (`/register`)
**When** I enter a valid email (e.g., `user@example.com`) and a password (min. 8 characters)
**And** I click the "Registrieren" button
**Then** my password is hashed using bcrypt (salt rounds: 12)
**And** a new user record is created in the `users` table
**And** a JWT token is generated using jose 6.1.3
**And** the JWT is stored in an HttpOnly cookie with `SameSite=Strict`
**And** I am redirected to the events page (`/events`)
**And** I see a success message: "Willkommen! Dein Account wurde erstellt."

### AC2: Duplicate Email Handling

**Given** I try to register with an email that already exists
**When** I submit the registration form
**Then** I receive an error message: "Diese Email-Adresse ist bereits registriert."
**And** the registration form remains visible
**And** no duplicate user is created

### AC3: Email Validation

**Given** I try to register with an invalid email format
**When** I submit the registration form
**Then** I receive a validation error: "Bitte gib eine gültige Email-Adresse ein."
**And** the form does not submit

### AC4: Password Validation

**Given** I try to register with a password shorter than 8 characters
**When** I submit the registration form
**Then** I receive a validation error: "Passwort muss mindestens 8 Zeichen lang sein."
**And** the form does not submit

### AC5: Accessibility Requirements

**And** All form inputs have WCAG 2.1 AA compliant labels and ARIA attributes
**And** Registration button is 44x44px minimum (accessibility requirement)
**And** Form is fully keyboard-navigable with visible focus indicators

---

## Tasks / Subtasks

### Task 1: Create Shared Validation Schemas
**Status:** pending
**Acceptance Criteria Coverage:** AC1, AC3, AC4
**Estimated Time:** 30 minutes

- [ ] Create `packages/shared/src/schemas/auth.schema.ts`
- [ ] Define `signupSchema` with Zod:
  - `email`: string().email('Ungültige Email-Adresse')
  - `password`: string().min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
  - `name`: string().min(2, 'Name muss mindestens 2 Zeichen lang sein')
  - `usvNumber`: string().optional()
- [ ] Export `SignupInput` type using `z.infer<typeof signupSchema>`
- [ ] Add German error messages for all validation rules

**File:** `packages/shared/src/schemas/auth.schema.ts`
```typescript
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Ungültige Email-Adresse'),
  password: z.string()
    .min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
    .regex(/[A-Z]/, 'Passwort muss mindestens einen Großbuchstaben enthalten')
    .regex(/[a-z]/, 'Passwort muss mindestens einen Kleinbuchstaben enthalten')
    .regex(/[0-9]/, 'Passwort muss mindestens eine Zahl enthalten'),
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein'),
  usvNumber: z.string().optional()
});

export type SignupInput = z.infer<typeof signupSchema>;
```

---

### Task 2: Create Password Hashing Utility (Backend)
**Status:** pending
**Acceptance Criteria Coverage:** AC1
**Estimated Time:** 15 minutes

- [ ] Create `apps/api/src/lib/password.ts`
- [ ] Implement `hashPassword(password: string): Promise<string>` using bcrypt with 12 rounds
- [ ] Implement `verifyPassword(password: string, hash: string): Promise<boolean>`
- [ ] Add unit tests: `apps/api/src/lib/password.test.ts`
  - Test password hashing produces valid bcrypt hash
  - Test password verification works correctly
  - Test wrong password is rejected

**File:** `apps/api/src/lib/password.ts`
```typescript
import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12); // 12 rounds per project standards
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
```

---

### Task 3: Create JWT Utility (Backend)
**Status:** pending
**Acceptance Criteria Coverage:** AC1
**Estimated Time:** 30 minutes

- [ ] Create `apps/api/src/lib/jwt.ts`
- [ ] Implement `signAccessToken(payload: { userId: number; role: string }): Promise<string>` using jose
- [ ] Implement `verifyAccessToken(token: string): Promise<{ userId: number; role: string }>`
- [ ] Use JWT_SECRET from environment variables
- [ ] Set token expiry to 15 minutes
- [ ] Add unit tests: `apps/api/src/lib/jwt.test.ts`
  - Test token signing produces valid JWT
  - Test token verification works
  - Test expired token is rejected
  - Test invalid token is rejected

**File:** `apps/api/src/lib/jwt.ts`
```typescript
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function signAccessToken(payload: { userId: number; role: 'member' | 'admin' }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .setIssuedAt()
    .sign(secret);
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as { userId: number; role: 'member' | 'admin' };
}
```

---

### Task 4: Create Registration Service (Backend)
**Status:** pending
**Acceptance Criteria Coverage:** AC1, AC2
**Estimated Time:** 1 hour

- [ ] Create `apps/api/src/services/auth.service.ts`
- [ ] Implement `registerUser(input: SignupInput)` function:
  - Check if email already exists (AC2)
  - Hash password using `hashPassword()` utility
  - Insert new user into database with Drizzle ORM
  - Generate JWT token using `signAccessToken()` utility
  - Return user object (WITHOUT password_hash) and accessToken
- [ ] Handle duplicate email error (throw 409 Conflict)
- [ ] Add unit tests: `apps/api/src/services/auth.service.test.ts`
  - Test successful registration
  - Test duplicate email returns 409 error
  - Test password is hashed before storing
  - Test JWT token is generated
  - Test password_hash is NOT returned in response

**File:** `apps/api/src/services/auth.service.ts`
```typescript
import { db } from '../db/connection';
import { users } from '@urc-falke/shared/db';
import { hashPassword } from '../lib/password';
import { signAccessToken } from '../lib/jwt';
import { SignupInput } from '@urc-falke/shared/schemas/auth.schema';
import { eq } from 'drizzle-orm';

export async function registerUser(input: SignupInput) {
  // Check if email already exists
  const existingUser = await db.select().from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (existingUser.length > 0) {
    throw {
      status: 409,
      type: 'email-already-exists',
      title: 'Email bereits registriert',
      detail: 'Ein Benutzer mit dieser Email existiert bereits.'
    };
  }

  // Hash password
  const passwordHash = await hashPassword(input.password);

  // Create user
  const [newUser] = await db.insert(users).values({
    email: input.email,
    password_hash: passwordHash,
    name: input.name,
    usv_number: input.usvNumber || null,
    role: 'member'
  }).returning();

  // Generate JWT
  const accessToken = await signAccessToken({
    userId: newUser.id,
    role: newUser.role as 'member' | 'admin'
  });

  // Return user (exclude password_hash)
  const { password_hash, ...userWithoutPassword } = newUser;
  return { user: userWithoutPassword, accessToken };
}
```

---

### Task 5: Create Validation Middleware (Backend)
**Status:** pending
**Acceptance Criteria Coverage:** AC3, AC4
**Estimated Time:** 20 minutes

- [ ] Create `apps/api/src/middleware/validate.middleware.ts`
- [ ] Implement `validate(schema: ZodSchema)` middleware
- [ ] Parse request body with Zod schema
- [ ] Return RFC 7807 Problem Details on validation error
- [ ] Add unit tests: `apps/api/src/middleware/validate.middleware.test.ts`

**File:** `apps/api/src/middleware/validate.middleware.ts`
```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        type: 'https://urc-falke.app/errors/validation-error',
        title: 'Validierungsfehler',
        status: 400,
        detail: 'Die eingegebenen Daten sind ungültig.',
        instance: req.originalUrl,
        errors: error.errors
      });
    }
  };
}
```

---

### Task 6: Create Rate Limiting Middleware (Backend)
**Status:** pending
**Acceptance Criteria Coverage:** AC1 (security)
**Estimated Time:** 15 minutes

- [ ] Create `apps/api/src/middleware/rate-limit.middleware.ts`
- [ ] Configure express-rate-limit for auth endpoints
- [ ] Set to 10 requests per minute per IP
- [ ] Return German error message
- [ ] Export `authRateLimiter` middleware

**File:** `apps/api/src/middleware/rate-limit.middleware.ts`
```typescript
import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 10,              // 10 requests per minute
  message: 'Zu viele Anmelde-Versuche. Bitte warte 1 Minute.'
});
```

---

### Task 7: Create Registration API Endpoint (Backend)
**Status:** pending
**Acceptance Criteria Coverage:** AC1, AC2
**Estimated Time:** 45 minutes

- [ ] Create `apps/api/src/routes/auth.routes.ts`
- [ ] Implement `POST /api/v1/auth/register` endpoint
- [ ] Apply validation middleware with `signupSchema`
- [ ] Apply rate limiting middleware
- [ ] Call `registerUser()` service
- [ ] Set JWT in HttpOnly cookie with correct settings:
  - `httpOnly: true`
  - `secure: true` (production)
  - `sameSite: 'lax'`
  - `maxAge: 15 * 60 * 1000` (15 minutes)
- [ ] Return user object with 201 Created status
- [ ] Handle errors with RFC 7807 format
- [ ] Register routes in `apps/api/src/server.ts`
- [ ] Add integration tests: `apps/api/src/routes/auth.routes.test.ts`
  - Test successful registration returns 201
  - Test duplicate email returns 409
  - Test invalid email returns 400
  - Test short password returns 400
  - Test JWT cookie is set
  - Test rate limiting works

**File:** `apps/api/src/routes/auth.routes.ts`
```typescript
import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { authRateLimiter } from '../middleware/rate-limit.middleware';
import { signupSchema } from '@urc-falke/shared/schemas/auth.schema';
import { registerUser } from '../services/auth.service';

const router = Router();

router.post(
  '/api/v1/auth/register',
  authRateLimiter,
  validate(signupSchema),
  async (req, res, next) => {
    try {
      const { user, accessToken } = await registerUser(req.body);

      // Set JWT in HttpOnly cookie
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
```

---

### Task 8: Create Registration Form Component (Frontend)
**Status:** pending
**Acceptance Criteria Coverage:** AC1, AC3, AC4, AC5
**Estimated Time:** 2 hours

- [ ] Create `apps/web/src/features/auth/components/SignupForm.tsx`
- [ ] Use Radix UI Form primitives for accessibility
- [ ] Use react-hook-form with zodResolver for validation
- [ ] Implement form fields:
  - Email input (type="email", ARIA label)
  - Password input (type="password", show/hide toggle, ARIA label)
  - Name input (ARIA label)
  - USV-Nummer input (optional, ARIA label)
- [ ] Implement registration button (44x44px minimum)
- [ ] Show validation errors inline
- [ ] Show success message on registration
- [ ] Use TanStack Query mutation for API call
- [ ] Redirect to /events on success
- [ ] Ensure WCAG 2.1 AA compliance:
  - 4.5:1 color contrast for text
  - Visible focus indicators (2px outline)
  - Full keyboard navigation
  - Screen reader announcements for errors
- [ ] Add component tests: `apps/web/src/features/auth/components/SignupForm.test.tsx`
  - Test form validation (email, password)
  - Test successful submission
  - Test error display
  - Test keyboard navigation
  - Test focus management

**File:** `apps/web/src/features/auth/components/SignupForm.tsx`
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupInput } from '@urc-falke/shared/schemas/auth.schema';
import { useRegister } from '../hooks/useRegister';
import * as Form from '@radix-ui/react-form';
import * as Label from '@radix-ui/react-label';

export function SignupForm() {
  const { mutate: register, isPending, error } = useRegister();

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      usvNumber: ''
    }
  });

  const onSubmit = (data: SignupInput) => {
    register(data);
  };

  return (
    <Form.Root onSubmit={form.handleSubmit(onSubmit)}>
      <Form.Field name="email">
        <Label.Root htmlFor="email">Email-Adresse</Label.Root>
        <Form.Control
          type="email"
          id="email"
          {...form.register('email')}
          aria-invalid={!!form.formState.errors.email}
          aria-describedby={form.formState.errors.email ? 'email-error' : undefined}
        />
        {form.formState.errors.email && (
          <Form.Message id="email-error" role="alert">
            {form.formState.errors.email.message}
          </Form.Message>
        )}
      </Form.Field>

      {/* Password field */}
      <Form.Field name="password">
        <Label.Root htmlFor="password">Passwort</Label.Root>
        <Form.Control
          type="password"
          id="password"
          {...form.register('password')}
          aria-invalid={!!form.formState.errors.password}
          aria-describedby={form.formState.errors.password ? 'password-error' : undefined}
        />
        {form.formState.errors.password && (
          <Form.Message id="password-error" role="alert">
            {form.formState.errors.password.message}
          </Form.Message>
        )}
      </Form.Field>

      {/* Name field */}
      <Form.Field name="name">
        <Label.Root htmlFor="name">Name</Label.Root>
        <Form.Control
          type="text"
          id="name"
          {...form.register('name')}
          aria-invalid={!!form.formState.errors.name}
        />
        {form.formState.errors.name && (
          <Form.Message role="alert">
            {form.formState.errors.name.message}
          </Form.Message>
        )}
      </Form.Field>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isPending}
        style={{ minWidth: '44px', minHeight: '44px' }}
      >
        {isPending ? 'Registriere...' : 'Registrieren'}
      </button>

      {error && <div role="alert">{error.message}</div>}
    </Form.Root>
  );
}
```

---

### Task 9: Create Registration Hook (Frontend)
**Status:** pending
**Acceptance Criteria Coverage:** AC1, AC2
**Estimated Time:** 30 minutes

- [ ] Create `apps/web/src/features/auth/hooks/useRegister.ts`
- [ ] Use TanStack Query `useMutation` for registration API call
- [ ] Implement `onSuccess`: redirect to /events, show success toast
- [ ] Implement `onError`: display error message from API
- [ ] Handle RFC 7807 error responses
- [ ] Add hook tests: `apps/web/src/features/auth/hooks/useRegister.test.ts`

**File:** `apps/web/src/features/auth/hooks/useRegister.ts`
```typescript
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { registerUser } from '../services/auth.service';
import type { SignupInput } from '@urc-falke/shared/schemas/auth.schema';

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: SignupInput) => registerUser(data),
    onSuccess: (user) => {
      // JWT cookie is set by backend, user is now authenticated
      navigate({ to: '/events' });
      // TODO: Show success toast
    },
    onError: (error: any) => {
      // Error handling (RFC 7807 format)
      console.error('Registration failed:', error);
    }
  });
}
```

---

### Task 10: Create Auth Service (Frontend)
**Status:** pending
**Acceptance Criteria Coverage:** AC1
**Estimated Time:** 20 minutes

- [ ] Create `apps/web/src/features/auth/services/auth.service.ts`
- [ ] Implement `registerUser(data: SignupInput): Promise<User>` function
- [ ] Make POST request to `/api/v1/auth/register`
- [ ] Handle response (JWT cookie set automatically)
- [ ] Parse RFC 7807 errors
- [ ] Add service tests: `apps/web/src/features/auth/services/auth.service.test.ts`

**File:** `apps/web/src/features/auth/services/auth.service.ts`
```typescript
import type { SignupInput } from '@urc-falke/shared/schemas/auth.schema';
import type { User } from '@urc-falke/shared/db';

export async function registerUser(data: SignupInput): Promise<User> {
  const response = await fetch('/api/v1/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    credentials: 'include' // Include cookies
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Registrierung fehlgeschlagen');
  }

  return response.json();
}
```

---

### Task 11: Create Registration Page Route (Frontend)
**Status:** pending
**Acceptance Criteria Coverage:** AC1
**Estimated Time:** 30 minutes

- [ ] Create `apps/web/src/routes/register.tsx` (TanStack Router)
- [ ] Import and render `SignupForm` component
- [ ] Add page title: "Registrieren - URC Falke"
- [ ] Add page heading: "Neues Konto erstellen"
- [ ] Add link to login page: "Bereits registriert? Jetzt anmelden"
- [ ] Ensure responsive design (mobile-first)
- [ ] Add page tests: `apps/web/src/routes/register.test.tsx`

**File:** `apps/web/src/routes/register.tsx`
```typescript
import { createFileRoute } from '@tanstack/react-router';
import { SignupForm } from '../features/auth/components/SignupForm';

export const Route = createFileRoute('/register')({
  component: RegisterPage
});

function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-center">
            Neues Konto erstellen
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Werde Teil der URC Falke Community
          </p>
        </div>

        <SignupForm />

        <div className="text-center">
          <a href="/login" className="text-blue-600 hover:text-blue-800">
            Bereits registriert? Jetzt anmelden
          </a>
        </div>
      </div>
    </div>
  );
}
```

---

### Task 12: Integration Testing
**Status:** pending
**Acceptance Criteria Coverage:** All ACs
**Estimated Time:** 1 hour

- [ ] Create end-to-end test: `apps/web/src/features/auth/register.e2e.test.ts`
- [ ] Test complete registration flow:
  - Navigate to /register
  - Fill in form with valid data
  - Submit form
  - Verify redirect to /events
  - Verify JWT cookie is set
  - Verify user is authenticated
- [ ] Test duplicate email scenario
- [ ] Test validation error scenarios
- [ ] Run all tests: `pnpm test`
- [ ] Verify test coverage > 80%

---

## Dev Notes

### Technical Requirements

#### Dependencies Added

**Backend (`apps/api/package.json`):**
- `express-rate-limit` - Already available (rate limiting)
- `jose@6.1.3` - Already available (JWT)
- `bcrypt@5.1.1` - Already available (password hashing)
- `@types/express` - Already available
- `@types/bcrypt` - Already available

**Frontend (`apps/web/package.json`):**
- `react-hook-form` - Form state management (NEW)
- `@hookform/resolvers` - Zod resolver for react-hook-form (NEW)
- `@radix-ui/react-form` - Accessible form primitives (NEW)
- `@radix-ui/react-label` - Accessible labels (NEW)

**Shared (`packages/shared/package.json`):**
- `zod@3.24+` - Already available (validation)

#### Database Schema

**Already Available (Story 1.1):**
```typescript
// packages/shared/src/db/schema/users.ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  password_hash: text('password_hash').notNull(),
  first_name: text('first_name'),
  last_name: text('last_name'),
  usv_number: text('usv_number').unique(),
  is_usv_verified: boolean('is_usv_verified').default(false),
  role: text('role').default('member'),
  is_founding_member: boolean('is_founding_member').default(false),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
  // ... other fields for onboarding, etc.
});
```

**Required for this story:**
- `email` - Unique, not null
- `password_hash` - Not null
- `first_name` - Nullable (can be set during registration or later)
- `last_name` - Nullable (can be set during registration or later)
- `usv_number` - Nullable (optional during registration)
- `role` - Default 'member'
- `created_at` - Auto-generated
- `updated_at` - Auto-generated

#### Architecture Patterns

**Authentication Flow (Track B: New Members):**
1. User visits `/register`
2. User fills in email, password, name
3. Frontend validates with Zod schema
4. Frontend sends POST `/api/v1/auth/register`
5. Backend validates with same Zod schema
6. Backend checks for duplicate email
7. Backend hashes password with bcrypt (12 rounds)
8. Backend inserts user into database
9. Backend generates JWT token (jose)
10. Backend sets JWT in HttpOnly cookie
11. Backend returns user object (without password)
12. Frontend redirects to `/events`

**Security Considerations:**
- Passwords NEVER sent in plain text over HTTP (HTTPS via Vercel)
- Passwords hashed with bcrypt (12 rounds)
- JWT stored in HttpOnly cookie (NOT localStorage)
- Rate limiting (10 req/min per IP)
- Input validation on both client and server
- SQL injection prevention (Drizzle ORM)
- XSS prevention (React automatic escaping)

#### API Response Format

**Success (201 Created):**
```json
{
  "id": 123,
  "email": "user@example.com",
  "name": "Max Mustermann",
  "role": "member",
  "isUsvVerified": false,
  "createdAt": "2025-01-15T10:00:00Z"
}
```

**Error (409 Conflict - Duplicate Email):**
```json
{
  "type": "https://urc-falke.app/errors/email-already-exists",
  "title": "Email bereits registriert",
  "status": 409,
  "detail": "Ein Benutzer mit dieser Email existiert bereits.",
  "instance": "/api/v1/auth/register"
}
```

**Error (400 Bad Request - Validation):**
```json
{
  "type": "https://urc-falke.app/errors/validation-error",
  "title": "Validierungsfehler",
  "status": 400,
  "detail": "Die eingegebenen Daten sind ungültig.",
  "instance": "/api/v1/auth/register",
  "errors": [
    {
      "path": ["password"],
      "message": "Passwort muss mindestens 8 Zeichen lang sein"
    }
  ]
}
```

---

### Architecture Compliance

#### Previous Story Learnings (Story 1.0 & 1.1)

**From Story 1.0 (Pre-Seed CLI Tool):**
- bcrypt rounds: 12 (NOT 10 as initially documented)
- Email validation: RFC 5322 simplified regex
- Error handling: Individual row processing, continue on errors
- Database fields: Use `snake_case` consistently
- Token generation: `crypto.randomBytes()` for cryptographic security
- Password hashing: `bcrypt.hash(password, 12)` synchronous approach
- Database imports: Use relative paths for scripts (`../../../../packages/shared/src/db/schema/users.js`)

**From Story 1.1 (Monorepo Foundation):**
- Turborepo monorepo structure established
- Drizzle ORM connected to NeonDB
- TypeScript project references configured
- Users table schema complete with ALL 17 columns
- Testing infrastructure set up (Vitest)
- Dev servers configured (ports 5173, 3000)

**Git Commit Patterns (Last 5 Commits):**
```
021534a - Code review fixes (integration tests, validation improvements)
2bfad1c - Story 1.0 complete implementation (CLI tool)
6edd778 - Automatic database migrations on Vercel
769486c - TypeScript composite:true fix
34d0d1c - Vercel package name correction
```

**Key Learnings:**
1. Always add `.gitignore` for test data (apps/api/.gitignore)
2. Create integration tests alongside unit tests
3. Use try-catch for error-prone operations (token generation)
4. Make paths configurable (output path via CLI options)
5. Document architectural decisions in code comments
6. Update File List in story after code changes
7. Use relative imports for cross-workspace dependencies in scripts

---

### Library/Framework Requirements

#### Backend Libraries

**jose 6.1.3 (JWT):**
```typescript
import { SignJWT, jwtVerify } from 'jose';

// Sign token
const token = await new SignJWT({ userId: 123, role: 'member' })
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime('15m')
  .setIssuedAt()
  .sign(secret);

// Verify token
const { payload } = await jwtVerify(token, secret);
```

**bcrypt 5.1.1 (Password Hashing):**
```typescript
import bcrypt from 'bcrypt';

// Hash password (12 rounds)
const hash = await bcrypt.hash(password, 12);

// Verify password
const isValid = await bcrypt.compare(password, hash);
```

**Zod 3.24+ (Validation):**
```typescript
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

// Validate
schema.parse(data); // Throws on invalid
```

**express-rate-limit (Rate Limiting):**
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10
});

router.post('/register', limiter, handler);
```

#### Frontend Libraries

**react-hook-form (Form Management):**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(signupSchema)
});
```

**TanStack Query 5.90.12 (API Calls):**
```typescript
import { useMutation } from '@tanstack/react-query';

const mutation = useMutation({
  mutationFn: registerUser,
  onSuccess: (user) => { /* redirect */ }
});
```

**Radix UI (Accessible Components):**
```typescript
import * as Form from '@radix-ui/react-form';
import * as Label from '@radix-ui/react-label';

// Form primitives with WCAG 2.1 AA compliance
```

---

### File Structure Requirements

**Backend Files Created:**
```
apps/api/src/
├── lib/
│   ├── jwt.ts                    # JWT signing/verification
│   ├── jwt.test.ts
│   ├── password.ts               # Password hashing
│   └── password.test.ts
├── middleware/
│   ├── validate.middleware.ts    # Zod validation
│   ├── validate.middleware.test.ts
│   ├── rate-limit.middleware.ts  # Rate limiting
│   └── rate-limit.middleware.test.ts
├── services/
│   ├── auth.service.ts           # Registration logic
│   └── auth.service.test.ts
└── routes/
    ├── auth.routes.ts            # Registration endpoint
    └── auth.routes.test.ts
```

**Frontend Files Created:**
```
apps/web/src/features/auth/
├── components/
│   ├── SignupForm.tsx            # Registration form
│   └── SignupForm.test.tsx
├── hooks/
│   ├── useRegister.ts            # Registration mutation
│   └── useRegister.test.ts
├── services/
│   ├── auth.service.ts           # API client
│   └── auth.service.test.ts
└── register.e2e.test.ts          # End-to-end test
```

**Shared Files Created:**
```
packages/shared/src/schemas/
└── auth.schema.ts                # Zod validation schemas
```

---

### Testing Requirements

#### Unit Tests

**Backend:**
- `apps/api/src/lib/password.test.ts` - Password hashing/verification
- `apps/api/src/lib/jwt.test.ts` - JWT signing/verification
- `apps/api/src/services/auth.service.test.ts` - Registration logic
- `apps/api/src/middleware/validate.middleware.test.ts` - Validation
- `apps/api/src/middleware/rate-limit.middleware.test.ts` - Rate limiting

**Frontend:**
- `apps/web/src/features/auth/components/SignupForm.test.tsx` - Form validation, submission
- `apps/web/src/features/auth/hooks/useRegister.test.ts` - Registration mutation
- `apps/web/src/features/auth/services/auth.service.test.ts` - API calls

#### Integration Tests

**Backend:**
- `apps/api/src/routes/auth.routes.test.ts` - Full API endpoint testing
  - Successful registration returns 201
  - Duplicate email returns 409
  - Invalid data returns 400
  - JWT cookie is set correctly
  - Rate limiting works

**Frontend:**
- `apps/web/src/features/auth/register.e2e.test.ts` - End-to-end flow
  - Complete registration flow
  - Redirect to /events
  - JWT cookie verification
  - Error handling

#### Test Coverage Goals

- Backend services: > 90%
- Frontend components: > 80%
- Integration tests: Critical paths covered
- All acceptance criteria validated

---

### Critical Success Factors

**1. Security First:**
- bcrypt with 12 rounds (NOT 10)
- JWT in HttpOnly cookies (NOT localStorage)
- Rate limiting (10 req/min)
- Input validation (client + server)
- HTTPS only (Vercel automatic)

**2. Accessibility (WCAG 2.1 AA):**
- All inputs have ARIA labels
- Error messages announced to screen readers
- 44x44px minimum touch targets
- 4.5:1 color contrast ratio
- Keyboard navigation with visible focus indicators

**3. Two-Track Onboarding:**
- This story implements Track B (New Members)
- Track A (Existing Members with QR code) is separate story
- Database schema supports both tracks
- No conflicts with pre-seeded users (Story 1.0)

**4. Code Quality:**
- Co-located tests (test files next to source)
- Shared validation schemas (packages/shared)
- RFC 7807 error responses
- Type-safe API responses (Drizzle types)

**5. Performance:**
- JWT expiry: 15 minutes (balance security/UX)
- Rate limiting prevents brute force
- Optimistic UI updates (TanStack Query)
- Lazy loading for routes (TanStack Router)

---

## Implementation Guidance

### Getting Started

**Prerequisites:**
- Story 1.1 (Monorepo Foundation) MUST be complete
- Database migration applied (`pnpm db:push`)
- Dev servers running (`pnpm turbo dev`)

**Installation Order:**
1. Task 1: Create shared validation schemas
2. Task 2-3: Create backend utilities (password, JWT)
3. Task 4: Create registration service
4. Task 5-6: Create middleware (validation, rate limiting)
5. Task 7: Create API endpoint
6. Task 8-11: Create frontend components
7. Task 12: Integration testing

**Estimated Total Time:** 8-10 hours

---

### Development Order

**Phase 1: Backend Foundation (Tasks 1-3)**
- Create shared Zod schemas
- Implement password hashing utility
- Implement JWT utility
- Write unit tests for utilities

**Phase 2: Backend Service Layer (Tasks 4-7)**
- Implement registration service logic
- Create validation middleware
- Create rate limiting middleware
- Create registration API endpoint
- Write integration tests

**Phase 3: Frontend Components (Tasks 8-11)**
- Create registration form component
- Create registration hook (TanStack Query)
- Create auth service (API client)
- Create registration page route
- Write component tests

**Phase 4: Integration & Verification (Task 12)**
- Write end-to-end tests
- Verify all acceptance criteria
- Test accessibility compliance
- Test security (rate limiting, HTTPS, etc.)
- Manual testing checklist

---

### Common Pitfalls & Solutions

**Pitfall 1: JWT Not Persisting Across Requests**
- **Symptom:** User logged out on page refresh
- **Solution:** Ensure `credentials: 'include'` in fetch requests, verify cookie settings

**Pitfall 2: Password Validation Too Weak**
- **Symptom:** Users can create weak passwords
- **Solution:** Add regex for uppercase, lowercase, numbers in Zod schema

**Pitfall 3: Form Validation Not Accessible**
- **Symptom:** Screen reader doesn't announce errors
- **Solution:** Use `role="alert"` and `aria-describedby` for error messages

**Pitfall 4: Rate Limiting Not Working**
- **Symptom:** Multiple rapid registration attempts succeed
- **Solution:** Verify express-rate-limit middleware is applied BEFORE route handler

**Pitfall 5: Duplicate Email Check Race Condition**
- **Symptom:** Two simultaneous registrations create duplicate emails
- **Solution:** Database unique constraint on email column (already in schema)

**Pitfall 6: TypeScript Type Errors**
- **Symptom:** `User` type doesn't match API response
- **Solution:** Import types from `@urc-falke/shared/db`, ensure snake_case → camelCase conversion

---

## References

**Story Source:**
- [docs/epics.md - Lines 754-792] Story 1.2 complete specification

**Architecture:**
- [docs/architecture.md - Authentication section] JWT, bcrypt, security patterns
- [docs/architecture.md - API Patterns] REST conventions, error responses
- [docs/architecture.md - Frontend Architecture] React patterns, TanStack Query

**Project Context:**
- [docs/project_context.md - Security Rules] Password hashing, JWT storage
- [docs/project_context.md - Naming Conventions] snake_case DB, camelCase code
- [docs/project_context.md - Accessibility Requirements] WCAG 2.1 AA

**Related Stories:**
- [docs/sprint-artifacts/1-0-pre-seed-existing-urc-falke-members-admin-tool.md] Story 1.0 (Track A)
- [docs/sprint-artifacts/1-1-monorepo-foundation-and-basic-user-schema.md] Story 1.1 (Foundation)

**External Documentation:**
- [jose Documentation](https://github.com/panva/jose)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [Zod Documentation](https://zod.dev/)
- [react-hook-form Documentation](https://react-hook-form.com/)
- [Radix UI Forms](https://www.radix-ui.com/docs/primitives/components/form)

---

## Dev Agent Record

### Context Reference

**Epic Context:** Epic 1 - User Onboarding & Authentication (11 stories)
**Story Position:** 2nd story in epic (after Story 1.1 Monorepo Foundation)
**Dependencies:** Story 1.1 MUST be complete before starting

### Agent Model Used

Claude Sonnet 4.5

### Completion Notes List

**Story Creation Phase (2025-12-22):**
- Comprehensive analysis of Epic 1 Story 1.2 from docs/epics.md
- Full architecture review for authentication patterns
- Complete project_context.md analysis for security and naming conventions
- UX design specification review for WCAG 2.1 AA requirements
- Previous story analysis (1.0, 1.1) for learnings and patterns
- Git commit analysis for recent work patterns
- All 5 acceptance criteria mapped to 12 detailed tasks
- Backend, frontend, and shared package tasks organized
- Security requirements documented (bcrypt 12 rounds, JWT HttpOnly cookies)
- Accessibility requirements specified (WCAG 2.1 AA)
- Testing requirements defined (unit, integration, e2e)
- File structure and naming conventions documented
- Dependencies identified and versions specified
- Story marked as **ready-for-dev**

**Key Implementation Details:**
- Registration implements Track B of Two-Track Onboarding (new members)
- Password hashing: bcrypt with 12 rounds (learned from Story 1.0)
- JWT storage: HttpOnly cookies with 15-minute expiry
- Rate limiting: 10 requests/minute per IP
- Validation: Shared Zod schemas (client + server)
- Accessibility: Radix UI primitives, WCAG 2.1 AA compliance
- Error responses: RFC 7807 Problem Details format
- Database: Uses existing `users` table from Story 1.1

**Critical Success Factors:**
- All security patterns followed (no localStorage for JWT)
- Accessibility compliance mandatory (WCAG 2.1 AA)
- Test coverage > 80% (unit + integration tests)
- German error messages for Austrian users
- Co-located tests (test files next to source)

### File List

**Created (Story Document):**
- `C:\Users\mario\Sources\dev\urc-falke\docs\sprint-artifacts\1-2-user-registration-with-email-and-password.md` - This comprehensive story file

**To Be Created (Implementation):**
- `packages/shared/src/schemas/auth.schema.ts` - Zod validation schemas
- `apps/api/src/lib/password.ts` - Password hashing utility
- `apps/api/src/lib/password.test.ts`
- `apps/api/src/lib/jwt.ts` - JWT signing/verification
- `apps/api/src/lib/jwt.test.ts`
- `apps/api/src/services/auth.service.ts` - Registration service
- `apps/api/src/services/auth.service.test.ts`
- `apps/api/src/middleware/validate.middleware.ts` - Zod validation
- `apps/api/src/middleware/validate.middleware.test.ts`
- `apps/api/src/middleware/rate-limit.middleware.ts` - Rate limiting
- `apps/api/src/routes/auth.routes.ts` - Registration endpoint
- `apps/api/src/routes/auth.routes.test.ts`
- `apps/web/src/features/auth/components/SignupForm.tsx` - Form component
- `apps/web/src/features/auth/components/SignupForm.test.tsx`
- `apps/web/src/features/auth/hooks/useRegister.ts` - TanStack Query hook
- `apps/web/src/features/auth/hooks/useRegister.test.ts`
- `apps/web/src/features/auth/services/auth.service.ts` - API client
- `apps/web/src/features/auth/services/auth.service.test.ts`
- `apps/web/src/routes/register.tsx` - Registration page
- `apps/web/src/features/auth/register.e2e.test.ts` - E2E tests

**Referenced (Already Exists):**
- `C:\Users\mario\Sources\dev\urc-falke\packages\shared\src\db\schema\users.ts` - Users table schema (Story 1.1)
- `C:\Users\mario\Sources\dev\urc-falke\apps\api\src\db\connection.ts` - Database connection (Story 1.1)
- `C:\Users\mario\Sources\dev\urc-falke\apps\api\src\server.ts` - Express server (Story 1.1)
- `C:\Users\mario\Sources\dev\urc-falke\docs\epics.md` - Story source
- `C:\Users\mario\Sources\dev\urc-falke\docs\architecture.md` - Architecture reference
- `C:\Users\mario\Sources\dev\urc-falke\docs\project_context.md` - Implementation rules
- `C:\Users\mario\Sources\dev\urc-falke\docs\sprint-artifacts\1-0-pre-seed-existing-urc-falke-members-admin-tool.md` - Related story
- `C:\Users\mario\Sources\dev\urc-falke\docs\sprint-artifacts\1-1-monorepo-foundation-and-basic-user-schema.md` - Prerequisite story

---

**Status:** ✅ ready-for-dev
**Created:** 2025-12-22
**Next Action:** Developer can start implementation with Task 1 (Shared Validation Schemas)
**Estimated Development Time:** 8-10 hours
