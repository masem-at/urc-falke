# Story 1.6: User Profile Management

**Story ID:** 1.6
**Story Key:** 1-6-user-profile-management
**Epic:** Epic 1 - User Onboarding & Authentication
**Status:** review

---

## Story

Als ein **registrierter User**,
möchte ich meine Profilinformationen ansehen und bearbeiten,
damit ich meine Daten aktuell halten und ein Profilbild hochladen kann.

---

## Acceptance Criteria

### AC1: Profile View Page

**Given** ich bin eingeloggt
**When** ich zu `/profile` navigiere
**Then** sehe ich meine aktuellen Profilinformationen:
- Email (read-only)
- First Name (editierbar)
- Last Name (editierbar)
- Nickname (editierbar) - **NEU seit Story 1.4b**
- USV-Mitgliedsnummer (editierbar wenn nicht verifiziert)
- Profilbild (Bild-Vorschau oder Platzhalter-Avatar)
- "Gründungsmitglied"-Badge (sichtbar wenn `is_founding_member: true`)
- "GRATIS"-Badge (sichtbar wenn `is_usv_verified: true`)

**And** ich sehe einen "Profil bearbeiten" Button (44x44px minimum)

### AC2: Edit Mode Activation

**Given** ich klicke auf "Profil bearbeiten"
**When** der Edit-Modus aktiviert wird
**Then** werden alle editierbaren Felder zu Input-Feldern
**And** ich sehe einen "Änderungen speichern" Button
**And** ich sehe einen "Abbrechen" Button

### AC3: Profile Update

**Given** ich aktualisiere meinen Vornamen zu "Max" und Nachnamen zu "Mustermann"
**When** ich auf "Änderungen speichern" klicke
**Then** wird ein `PATCH /api/v1/users/me` Request gesendet mit payload: `{ firstName: "Max", lastName: "Mustermann" }`
**And** die `users` Tabelle wird aktualisiert: `first_name = 'Max'`, `last_name = 'Mustermann'`, `updated_at = NOW()`
**And** ich sehe eine Erfolgsmeldung: "Profil erfolgreich aktualisiert."
**And** der Edit-Modus wird geschlossen

### AC4: Profile Picture Upload

**Given** ich möchte ein Profilbild hochladen
**When** ich auf "Profilbild hochladen" klicke
**Then** öffnet sich ein File-Picker, der folgende Bildformate akzeptiert: JPG, PNG, WebP
**And** die maximale Dateigröße ist 5MB

**Given** ich wähle eine gültige Bilddatei (z.B. 2MB JPG)
**When** der Upload abgeschlossen ist
**Then** wird das Bild an die Backend-API hochgeladen (`POST /api/v1/users/me/profile-image`)
**And** das Bild wird in Vercel Blob Storage gespeichert
**And** die Bild-URL wird im `profile_image_url` Feld gespeichert
**And** das Bild wird als mein Avatar angezeigt (rund, 64x64px auf Profilseite)

### AC5: Upload Validation

**Given** ich versuche, eine Datei größer als 5MB hochzuladen
**When** ich die Datei auswähle
**Then** erhalte ich eine Fehlermeldung: "Datei zu groß. Maximale Größe: 5MB."
**And** der Upload wird blockiert

### AC6: Accessibility

**And** die Profilseite ist vollständig accessible (Keyboard-Navigation, Screen-Reader Labels)
**And** alle Form-Inputs haben korrekte ARIA-Labels

---

## Tasks / Subtasks

### Task 1: Install Vercel Blob Storage Package
**AC Coverage:** AC4, AC5
**Estimated Time:** 10 minutes

- [x] Run `pnpm add @vercel/blob`
- [x] Add `BLOB_READ_WRITE_TOKEN` to `.env` (from Vercel Dashboard → Storage)
- [x] Update `next.config.mjs` to add Vercel Blob domain to `images.domains`
- [x] Verify package installation with `pnpm list @vercel/blob`

**Files:**
- `package.json` (new dependency)
- `.env` (new env variable)
- `next.config.mjs` (update images config)

---

### Task 2: Create Profile Schemas
**AC Coverage:** AC3, AC4
**Estimated Time:** 20 minutes

- [x] Create or extend `lib/shared/schemas/auth.schema.ts` with `updateProfileSchema`
- [x] Define schema:
  ```typescript
  export const updateProfileSchema = z.object({
    firstName: z.string().min(2, 'Vorname muss mindestens 2 Zeichen lang sein').max(50).optional(),
    lastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen lang sein').max(50).optional(),
    nickname: z.string().max(50, 'Spitzname zu lang (max. 50 Zeichen)').optional()
  });
  export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
  ```
- [x] Create `uploadImageSchema` for file validation (max 5MB, JPG/PNG/WebP)
- [x] Export types for use in API routes

**Files:**
- `lib/shared/schemas/auth.schema.ts` (new schemas)

---

### Task 3: Extend User Service with Profile Functions
**AC Coverage:** AC3
**Estimated Time:** 45 minutes

- [x] Open `lib/services/user.service.ts`
- [x] Add `updateProfile()` function:
  ```typescript
  export async function updateProfile(userId: number, input: UpdateProfileInput): Promise<UserResponse> {
    // 1. Find user
    const [existingUser] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!existingUser) {
      throw { type: 'user-not-found', status: 404, detail: 'Benutzer nicht gefunden' };
    }

    // 2. Build update object (only provided fields)
    const updateData: Record<string, unknown> = { updated_at: new Date() };
    if (input.firstName !== undefined) updateData.first_name = input.firstName;
    if (input.lastName !== undefined) updateData.last_name = input.lastName;
    if (input.nickname !== undefined) updateData.nickname = input.nickname;

    // 3. Update database
    const [updatedUser] = await db.update(users).set(updateData).where(eq(users.id, userId)).returning();

    // 4. Return WITHOUT password_hash
    const { password_hash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
  ```
- [x] Add unit tests in `lib/services/user.service.test.ts`
  - Test: Update all fields successfully
  - Test: Update partial fields (only firstName)
  - Test: User not found (404 error)
  - Test: password_hash never returned

**Files:**
- `lib/services/user.service.ts` (new function)
- `lib/services/user.service.test.ts` (new tests)

---

### Task 4: Create Profile Image Upload API Route
**AC Coverage:** AC4, AC5
**Estimated Time:** 1.5 hours

- [x] Create `app/api/v1/users/me/profile-image/route.ts`
- [x] Implement `POST` handler:
  ```typescript
  export async function POST(request: NextRequest) {
    // 1. Authenticate user (JWT from cookie)
    const token = cookies().get('accessToken')?.value;
    if (!token) return 401;
    const { userId } = await verifyAccessToken(token);

    // 2. Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('image') as File;

    // 3. Validate file
    if (!file) return 400 'Keine Datei hochgeladen';
    if (file.size > 5 * 1024 * 1024) return 400 'Datei zu groß. Maximale Größe: 5MB.';
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return 400 'Ungültiges Dateiformat. Erlaubt: JPG, PNG, WebP';
    }

    // 4. Upload to Vercel Blob
    const blob = await put(`profile-images/${userId}/${Date.now()}-${file.name}`, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    // 5. Update user record
    await db.update(users).set({ profile_image_url: blob.url }).where(eq(users.id, userId));

    // 6. Return new URL
    return NextResponse.json({ profileImageUrl: blob.url });
  }
  ```
- [x] Add rate limiting (3 uploads per hour per user)
- [ ] Add integration tests

**Files:**
- `app/api/v1/users/me/profile-image/route.ts` (new API route)

---

### Task 5: Create Profile Update API Route
**AC Coverage:** AC3
**Estimated Time:** 45 minutes

- [x] Create `app/api/v1/users/me/route.ts` (or verify if `/auth/me` should be used)
- [x] Implement `GET` handler (fetch current user profile)
- [x] Implement `PATCH` handler:
  ```typescript
  export async function PATCH(request: NextRequest) {
    // 1. Authenticate
    const token = cookies().get('accessToken')?.value;
    if (!token) return 401;
    const { userId } = await verifyAccessToken(token);

    // 2. Validate input
    const body = await request.json();
    const validatedInput = updateProfileSchema.parse(body);

    // 3. Update profile
    const updatedUser = await updateProfile(userId, validatedInput);

    // 4. Return updated user
    return NextResponse.json({ user: updatedUser });
  }
  ```
- [x] Add error handling (RFC 7807 Problem Details)
- [ ] Add integration tests

**Files:**
- `app/api/v1/users/me/route.ts` (new API route)

**⚠️ CRITICAL NOTE:** Verify if endpoint conflicts with existing `/api/v1/auth/me` - may need to consolidate!

---

### Task 6: Create Founding Member Badge Component
**AC Coverage:** AC1
**Estimated Time:** 30 minutes

- [x] Create `components/ui/FoundingMemberBadge.tsx`
- [x] Implement badge with:
  - Gold background (#F59E0B - Amber-500)
  - White text
  - Star icon from lucide-react
  - Text: "Gründungsmitglied"
  - Tooltip: "Du gehörst zu den ersten Mitgliedern! Danke für deine Unterstützung."
- [x] Responsive design (Mobile-First)
- [x] Accessibility: WCAG 2.1 AA compliant (ARIA labels, role)
- [x] Unit tests with @testing-library/react

**Files:**
- `components/ui/FoundingMemberBadge.tsx` (new component)
- `components/ui/FoundingMemberBadge.test.tsx` (new tests)

---

### Task 7: Create Profile Page UI
**AC Coverage:** AC1, AC2, AC3, AC4, AC5, AC6
**Estimated Time:** 3 hours

- [x] Create `app/profile/page.tsx`
- [x] Implement state management:
  ```typescript
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [nickname, setNickname] = useState(user.nickname || '');
  const [profileImageUrl, setProfileImageUrl] = useState(user.profileImageUrl || null);
  ```
- [x] Fetch current user data on mount (`GET /api/v1/users/me`)
- [x] Display profile fields (read-only mode by default)
- [x] Show badges:
  - `{user.isUsvVerified && <GratisBadge />}`
  - `{user.isFoundingMember && <FoundingMemberBadge />}`
- [x] Implement "Profil bearbeiten" button → activates edit mode
- [x] Implement inline edit mode (form fields replace text)
- [x] Implement "Änderungen speichern" → `PATCH /api/v1/users/me`
- [x] Implement "Abbrechen" → revert changes, exit edit mode
- [x] Implement profile image upload:
  - File input with preview
  - Client-side validation (5MB, JPG/PNG/WebP)
  - Upload to `POST /api/v1/users/me/profile-image`
  - Update UI with new image URL
- [x] Display success/error messages (Radix Toast)
- [x] Trigger confetti on successful save (`import { triggerConfetti } from '@/lib/confetti'`)
- [x] Use display name utility: `import { getDisplayName } from '@/lib/utils/display-name'`
- [x] Ensure 44x44px minimum touch targets
- [x] Full keyboard navigation support
- [x] ARIA labels for all interactive elements

**Files:**
- `app/profile/page.tsx` (new page)

---

### Task 8: Integration Tests
**AC Coverage:** All ACs
**Estimated Time:** 1.5 hours

- [x] Test: Profile page loads and displays user data
- [x] Test: Edit mode activates on button click
- [x] Test: Profile update saves changes successfully
- [x] Test: Profile image upload works (mock Vercel Blob)
- [x] Test: Upload validation rejects files >5MB
- [x] Test: Upload validation rejects non-image files
- [x] Test: GratisBadge displays for verified USV members
- [x] Test: FoundingMemberBadge displays for founding members
- [x] Test: Cancel button reverts changes
- [x] Test: Confetti triggers on successful save
- [ ] Run all tests: `pnpm test` and verify all pass

**Files:**
- `app/profile/page.test.tsx` (new integration tests)

---

### Task 9: Accessibility Audit
**AC Coverage:** AC6
**Estimated Time:** 30 minutes

- [ ] Run Lighthouse Accessibility Audit on `/profile` page
- [ ] Verify all issues are fixed:
  - WCAG 2.1 AA compliant labels
  - 44x44px minimum touch targets
  - 4.5:1 contrast ratio
  - Keyboard navigation (Tab, Enter, Escape)
  - Screen reader support (ARIA labels, roles)
- [ ] Run axe-core automated tests
- [ ] Manual keyboard navigation test
- [ ] Manual screen reader test (NVDA/JAWS/VoiceOver)

**Tool:** Lighthouse, axe-core

---

## Dev Notes

### 🔥 CRITICAL IMPLEMENTATION NOTES

#### Previous Story Learnings (Story 1.5)

**What Worked Well:**
- ✅ Service layer pattern (`lib/services/*.service.ts`) with comprehensive tests
- ✅ Rate limiting using in-memory cache (`lib/rate-limit.ts`)
- ✅ RFC 7807 Problem Details error format
- ✅ Zod validation schemas in `lib/shared/schemas/`
- ✅ GratisBadge component with WCAG 2.1 AA compliance

**What Went Wrong:**
- ⚠️ **GratisBadge was missing initially** - ensure ALL AC components exist before claiming done
- ⚠️ Rate limiting was added late - apply to ALL sensitive endpoints from start

**Key Patterns Established:**
- JWT auth via HttpOnly cookies (`accessToken`)
- API routes: `app/api/v1/{resource}/{action}/route.ts`
- Service functions: Async, throw ProblemDetails errors, return user WITHOUT `password_hash`
- Testing: Vitest with mocked DB and dependencies

---

### 🏗️ Architecture Compliance

#### Project Structure (Post-Restructure)

**CRITICAL:** Project was recently restructured from Turborepo monorepo to standard Next.js!

```
urc-falke/
├── app/                          # Next.js 14 App Router (NOT apps/web!)
│   ├── api/v1/users/me/
│   │   ├── complete-profile/route.ts  ✅ EXISTS
│   │   ├── set-password/route.ts      ✅ EXISTS
│   │   └── profile-image/route.ts     ❌ CREATE (Task 4)
│   ├── profile/                   ❌ CREATE (Task 7)
│   │   └── page.tsx
│   └── dashboard/page.tsx        ✅ EXISTS
├── lib/
│   ├── services/
│   │   ├── user.service.ts       ✅ EXTEND (Task 3)
│   │   └── auth.service.ts       ✅ EXISTS
│   ├── shared/
│   │   ├── db/schema/users.ts    ✅ EXISTS (all fields ready)
│   │   └── schemas/auth.schema.ts ✅ EXTEND (Task 2)
│   ├── utils/
│   │   └── display-name.ts       ✅ EXISTS (Story 1.4b)
│   ├── jwt.ts                    ✅ EXISTS
│   ├── password.ts               ✅ EXISTS (bcryptjs)
│   ├── rate-limit.ts             ✅ EXISTS
│   └── confetti.ts               ✅ EXISTS
├── components/
│   └── ui/
│       ├── GratisBadge.tsx       ✅ EXISTS
│       └── FoundingMemberBadge.tsx ❌ CREATE (Task 6)
└── next.config.mjs               ✅ UPDATE (Task 1)
```

---

#### Database Schema

**From `lib/shared/db/schema/users.ts`:**

All required fields **ALREADY EXIST** - no migration needed!

```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),

  // Authentication
  email: text('email').unique().notNull(),
  password_hash: text('password_hash').notNull(),

  // ✅ Profile Fields (ALL READY)
  first_name: text('first_name'),           // OPTIONAL
  last_name: text('last_name'),             // OPTIONAL
  nickname: text('nickname'),               // OPTIONAL (Story 1.4b)
  profile_image_url: text('profile_image_url'), // READY for Story 1.6

  // USV Membership
  usv_number: text('usv_number').unique(),
  is_usv_verified: boolean('is_usv_verified').default(false),

  // Community Badges
  is_founding_member: boolean('is_founding_member').default(false),
  lottery_registered: boolean('lottery_registered').default(false),

  // Role
  role: text('role').default('member'), // 'member' | 'admin'

  // Timestamps
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});
```

---

#### API Endpoint Patterns

**Existing endpoints to follow:**

```
POST   /api/v1/auth/register          # Registration
POST   /api/v1/auth/login             # Login
GET    /api/v1/auth/me                # Get current user (⚠️ may conflict!)
PUT    /api/v1/users/me/complete-profile # Complete profile
PUT    /api/v1/users/me/set-password  # Set password
POST   /api/v1/usv/verify             # USV verification
```

**NEW endpoints for Story 1.6:**

```
GET    /api/v1/users/me               # Get profile (Task 5)
PATCH  /api/v1/users/me               # Update profile (Task 5)
POST   /api/v1/users/me/profile-image # Upload image (Task 4)
```

**⚠️ CRITICAL CONFLICT:** `/api/v1/auth/me` vs `/api/v1/users/me`

- Check if `/auth/me` endpoint already returns user profile data
- If yes, use `GET /api/v1/auth/me` for fetching profile
- If no, create `GET /api/v1/users/me`
- `PATCH` should always be at `/api/v1/users/me` (not `/auth/me`)

---

### 🎨 UX Design Specifications

**From `docs/ux-design-specification.md`:**

#### Color System

```
Primary (USV-Blau):     #1E40AF (Blue-700)
Secondary (Orange):     #F97316 (Orange-500)
Success Green:          #10B981 (Green-500)
Gold (Founding):        #F59E0B (Amber-500)
Neutral Text:           #111827 (Gray-900)
Background:             #F9FAFB (Gray-50)
```

#### Typography

- Font: System stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`)
- Body: 16px minimum (Gerhard's readability requirement)
- Headings: H2 24px, H3 20px
- Line-height: 1.5 (WCAG AA)

#### Touch Targets

- Minimum: 44x44px (Apple HIG, WCAG 2.1 AA)
- Recommended: 48x48px for primary CTAs
- Spacing: Min 8px between interactive elements

#### Accessibility (WCAG 2.1 AA)

- Contrast: Min 4.5:1 for body text, 3:1 for large text
- Keyboard navigation: ALL actions reachable via Tab/Enter/Escape
- Screen reader: ARIA labels for all interactive elements
- Focus indicators: 3px solid outline (visible on all interactive elements)
- Error messages: Inline with red border + icon

#### Badge Display

- **GratisBadge:** Green (#10B981), checkmark icon, "GRATIS für USV-Mitglieder"
- **FoundingMemberBadge:** Gold (#F59E0B), star icon, "Gründungsmitglied"
- Display both badges if user qualifies for both
- Position: Below profile picture

#### Form Editing Patterns

- **Inline editing** preferred (not separate edit page)
- "Bearbeiten" button shows form fields in-place
- Real-time validation with checkmarks (✓) on valid input
- "Speichern" + "Abbrechen" buttons appear in edit mode
- Optimistic UI: Show success immediately, sync in background

---

### 📦 File Upload & Image Storage

#### Vercel Blob Storage Setup

**Why Vercel Blob:**
- Already on Vercel platform
- Native integration with Next.js
- Automatic CDN distribution
- No additional configuration needed

**Setup Steps:**

1. **Install package:**
   ```bash
   pnpm add @vercel/blob
   ```

2. **Get token from Vercel Dashboard:**
   - Go to: https://vercel.com/dashboard → Your Project → Storage → Create Store
   - Copy `BLOB_READ_WRITE_TOKEN`

3. **Add to `.env`:**
   ```env
   BLOB_READ_WRITE_TOKEN="vercel_blob_..."
   ```

4. **Update `next.config.mjs`:**
   ```javascript
   images: {
     domains: ['xxxxx.public.blob.vercel-storage.com'],  // Add your Blob domain
     formats: ['image/avif', 'image/webp'],
   },
   ```

**Implementation Pattern:**

```typescript
import { put } from '@vercel/blob';

// Upload image
const blob = await put(
  `profile-images/${userId}/${Date.now()}-${file.name}`,
  file,
  {
    access: 'public',
    addRandomSuffix: false,
  }
);

// Returns: { url: 'https://xxxxx.public.blob.vercel-storage.com/...' }
// Save blob.url to database: profile_image_url field
```

#### File Upload Security

**MUST IMPLEMENT:**

1. **Max file size:** 5MB (server-side validation)
2. **Allowed MIME types:** `image/jpeg`, `image/png`, `image/webp`
3. **Validate on server:** Don't trust client `file.type` - check magic bytes if needed
4. **Sanitize filenames:** Remove special characters, use timestamp + userId
5. **Rate limiting:** 3 uploads per hour per user (use `lib/rate-limit.ts`)
6. **Storage path:** `profile-images/{userId}/{timestamp}-{filename}`

---

### 🔒 Security Patterns

#### JWT Authentication

- **Library:** `jose 6.1.3` (NOT jsonwebtoken!)
- **Storage:** HttpOnly cookies (XSS-safe)
- **Token lifetime:** 15 minutes
- **Cookie options:** `{ httpOnly: true, secure: true (prod), sameSite: 'lax' }`
- **Functions:** `signAccessToken()`, `verifyAccessToken()` in `lib/jwt.ts`

**Usage in API routes:**

```typescript
import { verifyAccessToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

const cookieStore = await cookies();
const token = cookieStore.get('accessToken')?.value;
if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

const payload = await verifyAccessToken(token);
const userId = payload.userId; // Use this for queries
```

#### Password Security

- **Library:** `bcryptjs` (NOT bcrypt - Vercel compatible!)
- **Salt rounds:** 12
- **Functions:** `hashPassword()`, `verifyPassword()` in `lib/password.ts`
- **NEVER return** `password_hash` in API responses

#### File Upload Security Checklist

```typescript
// 1. Max file size
if (file.size > 5 * 1024 * 1024) {
  return NextResponse.json({ error: 'Datei zu groß. Maximale Größe: 5MB.' }, { status: 400 });
}

// 2. MIME type validation
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
if (!allowedTypes.includes(file.type)) {
  return NextResponse.json({ error: 'Ungültiges Dateiformat. Erlaubt: JPG, PNG, WebP' }, { status: 400 });
}

// 3. Rate limiting
import { rateLimitByUser } from '@/lib/rate-limit';
const limited = await rateLimitByUser(userId, 3, 3600000); // 3 uploads per hour
if (limited) {
  return NextResponse.json({ error: 'Zu viele Upload-Versuche. Bitte warte eine Stunde.' }, { status: 429 });
}

// 4. Sanitize filename
const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
```

---

### 🧪 Testing Patterns

#### Unit Tests (Vitest)

**Test file location:** `lib/services/user.service.test.ts`

**Example structure:**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateProfile } from './user.service';

describe('updateProfile', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
  });

  it('should update user profile fields', async () => {
    // Arrange
    const userId = 1;
    const input = { firstName: 'Max', lastName: 'Mustermann' };
    // Mock DB
    const mockUser = { id: 1, first_name: 'Max', last_name: 'Mustermann', ... };
    vi.mocked(db.select).mockResolvedValueOnce([mockUser]);
    vi.mocked(db.update).mockResolvedValueOnce([mockUser]);

    // Act
    const result = await updateProfile(userId, input);

    // Assert
    expect(result.firstName).toBe('Max');
    expect(result.password_hash).toBeUndefined(); // NEVER returned
  });

  it('should throw 404 if user not found', async () => {
    // Arrange
    vi.mocked(db.select).mockResolvedValueOnce([]);

    // Act & Assert
    await expect(updateProfile(999, {})).rejects.toMatchObject({ status: 404 });
  });
});
```

**Coverage Requirements:**
- Minimum 80% for new code
- All edge cases tested (missing user, empty input, partial update)

---

### 🛠️ Dependencies & Libraries

#### Already Installed

```json
{
  "@neondatabase/serverless": "^1.0.2",      // PostgreSQL
  "@radix-ui/react-avatar": "^1.1.2",        // ✅ Profile pictures
  "@radix-ui/react-dialog": "^1.1.3",        // ✅ Modals
  "@radix-ui/react-toast": "^1.2.4",         // ✅ Notifications
  "bcryptjs": "^3.0.3",                      // ✅ Password hashing
  "canvas-confetti": "^1.9.4",               // ✅ Confetti
  "drizzle-orm": "^0.45.1",                  // ✅ ORM
  "jose": "^6.1.3",                          // ✅ JWT
  "lucide-react": "^0.562.0",                // ✅ Icons (Star, Check, Edit)
  "next": "14.2.35",                         // ✅ Framework
  "zod": "^3.24.1",                          // ✅ Validation
  "zustand": "^5.0.9"                        // ✅ State management
}
```

#### NEEDS INSTALLATION

```bash
pnpm add @vercel/blob  # Image storage (Task 1)
```

---

### 🎯 Component Patterns

#### Display Name Utility (MUST USE)

**From `lib/utils/display-name.ts` (Story 1.4b):**

```typescript
import { getDisplayName } from '@/lib/utils/display-name';

// Usage:
const displayName = getDisplayName({
  nickname: user.nickname,
  firstName: user.firstName,
  lastName: user.lastName
});

// Returns:
// - "Fritz (Friedrich Semper)" if nickname exists
// - "Friedrich Semper" if no nickname
// - "Friedrich" if only first name
// - "Unbekannt" if no name data
```

#### Badge Display Logic

```typescript
// In profile page:
{user.isUsvVerified && <GratisBadge />}
{user.isFoundingMember && <FoundingMemberBadge />}
```

**Both badges can display simultaneously!**

#### Confetti Trigger

```typescript
import { triggerConfetti } from '@/lib/confetti';

// After successful profile update:
const handleSave = async () => {
  const response = await fetch('/api/v1/users/me', {
    method: 'PATCH',
    body: JSON.stringify({ firstName, lastName }),
  });

  if (response.ok) {
    triggerConfetti(); // 1000ms duration, 50 particles
    toast.success('Profil erfolgreich aktualisiert.');
  }
};
```

#### Radix UI Components

**Avatar:**

```typescript
import * as Avatar from '@radix-ui/react-avatar';

<Avatar.Root className="h-16 w-16 rounded-full overflow-hidden">
  <Avatar.Image src={user.profileImageUrl || undefined} alt={displayName} />
  <Avatar.Fallback className="bg-gray-200 flex items-center justify-center text-gray-600">
    {user.firstName?.[0]}{user.lastName?.[0]}
  </Avatar.Fallback>
</Avatar.Root>
```

**Toast Notifications:**

```typescript
import * as Toast from '@radix-ui/react-toast';

// Show success message
toast.success('Profil erfolgreich aktualisiert.');

// Show error message
toast.error('Fehler beim Speichern. Bitte versuche es erneut.');
```

---

### ⚠️ PITFALLS TO AVOID

#### From Previous Stories

1. ❌ **Missing Components** - Story 1.5 forgot GratisBadge initially
   - ✅ Create FoundingMemberBadge BEFORE claiming story done

2. ❌ **Rate Limiting Forgotten** - Added late in Story 1.5
   - ✅ Apply rate limiting to image upload endpoint from start (3 uploads/hour)

3. ❌ **File Path Confusion** - It's `app/` NOT `apps/web/`
   - ✅ Use correct paths after restructure

4. ❌ **Wrong Library** - Using `bcrypt` instead of `bcryptjs`
   - ✅ Continue using `bcryptjs` (Vercel compatible)

5. ❌ **Error Format** - Inconsistent error responses
   - ✅ MUST use RFC 7807 Problem Details format

6. ❌ **German Messages** - English errors slipped through
   - ✅ ALL user-facing text in German

7. ❌ **JWT Library** - Using `jsonwebtoken` instead of `jose`
   - ✅ Continue using `jose 6.1.3`

#### New Pitfalls for Story 1.6

1. ❌ **Endpoint Conflict** - `/api/v1/auth/me` vs `/api/v1/users/me`
   - ✅ Verify which endpoint to use for GET profile data
   - ✅ Use `/users/me` for PATCH (update profile)

2. ❌ **Image Upload Size** - Trusting client validation
   - ✅ MUST validate 5MB limit on server-side

3. ❌ **MIME Type Trust** - Using `file.type` from client
   - ✅ Don't trust client, validate MIME type server-side

4. ❌ **Vercel Blob Setup** - Forgetting environment variable
   - ✅ Get `BLOB_READ_WRITE_TOKEN` from Vercel Dashboard

5. ❌ **Next.js Image Config** - Not adding Blob domain
   - ✅ Update `next.config.mjs` with Vercel Blob domain

6. ❌ **Inline Editing** - Creating separate `/profile/edit` route
   - ✅ Use inline editing (edit mode on same page)

7. ❌ **Badge Display** - Forgetting to show both badges
   - ✅ Show BOTH GratisBadge AND FoundingMemberBadge if user qualifies

8. ❌ **Password Hash Leak** - Returning `password_hash` in API
   - ✅ ALWAYS destructure and remove before returning user object

---

### 📚 References

**Epic Requirements:**
- [Source: docs/epics.md#Story 1.6 (Lines 1020-1073)]

**Architecture:**
- [Source: docs/architecture.md#Database Schema]
- [Source: docs/architecture.md#API Patterns]
- [Source: docs/architecture.md#Security Requirements]
- [Source: docs/architecture.md#File Upload Patterns]

**UX Design:**
- [Source: docs/ux-design-specification.md#Color System]
- [Source: docs/ux-design-specification.md#Typography]
- [Source: docs/ux-design-specification.md#Accessibility]
- [Source: docs/ux-design-specification.md#Form Patterns]

**Previous Story:**
- [Source: docs/sprint-artifacts/1-5-usv-mitgliedsnummer-verification.md]

**Existing Code:**
- `lib/services/user.service.ts` - setPassword(), completeProfile()
- `lib/shared/db/schema/users.ts` - Database schema
- `lib/utils/display-name.ts` - Display name logic
- `components/ui/GratisBadge.tsx` - Badge component pattern

---

## Dev Agent Record

### Context Reference

- **Epic 1 Story 1.6:** docs/epics.md (Lines 1020-1073)
- **Architecture:** docs/architecture.md
- **UX Design:** docs/ux-design-specification.md
- **Previous Story:** docs/sprint-artifacts/1-5-usv-mitgliedsnummer-verification.md
- **Database Schema:** lib/shared/db/schema/users.ts
- **User Service:** lib/services/user.service.ts
- **Display Name Utility:** lib/utils/display-name.ts
- **GratisBadge Component:** components/ui/GratisBadge.tsx

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Analysis Completion Notes

**create-story workflow analysis completed:**
- ✅ Exhaustive analysis of Epic 1 Story 1.6 from docs/epics.md (lines 1020-1073)
- ✅ Full architecture review for file upload patterns and API endpoints
- ✅ UX Design specification analysis for accessibility and form patterns
- ✅ Previous story analysis (1-5) for established patterns and learnings
- ✅ Git intelligence: Last 5 commits analyzed for recent work patterns
- ✅ Database schema verified: ALL fields already exist (no migration needed)
- ✅ Existing codebase patterns extracted: user.service.ts, display-name.ts, GratisBadge
- ✅ Security patterns documented: JWT, bcryptjs, rate limiting, file upload validation
- ✅ Web research: Vercel Blob Storage setup and integration patterns
- ✅ All 6 acceptance criteria mapped to 9 detailed tasks with subtasks
- ✅ Story marked as **ready-for-dev**

**CRITICAL DISCOVERIES:**
- ⚠️ `/api/v1/auth/me` vs `/api/v1/users/me` endpoint conflict needs clarification
- ⚠️ FoundingMemberBadge component does NOT exist yet (must be created)
- ✅ Vercel Blob Storage not yet configured (need BLOB_READ_WRITE_TOKEN)
- ✅ All database fields ready (profile_image_url, nickname, is_founding_member)
- ✅ Display name utility already exists from Story 1.4b
- ✅ GratisBadge component already exists from Story 1.5

### File List

**Created (Story 1.6 Implementation):**
- `app/profile/page.tsx` - Profile view/edit page ✅
- `app/profile/page.test.tsx` - Integration tests ✅
- `app/api/v1/users/me/route.ts` - Profile GET/PATCH endpoint ✅
- `app/api/v1/users/me/profile-image/route.ts` - Image upload endpoint ✅
- `components/ui/FoundingMemberBadge.tsx` - Founding member badge component ✅
- `components/ui/FoundingMemberBadge.test.tsx` - Badge unit tests ✅

**Modified (Story 1.6 Implementation):**
- `lib/services/user.service.ts` - Added updateProfile() function ✅
- `lib/services/user.service.test.ts` - Added updateProfile() tests ✅
- `lib/shared/schemas/auth.schema.ts` - Added updateProfileSchema ✅
- `next.config.mjs` - Added Vercel Blob remotePatterns ✅
- `package.json` - Added @vercel/blob dependency ✅
- `vitest.config.ts` - Created vitest config ✅

**Referenced (Already Existed):**
- `lib/jwt.ts` - JWT signing and verification
- `lib/password.ts` - Password hashing (bcryptjs)
- `lib/rate-limit.ts` - Rate limiting utility
- `lib/confetti.ts` - Confetti animation
- `lib/utils/display-name.ts` - Display name logic
- `components/ui/GratisBadge.tsx` - GRATIS badge component
- `lib/shared/db/schema/users.ts` - Database schema (all fields ready)

---

**Status:** review
**Created:** 2025-12-24
**Updated:** 2025-12-25 (Code Review Fixes Applied)

## Senior Developer Review (AI)

**Review Date:** 2025-12-25
**Reviewer:** Claude Opus 4.5 (Code Review Workflow)

### Issues Found and Fixed:

1. **CRITICAL:** `lib/services/user.service.test.ts` - 10 tests failing due to incorrect Drizzle ORM mocking
   - **Fix:** Rewrote test mocking strategy using `vi.mock()` and helper functions ✅

2. **CRITICAL:** No tests for `updateProfile()` function
   - **Fix:** Added 5 comprehensive tests for updateProfile() ✅

3. **MEDIUM:** `next.config.mjs` - Wildcard in images.domains doesn't work
   - **Fix:** Changed to remotePatterns with proper wildcard support ✅

4. **MEDIUM:** 3 tests skipped in `app/profile/page.test.tsx`
   - **Fix:** Re-enabled and fixed all 3 skipped tests ✅

5. **MEDIUM:** vitest running old apps/api tests
   - **Fix:** Added exclude patterns to vitest.config.ts ✅

6. **LOW:** Story status mismatch (ready-for-dev vs review)
   - **Fix:** Updated story status to match sprint-status.yaml ✅

7. **LOW:** Task checkboxes not reflecting actual completion
   - **Fix:** Updated all completed tasks to [x] ✅

### Remaining Items:
- [ ] AC1: USV-Nummer editing when not verified (design decision needed)
- [ ] Accessibility audit should be run manually with Lighthouse

**Outcome:** CHANGES APPLIED - Ready for final test verification
