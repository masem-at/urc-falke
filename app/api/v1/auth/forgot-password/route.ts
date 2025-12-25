import { NextRequest, NextResponse } from 'next/server';
import { forgotPasswordSchema } from '@/lib/shared';
import { requestPasswordReset } from '@/lib/services/password-reset.service';
import { sendPasswordResetEmail } from '@/lib/services/email.service';
import { checkRateLimit, RATE_LIMITS } from '@/lib/utils/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP address
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() || 'unknown';
    const rateLimitKey = `forgot-password:${ip}`;

    const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.PASSWORD_RESET);
    if (!rateLimit.allowed) {
      return NextResponse.json({
        type: 'https://urc-falke.app/errors/rate-limit',
        title: 'Zu viele Anfragen',
        status: 429,
        detail: `Bitte warte ${rateLimit.retryAfter} Sekunden bevor du es erneut versuchst.`
      }, {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfter),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(rateLimit.resetAt)
        }
      });
    }

    const body = await request.json();

    // 1. Validate input
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({
        type: 'https://urc-falke.app/errors/validation',
        title: 'Validierungsfehler',
        status: 400,
        detail: parsed.error.errors[0]?.message || 'Ungültige Eingabe'
      }, { status: 400 });
    }

    // 2. Request password reset
    const result = await requestPasswordReset(parsed.data);

    // 3. Send email if user exists (result has token)
    if (result.token && result.email) {
      const emailResult = await sendPasswordResetEmail(result.email, result.token, result.firstName ?? null);

      // Log email failures for monitoring (but don't expose to user - security)
      if (!emailResult.success) {
        console.warn('[PASSWORD_RESET] Email sending failed', {
          email: result.email.substring(0, 3) + '***', // Partially masked for privacy
          timestamp: new Date().toISOString()
        });
      }
    }

    // 4. SECURITY: Always return same success message
    return NextResponse.json({
      message: 'Wenn diese Email-Adresse registriert ist, erhältst du einen Link zum Zurücksetzen deines Passworts.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({
      type: 'https://urc-falke.app/errors/server',
      title: 'Serverfehler',
      status: 500,
      detail: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.'
    }, { status: 500 });
  }
}
