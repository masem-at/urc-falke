export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { loginUser } from '@/lib/services/auth.service'
import { loginSchema } from '@/lib/shared'
import type { ZodError } from 'zod'

/**
 * POST /api/v1/auth/login
 *
 * Authenticate user with email and password
 *
 * Request Body:
 *   - email: string (valid email)
 *   - password: string
 *
 * Success Response (200 OK):
 *   {
 *     "user": { id, email, role, ... },
 *     "redirectTo": "/dashboard" | "/onboard-existing/set-password"
 *   }
 *   Sets accessToken cookie (HttpOnly, Secure, SameSite=lax)
 *
 * Error Responses:
 *   - 400: Validation error (invalid email format)
 *   - 401: Invalid credentials
 *   - 500: Internal server error
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validated = loginSchema.parse(body)

    // Call auth service
    const result = await loginUser(validated)

    // Set HttpOnly cookie with JWT
    const cookieStore = await cookies()
    cookieStore.set('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    })

    // Return user info and redirect
    return NextResponse.json(
      {
        user: result.user,
        redirectTo: result.user.must_change_password
          ? '/onboard-existing/set-password'
          : '/dashboard',
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

    // ProblemDetails error from service
    if (error && typeof error === 'object' && 'status' in error) {
      const problemDetails = error as any
      return NextResponse.json(problemDetails, { status: problemDetails.status })
    }

    // Unexpected error
    console.error('[API] Login error:', error)
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
