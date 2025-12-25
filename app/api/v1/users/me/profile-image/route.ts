export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/jwt'
import { put } from '@vercel/blob'
import { db } from '@/lib/db/connection'
import { users } from '@/lib/shared/db'
import { eq } from 'drizzle-orm'
import { checkRateLimit } from '@/lib/rate-limit'

/**
 * POST /api/v1/users/me/profile-image
 *
 * Upload profile image for authenticated user
 *
 * Requires: Valid JWT in accessToken cookie
 *
 * Request Body (multipart/form-data):
 *   - image: File (max 5MB, JPG/PNG/WebP only)
 *
 * Success Response (200 OK):
 *   {
 *     "profileImageUrl": "https://..."
 *   }
 *
 * Rate Limit: 3 uploads per hour per user
 *
 * Error Responses:
 *   - 400: Validation error (missing file, too large, invalid format)
 *   - 401: Not authenticated
 *   - 429: Too many requests (rate limit exceeded)
 *   - 500: Internal server error
 */
export async function POST(request: NextRequest) {
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
          detail: 'Du musst angemeldet sein um dein Profilbild hochzuladen.',
        },
        { status: 401 }
      )
    }

    // 2. Verify JWT and get user ID
    const payload = await verifyAccessToken(token)

    // 3. Check rate limit (3 uploads per hour per user)
    const rateLimitResult = checkRateLimit(`profile-image:${payload.userId}`, {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3, // 3 uploads per hour
    })

    if (!rateLimitResult.success) {
      const resetTimeDate = new Date(rateLimitResult.resetTime)
      const resetTimeFormatted = resetTimeDate.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
      })

      return NextResponse.json(
        {
          type: 'https://urc-falke.app/errors/rate-limit',
          title: 'Zu viele Anfragen',
          status: 429,
          detail: `Du kannst nur 3 Profilbilder pro Stunde hochladen. Versuche es um ${resetTimeFormatted} Uhr erneut.`,
        },
        { status: 429 }
      )
    }

    // 4. Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('image') as File | null

    // 5. Validate file existence
    if (!file) {
      return NextResponse.json(
        {
          type: 'https://urc-falke.app/errors/validation',
          title: 'Keine Datei hochgeladen',
          status: 400,
          detail: 'Bitte wähle eine Bilddatei aus.',
        },
        { status: 400 }
      )
    }

    // 6. Validate file size (max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          type: 'https://urc-falke.app/errors/validation',
          title: 'Datei zu groß',
          status: 400,
          detail: 'Die Datei darf maximal 5MB groß sein.',
        },
        { status: 400 }
      )
    }

    // 7. Validate file type (JPG/PNG/WebP only)
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          type: 'https://urc-falke.app/errors/validation',
          title: 'Ungültiges Dateiformat',
          status: 400,
          detail: 'Nur JPG, PNG und WebP Dateien sind erlaubt.',
        },
        { status: 400 }
      )
    }

    // 8. Upload to Vercel Blob Storage
    const blob = await put(
      `profile-images/${payload.userId}/${Date.now()}-${file.name}`,
      file,
      {
        access: 'public',
        addRandomSuffix: false,
      }
    )

    // 9. Update user record in database
    await db
      .update(users)
      .set({
        profile_image_url: blob.url,
        updated_at: new Date(),
      })
      .where(eq(users.id, payload.userId))

    // 10. Return new profile image URL
    return NextResponse.json(
      {
        profileImageUrl: blob.url,
      },
      { status: 200 }
    )
  } catch (error) {
    // Unexpected error
    console.error('[API] Profile image upload error:', error)
    return NextResponse.json(
      {
        type: 'https://urc-falke.app/errors/internal',
        title: 'Interner Serverfehler',
        status: 500,
        detail: 'Ein unerwarteter Fehler ist aufgetreten beim Hochladen des Bildes.',
      },
      { status: 500 }
    )
  }
}
