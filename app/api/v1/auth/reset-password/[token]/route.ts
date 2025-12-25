import { NextRequest, NextResponse } from 'next/server';
import { validateResetToken } from '@/lib/services/password-reset.service';
import type { ProblemDetails } from '@/lib/services/password-reset.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const result = await validateResetToken({ token });

    return NextResponse.json({
      valid: result.valid,
      email: result.email
    });

  } catch (error) {
    // Handle ProblemDetails errors
    if (error && typeof error === 'object' && 'status' in error) {
      const problemDetails = error as ProblemDetails;
      return NextResponse.json(problemDetails, { status: problemDetails.status });
    }

    console.error('Validate token error:', error);
    return NextResponse.json({
      type: 'https://urc-falke.app/errors/server',
      title: 'Serverfehler',
      status: 500,
      detail: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
      instance: '/api/v1/auth/reset-password/[token]'
    }, { status: 500 });
  }
}
