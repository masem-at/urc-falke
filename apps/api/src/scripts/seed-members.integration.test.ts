import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { writeFile, mkdir, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { db } from '../db/connection.js';
import { users } from '../../../../packages/shared/src/db/schema/users.js';
import { eq } from 'drizzle-orm';

const execAsync = promisify(exec);

// ============================================================================
// INTEGRATION TEST SETUP
// ============================================================================

const TEST_DATA_DIR = './test-data-integration';
const TEST_CSV_PATH = `${TEST_DATA_DIR}/test-members.csv`;
const TEST_OUTPUT_PATH = `${TEST_DATA_DIR}/test-members-output.csv`;

beforeAll(async () => {
  // Create test data directory
  if (!existsSync(TEST_DATA_DIR)) {
    await mkdir(TEST_DATA_DIR, { recursive: true });
  }
});

afterAll(async () => {
  // Clean up test data directory
  if (existsSync(TEST_DATA_DIR)) {
    await rm(TEST_DATA_DIR, { recursive: true, force: true });
  }
});

beforeEach(async () => {
  // Clean up test users before each test
  await db.delete(users).where(eq(users.email, 'integration-test-1@test.com'));
  await db.delete(users).where(eq(users.email, 'integration-test-2@test.com'));
  await db.delete(users).where(eq(users.email, 'integration-test-3@test.com'));
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Member Pre-Seed Integration Tests', () => {
  it('should successfully pre-seed members from CSV to database', async () => {
    // Create test CSV
    const csvContent = `email,first_name,last_name,usv_number
integration-test-1@test.com,Test,User1,USV111111
integration-test-2@test.com,Test,User2,USV222222`;

    await writeFile(TEST_CSV_PATH, csvContent, 'utf-8');

    // Run the seed script
    const { stdout, stderr } = await execAsync(
      `tsx src/scripts/seed-members.ts --csv ${TEST_CSV_PATH} --output ${TEST_OUTPUT_PATH}`
    );

    // Verify output contains success messages
    expect(stdout).toContain('Successfully pre-seeded');
    expect(stdout).toContain('Successful Inserts: 2');

    // Verify users exist in database
    const user1 = await db.select()
      .from(users)
      .where(eq(users.email, 'integration-test-1@test.com'))
      .limit(1);

    const user2 = await db.select()
      .from(users)
      .where(eq(users.email, 'integration-test-2@test.com'))
      .limit(1);

    expect(user1.length).toBe(1);
    expect(user2.length).toBe(1);

    // Verify user properties
    expect(user1[0].first_name).toBe('Test');
    expect(user1[0].last_name).toBe('User1');
    expect(user1[0].usv_number).toBe('USV111111');
    expect(user1[0].onboarding_token).toBeTruthy();
    expect(user1[0].onboarding_token?.length).toBe(16);
    expect(user1[0].onboarding_status).toBe('pre_seeded');
    expect(user1[0].must_change_password).toBe(true);
    expect(user1[0].is_founding_member).toBe(true);

    // Verify output CSV exists and contains correct data
    expect(existsSync(TEST_OUTPUT_PATH)).toBe(true);
  }, 30000); // 30 second timeout for database operations

  it('should handle duplicate emails correctly', async () => {
    // Create first user
    const csvContent1 = `email,first_name,last_name
integration-test-3@test.com,Test,User3`;

    await writeFile(TEST_CSV_PATH, csvContent1, 'utf-8');
    await execAsync(`tsx src/scripts/seed-members.ts --csv ${TEST_CSV_PATH} --output ${TEST_OUTPUT_PATH}`);

    // Try to create duplicate
    await execAsync(`tsx src/scripts/seed-members.ts --csv ${TEST_CSV_PATH} --output ${TEST_OUTPUT_PATH}`);

    // Verify only one user exists
    const users_found = await db.select()
      .from(users)
      .where(eq(users.email, 'integration-test-3@test.com'));

    expect(users_found.length).toBe(1);
  }, 30000);

  it('should skip invalid emails and continue processing', async () => {
    const csvContent = `email,first_name,last_name
invalid-email,Test,Invalid
integration-test-1@test.com,Test,Valid`;

    await writeFile(TEST_CSV_PATH, csvContent, 'utf-8');

    const { stdout } = await execAsync(
      `tsx src/scripts/seed-members.ts --csv ${TEST_CSV_PATH} --output ${TEST_OUTPUT_PATH}`
    );

    // Verify error for invalid email
    expect(stdout).toContain('Invalid email format');

    // Verify valid user was still created
    const validUser = await db.select()
      .from(users)
      .where(eq(users.email, 'integration-test-1@test.com'))
      .limit(1);

    expect(validUser.length).toBe(1);

    // Verify summary shows correct counts
    expect(stdout).toContain('Successful Inserts: 1');
    expect(stdout).toContain('Errors (Validation):  1');
  }, 30000);

  it('should generate unique tokens for each member', async () => {
    const csvContent = `email,first_name,last_name
integration-test-1@test.com,Test,User1
integration-test-2@test.com,Test,User2`;

    await writeFile(TEST_CSV_PATH, csvContent, 'utf-8');
    await execAsync(`tsx src/scripts/seed-members.ts --csv ${TEST_CSV_PATH} --output ${TEST_OUTPUT_PATH}`);

    // Get both users
    const user1 = await db.select()
      .from(users)
      .where(eq(users.email, 'integration-test-1@test.com'))
      .limit(1);

    const user2 = await db.select()
      .from(users)
      .where(eq(users.email, 'integration-test-2@test.com'))
      .limit(1);

    // Verify tokens are different
    expect(user1[0].onboarding_token).toBeTruthy();
    expect(user2[0].onboarding_token).toBeTruthy();
    expect(user1[0].onboarding_token).not.toBe(user2[0].onboarding_token);

    // Verify token expiry is set (should be 90 days from now)
    expect(user1[0].onboarding_token_expires).toBeTruthy();
    const now = new Date();
    const expiry = new Date(user1[0].onboarding_token_expires!);
    const daysDiff = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Allow some tolerance (89-91 days due to test execution time)
    expect(daysDiff).toBeGreaterThanOrEqual(89);
    expect(daysDiff).toBeLessThanOrEqual(91);
  }, 30000);

  it('should handle missing required fields', async () => {
    const csvContent = `email,first_name,last_name
integration-test-1@test.com,,User1
integration-test-2@test.com,Test,`;

    await writeFile(TEST_CSV_PATH, csvContent, 'utf-8');

    const { stdout } = await execAsync(
      `tsx src/scripts/seed-members.ts --csv ${TEST_CSV_PATH} --output ${TEST_OUTPUT_PATH}`
    );

    // Verify both rows failed validation
    expect(stdout).toContain('Missing required fields');
    expect(stdout).toContain('Successful Inserts: 0');
    expect(stdout).toContain('Errors (Validation):  2');

    // Verify no users were created
    const user1 = await db.select()
      .from(users)
      .where(eq(users.email, 'integration-test-1@test.com'));

    const user2 = await db.select()
      .from(users)
      .where(eq(users.email, 'integration-test-2@test.com'));

    expect(user1.length).toBe(0);
    expect(user2.length).toBe(0);
  }, 30000);
});
