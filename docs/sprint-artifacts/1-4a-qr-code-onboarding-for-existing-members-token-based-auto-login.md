# Story 1.4a: QR-Code Onboarding for Existing Members (Token-Based Auto-Login)

**Story ID:** 1.4a
**Story Key:** 1-4a-qr-code-onboarding-for-existing-members-token-based-auto-login
**Epic:** Epic 1 - User Onboarding & Authentication
**Status:** ready-for-dev

---

## Story

Als ein **bestehendes URC Falke Mitglied, das einen QR-Code per Post erhalten hat**,
möchte ich meinen personalisierten QR-Code scannen und meinen Account schnell aktivieren,
damit ich die App in unter 15 Sekunden nutzen kann.

---

## Acceptance Criteria

### AC1: QR-Code Scan und Redirect
**Given** ich bin ein pre-seeded Mitglied (via Story 1.0) mit einem gültigen `onboarding_token`
**When** ich meinen personalisierten QR-Code mit meiner Smartphone-Kamera scanne
**Then** werde ich weitergeleitet zu: `https://urc-falke.app/onboard-existing?token={my_onboarding_token}`
**And** die Onboarding-Seite lädt in <2 Sekunden

### AC2: Token Validierung und Auto-Login
**Given** ich bin auf der Onboarding-Seite via meinem personalisierten Token
**When** die Seite lädt
**Then** validiert das Backend meinen Token durch Prüfung:
1. Token existiert in `users` Tabelle (`onboarding_token` Feld)
2. Token ist nicht abgelaufen (`onboarding_token_expires > NOW()`)
3. User hat `onboarding_status: 'pre_seeded'`

**And** wenn Token gültig ist, werde ich automatisch eingeloggt:
- JWT wird generiert mit `{ userId, email, role }`
- JWT wird in HttpOnly cookie gespeichert (`accessToken`)
- Ich werde sofort zu `/onboard-existing/set-password` weitergeleitet

### AC3: Passwort setzen
**Given** ich bin auf der `/onboard-existing/set-password` Seite
**When** die Seite lädt
**Then** sehe ich einen personalisierten Willkommens-Screen:
- "Willkommen zurück, {firstName}!" Überschrift
- "Bitte wähle ein neues Passwort für deinen Account." Text
- Neues Passwort Input (min. 8 Zeichen, required)
- Passwort bestätigen Input (muss übereinstimmen)
- "Passwort festlegen"-Button (44x44px, primary color)

**Given** ich gebe ein neues Passwort ein (min. 8 Zeichen) und Bestätigung stimmt überein
**When** ich auf "Passwort festlegen" klicke
**Then** wird ein `POST /api/v1/users/me/set-password` Request gesendet mit payload: `{ newPassword }`
**And** das Backend:
1. Hasht das neue Passwort mit bcrypt (salt rounds: 12)
2. Aktualisiert `password_hash` Feld
3. Setzt `must_change_password: false`
4. Setzt `onboarding_status: 'password_changed'`
5. Löscht `onboarding_token` und `onboarding_token_expires` (single-use Token)

**And** ich werde zu `/profile/complete` weitergeleitet
**And** ich sehe eine Erfolgsmeldung: "Passwort erfolgreich festgelegt!"

### AC4: Profil vervollständigen
**Given** ich bin auf `/profile/complete` (minimale Profil-Vervollständigung)
**When** die Seite lädt
**Then** sehe ich ein einfaches Formular mit:
- Vorname (aus CSV vorausgefüllt, editierbar)
- Nachname (aus CSV vorausgefüllt, editierbar)
- Telefon (optional, leer)
- "Hast du eine USV-Mitgliedsnummer?" Checkbox (vorausgewählt wenn `usv_number` aus CSV existiert)
- USV-Nummer Input (vorausgefüllt wenn existiert, editierbar)
- "Profil abschließen"-Button

**Given** ich überprüfe meine vorausgefüllten Informationen und füge optional Telefonnummer hinzu
**When** ich auf "Profil abschließen" klicke
**Then** wird ein `PATCH /api/v1/users/me/complete-profile` Request gesendet
**And** `onboarding_status` wird auf `'completed'` gesetzt
**And** eine Konfetti-Animation spielt (1000ms, 50 Partikel)
**And** ich werde zu `/events` (Haupt-App) weitergeleitet
**And** ich sehe eine Willkommensnachricht: "Geschafft! Du bist jetzt Teil der digitalen Falken-Familie."

**And** Gesamtzeit vom QR-Scan bis zur Events-Seite: <15 Sekunden (schneller als 30-Sekunden Ziel)

### AC5: Abgelaufener Token
**Given** mein `onboarding_token` ist abgelaufen (`onboarding_token_expires < NOW()`)
**When** ich versuche den QR-Code zu nutzen
**Then** sehe ich eine Fehlerseite:
- "Dein Aktivierungscode ist abgelaufen."
- "Bitte kontaktiere uns unter info@urc-falke.at für einen neuen Code."

### AC6: Bereits verwendeter Token
**Given** mein `onboarding_token` wurde bereits verwendet (`onboarding_status != 'pre_seeded'`)
**When** ich versuche den QR-Code erneut zu nutzen
**Then** werde ich zur Login-Seite (`/login`) weitergeleitet
**And** ich sehe eine Nachricht: "Du hast deinen Account bereits aktiviert. Bitte melde dich mit deinem Passwort an."

---

## Tasks / Subtasks

### Task 1: Onboard-Existing Schema und Service (Backend)
**Status:** pending
**Acceptance Criteria Coverage:** AC1, AC2
**Estimated Time:** 45 minutes

- [ ] Erstelle `onboardExistingSchema` in `packages/shared/src/schemas/auth.schema.ts`
- [ ] Definiere Zod Schema:
  - `token`: string().min(1, 'Token wird benötigt')
- [ ] Erstelle `onboardExistingUser` Funktion in `apps/api/src/services/auth.service.ts`
- [ ] Implementiere Token-Validierung:
  - Token existiert in DB (`onboarding_token` Feld)
  - Token nicht abgelaufen (`onboarding_token_expires > NOW()`)
  - User hat `onboarding_status: 'pre_seeded'`
- [ ] Bei gültigem Token:
  - Generiere JWT Token (wie bei Login)
  - Lade User-Daten für Response
  - Returniere `{ user, accessToken, redirectTo: '/onboard-existing/set-password' }`
- [ ] Fehlerbehandlung:
  - Token nicht gefunden → 404 "Token nicht gefunden"
  - Token abgelaufen → 410 "Token abgelaufen"
  - Token bereits verwendet → 409 "Account bereits aktiviert"
- [ ] Unit Tests in `apps/api/src/services/auth.service.test.ts`

**File:** `apps/api/src/services/auth.service.ts` (erweitern)

---

### Task 2: Onboard-Existing Route (Backend)
**Status:** pending
**Acceptance Criteria Coverage:** AC1, AC2
**Estimated Time:** 30 minutes

- [ ] Füge `POST /api/v1/auth/onboard-existing` Route hinzu
- [ ] Apply Rate Limiting (authRateLimiter)
- [ ] Apply Validation (validate(onboardExistingSchema))
- [ ] Call `onboardExistingUser()` Service
- [ ] Set JWT in HttpOnly Cookie
- [ ] Return Response mit `{ user, redirectTo }`
- [ ] Füge Route zu `apps/api/src/routes/auth.routes.ts` hinzu
- [ ] Integration Tests

**File:** `apps/api/src/routes/auth.routes.ts` (erweitern)

---

### Task 3: Set-Password Schema und Service (Backend)
**Status:** pending
**Acceptance Criteria Coverage:** AC3
**Estimated Time:** 45 minutes

- [ ] Erstelle `setPasswordSchema` in `packages/shared/src/schemas/auth.schema.ts`
- [ ] Definiere Zod Schema:
  - `newPassword`: string().min(8, 'Passwort muss mindestens 8 Zeichen haben')
- [ ] Erstelle `setPassword` Funktion in `apps/api/src/services/user.service.ts`
- [ ] Implementiere Logik:
  1. Hash Passwort mit bcrypt (12 rounds)
  2. Update `password_hash` in DB
  3. Set `must_change_password: false`
  4. Set `onboarding_status: 'password_changed'`
  5. Clear `onboarding_token` und `onboarding_token_expires`
- [ ] Return `{ success: true, redirectTo: '/profile/complete' }`
- [ ] Unit Tests in `apps/api/src/services/user.service.test.ts`

**File:** `apps/api/src/services/user.service.ts` (neu)

---

### Task 4: Set-Password und Complete-Profile Routes (Backend)
**Status:** pending
**Acceptance Criteria Coverage:** AC3, AC4
**Estimated Time:** 45 minutes

- [ ] Erstelle `apps/api/src/routes/user.routes.ts`
- [ ] Füge `POST /api/v1/users/me/set-password` Route hinzu
  - Requires Auth (requireAuth middleware)
  - ABER: Darf auch mit `must_change_password: true` aufgerufen werden!
  - Validate mit setPasswordSchema
- [ ] Füge `PATCH /api/v1/users/me/complete-profile` Route hinzu
  - Requires Auth
  - Validate mit completeProfileSchema
  - Update User-Felder: first_name, last_name, phone, usv_number
  - Set `onboarding_status: 'completed'`
- [ ] Register Routes in `apps/api/src/server.ts`
- [ ] Integration Tests

**File:** `apps/api/src/routes/user.routes.ts` (neu)

---

### Task 5: Auth Middleware Update für Set-Password Exception
**Status:** pending
**Acceptance Criteria Coverage:** AC3
**Estimated Time:** 20 minutes

- [ ] Update `requireAuth` Middleware in `auth.middleware.ts`
- [ ] KRITISCH: Exception für `/api/v1/users/me/set-password` Endpoint
  - Wenn `must_change_password: true` UND Request-Path ist `/api/v1/users/me/set-password`
  - DANN: Erlaube Request (kein 403)
  - SONST: Return 403 wie bisher
- [ ] Alternative: Neue Middleware `requireAuthAllowPasswordChange`
- [ ] Update Tests in `auth.middleware.test.ts`

**File:** `apps/api/src/middleware/auth.middleware.ts` (update)

---

### Task 6: Onboard-Existing Frontend Route
**Status:** pending
**Acceptance Criteria Coverage:** AC1, AC2, AC5, AC6
**Estimated Time:** 1 hour

- [ ] Erstelle `apps/web/src/routes/onboard-existing.tsx`
- [ ] Extrahiere Token aus URL Query Parameter
- [ ] Call Backend `POST /api/v1/auth/onboard-existing` mit Token
- [ ] Bei Erfolg: Redirect zu `/onboard-existing/set-password`
- [ ] Bei Token abgelaufen (410): Zeige Error-Page mit Kontakt-Info
- [ ] Bei Token bereits verwendet (409): Redirect zu `/login` mit Nachricht
- [ ] Bei ungültigem Token (404): Zeige 404-Seite
- [ ] Loading State während Validierung
- [ ] Accessibility: WCAG 2.1 AA compliant

**File:** `apps/web/src/routes/onboard-existing.tsx` (neu)

---

### Task 7: Set-Password Page und Form
**Status:** pending
**Acceptance Criteria Coverage:** AC3
**Estimated Time:** 1.5 hours

- [ ] Erstelle `apps/web/src/routes/onboard-existing/set-password.tsx`
- [ ] Erstelle `apps/web/src/features/auth/components/SetPasswordForm.tsx`
- [ ] Implementiere Form:
  - "Willkommen zurück, {firstName}!" Heading (lade User-Daten)
  - New Password Input mit Show/Hide Toggle
  - Confirm Password Input
  - Password Strength Indicator (optional)
  - "Passwort festlegen" Button (44x44px, primary)
- [ ] Client-side Validation (Zod)
- [ ] Erstelle `useSetPassword` Hook in `apps/web/src/features/auth/hooks/useSetPassword.ts`
- [ ] TanStack Query Mutation für API Call
- [ ] Bei Erfolg: Toast + Redirect zu `/profile/complete`
- [ ] Accessibility: WCAG 2.1 AA, Keyboard Navigation

**Files:**
- `apps/web/src/routes/onboard-existing/set-password.tsx` (neu)
- `apps/web/src/features/auth/components/SetPasswordForm.tsx` (neu)
- `apps/web/src/features/auth/hooks/useSetPassword.ts` (neu)

---

### Task 8: Profile Complete Page und Form
**Status:** pending
**Acceptance Criteria Coverage:** AC4
**Estimated Time:** 1.5 hours

- [ ] Erstelle `apps/web/src/routes/profile/complete.tsx`
- [ ] Erstelle `apps/web/src/features/profile/components/ProfileCompleteForm.tsx`
- [ ] Implementiere Form:
  - Vorname Input (pre-filled)
  - Nachname Input (pre-filled)
  - Telefon Input (optional)
  - USV-Nummer Checkbox + Input
  - "Profil abschließen" Button (44x44px, primary)
- [ ] Erstelle `useCompleteProfile` Hook
- [ ] Bei Erfolg:
  - Konfetti Animation (1000ms, 50 particles)
  - Welcome Toast: "Geschafft! Du bist jetzt Teil der digitalen Falken-Familie."
  - Redirect zu `/events`
- [ ] Accessibility: WCAG 2.1 AA

**Files:**
- `apps/web/src/routes/profile/complete.tsx` (neu)
- `apps/web/src/features/profile/components/ProfileCompleteForm.tsx` (neu)
- `apps/web/src/features/profile/hooks/useCompleteProfile.ts` (neu)

---

### Task 9: Konfetti Animation
**Status:** pending
**Acceptance Criteria Coverage:** AC4
**Estimated Time:** 30 minutes

- [ ] Installiere `canvas-confetti` Package: `pnpm add canvas-confetti --filter @urc-falke/web`
- [ ] Erstelle `apps/web/src/lib/confetti.ts` Utility
- [ ] Implementiere `triggerConfetti()` Funktion:
  - Duration: 1000ms
  - Particle Count: 50
  - Colors: URC Falke Branding (Primary, Secondary)
- [ ] Export für Verwendung in ProfileCompleteForm
- [ ] TypeScript Types für canvas-confetti

**File:** `apps/web/src/lib/confetti.ts` (neu)

---

### Task 10: Error Pages (Token-Fehler)
**Status:** pending
**Acceptance Criteria Coverage:** AC5, AC6
**Estimated Time:** 45 minutes

- [ ] Erstelle `apps/web/src/features/auth/components/TokenExpiredError.tsx`
  - "Dein Aktivierungscode ist abgelaufen."
  - "Bitte kontaktiere uns unter info@urc-falke.at für einen neuen Code."
  - URC Falke Logo/Branding
- [ ] Erstelle `apps/web/src/features/auth/components/TokenUsedError.tsx`
  - "Du hast deinen Account bereits aktiviert."
  - "Bitte melde dich mit deinem Passwort an."
  - Link zu `/login`
- [ ] Responsive Design (Mobile-First)
- [ ] Accessibility: WCAG 2.1 AA

**Files:**
- `apps/web/src/features/auth/components/TokenExpiredError.tsx` (neu)
- `apps/web/src/features/auth/components/TokenUsedError.tsx` (neu)

---

### Task 11: API Client Updates
**Status:** pending
**Acceptance Criteria Coverage:** AC1-AC4
**Estimated Time:** 30 minutes

- [ ] Update `apps/web/src/lib/api.ts`
- [ ] Füge hinzu:
  - `authApi.onboardExisting(token)` - Token-basierter Login
  - `userApi.setPassword(newPassword)` - Passwort setzen
  - `userApi.completeProfile(data)` - Profil vervollständigen
  - `userApi.getProfile()` - User-Profil laden
- [ ] TypeScript Types für Request/Response

**File:** `apps/web/src/lib/api.ts` (update)

---

### Task 12: Integration Tests
**Status:** pending
**Acceptance Criteria Coverage:** All ACs
**Estimated Time:** 1.5 hours

- [ ] End-to-End Test: Kompletter Onboarding-Flow
  1. Pre-seed User mit Token erstellen
  2. Call onboard-existing mit Token
  3. Verify JWT Cookie gesetzt
  4. Call set-password
  5. Verify Token gelöscht
  6. Call complete-profile
  7. Verify Status 'completed'
  8. Verify Redirect zu /events
- [ ] Test: Token abgelaufen
- [ ] Test: Token bereits verwendet
- [ ] Test: Ungültiger Token
- [ ] Test: Passwort zu kurz
- [ ] Test: Passwörter stimmen nicht überein
- [ ] Run all tests: `pnpm turbo test`

**File:** `apps/api/src/routes/user.routes.test.ts` (neu)

---

## Dev Notes

### Architektur-Compliance

**Two-Track Onboarding System:**
- Diese Story implementiert **Track A** (Existing Members mit Pre-Seeded Token)
- Track B (New Members Registration) wurde in Story 1.2 implementiert
- KRITISCH: Tracks NICHT vermischen - unterschiedliche Endpoints und Flows

**Token Security Rules (aus project_context.md):**
- Tokens sind **single-use** - IMMER `onboarding_token` nach erfolgreicher Aktivierung löschen
- Tokens sind **time-limited** - validiere `onboarding_token_expires > NOW()`
- Tokens sind **status-gated** - MUSS `onboarding_status === 'pre_seeded'` prüfen
- NIEMALS Token-Wiederverwendung erlauben - prüfen ob bereits verwendet

**Onboarding Status Lifecycle:**
```
Track A: NULL → pre_seeded → password_changed → completed
Track B: NULL → completed (direct)
```

### Wiederverwendbare Komponenten (aus Story 1.3)

| Komponente | Pfad | Verwendung |
|------------|------|------------|
| JWT Signing | `apps/api/src/lib/jwt.ts` | `signAccessToken()` für Auto-Login |
| Password Hashing | `apps/api/src/lib/password.ts` | `hashPassword()` für neues Passwort |
| Auth Middleware | `apps/api/src/middleware/auth.middleware.ts` | `requireAuth` (mit Exception für set-password) |
| Validation | `apps/api/src/middleware/validate.middleware.ts` | Zod Schema Validation |
| Rate Limiter | `apps/api/src/middleware/rate-limit.middleware.ts` | `authRateLimiter` |
| API Client | `apps/web/src/lib/api.ts` | Erweitern für neue Endpoints |
| Query Client | `apps/web/src/lib/queryClient.ts` | TanStack Query Setup |

### Kritische Pitfalls zu vermeiden

1. **Auth Middleware Exception:**
   - `requireAuth` MUSS `/api/v1/users/me/set-password` erlauben, auch wenn `must_change_password: true`
   - Sonst kann User sein Passwort nie ändern!

2. **Token-Cleanup:**
   - IMMER `onboarding_token = NULL` setzen nach erfolgreicher Aktivierung
   - IMMER `onboarding_token_expires = NULL` setzen
   - Verhindert Token-Replay-Attacken

3. **Status-Transitions:**
   - `pre_seeded` → `password_changed` (nach set-password)
   - `password_changed` → `completed` (nach complete-profile)
   - NIEMALS Status überspringen!

4. **Konfetti:**
   - NUR bei erfolgreichem Profile-Complete triggern
   - Animation darf Navigation NICHT blockieren

5. **Error Messages (German):**
   - ALLE Fehler in Deutsch (österreichische User)
   - RFC 7807 Problem Details Format

### Database-Felder (bereits vorhanden aus Story 1.0)

```typescript
// packages/shared/src/db/schema/users.ts
onboarding_token: text('onboarding_token').unique(),
onboarding_token_expires: timestamp('onboarding_token_expires'),
onboarding_status: text('onboarding_status'), // 'pre_seeded' | 'password_changed' | 'completed'
must_change_password: boolean('must_change_password').default(false),
```

### API Endpoints (zu implementieren)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/onboard-existing` | No | Token-basierter Auto-Login |
| POST | `/api/v1/users/me/set-password` | Yes* | Passwort setzen (*Exception für must_change_password) |
| PATCH | `/api/v1/users/me/complete-profile` | Yes | Profil vervollständigen |

### Frontend Routes (zu implementieren)

| Route | Komponente | Description |
|-------|------------|-------------|
| `/onboard-existing` | OnboardExistingPage | Token-Validierung und Redirect |
| `/onboard-existing/set-password` | SetPasswordPage | Neues Passwort setzen |
| `/profile/complete` | ProfileCompletePage | Profil vervollständigen |

### Project Structure Notes

**Backend:**
```
apps/api/src/
├── routes/
│   ├── auth.routes.ts      # + onboard-existing endpoint
│   └── user.routes.ts      # NEW: set-password, complete-profile
├── services/
│   ├── auth.service.ts     # + onboardExistingUser()
│   └── user.service.ts     # NEW: setPassword(), completeProfile()
└── middleware/
    └── auth.middleware.ts  # UPDATE: Exception für set-password
```

**Frontend:**
```
apps/web/src/
├── routes/
│   ├── onboard-existing.tsx           # NEW
│   ├── onboard-existing/
│   │   └── set-password.tsx           # NEW
│   └── profile/
│       └── complete.tsx               # NEW
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── SetPasswordForm.tsx    # NEW
│   │   │   ├── TokenExpiredError.tsx  # NEW
│   │   │   └── TokenUsedError.tsx     # NEW
│   │   └── hooks/
│   │       └── useSetPassword.ts      # NEW
│   └── profile/
│       ├── components/
│       │   └── ProfileCompleteForm.tsx # NEW
│       └── hooks/
│           └── useCompleteProfile.ts   # NEW
└── lib/
    ├── api.ts                          # UPDATE: neue endpoints
    └── confetti.ts                     # NEW
```

### References

- [Source: docs/epics.md#Story 1.4a] - Vollständige Acceptance Criteria
- [Source: docs/project_context.md#Two-Track Onboarding] - Security Rules
- [Source: docs/architecture.md#Onboarding Token Authentication] - Flow Details
- [Source: docs/sprint-artifacts/1-3-user-login-and-session-management.md] - Previous Story Learnings

---

## Dev Agent Record

### Context Reference

- `docs/epics.md` - Epic 1 Story 1.4a (Lines 840-917)
- `docs/project_context.md` - Critical Implementation Rules
- `docs/architecture.md` - Two-Track Onboarding Architecture
- `docs/sprint-artifacts/1-3-user-login-and-session-management.md` - Previous Story

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Analysis Completion Notes

**Ultimate Context Engine Analysis completed:**
- Exhaustive analysis of Epic 1 Story 1.4a from docs/epics.md
- Full architecture review for Two-Track Onboarding patterns
- Complete project_context.md analysis for security and token rules
- Previous story analysis (1.0, 1.3) for learnings and patterns
- Existing codebase analysis (auth.routes.ts, auth.middleware.ts)
- All 6 acceptance criteria mapped to 12 detailed tasks
- Story marked as **ready-for-dev**

### File List

**To Be Created:**
- `apps/api/src/services/user.service.ts`
- `apps/api/src/services/user.service.test.ts`
- `apps/api/src/routes/user.routes.ts`
- `apps/api/src/routes/user.routes.test.ts`
- `apps/web/src/routes/onboard-existing.tsx`
- `apps/web/src/routes/onboard-existing/set-password.tsx`
- `apps/web/src/routes/profile/complete.tsx`
- `apps/web/src/features/auth/components/SetPasswordForm.tsx`
- `apps/web/src/features/auth/components/TokenExpiredError.tsx`
- `apps/web/src/features/auth/components/TokenUsedError.tsx`
- `apps/web/src/features/auth/hooks/useSetPassword.ts`
- `apps/web/src/features/profile/components/ProfileCompleteForm.tsx`
- `apps/web/src/features/profile/hooks/useCompleteProfile.ts`
- `apps/web/src/lib/confetti.ts`

**To Be Modified:**
- `packages/shared/src/schemas/auth.schema.ts` - Add onboardExistingSchema, setPasswordSchema
- `apps/api/src/services/auth.service.ts` - Add onboardExistingUser()
- `apps/api/src/routes/auth.routes.ts` - Add onboard-existing route
- `apps/api/src/middleware/auth.middleware.ts` - Add set-password exception
- `apps/api/src/server.ts` - Register user routes
- `apps/web/src/lib/api.ts` - Add new API methods
- `apps/web/src/routes/index.tsx` - Export new routes
- `apps/web/src/App.tsx` - Add new routes

**Referenced (Already Exists):**
- `apps/api/src/lib/jwt.ts` - JWT signing
- `apps/api/src/lib/password.ts` - Password hashing
- `apps/api/src/middleware/validate.middleware.ts` - Zod validation
- `apps/api/src/middleware/rate-limit.middleware.ts` - Rate limiting
- `apps/api/src/db/connection.ts` - Database connection
- `packages/shared/src/db/schema/users.ts` - User schema with onboarding fields

---

**Status:** ready-for-dev
**Created:** 2025-12-22
**Next Action:** Developer can start implementation with Task 1 (Onboard-Existing Service)
