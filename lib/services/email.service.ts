// ============================================================================
// EMAIL SERVICE (Story 1.7)
// ============================================================================
//
// Uses Resend API for transactional emails.
// Resend provides generous free tier (100 emails/day) suitable for MVP.
//
// ============================================================================

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email via Resend API
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; id?: string }> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    // In development, log the email instead of failing
    if (process.env.NODE_ENV === 'development') {
      console.log('=== EMAIL DEBUG (no RESEND_API_KEY) ===');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('HTML:', options.html);
      console.log('========================================');
      return { success: true };
    }
    return { success: false };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'URC Falke <noreply@urc-falke.app>',
        to: options.to,
        subject: options.subject,
        html: options.html
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend API error:', error);
      return { success: false };
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  firstName: string | null
): Promise<{ success: boolean }> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://urc-falke.app'}/reset-password/${resetToken}`;
  const greeting = firstName ? `Hallo ${firstName}` : 'Hallo';

  const html = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Passwort zurücksetzen</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1E3A8A; margin-bottom: 10px;">URC Falke</h1>
      </div>

      <p style="font-size: 16px;">${greeting},</p>

      <p style="font-size: 16px;">
        Du hast angefordert, dein Passwort für deinen URC Falke Account zurückzusetzen.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}"
           style="display: inline-block; background-color: #1E3A8A; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
          Passwort zurücksetzen
        </a>
      </div>

      <p style="font-size: 14px; color: #666;">
        Dieser Link ist <strong>1 Stunde</strong> gültig.
      </p>

      <p style="font-size: 14px; color: #666;">
        Falls du diese Email nicht angefordert hast, kannst du sie ignorieren.
        Dein Passwort wird nicht geändert.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

      <p style="font-size: 12px; color: #999; text-align: center;">
        Diese Email wurde automatisch generiert. Bitte antworte nicht auf diese Email.<br>
        Bei Fragen kontaktiere uns unter info@urc-falke.at
      </p>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Passwort zurücksetzen - URC Falke',
    html
  });
}
