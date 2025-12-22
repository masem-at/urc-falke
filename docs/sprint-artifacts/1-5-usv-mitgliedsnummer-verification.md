# Story 1.5: USV-Mitgliedsnummer Verification

**Story ID:** 1.5
**Story Key:** 1-5-usv-mitgliedsnummer-verification
**Epic:** Epic 1 - User Onboarding & Authentication
**Status:** ready-for-dev

---

## Story

As a **user with a USV membership number**,
I want my USV membership to be verified automatically,
So that I receive the "GRATIS für USV-Mitglieder" benefit.

---

## Acceptance Criteria

### AC1: USV API Verification Call

**Given** I registered with a USV number (via onboarding or profile)
**When** the system validates my USV number via USV-API
**Then** an API call is made to `POST /api/v1/usv/verify` with payload: `{ usvNumber }`
**And** the USV-API responds with `{ valid: true, memberSince: "2018-01-15" }` or `{ valid: false }`
**And** the API call is rate-limited to 5 requests per minute per IP address

### AC2: Successful Verification

**Given** the USV-API confirms my number is valid
**When** the verification completes
**Then** my `is_usv_verified` field is set to `true`
**And** I receive an email: "Deine USV-Mitgliedschaft wurde bestätigt! Du bist GRATIS dabei."
**And** I see a "GRATIS"-Badge on my profile page
**And** I see a confirmation message: "Du bist bereits Mitglied! Willkommen zurück." (FR9)

### AC3: Invalid USV Number Handling

**Given** the USV-API confirms my number is invalid
**When** the verification completes
**Then** my `is_usv_verified` field remains `false`
**And** I receive an error message: "Die eingegebene USV-Mitgliedsnummer konnte nicht verifiziert werden. Bitte prüfe deine Eingabe."
**And** I can update my USV number in profile settings

### AC4: API Timeout and Retry Logic

**Given** the USV-API is unreachable or times out
**When** the verification is attempted
**Then** the system logs the error
**And** I see a message: "Die Überprüfung dauert länger als erwartet. Wir benachrichtigen dich, sobald sie abgeschlossen ist."
**And** the verification is retried up to 3 times with exponential backoff

### AC5: GRATIS Badge Display

**Given** I am a verified USV member (`is_usv_verified: true`)
**When** I view any event registration page
**Then** I see a "GRATIS für USV-Mitglieder"-Badge (green badge with checkmark icon)
**And** I do not see any payment/membership fee information
**And** The badge is displayed prominently (FR11 requirement)

---

## Tasks / Subtasks

### Task 1: Create USV Verification Service (Backend)
**Status:** pending
**Acceptance Criteria Coverage:** AC1, AC2, AC3, AC4
**Estimated Time:** 2 hours

- [ ] Create `apps/api/src/services/usv-verification.service.ts`
- [ ] Implement `verifyUSVNumber(usvNumber: string): Promise<USVVerificationResult>` function
- [ ] Add USV API endpoint configuration (environment variable: `USV_API_URL`)
- [ ] Implement API call with timeout (30 seconds)
- [ ] Implement retry logic (3 retries with exponential backoff: 1s, 2s, 4s)
- [ ] Add error handling for network failures, timeouts, and invalid responses
- [ ] Update `is_usv_verified` field in database on successful verification
- [ ] Add unit tests: `apps/api/src/services/usv-verification.service.test.ts`
  - Test successful verification
  - Test invalid USV number
  - Test API timeout
  - Test retry logic
  - Test database update

**Architecture Notes:**
- Use `fetch` with `AbortSignal` for timeout control
- Store USV API URL in `.env`: `USV_API_URL=https://api.usv.at/verify` (placeholder)
- Return type: `{ valid: boolean, memberSince?: string, error?: string }`

---

### Task 2: Create USV Verification API Endpoint
**Status:** pending
**Acceptance Criteria Coverage:** AC1, AC4
**Estimated Time:** 1 hour

- [ ] Add `POST /api/v1/usv/verify` endpoint to `apps/api/src/routes/auth.routes.ts`
- [ ] Apply rate limiting: 5 requests per minute per IP (use `express-rate-limit`)
- [ ] Validate request body with Zod schema: `{ usvNumber: string }`
- [ ] Call `verifyUSVNumber()` service
- [ ] Return RFC 7807 Problem Details on error
- [ ] Add integration tests for endpoint

**Rate Limiting Configuration:**
```typescript
const usvVerifyRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: 'Zu viele Anfragen. Bitte versuche es in einer Minute erneut.'
});
```

---

### Task 3: Create Email Notification for Verification
**Status:** pending
**Acceptance Criteria Coverage:** AC2
**Estimated Time:** 1.5 hours

- [ ] Create email template: `apps/api/src/emails/usv-verification-success.html`
- [ ] Add email service function: `sendUSVVerificationEmail(email: string, firstName: string)`
- [ ] Email content:
  - Subject: "Deine USV-Mitgliedschaft wurde bestätigt! 🎉"
  - Body: "Hallo {firstName}, deine USV-Mitgliedschaft wurde bestätigt! Du bist GRATIS dabei."
  - CTA: "Zur App" (link to https://urc-falke.app/events)
- [ ] Send email after successful verification in service
- [ ] Add test for email sending

**Email Service Stack:**
- Use Vercel Email (Resend API) or Sendgrid (TBD based on project setup)
- Email template with USV-Blau branding (#1E3A8A)

---

### Task 4: Frontend USV Verification Trigger
**Status:** pending
**Acceptance Criteria Coverage:** AC1
**Estimated Time:** 1 hour

- [ ] Add `verifyUSVNumber()` API call in `apps/web/src/lib/api.ts`
- [ ] Trigger verification automatically after registration (if USV number provided)
- [ ] Trigger verification when user updates USV number in profile
- [ ] Show loading state during verification ("Überprüfung läuft...")
- [ ] Show success/error notification after verification

**API Integration:**
```typescript
export const usvApi = {
  verify: (usvNumber: string): Promise<USVVerificationResponse> => {
    return apiFetch<USVVerificationResponse>('/api/v1/usv/verify', {
      method: 'POST',
      body: JSON.stringify({ usvNumber }),
    });
  },
};
```

---

### Task 5: GRATIS Badge Component (Frontend)
**Status:** pending
**Acceptance Criteria Coverage:** AC5
**Estimated Time:** 1.5 hours

- [ ] Create `apps/web/src/components/ui/GratisBadge.tsx`
- [ ] Design: Green badge with checkmark icon (lucide-react `Check` icon)
- [ ] Text: "GRATIS für USV-Mitglieder"
- [ ] Size: Large (min 44x44px height for accessibility)
- [ ] Accessible: ARIA label, keyboard focusable
- [ ] Display on event pages when `user.is_usv_verified === true`
- [ ] Add unit tests for component

**Badge Design:**
- Background: Green (#22C55E)
- Text: White (#FFFFFF)
- Icon: White checkmark
- Border radius: 8px
- Padding: 12px 16px

---

### Task 6: Profile Page GRATIS Badge Display
**Status:** pending
**Acceptance Criteria Coverage:** AC2
**Estimated Time:** 30 minutes

- [ ] Add GRATIS badge to profile page when `is_usv_verified: true`
- [ ] Display badge below profile picture
- [ ] Badge should be prominent and easily visible
- [ ] Add tooltip: "Deine USV-Mitgliedschaft wurde verifiziert"

---

### Task 7: Error Handling and User Feedback
**Status:** pending
**Acceptance Criteria Coverage:** AC3, AC4
**Estimated Time:** 1 hour

- [ ] Show error message for invalid USV number (AC3)
- [ ] Show timeout message for API failures (AC4)
- [ ] Add "USV-Nummer aktualisieren" link in error message
- [ ] Log all verification attempts (success and failure) to database audit table
- [ ] Add monitoring/alerting for high verification failure rates

---

## Dev Notes

### Technical Requirements

**Backend Dependencies:**
- `express-rate-limit@^8.2.1` (already installed)
- No new dependencies required (use existing `fetch`, `drizzle-orm`)

**Frontend Dependencies:**
- No new dependencies (use existing `lucide-react`, `@radix-ui/react-toast`)

**Environment Variables:**
```env
# apps/api/.env
USV_API_URL=https://api.usv.at/verify
USV_API_TIMEOUT=30000
```

---

### Architecture Compliance

**From Architecture Document:**
- **API Patterns:** Use RFC 7807 Problem Details for errors (apps/api/src/services/usv-verification.service.ts)
- **Rate Limiting:** Apply `express-rate-limit` to `/api/v1/usv/verify` endpoint (5 req/min per IP)
- **Database:** Use Drizzle ORM to update `users.is_usv_verified` field
- **Email Service:** Use existing email service configuration (Vercel Email or Sendgrid)
- **Error Handling:** Implement retry logic with exponential backoff for external API calls
- **Logging:** Log all USV verification attempts to audit table (for DSGVO compliance)

**Security Requirements:**
- Validate USV number format before API call (regex: `USV[0-9]{6}`)
- Rate limit to prevent abuse (5 req/min per IP)
- Log verification attempts for audit trail
- Return same error message for invalid format vs invalid number (security through obscurity)

---

### Previous Story Intelligence

**From Story 1.0-1.4a:**
- **Password Hashing:** Use `bcrypt` with 12 rounds (apps/api/src/lib/password.ts)
- **JWT Generation:** Use `jose 6.1.3` (apps/api/src/lib/jwt.ts)
- **Database Connection:** NeonDB via Drizzle ORM (apps/api/src/db/connection.ts)
- **Auth Middleware:** Use `requireAuth` middleware for protected routes (apps/api/src/middleware/auth.middleware.ts)
- **API Response Format:** Use RFC 7807 Problem Details for errors
- **Email Service:** Email service already set up (check apps/api/src/services/email.service.ts if exists)
- **Frontend API Client:** Use `apiFetch` wrapper in apps/web/src/lib/api.ts
- **Toast Notifications:** Use `@radix-ui/react-toast` for user feedback
- **Component Patterns:** Radix UI + Tailwind CSS for accessible components

**Git Intelligence (Recent Commits):**
- Stories 1.2-1.4a implemented authentication flow with JWT cookies
- Existing auth service patterns: `registerUser()`, `loginUser()`, `onboardExistingUser()`
- Follow same service pattern for USV verification
- Tests use Vitest with mocked database and API calls

---

### File Structure Requirements

**Backend Files Created:**
```
apps/api/src/
├── services/
│   ├── usv-verification.service.ts       # NEW: USV verification logic
│   └── usv-verification.service.test.ts  # NEW: Service tests
├── routes/
│   └── auth.routes.ts                    # MODIFY: Add POST /api/v1/usv/verify
├── emails/
│   └── usv-verification-success.html     # NEW: Email template
└── middleware/
    └── rate-limit.middleware.ts          # MODIFY: Add usvVerifyRateLimiter
```

**Frontend Files Created:**
```
apps/web/src/
├── components/ui/
│   ├── GratisBadge.tsx                   # NEW: GRATIS badge component
│   └── GratisBadge.test.tsx              # NEW: Component tests
├── lib/
│   └── api.ts                            # MODIFY: Add usvApi.verify()
└── routes/
    └── profile.tsx                       # MODIFY: Display GRATIS badge
```

---

### Testing Requirements

**Unit Tests:**
- `apps/api/src/services/usv-verification.service.test.ts` - USV verification logic
- `apps/web/src/components/ui/GratisBadge.test.tsx` - Badge component rendering

**Integration Tests:**
- `apps/api/src/routes/auth.routes.test.ts` - POST /api/v1/usv/verify endpoint
- Rate limiting (5 req/min enforcement)
- Database updates after successful verification

**Test Coverage Requirements:**
- Minimum 80% code coverage for new files
- All edge cases tested (timeout, retry, invalid number)

---

### Latest Tech Information

**USV API (Mock/Placeholder):**
- Real USV API may not exist - implement mock service for MVP
- Mock service returns `{ valid: true }` for numbers matching pattern `USV[0-9]{6}`
- Production: Replace with real USV API integration (TBD)

**Retry Library:**
- Use native `fetch` with custom retry logic (no external library needed)
- Exponential backoff: 1s, 2s, 4s delays

---

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Context Reference
Story created: 2025-12-22
Epic: docs/epics.md - Epic 1, Story 1.5
Architecture: docs/architecture.md
Previous Stories: 1.0, 1.1, 1.2, 1.3, 1.4a (all completed)

### Debug Log References
(Will be added during implementation)

### Completion Notes List
(Will be added during implementation)

### File List
(Will be added during implementation)

### Change Log
- 2025-12-22: Story 1.5 created with comprehensive context (ready-for-dev)

---

**Status:** ready-for-dev
**Implementation Date:** TBD
**Next Action:** Run `/bmad:bmm:workflows:dev-story 1-5` to implement
