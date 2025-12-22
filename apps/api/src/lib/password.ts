import bcrypt from 'bcrypt';

// ============================================================================
// PASSWORD HASHING UTILITY
// ============================================================================
//
// SECURITY NOTE: Uses bcrypt with 12 rounds (learned from Story 1.0)
// - 12 rounds is the project standard (NOT 10)
// - Provides strong security while maintaining acceptable performance
// - Each hash takes ~200ms on modern hardware
//
// ============================================================================

/**
 * Hash a plain text password using bcrypt with 12 salt rounds
 *
 * @param password - The plain text password to hash
 * @returns Promise<string> - The bcrypt hash string
 *
 * @example
 * const hash = await hashPassword('mySecurePassword123');
 * // Returns: $2b$12$... (60-character bcrypt hash)
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12); // 12 rounds per project standards
}

/**
 * Verify a plain text password against a bcrypt hash
 *
 * @param password - The plain text password to verify
 * @param hash - The bcrypt hash to compare against
 * @returns Promise<boolean> - True if password matches hash
 *
 * @example
 * const isValid = await verifyPassword('mySecurePassword123', storedHash);
 * if (isValid) {
 *   // Password is correct
 * }
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
