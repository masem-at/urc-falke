import { db } from '../db/connection';
import { users } from '@urc-falke/shared/db';
import { eq } from 'drizzle-orm';

export interface USVVerificationResult {
  valid: boolean;
  memberSince?: string;
  error?: string;
}

interface USVApiResponse {
  valid: boolean;
  memberSince?: string;
}

const USV_API_URL = process.env.USV_API_URL || 'https://api.usv.at/verify';
const USV_API_TIMEOUT = parseInt(process.env.USV_API_TIMEOUT || '30000', 10);
const MAX_RETRIES = 3;

/**
 * Verify a USV membership number via external USV API
 * Implements retry logic with exponential backoff (1s, 2s, 4s)
 * Updates database on successful verification
 *
 * @param usvNumber - The USV membership number to verify
 * @param userId - The user ID to update in database
 * @returns Promise<USVVerificationResult> - Verification result
 * @throws Error if verification fails after all retries
 */
export async function verifyUSVNumber(
  usvNumber: string,
  userId: number
): Promise<USVVerificationResult> {
  let lastError: Error | null = null;

  // Try initial request + 3 retries
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Calculate exponential backoff delay (0s, 1s, 2s, 4s)
      if (attempt > 0) {
        const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      const result = await callUSVApi(usvNumber);

      // Update database if verification successful
      if (result.valid) {
        await db
          .update(users)
          .set({ is_usv_verified: true })
          .where(eq(users.id, userId));
      }

      return result;
    } catch (error) {
      lastError = error as Error;

      // If this is the last attempt, throw the error
      if (attempt === MAX_RETRIES) {
        throw lastError;
      }

      // Continue to next retry
      console.error(
        `USV verification attempt ${attempt + 1} failed:`,
        error
      );
    }
  }

  // Should never reach here, but TypeScript needs it
  throw lastError || new Error('Verification failed');
}

/**
 * Internal function to call USV API with timeout
 */
async function callUSVApi(usvNumber: string): Promise<USVVerificationResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), USV_API_TIMEOUT);

  try {
    const response = await fetch(USV_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usvNumber }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `USV API returned ${response.status}: ${response.statusText}`
      );
    }

    const data = (await response.json()) as USVApiResponse;

    // Validate response structure
    if (typeof data.valid !== 'boolean') {
      throw new Error('Invalid API response: missing valid field');
    }

    return {
      valid: data.valid,
      memberSince: data.memberSince,
    };
  } catch (error) {
    // Clear timeout on error
    clearTimeout(timeoutId);

    if ((error as Error).name === 'AbortError') {
      throw new Error('USV API timeout exceeded');
    }

    throw error;
  }
}
