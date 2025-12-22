import { db } from '../db/connection.js';
import { users, type User } from '@urc-falke/shared/db';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { signAccessToken } from '../lib/jwt.js';
import type { SignupInput, LoginInput } from '@urc-falke/shared';
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
 * @param input - Signup data (email, password, firstName, lastName, usvNumber)
 * @returns Promise<RegistrationResult> - User object and JWT access token
 * @throws ProblemDetails if email already exists (409 Conflict)
 *
 * @example
 * const result = await registerUser({
 *   email: 'max@example.com',
 *   password: 'SecurePass123',
 *   firstName: 'Max',
 *   lastName: 'Mustermann',
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
      type: 'https://urc-falke.app/errors/email-already-exists',
      title: 'Email bereits registriert',
      status: 409,
      detail: 'Ein Benutzer mit dieser Email existiert bereits.'
    };
    throw error;
  }

  // 2. Hash password with bcrypt (12 rounds - project standard)
  const passwordHash = await hashPassword(input.password);

  // 3. Create user in database
  // CRITICAL: Map camelCase input to snake_case database fields
  const [newUser] = await db.insert(users).values({
    email: input.email,
    password_hash: passwordHash,
    first_name: input.firstName,
    last_name: input.lastName,
    usv_number: input.usvNumber || null,
    role: 'member',
    onboarding_status: 'completed', // Track B goes directly to completed
    is_founding_member: false
  }).returning();

  // 4. Generate JWT access token (15-minute expiry)
  const accessToken = await signAccessToken({
    userId: newUser.id,
    role: (newUser.role as 'member' | 'admin')
  });

  // 5. Return user object WITHOUT password_hash (SECURITY)
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
