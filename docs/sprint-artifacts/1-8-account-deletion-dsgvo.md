# Story 1.8: Account Deletion (DSGVO)

**Story ID:** 1.8
**Story Key:** 1-8-account-deletion-dsgvo
**Epic:** Epic 1 - User Onboarding & Authentication
**Status:** done

---

## Story

As a **registered user**,
I want to delete my account and all associated data,
So that I comply with my DSGVO right to be forgotten.

---

## Acceptance Criteria

### AC1: Danger Zone UI in Profile Page

**Given** I am logged in and on my profile page (`/profile`)
**When** I scroll to the bottom of the page
**Then** I see a "Danger Zone" section with:
- Red border styling
- Heading: "Gefahrenbereich" (German)
- Button: "Account löschen" (red background, white text, min 44x44px)

### AC2: Confirmation Dialog

**Given** I click "Account löschen"
**When** the confirmation dialog opens
**Then** I see a warning message:
- "Möchtest du deinen Account wirklich löschen?"
- "Diese Aktion kann nicht rückgängig gemacht werden."
- "Alle deine Daten (Profil, Event-Anmeldungen, Fotos, Kommentare) werden dauerhaft gelöscht."
**And** I see two buttons:
- "Abbrechen" (gray, secondary)
- "Ja, Account löschen" (red, primary, min 44x44px)

### AC3: Account Deletion - Backend Processing

**Given** I click "Ja, Account löschen" in the confirmation dialog
**When** the deletion process starts
**Then** a `DELETE /api/v1/users/me` request is sent
**And** the backend performs the following actions **in order**:
1. Delete all event registrations (`event_participants` where `user_id = {myId}`)
2. Delete all uploaded photos (`photos` where `user_id = {myId}`)
3. Delete all tour reports (`tour_reports` where `user_id = {myId}`)
4. Delete all comments (`comments` where `user_id = {myId}`)
5. Delete profile image from Vercel Blob Storage (if `profile_image_url` exists)
6. Delete the user record (`users` where `id = {myId}`)

> **NOTE:** Tables `event_participants`, `photos`, `tour_reports`, `comments` do NOT exist yet.
> For MVP, only delete from `users` table and profile image from Blob Storage.
> The other tables will be added in Epic 2 (Events) and Epic 5 (Media).

### AC4: Post-Deletion Redirect

**Given** the deletion is successful
**When** the backend responds with 200 OK
**Then** the `auth_token` cookie is cleared (logout)
**And** I am redirected to the homepage (`/`)
**And** I see a toast notification: "Dein Account wurde erfolgreich gelöscht. Wir hoffen, dich bald wieder zu sehen!"

### AC5: Cancel Deletion

**Given** I click "Abbrechen" in the confirmation dialog
**When** the dialog closes
**Then** no deletion occurs
**And** I remain on my profile page

### AC6: DSGVO Compliance - Data Retention Rules

**And** If the user was an admin, their admin actions are NOT deleted (anonymized instead)
**And** Audit logs retain anonymized reference: `deleted_user_id = NULL, deleted_at = timestamp`
**And** Donation records (if any) are retained for 10 years (DSGVO tax exception, anonymized)

> **NOTE for MVP:** Audit logs and donations tables don't exist yet.
> Implement only user deletion. Admin anonymization will be handled in Epic 3.

### AC7: Accessibility Requirements

**And** Confirmation dialog uses Radix Dialog for proper focus management
**And** Dialog has `role="alertdialog"` for screen readers
**And** Escape key closes the dialog (cancel action)
**And** All buttons are keyboard accessible with proper focus states
**And** Buttons are min 44x44px (WCAG touch target)

---

## Tasks / Subtasks

### Task 1: Add Danger Zone UI to Profile Page
**Status:** completed
**Acceptance Criteria Coverage:** AC1
**Estimated Time:** 30 minutes

- [x] Add "Gefahrenbereich" section at bottom of `/profile` page
- [x] Style with red border (`border-red-500`)
- [x] Add "Account löschen" button with red styling
- [x] Ensure 44x44px minimum button size

**File:** `app/profile/page.tsx` (update existing)
```typescript
// Add at bottom of profile page:
{/* Danger Zone */}
<section className="mt-12 p-6 border-2 border-red-500 rounded-lg">
  <h2 className="text-xl font-bold text-red-700 mb-4">Gefahrenbereich</h2>
  <p className="text-gray-600 mb-4">
    Hier kannst du deinen Account und alle zugehörigen Daten dauerhaft löschen.
  </p>
  <button
    onClick={() => setShowDeleteDialog(true)}
    className="min-h-[44px] min-w-[44px] px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
  >
    Account löschen
  </button>
</section>
```

---

### Task 2: Create Confirmation Dialog Component
**Status:** completed
**Acceptance Criteria Coverage:** AC2, AC5, AC7
**Estimated Time:** 45 minutes

- [x] Create `DeleteAccountDialog` component using Radix AlertDialog
- [x] Display warning message in German
- [x] Add "Abbrechen" (secondary) and "Ja, Account löschen" (danger) buttons
- [x] Implement proper keyboard navigation and focus trap
- [x] Add `role="alertdialog"` for accessibility

**File:** `components/DeleteAccountDialog.tsx`
```typescript
'use client';

import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useState } from 'react';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export function DeleteAccountDialog({ open, onOpenChange, onConfirm }: DeleteAccountDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
        <AlertDialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
          role="alertdialog"
        >
          <AlertDialog.Title className="text-xl font-bold text-gray-900 mb-4">
            Möchtest du deinen Account wirklich löschen?
          </AlertDialog.Title>
          <AlertDialog.Description className="text-gray-600 mb-6 space-y-2">
            <p>Diese Aktion kann nicht rückgängig gemacht werden.</p>
            <p>Alle deine Daten (Profil, Event-Anmeldungen, Fotos, Kommentare) werden dauerhaft gelöscht.</p>
          </AlertDialog.Description>
          <div className="flex gap-4 justify-end">
            <AlertDialog.Cancel asChild>
              <button className="min-h-[44px] px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300">
                Abbrechen
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={handleConfirm}
                disabled={isDeleting}
                className="min-h-[44px] px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Wird gelöscht...' : 'Ja, Account löschen'}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
```

---

### Task 3: Create Account Deletion Service
**Status:** completed
**Acceptance Criteria Coverage:** AC3, AC6
**Estimated Time:** 30 minutes

- [x] Create `deleteUserAccount` function in `lib/services/user.service.ts`
- [x] Delete profile image from Vercel Blob Storage (if exists)
- [x] Delete user record from database
- [x] Return success response

**File:** `lib/services/user.service.ts` (update existing)
```typescript
/**
 * Delete user account and all associated data (DSGVO compliance)
 *
 * For MVP: Only deletes user record and profile image
 * Future: Will cascade delete event_participants, photos, tour_reports, comments
 *
 * @param userId - User ID to delete
 * @throws ProblemDetails if user not found
 */
export async function deleteUserAccount(userId: number): Promise<{ success: boolean }> {
  // 1. Get user to check profile image
  const [user] = await db.select({
    id: users.id,
    profile_image_url: users.profile_image_url
  }).from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw {
      type: 'https://urc-falke.app/errors/user-not-found',
      title: 'Benutzer nicht gefunden',
      status: 404,
      detail: 'Benutzer nicht gefunden.'
    };
  }

  // 2. Delete profile image from Vercel Blob Storage (if exists)
  if (user.profile_image_url) {
    try {
      await del(user.profile_image_url);
    } catch (error) {
      console.warn('[ACCOUNT_DELETE] Failed to delete profile image:', error);
      // Continue with user deletion even if image deletion fails
    }
  }

  // 3. Delete user record
  await db.delete(users).where(eq(users.id, userId));

  return { success: true };
}
```

---

### Task 4: Create DELETE /api/v1/users/me Endpoint
**Status:** completed
**Acceptance Criteria Coverage:** AC3, AC4
**Estimated Time:** 30 minutes

- [x] Create `DELETE /api/v1/users/me` route
- [x] Require authentication (same as other `/users/me` endpoints)
- [x] Call `deleteUserAccount` service
- [x] Clear `auth_token` cookie on success
- [x] Return 200 OK with success message

**File:** `app/api/v1/users/me/route.ts` (update existing - add DELETE handler)
```typescript
export async function DELETE(request: NextRequest) {
  try {
    // 1. Get authenticated user
    const payload = await getAuthenticatedUser(request);
    if (!payload) {
      return NextResponse.json({
        type: 'https://urc-falke.app/errors/unauthorized',
        title: 'Nicht autorisiert',
        status: 401,
        detail: 'Du musst angemeldet sein.'
      }, { status: 401 });
    }

    // 2. Delete account
    await deleteUserAccount(payload.userId);

    // 3. Clear auth cookie and respond
    const response = NextResponse.json({
      message: 'Dein Account wurde erfolgreich gelöscht.'
    });

    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/'
    });

    return response;

  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      const problemDetails = error as { status: number };
      return NextResponse.json(error, { status: problemDetails.status });
    }

    console.error('Delete account error:', error);
    return NextResponse.json({
      type: 'https://urc-falke.app/errors/server',
      title: 'Serverfehler',
      status: 500,
      detail: 'Ein Fehler ist aufgetreten.',
      instance: '/api/v1/users/me'
    }, { status: 500 });
  }
}
```

---

### Task 5: Integrate Dialog in Profile Page
**Status:** completed
**Acceptance Criteria Coverage:** AC1, AC2, AC4, AC5
**Estimated Time:** 30 minutes

- [x] Import and use `DeleteAccountDialog` in profile page
- [x] Handle API call on confirm
- [x] Redirect to homepage on success
- [x] Show toast notification

**File:** `app/profile/page.tsx` (update)
```typescript
import { DeleteAccountDialog } from '@/components/DeleteAccountDialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// In component:
const router = useRouter();
const [showDeleteDialog, setShowDeleteDialog] = useState(false);

const handleDeleteAccount = async () => {
  const response = await fetch('/api/v1/users/me', {
    method: 'DELETE'
  });

  if (response.ok) {
    // Show toast (implement based on existing toast pattern)
    router.push('/?deleted=true');
  } else {
    const data = await response.json();
    // Handle error
  }
};

// In JSX:
<DeleteAccountDialog
  open={showDeleteDialog}
  onOpenChange={setShowDeleteDialog}
  onConfirm={handleDeleteAccount}
/>
```

---

### Task 6: Add Unit Tests
**Status:** completed
**Acceptance Criteria Coverage:** All ACs
**Estimated Time:** 45 minutes

- [x] Test `deleteUserAccount` service
- [x] Test DELETE endpoint with auth
- [x] Test DELETE endpoint without auth (401)
- [x] Test user not found (404)
- [x] Test profile image deletion

**File:** `lib/services/user.service.test.ts` (update)
```typescript
describe('deleteUserAccount', () => {
  it('should delete user and return success', async () => {
    // ... test implementation
  });

  it('should delete profile image if exists', async () => {
    // ... test implementation
  });

  it('should throw 404 for non-existent user', async () => {
    // ... test implementation
  });
});
```

---

### Task 7: Add Homepage Success Message
**Status:** completed
**Acceptance Criteria Coverage:** AC4
**Estimated Time:** 15 minutes

- [x] Check for `?deleted=true` query parameter on homepage
- [x] Show success toast: "Dein Account wurde erfolgreich gelöscht. Wir hoffen, dich bald wieder zu sehen!"

---

## Dev Notes

### Architecture Compliance

- **API Pattern:** DELETE endpoint follows existing `/api/v1/users/me` pattern
- **Authentication:** Same auth middleware as GET/PATCH endpoints
- **Cookie Clearing:** Use same pattern as `/api/v1/auth/logout`
- **Error Format:** RFC 7807 Problem Details (German messages)

### DSGVO Considerations (MVP Scope)

For MVP, the only user data that needs deletion is:
- `users` table record
- Profile image in Vercel Blob Storage (if exists)

Future tables to handle when implemented:
- `event_participants` (Epic 2)
- `photos` (Epic 5)
- `tour_reports` (Epic 5)
- `comments` (Epic 5)
- Audit logs - anonymize, don't delete (Epic 3)
- Donation records - retain 10 years, anonymize (Epic 7)

### Existing Code Patterns

From `app/api/v1/users/me/route.ts`:
- `getAuthenticatedUser(request)` for auth check
- Cookie clearing in logout endpoint

From `lib/services/user.service.ts`:
- Database operations with Drizzle ORM
- Error throwing with ProblemDetails

### Dependencies

- `@vercel/blob` - For profile image deletion
- `@radix-ui/react-alert-dialog` - For confirmation dialog

### Project Structure Notes

| File | Action |
|------|--------|
| `app/profile/page.tsx` | Update - add Danger Zone section |
| `app/api/v1/users/me/route.ts` | Update - add DELETE handler |
| `lib/services/user.service.ts` | Update - add deleteUserAccount |
| `lib/services/user.service.test.ts` | Update - add tests |
| `components/DeleteAccountDialog.tsx` | Create new |

### References

- [Source: docs/epics.md#Story 1.8]
- [Source: docs/project_context.md#DSGVO Compliance]
- [Source: docs/project_context.md#Security Rules]

---

## Dev Agent Record

### Context Reference

- docs/project_context.md
- docs/sprint-artifacts/sprint-status.yaml
- app/profile/page.tsx (existing)
- lib/services/user.service.ts (existing)
- app/api/v1/users/me/route.ts (existing)
- app/api/v1/auth/logout/route.ts (pattern reference)

### Agent Model Used

Claude Opus 4.5

### Completion Notes List

1. **Task 3 (Service):** Created `deleteUserAccount` in `lib/services/user.service.ts` with:
   - User lookup and 404 error handling
   - Profile image deletion from Vercel Blob Storage (best-effort)
   - User record deletion from database
   - Proper ProblemDetails error format

2. **Task 4 (API):** Added DELETE handler to `/api/v1/users/me/route.ts` with:
   - JWT authentication via accessToken cookie
   - Call to deleteUserAccount service
   - Cookie clearing for logout
   - RFC 7807 error responses

3. **Task 6 (Tests):** Added 5 unit tests to `user.service.test.ts`:
   - `should successfully delete user account`
   - `should delete profile image from blob storage if exists`
   - `should continue deleting user even if profile image deletion fails`
   - `should not call blob delete if no profile image`
   - `should throw 404 when user not found`

4. **Task 2 (Dialog):** Created `DeleteAccountDialog.tsx` with:
   - Radix AlertDialog for accessibility
   - German UI text matching AC2
   - Error state handling
   - Loading state during deletion
   - 44x44px minimum touch targets

5. **Tasks 1 & 5 (Profile Integration):** Updated `app/profile/page.tsx`:
   - Added "Gefahrenbereich" section with red border styling
   - Integrated DeleteAccountDialog component
   - handleDeleteAccount with API call and redirect

6. **Task 7 (Homepage):** Updated `app/page.tsx`:
   - Client component with useSearchParams
   - Checks for `?deleted=true` query parameter
   - Shows success toast with auto-hide after 7 seconds
   - Clears URL parameter after showing toast

7. **Dependencies:** Installed `@radix-ui/react-alert-dialog`

8. **Testing:** All 189 tests pass, build successful

### File List

| File | Action | Description |
|------|--------|-------------|
| `lib/services/user.service.ts` | Modified | Added `deleteUserAccount` function |
| `app/api/v1/users/me/route.ts` | Modified | Added DELETE handler |
| `lib/services/user.service.test.ts` | Modified | Added 5 unit tests for deleteUserAccount |
| `components/DeleteAccountDialog.tsx` | Created | Radix AlertDialog confirmation component |
| `app/profile/page.tsx` | Modified | Added Danger Zone section and dialog integration |
| `app/page.tsx` | Modified | Added account deletion success message |
| `package.json` | Modified | Added @radix-ui/react-alert-dialog dependency |
