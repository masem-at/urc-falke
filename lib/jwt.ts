import { SignJWT, jwtVerify } from 'jose';

// ============================================================================
// JWT UTILITY (jose 6.1.3)
// ============================================================================
//
// SECURITY NOTE: JWT tokens stored in HttpOnly cookies (NOT localStorage)
// - Prevents XSS attacks from stealing tokens
// - Cookies auto-sent with requests (no manual auth header management)
// - 15-minute expiry for access tokens
//
// ARCHITECTURE NOTE: Uses jose library (NOT jsonwebtoken)
// - Better TypeScript support
// - Modern ES modules
// - More secure defaults
//
// ============================================================================

/**
 * JWT Payload structure for access tokens
 */
export interface JWTPayload {
  userId: number;
  role: 'member' | 'admin';
}

/**
 * Get JWT secret from environment variable
 * Converts string to Uint8Array for jose library
 */
const getSecret = (): Uint8Array => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return new TextEncoder().encode(secret);
};

/**
 * Sign an access token with user information
 *
 * @param payload - User ID and role
 * @returns Promise<string> - Signed JWT token
 *
 * @example
 * const token = await signAccessToken({ userId: 123, role: 'member' });
 * // Returns: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
export async function signAccessToken(payload: JWTPayload): Promise<string> {
  const secret = getSecret();

  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m') // 15 minutes expiry
    .setIssuedAt()
    .sign(secret);
}

/**
 * Verify and decode an access token
 *
 * @param token - JWT token string
 * @returns Promise<JWTPayload> - Decoded payload with userId and role
 * @throws Error if token is invalid, expired, or malformed
 *
 * @example
 * try {
 *   const payload = await verifyAccessToken(token);
 *   console.log(payload.userId); // 123
 *   console.log(payload.role);   // 'member'
 * } catch (error) {
 *   // Token is invalid or expired
 * }
 */
export async function verifyAccessToken(token: string): Promise<JWTPayload> {
  const secret = getSecret();

  try {
    const { payload } = await jwtVerify(token, secret);

    // Validate payload structure
    if (
      typeof payload.userId !== 'number' ||
      (payload.role !== 'member' && payload.role !== 'admin')
    ) {
      throw new Error('Invalid token payload structure');
    }

    return {
      userId: payload.userId as number,
      role: payload.role as 'member' | 'admin'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
    throw new Error('Token verification failed');
  }
}
