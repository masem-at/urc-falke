import { db } from '../db/connection.js';
import { users, type User } from '@urc-falke/shared/db';
import { hashPassword } from '../lib/password.js';
import type { SetPasswordInput, CompleteProfileInput } from '@urc-falke/shared';
import { eq } from 'drizzle-orm';

// ============================================================================
// USER SERVICE (Profile and Password Management)
// ============================================================================
//
// ARCHITECTURE NOTE: This service handles user profile operations
// - Track A onboarding: set-password, complete-profile
// - Profile updates for all users
//
// SECURITY NOTES:
// - Password hashed with bcrypt (12 rounds)
// - password_hash NEVER returned in response
// - onboarding_token cleared after password change (single-use)
//
// ============================================================================

/**
 * User response type (without sensitive fields)
 */
export interface UserResponse extends Omit<User, 'password_hash'> {}

/**
 * RFC 7807 Problem Details for API errors
 */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
}

/**
 * Set password result
 */
export interface SetPasswordResult {
  user: UserResponse;
  redirectTo: string;
}

/**
 * Complete profile result
 */
export interface CompleteProfileResult {
  user: UserResponse;
  showConfetti: boolean;
}

// ============================================================================
// SET PASSWORD SERVICE (Track A: First password after QR scan)
// ============================================================================
//
// This is called after successful QR code onboarding
// User has a valid session (must_change_password=true)
//
// CRITICAL OPERATIONS:
// 1. Hash new password
// 2. Update password_hash in database
// 3. Set must_change_password = false
// 4. Update onboarding_status: 'pre_seeded' → 'password_changed'
// 5. Clear onboarding_token (single-use security)
//
// ============================================================================

/**
 * Set password for a Track A user during onboarding
 *
 * @param userId - The authenticated user's ID
 * @param input - New password
 * @returns Promise<SetPasswordResult> - Updated user and redirect path
 * @throws ProblemDetails if user not found (404) or already set password (409)
 *
 * @example
 * const result = await setPassword(userId, { password: 'NewSecurePass123' });
 * // Returns: { user, redirectTo: '/onboard-existing/complete-profile' }
 */
export async function setPassword(userId: number, input: SetPasswordInput): Promise<SetPasswordResult> {
  // 1. Find user
  const [existingUser] = await db.select().from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!existingUser) {
    const error: ProblemDetails = {
      type: 'https://urc-falke.app/errors/user-not-found',
      title: 'Benutzer nicht gefunden',
      status: 404,
      detail: 'Der Benutzer wurde nicht gefunden.'
    };
    throw error;
  }

  // 2. Check if user still needs to change password
  if (!existingUser.must_change_password) {
    const error: ProblemDetails = {
      type: 'https://urc-falke.app/errors/password-already-set',
      title: 'Passwort bereits gesetzt',
      status: 409,
      detail: 'Du hast dein Passwort bereits geändert.'
    };
    throw error;
  }

  // 3. Hash new password
  const passwordHash = await hashPassword(input.password);

  // 4. Update user in database
  // CRITICAL: Clear token (single-use), update status, set password
  const [updatedUser] = await db.update(users)
    .set({
      password_hash: passwordHash,
      must_change_password: false,
      onboarding_status: 'password_changed',
      onboarding_token: null, // Clear token (single-use security)
      onboarding_token_expires: null,
      updated_at: new Date()
    })
    .where(eq(users.id, userId))
    .returning();

  // 5. Return user object WITHOUT password_hash (SECURITY)
  const { password_hash, ...userWithoutPassword } = updatedUser;

  return {
    user: userWithoutPassword,
    redirectTo: '/onboard-existing/complete-profile'
  };
}

// ============================================================================
// COMPLETE PROFILE SERVICE (Track A: Finalize onboarding)
// ============================================================================
//
// This is called after setting password
// User has a valid session (must_change_password=false, onboarding_status='password_changed')
//
// CRITICAL OPERATIONS:
// 1. Update optional profile fields
// 2. Update onboarding_status: 'password_changed' → 'completed'
// 3. Return showConfetti: true for celebration animation
//
// ============================================================================

/**
 * Complete profile for a Track A user during onboarding
 *
 * @param userId - The authenticated user's ID
 * @param input - Optional profile updates (firstName, lastName, profileImageUrl)
 * @returns Promise<CompleteProfileResult> - Updated user and confetti flag
 * @throws ProblemDetails if user not found (404)
 *
 * @example
 * const result = await completeProfile(userId, {
 *   firstName: 'Max',
 *   lastName: 'Mustermann'
 * });
 * // Returns: { user, showConfetti: true }
 */
export async function completeProfile(userId: number, input: CompleteProfileInput): Promise<CompleteProfileResult> {
  // 1. Find user
  const [existingUser] = await db.select().from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!existingUser) {
    const error: ProblemDetails = {
      type: 'https://urc-falke.app/errors/user-not-found',
      title: 'Benutzer nicht gefunden',
      status: 404,
      detail: 'Der Benutzer wurde nicht gefunden.'
    };
    throw error;
  }

  // 2. Build update object with only provided fields
  const updateData: Record<string, unknown> = {
    onboarding_status: 'completed',
    updated_at: new Date()
  };

  if (input.firstName !== undefined) {
    updateData.first_name = input.firstName;
  }
  if (input.lastName !== undefined) {
    updateData.last_name = input.lastName;
  }
  if (input.profileImageUrl !== undefined) {
    updateData.profile_image_url = input.profileImageUrl;
  }

  // 3. Update user in database
  const [updatedUser] = await db.update(users)
    .set(updateData)
    .where(eq(users.id, userId))
    .returning();

  // 4. Return user object WITHOUT password_hash (SECURITY)
  const { password_hash, ...userWithoutPassword } = updatedUser;

  return {
    user: userWithoutPassword,
    showConfetti: true // Always show confetti on completion
  };
}
