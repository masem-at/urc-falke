import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { registerUser } from '@/lib/services/auth.service'
import { signupSchema } from '@urc-falke/shared'
import type { ZodError } from 'zod'

/**
 * POST /api/v1/auth/register
 *
 * Register a new user (Track B: New Members)
 *
 * Request Body:
 *   - email: string (valid email)
 *   - password: string (min 8 chars, uppercase, lowercase, number)
 *   - firstName: string (optional)
 *   - lastName: string (optional)
 *
 * Success Response (201 Created):
 *   {
 *     "user": { id, email, role, ... }
 *   }
 *   Sets accessToken cookie (HttpOnly, Secure, SameSite=lax)
 *
 * Error Responses:
 *   - 400: Validation error (password requirements, invalid email)
 *   - 409: Email already registered
 *   - 500: Internal server error
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validated = signupSchema.parse(body)

    // Call auth service
    const result = await registerUser(validated)

    // Set HttpOnly cookie with JWT
    const cookieStore = await cookies()
    cookieStore.set('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    })

    // Return user info
    return NextResponse.json(
      {
        user: result.user,
      },
      { status: 201 }
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

    // ProblemDetails error from service
    if (error && typeof error === 'object' && 'status' in error) {
      const problemDetails = error as any
      return NextResponse.json(problemDetails, { status: problemDetails.status })
    }

    // Unexpected error
    console.error('[API] Register error:', error)
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
