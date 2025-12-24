import { db } from '../db/connection';
import { users, type User } from '@/lib/shared/db';
import { hashPassword, verifyPassword } from '../password';
import { signAccessToken } from '../jwt';
import type { SignupInput, LoginInput, OnboardExistingInput } from '@/lib/shared';
import { eq } from 'drizzle-orm';

// ============================================================================
// REGISTRATION SERVICE (Track B: New Members)
// ============================================================================
//
// ARCHITECTURE NOTE: Track B Registration for new members
// - Track A (existing members) uses pre-seeded tokens (Story 1.0)
// - Track B (new members) uses standard registration form (this story)
//
// SECURITY NOTES:
// - Password hashed with bcrypt (12 rounds)
// - JWT generated with 15-minute expiry
// - Duplicate email check prevents race conditions (DB unique constraint)
// - password_hash NEVER returned in response
//
// ============================================================================

/**
 * User response type (without sensitive fields)
 */
export interface UserResponse extends Omit<User, 'password_hash'> {}

/**
 * Registration result containing user and access token
 */
export interface RegistrationResult {
  user: UserResponse;
  accessToken: string;
}

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
 * Register a new user (Track B: New Members)
 *
 * @param input - Signup data (email, password, firstName, lastName, nickname, usvNumber)
 * @returns Promise<RegistrationResult> - User object and JWT access token
 * @throws ProblemDetails if email already exists (409 Conflict)
 *
 * @example
 * const result = await registerUser({
 *   email: 'max@example.com',
 *   password: 'SecurePass123',
 *   firstName: 'Max',
 *   lastName: 'Mustermann',
 *   nickname: 'Maxi',
 *   usvNumber: 'USV123456'
 * });
 */
export async function registerUser(input: SignupInput): Promise<RegistrationResult> {
  // 1. Check if email already exists (AC2: Duplicate Email Handling)
  const existingUser = await db.select().from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (existingUser.length > 0) {
    const error: ProblemDetails = {
      type: 'https://urc-falke.app/errors/email-exists',
      title: 'Email bereits registriert',
      status: 409,
      detail: 'Ein Benutzer mit dieser Email existiert bereits.'
    };
    throw error;
  }

  // 2. Hash password with bcrypt (12 rounds - project standard)
  const passwordHash = await hashPassword(input.password);

  // 3. Determine if user is a founding member (before launch date)
  const LAUNCH_DATE = new Date(process.env.LAUNCH_DATE || '2025-02-01T00:00:00Z');
  const now = new Date();
  const isFoundingMember = now < LAUNCH_DATE;

  // 4. Create user in database
  // CRITICAL: Map camelCase input to snake_case database fields
  const [newUser] = await db.insert(users).values({
    email: input.email,
    password_hash: passwordHash,
    first_name: input.firstName || null,
    last_name: input.lastName || null,
    nickname: input.nickname || null,
    usv_number: input.usvNumber || null,
    is_usv_verified: input.usvNumber ? false : null, // false if USV number provided, null otherwise
    role: 'member',
    onboarding_status: 'completed', // Track B goes directly to completed
    is_founding_member: isFoundingMember,
    lottery_registered: isFoundingMember // Same logic as founding member
  }).returning();

  // 5. Generate JWT access token (15-minute expiry)
  const accessToken = await signAccessToken({
    userId: newUser.id,
    role: (newUser.role as 'member' | 'admin')
  });

  // 6. Return user object WITHOUT password_hash (SECURITY)
  const { password_hash, ...userWithoutPassword } = newUser;

  return {
    user: userWithoutPassword,
    accessToken
  };
}

// ============================================================================
// LOGIN SERVICE (Track A and Track B)
// ============================================================================
//
// ARCHITECTURE NOTE: Handles login for both tracks
// - Track A (existing members with pre-seeded accounts): may have must_change_password=true
// - Track B (new registrations): always have must_change_password=false
//
// CRITICAL: Frontend must check must_change_password and redirect to
// /onboard-existing/set-password if true (Two-Track Onboarding compliance)
//
// ============================================================================

/**
 * Login result containing user, access token, and password change requirement
 */
export interface LoginResult {
  user: UserResponse;
  accessToken: string;
  mustChangePassword: boolean;
}

/**
 * Login an existing user (Track A and Track B)
 *
 * @param input - Login data (email, password)
 * @returns Promise<LoginResult> - User object, JWT access token, and must_change_password flag
 * @throws ProblemDetails if credentials are invalid (401 Unauthorized)
 *
 * @example
 * const result = await loginUser({
 *   email: 'max@example.com',
 *   password: 'SecurePass123'
 * });
 * if (result.mustChangePassword) {
 *   // Redirect to password change page (Track A onboarding)
 * }
 */
export async function loginUser(input: LoginInput): Promise<LoginResult> {
  // 1. Find user by email
  const [existingUser] = await db.select().from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (!existingUser) {
    // SECURITY: Use generic message to prevent email enumeration
    const error: ProblemDetails = {
      type: 'https://urc-falke.app/errors/invalid-credentials',
      title: 'Ungültige Anmeldedaten',
      status: 401,
      detail: 'Email oder Passwort ist falsch.'
    };
    throw error;
  }

  // 2. Verify password
  const isValidPassword = await verifyPassword(input.password, existingUser.password_hash);

  if (!isValidPassword) {
    // SECURITY: Use same generic message as "user not found"
    const error: ProblemDetails = {
      type: 'https://urc-falke.app/errors/invalid-credentials',
      title: 'Ungültige Anmeldedaten',
      status: 401,
      detail: 'Email oder Passwort ist falsch.'
    };
    throw error;
  }

  // 3. Generate JWT access token (15-minute expiry)
  const accessToken = await signAccessToken({
    userId: existingUser.id,
    role: (existingUser.role as 'member' | 'admin')
  });

  // 4. Return user object WITHOUT password_hash (SECURITY)
  const { password_hash, ...userWithoutPassword } = existingUser;

  return {
    user: userWithoutPassword,
    accessToken,
    mustChangePassword: existingUser.must_change_password ?? false
  };
}

// ============================================================================
// ONBOARD EXISTING USER SERVICE (Track A: Token-Based Auto-Login)
// ============================================================================
//
// ARCHITECTURE NOTE: This is Track A onboarding for pre-seeded members
// - Pre-seeded users have an onboarding_token from QR code (generated in Story 1.0)
// - Token is single-use, time-limited (90 days), and status-gated
// - After successful token validation, user is auto-logged in
// - User MUST change password before accessing protected routes
//
// SECURITY NOTES:
// - Token validated against: existence, expiration, status
// - JWT generated with 15-minute expiry (same as login)
// - password_hash NEVER returned in response
// - Token is NOT cleared here - it's cleared in set-password step
//
// ============================================================================

/**
 * Onboard existing result containing user, access token, and redirect path
 */
export interface OnboardExistingResult {
  user: UserResponse;
  accessToken: string;
  redirectTo: string;
}

/**
 * Onboard an existing member using their QR code token (Track A)
 *
 * @param input - Onboard data (token from QR code)
 * @returns Promise<OnboardExistingResult> - User object, JWT, and redirect path
 * @throws ProblemDetails if token is invalid (404), expired (410), or already used (409)
 *
 * Token Validation Rules:
 * 1. Token must exist in database (onboarding_token field)
 * 2. Token must not be expired (onboarding_token_expires > NOW())
 * 3. User must have onboarding_status === 'pre_seeded'
 *
 * @example
 * const result = await onboardExistingUser({
 *   token: 'abc123-unique-token'
 * });
 * // Returns: { user, accessToken, redirectTo: '/onboard-existing/set-password' }
 */
export async function onboardExistingUser(input: OnboardExistingInput): Promise<OnboardExistingResult> {
  // 1. Find user by onboarding_token
  const [existingUser] = await db.select().from(users)
    .where(eq(users.onboarding_token, input.token))
    .limit(1);

  // 2. Token not found - 404
  if (!existingUser) {
    const error: ProblemDetails = {
      type: 'https://urc-falke.app/errors/token-not-found',
      title: 'Token nicht gefunden',
      status: 404,
      detail: 'Der Aktivierungscode wurde nicht gefunden. Bitte prüfe deinen QR-Code.'
    };
    throw error;
  }

  // 3. Token expired - 410 Gone
  const now = new Date();
  if (existingUser.onboarding_token_expires && existingUser.onboarding_token_expires < now) {
    const error: ProblemDetails = {
      type: 'https://urc-falke.app/errors/token-expired',
      title: 'Token abgelaufen',
      status: 410,
      detail: 'Dein Aktivierungscode ist abgelaufen. Bitte kontaktiere uns unter info@urc-falke.at für einen neuen Code.'
    };
    throw error;
  }

  // 4. Token already used (status !== 'pre_seeded') - 409 Conflict
  if (existingUser.onboarding_status !== 'pre_seeded') {
    const error: ProblemDetails = {
      type: 'https://urc-falke.app/errors/token-already-used',
      title: 'Account bereits aktiviert',
      status: 409,
      detail: 'Du hast deinen Account bereits aktiviert. Bitte melde dich mit deinem Passwort an.'
    };
    throw error;
  }

  // 5. Token is valid - generate JWT and auto-login
  const accessToken = await signAccessToken({
    userId: existingUser.id,
    role: (existingUser.role as 'member' | 'admin')
  });

  // 6. Return user object WITHOUT password_hash (SECURITY)
  const { password_hash, ...userWithoutPassword } = existingUser;

  return {
    user: userWithoutPassword,
    accessToken,
    redirectTo: '/onboard-existing/set-password'
  };
}
