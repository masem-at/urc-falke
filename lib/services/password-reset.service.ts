import { randomBytes } from 'crypto';
import { db } from '../db/connection';
import { users } from '@/lib/shared/db';
import { hashPassword } from '../password';
import { eq, and, gt, lt, or, isNull, isNotNull } from 'drizzle-orm';
import type { ForgotPasswordInput, ResetPasswordInput, ValidateTokenInput } from '@/lib/shared';

// ============================================================================
// PASSWORD RESET SERVICE (Story 1.7)
// ============================================================================
//
// SECURITY NOTES:
// - Token is 32-byte random hex (64 characters)
// - Token expires after 1 hour
// - Token is single-use (deleted after successful reset)
// - Same success message shown regardless of email existence (anti-enumeration)
// - Rate limiting should be applied at route level
//
// ============================================================================

/**
 * RFC 7807 Problem Details for API errors
 */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
}

/**
 * Generate a cryptographically secure random token
 * @returns 64-character hex string (32 bytes)
 */
function generateResetToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Clean up expired password reset tokens
 * Called opportunistically when new tokens are generated
 * Runs async to not block the main request
 */
async function cleanupExpiredTokens(): Promise<void> {
  try {
    const now = new Date();
    await db.update(users)
      .set({
        password_reset_token: null,
        password_reset_token_expires: null
      })
      .where(
        and(
          isNotNull(users.password_reset_token),
          isNotNull(users.password_reset_token_expires),
          lt(users.password_reset_token_expires, now)
        )
      );
  } catch (error) {
    // Log but don't fail the main request
    console.warn('[PASSWORD_RESET] Token cleanup failed:', error);
  }
}

/**
 * Request a password reset for an email address
 *
 * SECURITY: Always returns success message even if email doesn't exist
 * to prevent email enumeration attacks.
 *
 * @param input - Email address
 * @returns Object with success flag and optional token (for email sending)
 */
export async function requestPasswordReset(input: ForgotPasswordInput): Promise<{
  success: boolean;
  email?: string;
  token?: string;
  firstName?: string | null;
}> {
  // 1. Find user by email (silently succeed if not found)
  const [user] = await db.select().from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (!user) {
    // SECURITY: Don't reveal that email doesn't exist
    return { success: true };
  }

  // 2. Generate reset token and expiration
  const token = generateResetToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

  // 3. Store token in database
  await db.update(users)
    .set({
      password_reset_token: token,
      password_reset_token_expires: expiresAt,
      updated_at: new Date()
    })
    .where(eq(users.id, user.id));

  // 4. Opportunistic cleanup of expired tokens (non-blocking)
  // Fire and forget - don't await
  cleanupExpiredTokens();

  // 5. Return token for email sending
  return {
    success: true,
    email: user.email,
    token,
    firstName: user.first_name
  };
}

/**
 * Validate a password reset token
 *
 * @param input - Token to validate
 * @returns User info if valid
 * @throws ProblemDetails if token is invalid or expired
 */
export async function validateResetToken(input: ValidateTokenInput): Promise<{
  valid: boolean;
  email: string;
  firstName: string | null;
}> {
  const now = new Date();

  // 1. Find user with this token
  const [user] = await db.select({
    id: users.id,
    email: users.email,
    first_name: users.first_name,
    password_reset_token_expires: users.password_reset_token_expires
  }).from(users)
    .where(eq(users.password_reset_token, input.token))
    .limit(1);

  // 2. Token not found
  if (!user) {
    const error: ProblemDetails = {
      type: 'https://urc-falke.app/errors/token-invalid',
      title: 'Ungültiger Link',
      status: 404,
      detail: 'Ungültiger Link. Bitte fordere einen neuen Link an.'
    };
    throw error;
  }

  // 3. Token expired
  if (user.password_reset_token_expires && user.password_reset_token_expires < now) {
    const error: ProblemDetails = {
      type: 'https://urc-falke.app/errors/token-expired',
      title: 'Link abgelaufen',
      status: 410,
      detail: 'Dieser Link ist abgelaufen. Bitte fordere einen neuen Link an.'
    };
    throw error;
  }

  return {
    valid: true,
    email: user.email,
    firstName: user.first_name
  };
}

/**
 * Reset password with a valid token
 *
 * Uses atomic update pattern to prevent race conditions:
 * - Validates token AND updates password in single query
 * - Only updates if token exists and is not expired
 * - Returns row count to detect if update happened
 *
 * @param input - Token and new password
 * @throws ProblemDetails if token is invalid or expired
 */
export async function resetPassword(input: ResetPasswordInput): Promise<{ success: boolean }> {
  const now = new Date();

  // 1. First check if token exists at all (to differentiate error messages)
  const [existingUser] = await db.select({
    id: users.id,
    expires: users.password_reset_token_expires
  }).from(users)
    .where(eq(users.password_reset_token, input.token))
    .limit(1);

  // 2. Token doesn't exist
  if (!existingUser) {
    const error: ProblemDetails = {
      type: 'https://urc-falke.app/errors/token-invalid',
      title: 'Ungültiger Link',
      status: 404,
      detail: 'Ungültiger Link. Bitte fordere einen neuen Link an.'
    };
    throw error;
  }

  // 3. Token expired
  if (existingUser.expires && existingUser.expires < now) {
    const error: ProblemDetails = {
      type: 'https://urc-falke.app/errors/token-expired',
      title: 'Link abgelaufen',
      status: 410,
      detail: 'Dieser Link ist abgelaufen. Bitte fordere einen neuen Link an.'
    };
    throw error;
  }

  // 4. Hash new password (12 rounds - project standard)
  const passwordHash = await hashPassword(input.password);

  // 5. Atomic update: Only update if token STILL exists and is not expired
  // This prevents race conditions where two requests try to use the same token
  const result = await db.update(users)
    .set({
      password_hash: passwordHash,
      password_reset_token: null,
      password_reset_token_expires: null,
      updated_at: now
    })
    .where(
      and(
        eq(users.password_reset_token, input.token),
        or(
          isNull(users.password_reset_token_expires),
          gt(users.password_reset_token_expires, now)
        )
      )
    )
    .returning({ id: users.id });

  // 6. Race condition: Token was used between our check and update
  if (result.length === 0) {
    const error: ProblemDetails = {
      type: 'https://urc-falke.app/errors/token-invalid',
      title: 'Ungültiger Link',
      status: 404,
      detail: 'Dieser Link wurde bereits verwendet. Bitte fordere einen neuen Link an.'
    };
    throw error;
  }

  return { success: true };
}
