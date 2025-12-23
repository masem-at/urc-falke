import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/jwt'
import { verifyUSVNumber } from '@/lib/services/usv-verification.service'
import { usvVerifySchema } from '@urc-falke/shared'
import type { ZodError } from 'zod'

/**
 * POST /api/v1/usv/verify
 *
 * Verify USV (Untersee Volleyball) membership number
 *
 * Requires: Valid JWT in accessToken cookie
 *
 * Request Body:
 *   - usvNumber: string (USV membership number)
 *
 * Success Response (200 OK):
 *   {
 *     "valid": true,
 *     "memberSince": "2018-01-15"
 *   }
 *
 * Error Responses:
 *   - 400: Validation error (invalid USV number format)
 *   - 401: Not authenticated
 *   - 500: Internal server error (USV API unavailable)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
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

    // Verify JWT and get user ID
    const payload = await verifyAccessToken(token)

    // Parse and validate request body
    const body = await request.json()
    const validated = usvVerifySchema.parse(body)

    // Call USV verification service
    const result = await verifyUSVNumber(validated.usvNumber, payload.userId)

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
    console.error('[API] USV verify error:', error)
    return NextResponse.json(
      {
        type: 'https://urc-falke.app/errors/internal',
        title: 'Interner Serverfehler',
        status: 500,
        detail: 'USV-Verifizierung fehlgeschlagen. Bitte später erneut versuchen.',
      },
      { status: 500 }
    )
  }
}
