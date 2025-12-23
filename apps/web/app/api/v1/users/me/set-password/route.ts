import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/jwt'
import { setPassword } from '@/lib/services/user.service'
import { setPasswordSchema } from '@urc-falke/shared'
import type { ZodError } from 'zod'

/**
 * PUT /api/v1/users/me/set-password
 *
 * Set password for Track A user during onboarding
 *
 * Requires: Valid JWT in accessToken cookie (even with must_change_password=true)
 *
 * Request Body:
 *   - password: string (min 8 chars, uppercase, lowercase, number)
 *
 * Success Response (200 OK):
 *   {
 *     "user": { ... },
 *     "redirectTo": "/onboard-existing/complete-profile"
 *   }
 *
 * CRITICAL: After successful password change, user should be redirected to
 * /onboard-existing/complete-profile to finalize onboarding
 *
 * Error Responses:
 *   - 400: Validation error (password requirements)
 *   - 401: Not authenticated
 *   - 404: User not found
 *   - 409: Password already set
 *   - 500: Internal server error
 */
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    if (!token) {
      return NextResponse.json(
        {
          type: 'https://urc-falke.app/errors/unauthorized',
          title: 'Nicht authentifiziert',
          status: 401,
          detail: 'Du musst angemeldet sein um dein Passwort zu setzen.',
        },
        { status: 401 }
      )
    }

    // Verify JWT and get user ID
    const payload = await verifyAccessToken(token)

    // Parse and validate request body
    const body = await request.json()
    const validated = setPasswordSchema.parse(body)

    // Call user service
    const result = await setPassword(payload.userId, validated)

    return NextResponse.json(result, { status: 200 })
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

    // ProblemDetails error from service
    if (error && typeof error === 'object' && 'status' in error) {
      const problemDetails = error as any
      return NextResponse.json(problemDetails, { status: problemDetails.status })
    }

    // Unexpected error
    console.error('[API] Set password error:', error)
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
