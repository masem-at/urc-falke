import { describe, it, expect } from 'vitest';
import { db } from './connection';
import { users } from '@urc-falke/shared/db';

describe('Database Connection', () => {
  it.skipIf(!process.env.DATABASE_URL)('should connect to NeonDB successfully', async () => {
    const result = await db.select().from(users).limit(1);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it.skipIf(!process.env.DATABASE_URL)('should have users table with correct schema', async () => {
    const result = await db.select({
      id: users.id,
      email: users.email,
      onboarding_token: users.onboarding_token,
      is_founding_member: users.is_founding_member
    }).from(users).limit(1);

    expect(result).toBeInstanceOf(Array);
  });
});
