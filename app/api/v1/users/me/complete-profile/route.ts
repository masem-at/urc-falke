export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/jwt'
import { completeProfile } from '@/lib/services/user.service'
import { completeProfileSchema } from '@/lib/shared'
import type { ZodError } from 'zod'

/**
 * PUT /api/v1/users/me/complete-profile
 *
 * Complete profile for Track A user during onboarding
 *
 * Requires: Valid JWT in accessToken cookie
 *
 * Request Body (all optional):
 *   - firstName: string (min 2 chars)
 *   - lastName: string (min 2 chars)
 *   - profileImageUrl: string (valid URL)
 *
 * Success Response (200 OK):
 *   {
 *     "user": { ... },
 *     "showConfetti": true
 *   }
 *
 * CRITICAL: After successful completion, frontend should show confetti
 * animation (1000ms duration, 50 particles) to celebrate
 *
 * Error Responses:
 *   - 400: Validation error
 *   - 401: Not authenticated
 *   - 403: Must change password first
 *   - 404: User not found
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
          detail: 'Du musst angemeldet sein um dein Profil zu vervollständigen.',
        },
        { status: 401 }
      )
    }

    // Verify JWT and get user ID
    const payload = await verifyAccessToken(token)

    // Parse and validate request body
    const body = await request.json()
    const validated = completeProfileSchema.parse(body)

    // Call user service
    const result = await completeProfile(payload.userId, validated)

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
    console.error('[API] Complete profile error:', error)
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
