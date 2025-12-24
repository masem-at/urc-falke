import 'dotenv/config';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { db } from '../db/connection.js';
import { users } from '../../../../packages/shared/src/db/schema/users.js';
import { eq } from 'drizzle-orm';

const TEST_USERS = [
  { email: 'mario.semper@masem.at', first_name: 'Mario', last_name: 'Semper' },
  { email: 'semperfriedrich@gmail.com', first_name: 'Friedrich', last_name: 'Semper' },
  { email: 'danielo.helliner@gmail.com', first_name: 'Daniel', last_name: 'Semper' },
];

// Simple readable passwords for testing
const PASSWORDS: Record<string, string> = {
  'mario.semper@masem.at': 'TestMario123!',
  'semperfriedrich@gmail.com': 'TestFritz123!',
  'danielo.helliner@gmail.com': 'TestDaniel123!',
};

function generateOnboardingToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = crypto.randomBytes(16);
  let token = '';
  for (let i = 0; i < 16; i++) {
    token += chars[bytes[i] % chars.length];
  }
  return token;
}

function getTokenExpiry(): Date {
  const now = new Date();
  now.setDate(now.getDate() + 90);
  return now;
}

async function seedTestUsers() {
  console.log('\n========================================');
  console.log('SEEDING TEST USERS');
  console.log('========================================\n');

  for (const user of TEST_USERS) {
    const password = PASSWORDS[user.email];
    const passwordHash = await bcrypt.hash(password, 12);
    const token = generateOnboardingToken();
    const tokenExpiry = getTokenExpiry();

    try {
      // Delete existing user if present
      await db.delete(users).where(eq(users.email, user.email));

      // Insert fresh user
      await db.insert(users).values({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        password_hash: passwordHash,
        onboarding_token: token,
        onboarding_token_expires: tokenExpiry,
        onboarding_status: 'pre_seeded',
        must_change_password: false, // Password already set to known value
        is_founding_member: true,
      });

      const onboardingLink = `https://urc-falke.app/onboard-existing?token=${token}`;

      console.log(`✓ ${user.first_name} ${user.last_name}`);
      console.log(`  Email:    ${user.email}`);
      console.log(`  Password: ${password}`);
      console.log(`  Token:    ${token}`);
      console.log(`  Link:     ${onboardingLink}`);
      console.log('');
    } catch (error) {
      console.error(`✗ Failed to seed ${user.email}:`, error);
    }
  }

  console.log('========================================');
  console.log('CREDENTIALS SUMMARY');
  console.log('========================================');
  for (const user of TEST_USERS) {
    console.log(`${user.email} / ${PASSWORDS[user.email]}`);
  }
  console.log('========================================\n');

  process.exit(0);
}

seedTestUsers();
