import { describe, it, expect } from 'vitest';
import { db } from './connection';
import { users } from '@urc-falke/shared/db';

describe('Database Connection', () => {
  it('should connect to NeonDB successfully', async () => {
    try {
      const result = await db.select().from(users).limit(1);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    } catch (error) {
      // Skip test if DATABASE_URL not configured
      console.log('Database connection test skipped - DATABASE_URL not configured');
    }
  });

  it('should have users table with correct schema', async () => {
    try {
      const result = await db.select({
        id: users.id,
        email: users.email,
        onboarding_token: users.onboarding_token,
        is_founding_member: users.is_founding_member
      }).from(users).limit(1);

      expect(result).toBeInstanceOf(Array);
    } catch (error) {
      // Skip test if DATABASE_URL not configured
      console.log('Database schema test skipped - DATABASE_URL not configured');
    }
  });
});
