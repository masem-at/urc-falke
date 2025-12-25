export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'
import { verifyAccessToken } from '@/lib/jwt'
import { updateProfile, deleteUserAccount } from '@/lib/services/user.service'
import { updateProfileSchema } from '@/lib/shared'
import { db } from '@/lib/db/connection'
import { users } from '@/lib/shared/db'
import { eq } from 'drizzle-orm'
import type { ZodError } from 'zod'
import { checkRateLimit, RATE_LIMITS } from '@/lib/utils/rate-limiter'

/**
 * GET /api/v1/users/me
 *
 * Get current user's full profile (for profile page)
 *
 * Requires: Valid JWT in accessToken cookie
 *
 * Success Response (200 OK):
 *   {
 *     "id": 1,
 *     "email": "user@example.com",
 *     "firstName": "Max",
 *     "lastName": "Mustermann",
 *     "nickname": "Maxi",
 *     "profileImageUrl": "https://...",
 *     "isFoundingMember": true,
 *     "isUsvVerified": true,
 *     ...
 *   }
 *
 * Error Responses:
 *   - 401: Not authenticated
 *   - 404: User not found
 *   - 500: Internal server error
 */
export async function GET(_request: NextRequest) {
  try {
    // 1. Check authentication
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    if (!token) {
      return NextResponse.json(
        {
          type: 'https://urc-falke.app/errors/unauthorized',
          title: 'Nicht authentifiziert',
          status: 401,
          detail: 'Du musst angemeldet sein um dein Profil anzusehen.',
        },
        { status: 401 }
      )
    }

    // 2. Verify JWT and get user ID
    const payload = await verifyAccessToken(token)

    // 3. Fetch full user profile from database (WITHOUT password_hash)
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        first_name: users.first_name,
        last_name: users.last_name,
        nickname: users.nickname,
        profile_image_url: users.profile_image_url,
        role: users.role,
        onboarding_status: users.onboarding_status,
        must_change_password: users.must_change_password,
        usv_number: users.usv_number,
        is_usv_verified: users.is_usv_verified,
        is_founding_member: users.is_founding_member,
        onboarding_token: users.onboarding_token,
        onboarding_token_expires: users.onboarding_token_expires,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1)

    if (!user) {
      return NextResponse.json(
        {
          type: 'https://urc-falke.app/errors/user-not-found',
          title: 'Benutzer nicht gefunden',
          status: 404,
          detail: 'Der Benutzer wurde nicht gefunden.',
        },
        { status: 404 }
      )
    }

    // 4. Return full user profile
    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    // Token verification failed or other error
    console.error('[API] Get user profile error:', error)
    return NextResponse.json(
      {
        type: 'https://urc-falke.app/errors/internal',
        title: 'Interner Serverfehler',
        status: 500,
        detail: 'Ein unerwarteter Fehler ist aufgetreten.',
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/v1/users/me
 *
 * Update current user's profile fields
 *
 * Requires: Valid JWT in accessToken cookie
 *
 * Request Body:
 *   - firstName?: string (min 2 chars, max 50)
 *   - lastName?: string (min 2 chars, max 50)
 *   - nickname?: string (max 50 chars)
 *
 * Success Response (200 OK):
 *   {
 *     "user": { ... }
 *   }
 *
 * Error Responses:
 *   - 400: Validation error
 *   - 401: Not authenticated
 *   - 404: User not found
 *   - 500: Internal server error
 */
export async function PATCH(request: NextRequest) {
  try {
    // 1. Check authentication
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    if (!token) {
      return NextResponse.json(
        {
          type: 'https://urc-falke.app/errors/unauthorized',
          title: 'Nicht authentifiziert',
          status: 401,
          detail: 'Du musst angemeldet sein um dein Profil zu bearbeiten.',
        },
        { status: 401 }
      )
    }

    // 2. Verify JWT and get user ID
    const payload = await verifyAccessToken(token)

    // 3. Parse and validate request body
    const body = await request.json()
    const validated = updateProfileSchema.parse(body)

    // 4. Update profile using service
    const updatedUser = await updateProfile(payload.userId, validated)

    // 5. Return updated user
    return NextResponse.json(
      {
        user: updatedUser,
      },
      { status: 200 }
    )
  } catch (error) {
    // Zod validation error
    if (error && typeof error === 'object' && 'issues' in error) {
      const zodError = error as ZodError
      return NextResponse.json(
        {
          type: 'https://urc-falke.app/errors/validation',
          title: 'Validierungsfehler',
          status: 400,
          detail: 'Die eingegebenen Daten sind ungültig.',
          errors: zodError.issues,
        },
        { status: 400 }
      )
    }

    // ProblemDetails error from service (e.g., user not found)
    if (error && typeof error === 'object' && 'status' in error) {
      const problemDetails = error as any
      return NextResponse.json(problemDetails, { status: problemDetails.status })
    }

    // Unexpected error
    console.error('[API] Update user profile error:', error)
    return NextResponse.json(
      {
        type: 'https://urc-falke.app/errors/internal',
        title: 'Interner Serverfehler',
        status: 500,
        detail: 'Ein unerwarteter Fehler ist aufgetreten.',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/v1/users/me
 *
 * Delete current user's account (DSGVO compliance)
 *
 * Requires: Valid JWT in accessToken cookie
 *
 * This endpoint:
 * - Deletes profile image from Vercel Blob Storage (if exists)
 * - Deletes user record from database
 * - Clears accessToken cookie (logout)
 *
 * Success Response (200 OK):
 *   {
 *     "message": "Dein Account wurde erfolgreich gelöscht."
 *   }
 *   Clears accessToken cookie
 *
 * Error Responses:
 *   - 401: Not authenticated
 *   - 404: User not found
 *   - 500: Internal server error
 */
export async function DELETE(_request: NextRequest) {
  try {
    // 0. Rate limiting (DSGVO-critical endpoint)
    const headersList = await headers()
    const clientIp = headersList.get('x-forwarded-for')?.split(',')[0]?.trim()
      || headersList.get('x-real-ip')
      || 'unknown'
    const rateLimitKey = `account-delete:${clientIp}`
    const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.ACCOUNT_DELETE)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          type: 'https://urc-falke.app/errors/rate-limit',
          title: 'Zu viele Anfragen',
          status: 429,
          detail: `Bitte warte ${rateLimit.retryAfter} Sekunden bevor du es erneut versuchst.`,
          instance: '/api/v1/users/me'
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfter) }
        }
      )
    }

    // 1. Check authentication
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    if (!token) {
      return NextResponse.json(
        {
          type: 'https://urc-falke.app/errors/unauthorized',
          title: 'Nicht authentifiziert',
          status: 401,
          detail: 'Du musst angemeldet sein um deinen Account zu löschen.',
          instance: '/api/v1/users/me'
        },
        { status: 401 }
      )
    }

    // 2. Verify JWT and get user ID
    const payload = await verifyAccessToken(token)

    // 3. Delete account using service
    await deleteUserAccount(payload.userId)

    // 4. Clear auth cookie (logout)
    cookieStore.delete('accessToken')

    // 5. Return success message
    return NextResponse.json(
      {
        message: 'Dein Account wurde erfolgreich gelöscht.'
      },
      { status: 200 }
    )
  } catch (error) {
    // ProblemDetails error from service (e.g., user not found)
    if (error && typeof error === 'object' && 'status' in error) {
      const problemDetails = error as { status: number }
      return NextResponse.json(error, { status: problemDetails.status })
    }

    // Unexpected error
    console.error('[API] Delete user account error:', error)
    return NextResponse.json(
      {
        type: 'https://urc-falke.app/errors/internal',
        title: 'Interner Serverfehler',
        status: 500,
        detail: 'Ein unerwarteter Fehler ist aufgetreten.',
        instance: '/api/v1/users/me'
      },
      { status: 500 }
    )
  }
}
