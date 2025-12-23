import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/jwt'
import { db } from '@/lib/db/connection'
import { users } from '@urc-falke/shared/db'
import { eq } from 'drizzle-orm'

/**
 * GET /api/v1/auth/me
 *
 * Get current authenticated user
 *
 * Requires: Valid JWT in accessToken cookie
 *
 * Success Response (200 OK):
 *   {
 *     "id": 1,
 *     "email": "user@example.com",
 *     "role": "member",
 *     ...
 *   }
 *
 * Error Responses:
 *   - 401: Not authenticated or token expired
 *   - 500: Internal server error
 */
export async function GET(_request: NextRequest) {
  try {
    // Get token from cookie
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    if (!token) {
      return NextResponse.json(
        {
          type: 'https://urc-falke.app/errors/unauthorized',
          title: 'Nicht autorisiert',
          status: 401,
          detail: 'Bitte melde dich an.',
        },
        { status: 401 }
      )
    }

    // Verify JWT token
    const payload = await verifyAccessToken(token)

    // Fetch user from database
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        first_name: users.first_name,
        last_name: users.last_name,
        role: users.role,
        onboarding_status: users.onboarding_status,
        must_change_password: users.must_change_password,
        usv_number: users.usv_number,
        is_usv_verified: users.is_usv_verified,
        created_at: users.created_at,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1)

    if (!user) {
      return NextResponse.json(
        {
          type: 'https://urc-falke.app/errors/unauthorized',
          title: 'Nicht autorisiert',
          status: 401,
          detail: 'Benutzer nicht gefunden.',
        },
        { status: 401 }
      )
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    // Token verification failed
    console.error('[API] Auth me error:', error)
    return NextResponse.json(
      {
        type: 'https://urc-falke.app/errors/unauthorized',
        title: 'Nicht autorisiert',
        status: 401,
        detail: 'Sitzung abgelaufen. Bitte erneut anmelden.',
      },
      { status: 401 }
    )
  }
}
