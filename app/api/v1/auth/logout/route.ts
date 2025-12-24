export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * POST /api/v1/auth/logout
 *
 * Logout user by clearing accessToken cookie
 *
 * Success Response (200 OK):
 *   {
 *     "message": "Erfolgreich abgemeldet"
 *   }
 *   Clears accessToken cookie
 */
export async function POST() {
  try {
    // Clear the accessToken cookie
    const cookieStore = await cookies()
    cookieStore.delete('accessToken')

    return NextResponse.json(
      {
        message: 'Erfolgreich abgemeldet',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API] Logout error:', error)
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
