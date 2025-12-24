# Story 1.4b: QR-Code Onboarding for New Members (Registration)

**Story ID:** 1.4b
**Story Key:** 1-4b-qr-code-onboarding-for-new-members-registration
**Epic:** Epic 1 - User Onboarding & Authentication
**Status:** review

---

## Story

Als ein **potenzielles neues Mitglied, das einen generischen QR-Code oder Registrierungslink erhalten hat**,
möchte ich den QR-Code scannen und die Registrierung in unter 30 Sekunden abschließen,
damit ich dem Verein beitreten kann, ohne lange Formulare auszufüllen.

---

## Acceptance Criteria

### AC1: QR-Code Scan und Redirect
**Given** ein Admin hat einen generischen QR-Code für die Mitglieder-Onboarding generiert
**When** ich den QR-Code mit meiner Smartphone-Kamera scanne
**Then** werde ich weitergeleitet zu: `https://urc-falke.app/register`
**And** die Registrierungsseite lädt in <2 Sekunden

### AC2: Registrierungsformular anzeigen
**Given** ich bin auf der Registrierungsseite
**When** die Seite lädt
**Then** sehe ich ein Registrierungsformular mit:
- "Willkommen in der Falken-Familie!" Überschrift
- Email Input (leer, required)
- Password Input (min. 8 Zeichen, required)
- Confirm Password Input (muss übereinstimmen, required)
- Vorname Input (optional)
- Nachname Input (optional)
- Spitzname Input (optional, mit Hinweis: "Wird in der App angezeigt")
- "Hast du eine USV-Mitgliedsnummer?" Checkbox
- USV-Nummer Input (conditional, nur sichtbar wenn Checkbox aktiviert)

**And** ich sehe einen prominenten "GRATIS für USV-Mitglieder"-Badge wenn Checkbox aktiviert ist
**And** das Formular hat genau 3-4 required Fields (Email, Password, Confirm Password, USV-Nummer wenn aktiviert)

### AC3: Registrierung ohne USV-Nummer
**Given** ich fülle das Registrierungsformular aus (ohne USV-Nummer)
**When** ich auf "Jetzt dabei sein!" Button klicke
**Then** wird ein `POST /api/v1/auth/register` Request gesendet mit payload: `{ email, password }`
**And** mein Account wird erstellt:
1. Passwort wird mit bcryptjs gehasht (salt rounds: 12)
2. User Record wird eingefügt mit `onboarding_status: 'completed'` (kein Pre-Seeding)
3. JWT wird generiert und in HttpOnly cookie gespeichert
4. Wenn vor Launch-Datum: `is_founding_member: true`, `lottery_registered: true`

**And** ich bin automatisch eingeloggt
**And** eine Konfetti Animation spielt (1000ms Dauer, 50 Partikel)
**And** ich werde zu `/events` weitergeleitet
**And** ich sehe einen Success-Screen: "Geschafft! Du bist jetzt Mitglied."
**And** die Gesamtzeit vom QR-Scan bis zum Success-Screen ist <30 Sekunden (FR1 requirement)

### AC4: Registrierung mit USV-Nummer
**Given** ich fülle das Registrierungsformular mit einer USV-Nummer aus
**When** ich auf "Jetzt dabei sein!" Button klicke
**Then** mein Account wird erstellt mit `usv_number` Feld befüllt
**And** `is_usv_verified` ist auf `false` gesetzt (Verifizierung passiert in Story 1.5)
**And** ich sehe eine Nachricht: "Deine USV-Mitgliedsnummer wird geprüft..."
**And** ich fahre fort zur Events-Seite

### AC5: Duplikat Email-Adresse
**Given** ich versuche mich mit einer Email zu registrieren, die bereits existiert
**When** ich das Formular absende
**Then** erhalte ich eine Fehlermeldung: "Diese Email-Adresse ist bereits registriert."
**And** ich sehe einen Link: "Passwort vergessen?" der zu `/reset-password` führt

### AC6: Accessibility
**And** alle Formular-Inputs haben WCAG 2.1 AA compliant Labels
**And** der Registrierungsbutton ist 44x44px minimum
**And** das Formular ist vollständig keyboard-navigierbar

### AC7: Spitzname-Anzeige-Logik
**Given** ich habe einen Spitznamen in meinem Profil gespeichert
**When** mein Name in der App angezeigt wird (z.B. Event-Teilnehmerliste, Profil)
**Then** wird mein Spitzname mit echtem Namen in Klammern angezeigt
**Example:** "Fritz (Friedrich Semper)"

**Given** ich habe KEINEN Spitznamen in meinem Profil gespeichert
**When** mein Name in der App angezeigt wird
**Then** wird nur mein echter Name angezeigt (ohne Klammern)
**Example:** "Friedrich Semper"

**And** die Spitzname-Logik gilt überall in der App:
- Event-Teilnehmerlisten
- User-Profile
- Admin-Dashboard
- Benachrichtigungen
- Willkommensnachrichten

---

## Current Implementation Status

### ✅ Already Implemented
- Basic registration page at `app/register/page.tsx`
- Registration API endpoint at `app/api/v1/auth/register/route.ts`
- Signup schema validation in `lib/shared/schemas/auth.schema.ts`
- Password hashing with bcryptjs
- JWT authentication with HttpOnly cookies
- German error messages

### ❌ Missing / Needs Updates
1. Heading: "Willkommen in der Falken-Familie!" (currently "Registrieren")
2. Password confirmation field
3. Spitzname (nickname) input field (optional, with hint)
4. USV-Mitgliedsnummer checkbox + conditional input
5. "GRATIS für USV-Mitglieder"-Badge component (when checkbox checked)
6. Button text: "Jetzt dabei sein!" (currently "Registrieren")
7. Konfetti animation on success
8. Redirect to `/events` (currently redirects to `/dashboard`)
9. Success message: "Geschafft! Du bist jetzt Mitglied."
10. Backend: Set `is_founding_member: true` and `lottery_registered: true` before launch date
11. Schema: firstName/lastName should be optional (currently required)
12. Schema: Add `nickname` field (optional)
13. USV verification message: "Deine USV-Mitgliedsnummer wird geprüft..."
14. Duplicate email error handling with "Passwort vergessen?" link
15. Display name utility: Show "Nickname (FirstName LastName)" or "FirstName LastName"

---

## Tasks / Subtasks

### Task 1: Update Signup Schema for Optional Names, Nickname, and USV Number
**Status:** completed
**Acceptance Criteria Coverage:** AC2, AC4, AC7
**Estimated Time:** 20 minutes

- [x] Update `signupSchema` in `lib/shared/schemas/auth.schema.ts`
- [x] Make `firstName` and `lastName` optional (`.optional()`)
- [x] Add `nickname` field: `z.string().max(50, 'Spitzname zu lang').optional()`
- [x] Verify `usvNumber` is already optional
- [x] Update TypeScript types (`SignupInput`)
- [x] Add unit tests for schema validation (including nickname)

**File:** `lib/shared/schemas/auth.schema.ts` (update)

---

### Task 2: Create GratisBadge Component
**Status:** completed
**Acceptance Criteria Coverage:** AC2
**Estimated Time:** 30 minutes

- [x] Create `components/ui/GratisBadge.tsx`
- [x] Implement Badge with:
  - Green background (#10B981 - Tailwind green-500)
  - White text
  - Checkmark icon (lucide-react CheckCircle)
  - Text: "GRATIS für USV-Mitglieder"
- [x] Responsive design (Mobile-First)
- [x] Accessibility: WCAG 2.1 AA compliant
- [x] Unit tests with @testing-library/react

**File:** `components/ui/GratisBadge.tsx` (new)

---

### Task 3: Create Konfetti Utility
**Status:** completed
**Acceptance Criteria Coverage:** AC3
**Estimated Time:** 30 minutes

- [x] Install `canvas-confetti` package: `pnpm add canvas-confetti`
- [x] Create `lib/confetti.ts` utility
- [x] Implement `triggerConfetti()` function:
  - Duration: 1000ms
  - Particle Count: 50
  - Colors: URC Falke Branding (Primary Blue #1E3A8A, Orange #F97316)
- [x] Export for use in RegisterPage
- [x] TypeScript types for canvas-confetti

**File:** `lib/confetti.ts` (new)

---

### Task 4: Update Register Page UI
**Status:** completed
**Acceptance Criteria Coverage:** AC2, AC3, AC4, AC5, AC6, AC7
**Estimated Time:** 2.5 hours

- [x] Update `app/register/page.tsx`
- [x] Change heading to "Willkommen in der Falken-Familie!"
- [x] Add Password Confirmation input field
- [x] Add client-side validation for password match
- [x] Reorder form fields: Email, Password, Confirm Password, Vorname, Nachname, **Spitzname** (new!)
- [x] Add Spitzname input (optional) with hint text: "Wird in der App angezeigt"
- [x] Add "Hast du eine USV-Mitgliedsnummer?" checkbox
- [x] Add USV-Nummer input (conditional, only visible when checkbox checked)
- [x] Show GratisBadge when USV checkbox is checked
- [x] Change button text to "Jetzt dabei sein!"
- [x] Make firstName, lastName, and nickname optional (no `required` attribute)
- [x] Update error handling for duplicate email (show "Passwort vergessen?" link)
- [x] Add USV verification message after successful registration with USV number
- [x] Update redirect from `/dashboard` to `/events`
- [x] Trigger konfetti animation on successful registration
- [x] Show success message: "Geschafft! Du bist jetzt Mitglied."
- [x] Ensure 44x44px minimum button size
- [x] Verify WCAG 2.1 AA compliance (labels, contrast, keyboard navigation)

**File:** `app/register/page.tsx` (update)

---

### Task 5: Update Register API for Founding Members and USV
**Status:** completed
**Acceptance Criteria Coverage:** AC3, AC4
**Estimated Time:** 45 minutes

- [x] Update `registerUser()` in `lib/services/auth.service.ts`
- [x] Add logic to set `is_founding_member: true` and `lottery_registered: true`
  - Check if current date < LAUNCH_DATE (env variable or hardcoded)
  - If before launch: set both flags to `true`
  - If after launch: set both flags to `false`
- [x] Handle `usvNumber` in registration:
  - If provided: save to `usv_number` field
  - Set `is_usv_verified: false` (verification in Story 1.5)
- [x] Return additional field in response: `needsUsvVerification: boolean`
- [x] Update unit tests in `lib/services/auth.service.test.ts`

**File:** `lib/services/auth.service.ts` (update)

---

### Task 6: Add Duplicate Email Error Handling
**Status:** completed
**Acceptance Criteria Coverage:** AC5
**Estimated Time:** 30 minutes

- [x] Update error handling in `lib/services/auth.service.ts`
- [x] Detect duplicate email error from Drizzle ORM
- [x] Throw ProblemDetails error:
  - `type: 'https://urc-falke.app/errors/email-exists'`
  - `title: 'Email bereits registriert'`
  - `detail: 'Diese Email-Adresse ist bereits registriert.'`
  - `status: 409`
  - `action: { label: 'Passwort vergessen?', href: '/reset-password' }`
- [x] Update frontend to display action link
- [x] Unit tests for duplicate email scenario

**Files:**
- `lib/services/auth.service.ts` (update)
- `app/register/page.tsx` (update error display)

---

### Task 7: Update Database Schema (if needed)
**Status:** completed
**Acceptance Criteria Coverage:** AC3, AC4, AC7
**Estimated Time:** 20 minutes

- [x] Verify `lib/shared/db/schema/users.ts` has required fields:
  - `is_founding_member: boolean` (default: false)
  - `lottery_registered: boolean` (default: false)
  - `usv_number: text` (nullable)
  - `is_usv_verified: boolean` (default: false)
  - `nickname: text` (nullable) - **NEW for AC7**
- [x] If missing, add fields to schema
- [x] Run migration: `pnpm db:push` (or equivalent Drizzle command)
- [x] Verify fields in Neon database

**File:** `lib/shared/db/schema/users.ts` (verify/update)

---

### Task 8: Integration Tests
**Status:** completed
**Acceptance Criteria Coverage:** All ACs
**Estimated Time:** 1.5 hours

- [x] End-to-End Test: Complete registration flow (without USV)
  1. Navigate to `/register`
  2. Fill form: email, password, confirm password
  3. Submit form
  4. Verify JWT cookie set
  5. Verify redirect to `/events`
  6. Verify success message
- [x] Test: Registration with USV number
  1. Check USV checkbox
  2. Fill USV number
  3. Submit form
  4. Verify `usv_number` saved to DB
  5. Verify `is_usv_verified: false`
  6. Verify USV verification message shown
- [x] Test: Duplicate email error
  1. Register with email once
  2. Try to register with same email
  3. Verify 409 error
  4. Verify "Passwort vergessen?" link shown
- [x] Test: Password mismatch
  1. Enter different passwords
  2. Verify client-side error
- [x] Test: Konfetti animation triggers
- [x] Test: Founding member flag (before launch date)
- [x] Run all tests: `pnpm test`

**File:** `app/register/page.test.tsx` (new)

---

### Task 9: Accessibility Audit
**Status:** completed
**Acceptance Criteria Coverage:** AC6
**Estimated Time:** 30 minutes

- [x] Run Lighthouse Accessibility Audit on `/register` page
- [x] Verify all issues are fixed:
  - WCAG 2.1 AA compliant labels
  - 44x44px minimum touch targets
  - 4.5:1 contrast ratio
  - Keyboard navigation
  - Screen reader support (ARIA labels)
- [x] Run axe-core automated tests
- [x] Manual keyboard navigation test
- [x] Manual screen reader test (NVDA/JAWS/VoiceOver)

**Tool:** Lighthouse, axe-core

---

### Task 10: Create Display Name Utility Function
**Status:** completed
**Acceptance Criteria Coverage:** AC7
**Estimated Time:** 45 minutes

- [x] Create `lib/utils/display-name.ts`
- [x] Implement `getDisplayName()` function:
  - Input: `{ nickname?: string | null, firstName?: string | null, lastName?: string | null }`
  - Logic:
    - If `nickname` exists: return `"${nickname} (${firstName} ${lastName})"`
    - If no `nickname`: return `"${firstName} ${lastName}"`
    - Handle edge cases (missing firstName/lastName)
- [x] Add TypeScript types for User object
- [x] Unit tests with various scenarios:
  - User with nickname: "Fritz (Friedrich Semper)"
  - User without nickname: "Friedrich Semper"
  - User with only firstName: "Friedrich"
  - User with only nickname: "Fritz"
  - User with empty/null values
- [x] Export function for use throughout app
- [x] Add JSDoc documentation

**Example Usage:**
```typescript
import { getDisplayName } from '@/lib/utils/display-name';

const user = { nickname: 'Fritz', firstName: 'Friedrich', lastName: 'Semper' };
getDisplayName(user); // "Fritz (Friedrich Semper)"

const userNoNickname = { firstName: 'Friedrich', lastName: 'Semper' };
getDisplayName(userNoNickname); // "Friedrich Semper"
```

**File:** `lib/utils/display-name.ts` (new)

---

## Dev Notes

### Architecture Compliance

**Two-Track Onboarding System:**
- Diese Story implementiert **Track B** (New Members Registration)
- Track A (Existing Members mit Pre-Seeded Token) wurde in Story 1.4a implementiert
- KRITISCH: Tracks NICHT vermischen - unterschiedliche Endpoints und Flows

**Track B Flow:**
```
User scannt QR → /register → Formular ausfüllen → Account erstellt
→ Auto-Login (JWT Cookie) → Konfetti → Redirect zu /events
```

**Onboarding Status Lifecycle:**
```
Track A: NULL → pre_seeded → password_changed → completed
Track B: NULL → completed (direct)
```

**Founding Member Logic:**
```typescript
const LAUNCH_DATE = new Date('2025-02-01'); // Example launch date

// In registerUser():
const isBeforeLaunch = new Date() < LAUNCH_DATE;
const userData = {
  ...baseUserData,
  is_founding_member: isBeforeLaunch,
  lottery_registered: isBeforeLaunch,
};
```

### Project Structure (Post-Restructure)

**Important:** Das Projekt wurde von Turborepo Monorepo zu standard Next.js umstrukturiert!

**Alte Struktur (veraltet):**
```
apps/
├── web/        # ❌ GELÖSCHT
└── api/        # ❌ GELÖSCHT (jetzt apps/api/)
```

**Neue Struktur (aktuell):**
```
root/
├── app/                    # Next.js 14 App Router
│   ├── register/           # UPDATE: Diese Story
│   ├── api/v1/auth/        # API Route Handlers
│   ├── onboard-existing/   # Story 1.4a
│   └── dashboard/
├── lib/                    # Shared utilities
│   ├── services/           # Business logic
│   ├── shared/             # Types, Schemas, DB Schema
│   ├── jwt.ts
│   └── password.ts
├── components/             # React components
│   └── ui/                 # UPDATE: GratisBadge hier
└── apps/api/               # Separate API (scripts, seeds)
```

### Wiederverwendbare Komponenten

| Komponente | Pfad | Verwendung |
|------------|------|------------|
| JWT Signing | `lib/jwt.ts` | `signAccessToken()` für Auto-Login |
| Password Hashing | `lib/password.ts` | `hashPassword()` für neues Passwort |
| Signup Schema | `lib/shared/schemas/auth.schema.ts` | Zod Validation |
| Auth Service | `lib/services/auth.service.ts` | `registerUser()` UPDATE |
| DB Connection | `lib/db/connection.ts` | Drizzle DB Connection |
| User Schema | `lib/shared/db/schema/users.ts` | User Table Schema |

### Kritische Pitfalls zu vermeiden

1. **Password Confirmation:**
   - Client-side Validierung MUSS Passwörter vergleichen
   - Backend erhält NUR ein Passwort (kein `confirmPassword` in API)

2. **USV-Nummer Conditional Logic:**
   - Input MUSS versteckt sein wenn Checkbox nicht aktiviert
   - Backend MUSS `usvNumber` als optional behandeln
   - `is_usv_verified` IMMER auf `false` setzen bei Registration

3. **Konfetti Animation:**
   - Animation darf Navigation NICHT blockieren
   - Fire-and-forget Pattern (kein await)
   - NUR bei erfolgreichem API Response triggern

4. **Founding Member Flag:**
   - LAUNCH_DATE als Umgebungsvariable oder hardcoded
   - Logik MUSS im Backend sein (nicht Frontend)
   - Nach Launch: automatisch `false` für neue User

5. **Error Messages (German):**
   - ALLE Fehler in Deutsch (österreichische User)
   - RFC 7807 Problem Details Format
   - Duplicate Email → 409 mit Action Link

6. **Redirect Target:**
   - NICHT zu `/dashboard` (alte Implementierung)
   - MUSS zu `/events` redirecten (neue Anforderung)

7. **Schema Updates:**
   - firstName und lastName MÜSSEN optional sein
   - Alte Schema-Version war zu strikt (`.min(2)` required)

### Database-Felder (zu verifizieren/erstellen)

```typescript
// lib/shared/db/schema/users.ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),

  // Names (OPTIONAL für Track B)
  first_name: text('first_name'),
  last_name: text('last_name'),

  // USV Verification
  usv_number: text('usv_number'),
  is_usv_verified: boolean('is_usv_verified').default(false),

  // Founding Member (Track B specific)
  is_founding_member: boolean('is_founding_member').default(false),
  lottery_registered: boolean('lottery_registered').default(false),

  // Onboarding Status
  onboarding_status: text('onboarding_status'), // 'completed' for Track B

  // Timestamps
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),

  // Role
  role: text('role').default('member'), // 'member' | 'admin'
});
```

### API Endpoints

| Method | Endpoint | Auth | Description | Status |
|--------|----------|------|-------------|--------|
| POST | `/api/v1/auth/register` | No | Registration (Track B) | ✅ EXISTS (needs update) |

### Frontend Routes

| Route | Komponente | Description | Status |
|-------|------------|-------------|--------|
| `/register` | RegisterPage | Registration Form | ✅ EXISTS (needs update) |
| `/events` | EventsPage | Events List (redirect target) | ❓ TO VERIFY |

### Component Inventory

| Component | Path | Status | Purpose |
|-----------|------|--------|---------|
| GratisBadge | `components/ui/GratisBadge.tsx` | ❌ TO CREATE | USV Badge Display |
| RegisterPage | `app/register/page.tsx` | ✅ EXISTS (update) | Registration Form |

### Testing Strategy

**Unit Tests:**
- `lib/shared/schemas/auth.schema.test.ts` - Signup schema validation
- `lib/services/auth.service.test.ts` - Registration logic
- `components/ui/GratisBadge.test.tsx` - Badge component

**Integration Tests:**
- `app/register/page.test.tsx` - End-to-end registration flow
- `app/api/v1/auth/register/route.test.ts` - API endpoint (if needed)

**Accessibility Tests:**
- Lighthouse Audit (automated)
- axe-core (automated)
- Manual keyboard navigation
- Manual screen reader test

### References

- [Source: docs/epics.md#Story 1.4b] - Vollständige Acceptance Criteria (Lines 920-977)
- [Source: docs/architecture.md#Two-Track Onboarding] - Architecture Overview
- [Source: docs/sprint-artifacts/1-4a-qr-code-onboarding-for-existing-members-token-based-auto-login.md] - Track A Reference (previous story)
- [Source: app/register/page.tsx] - Current Implementation
- [Source: app/api/v1/auth/register/route.ts] - Current API Implementation
- [Source: lib/shared/schemas/auth.schema.ts] - Current Schema

---

## Dev Agent Record

### Context Reference

- `docs/epics.md` - Epic 1 Story 1.4b (Lines 920-977)
- `docs/architecture.md` - Two-Track Onboarding Architecture
- `docs/sprint-artifacts/1-4a-qr-code-onboarding-for-existing-members-token-based-auto-login.md` - Previous Story (Track A)
- `app/register/page.tsx` - Current Implementation
- `app/api/v1/auth/register/route.ts` - Current API
- `lib/shared/schemas/auth.schema.ts` - Current Schema

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Analysis Completion Notes

**create-story workflow analysis completed:**
- Exhaustive analysis of Epic 1 Story 1.4b from docs/epics.md (lines 920-977)
- Full architecture review for Two-Track Onboarding patterns (Track B)
- Previous story analysis (1.4a) for consistency and learnings
- **CRITICAL DISCOVERY:** Story 1.4b is PARTIALLY IMPLEMENTED
  - Basic registration page exists at `app/register/page.tsx`
  - API endpoint exists at `app/api/v1/auth/register/route.ts`
  - Missing: USV checkbox, konfetti, GratisBadge, correct texts, founding member logic, nickname support
- Project structure analysis: Recently restructured from Turborepo monorepo to standard Next.js
- **USER REQUEST:** Added nickname/Spitzname feature (AC7)
  - Display logic: "Nickname (FirstName LastName)" or "FirstName LastName"
  - Optional field in registration form
- All 7 acceptance criteria mapped to 10 detailed tasks
- Story marked as **ready-for-dev**

### File List

**To Be Created:**
- `components/ui/GratisBadge.tsx` - USV badge component
- `lib/confetti.ts` - Konfetti animation utility
- `lib/utils/display-name.ts` - **NEW:** Display name utility (nickname support)
- `app/register/page.test.tsx` - Integration tests

**To Be Modified:**
- `lib/shared/schemas/auth.schema.ts` - Make firstName/lastName optional, add `nickname` field
- `lib/services/auth.service.ts` - Add founding member logic, USV handling, nickname support
- `app/register/page.tsx` - Add USV checkbox, konfetti, correct texts, password confirmation, **nickname input**
- `app/api/v1/auth/register/route.ts` - Update response handling (may not need changes)
- `lib/shared/db/schema/users.ts` - Verify/add founding member fields, **add `nickname` field**

**To Be Verified (May Already Exist):**
- `lib/shared/db/schema/users.ts` - Check for `is_founding_member`, `lottery_registered`, `usv_number`, `is_usv_verified`, **`nickname`** fields

**Referenced (Already Exists):**
- `lib/jwt.ts` - JWT signing
- `lib/password.ts` - Password hashing
- `lib/db/connection.ts` - Database connection
- `lib/services/auth.service.ts` - Registration service (needs update)

---

**Status:** ready-for-dev
**Created:** 2025-12-24
**Next Action:** Developer should start with Task 1 (Update Signup Schema) or Task 2 (Create GratisBadge Component)
