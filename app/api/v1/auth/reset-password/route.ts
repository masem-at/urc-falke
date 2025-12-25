import { NextRequest, NextResponse } from 'next/server';
import { resetPasswordSchema } from '@/lib/shared';
import { resetPassword } from '@/lib/services/password-reset.service';
import type { ProblemDetails } from '@/lib/services/password-reset.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validate input
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({
        type: 'https://urc-falke.app/errors/validation',
        title: 'Validierungsfehler',
        status: 400,
        detail: parsed.error.errors[0]?.message || 'Ungültige Eingabe'
      }, { status: 400 });
    }

    // 2. Reset password
    await resetPassword(parsed.data);

    // 3. Return success
    return NextResponse.json({
      message: 'Dein Passwort wurde erfolgreich geändert. Bitte melde dich mit deinem neuen Passwort an.'
    });

  } catch (error) {
    // Handle ProblemDetails errors
    if (error && typeof error === 'object' && 'status' in error) {
      const problemDetails = error as ProblemDetails;
      return NextResponse.json(problemDetails, { status: problemDetails.status });
    }

    console.error('Reset password error:', error);
    return NextResponse.json({
      type: 'https://urc-falke.app/errors/server',
      title: 'Serverfehler',
      status: 500,
      detail: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
      instance: '/api/v1/auth/reset-password'
    }, { status: 500 });
  }
}
