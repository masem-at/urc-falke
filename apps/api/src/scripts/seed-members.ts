import 'dotenv/config';
import { Command } from 'commander';
import Papa from 'papaparse';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { dirname, basename } from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { db } from '../db/connection.js';
import { users } from '../../../../packages/shared/src/db/schema/users.js';
import { eq } from 'drizzle-orm';

// ============================================================================
// TYPES
// ============================================================================

interface CsvRow {
  email: string;
  first_name: string;
  last_name: string;
  usv_number?: string;
}

interface ProcessedMember {
  email: string;
  first_name: string;
  last_name: string;
  onboarding_token: string;
  qr_code_url: string;
  onboarding_link: string;
}

interface SummaryReport {
  totalRows: number;
  successfulInserts: number;
  skippedDuplicates: number;
  validationErrors: number;
  errors: Array<{ row: number; email: string; error: string }>;
}

// ============================================================================
// EMAIL VALIDATION (RFC 5322)
// ============================================================================

function isValidEmail(email: string): boolean {
  // RFC 5322 simplified regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

// ============================================================================
// TOKEN GENERATION
// ============================================================================

function generateOnboardingToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = crypto.randomBytes(16);
  let token = '';
  for (let i = 0; i < 16; i++) {
    token += chars[bytes[i] % chars.length];
  }
  return token;
}

async function ensureUniqueToken(): Promise<string> {
  let attempts = 0;
  while (attempts < 5) {
    const token = generateOnboardingToken();
    const existing = await db.select()
      .from(users)
      .where(eq(users.onboarding_token, token))
      .limit(1);
    if (existing.length === 0) return token;
    attempts++;
  }
  throw new Error('Failed to generate unique token after 5 attempts');
}

function getTokenExpiry(): Date {
  const now = new Date();
  now.setDate(now.getDate() + 90); // 90 days from now
  return now;
}

// ============================================================================
// PASSWORD GENERATION
// ============================================================================

function generateTemporaryPassword(): string {
  return crypto.randomBytes(16).toString('base64').slice(0, 16);
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12); // 12 rounds per project standards
}

// ============================================================================
// CSV PARSING
// ============================================================================

async function parseCSV(csvPath: string): Promise<CsvRow[]> {
  try {
    const fileContent = await readFile(csvPath, 'utf-8');

    return new Promise((resolve, reject) => {
      Papa.parse<CsvRow>(fileContent, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim().toLowerCase(),
        complete: (results) => {
          // Validate required columns
          const requiredColumns = ['email', 'first_name', 'last_name'];
          const headers = results.meta.fields || [];
          const missingColumns = requiredColumns.filter(col => !headers.includes(col));

          if (missingColumns.length > 0) {
            reject(new Error(`CSV missing required columns: ${missingColumns.join(', ')}`));
            return;
          }

          resolve(results.data);
        },
        error: (error: Error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        }
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read CSV file: ${error.message}`);
    }
    throw error;
  }
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

async function insertUser(row: CsvRow, token: string): Promise<void> {
  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(temporaryPassword);
  const tokenExpiry = getTokenExpiry();

  await db.insert(users).values({
    email: row.email,
    first_name: row.first_name,
    last_name: row.last_name,
    usv_number: row.usv_number || null,
    password_hash: passwordHash,
    onboarding_token: token,
    onboarding_token_expires: tokenExpiry,
    onboarding_status: 'pre_seeded',
    must_change_password: true,
    is_founding_member: true,
  });
}

// ============================================================================
// OUTPUT CSV GENERATION
// ============================================================================

function generateQRCodeURL(onboardingLink: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(onboardingLink)}`;
}

function generateOnboardingLink(token: string): string {
  return `https://urc-falke.app/onboard-existing?token=${token}`;
}

async function writeOutputCSV(members: ProcessedMember[], outputPath: string): Promise<void> {
  const csvContent = Papa.unparse(members, {
    columns: ['email', 'first_name', 'last_name', 'onboarding_token', 'qr_code_url', 'onboarding_link'],
    header: true
  });

  await writeFile(outputPath, csvContent, 'utf-8');
}

// ============================================================================
// SUMMARY REPORT
// ============================================================================

function displaySummary(report: SummaryReport, outputPath: string): void {
  console.log('\n========================================');
  console.log('MEMBER PRE-SEED SUMMARY');
  console.log('========================================');
  console.log(`Total Rows Processed: ${report.totalRows}`);
  console.log(`✓ Successful Inserts: ${report.successfulInserts}`);
  console.log(`⚠ Skipped (Duplicates): ${report.skippedDuplicates}`);
  console.log(`✗ Errors (Validation):  ${report.validationErrors}`);
  console.log('========================================');
  console.log(`Output CSV: ${outputPath}`);
  console.log('========================================\n');

  if (report.errors.length > 0) {
    console.log('Error Details:');
    report.errors.forEach(err => {
      console.log(`  Row ${err.row}: ${err.email} - ${err.error}`);
    });
    console.log('');
  }
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function seedMembers(csvPath: string, outputPath?: string): Promise<void> {
  const report: SummaryReport = {
    totalRows: 0,
    successfulInserts: 0,
    skippedDuplicates: 0,
    validationErrors: 0,
    errors: []
  };

  const processedMembers: ProcessedMember[] = [];

  // Generate default output path if not provided
  const inputDir = dirname(csvPath);
  const inputName = basename(csvPath, '.csv');
  const finalOutputPath = outputPath || `${inputDir}/${inputName}-output.csv`;

  try {
    // Ensure output directory exists
    const outputDir = dirname(finalOutputPath);
    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true });
    }

    // Parse CSV
    console.log(`📄 Reading CSV file: ${csvPath}...`);
    const rows = await parseCSV(csvPath);
    report.totalRows = rows.length;
    console.log(`✓ Found ${rows.length} rows to process\n`);

    // Process each row individually (NO transaction wrapper)
    //
    // ARCHITECTURAL DECISION: We deliberately process rows individually without a
    // database transaction wrapper because:
    // 1. Partial success is acceptable (AC6: continue processing after errors)
    // 2. Duplicate emails should be skipped, not rolled back
    // 3. Invalid data should be logged, not abort the entire batch
    // 4. Summary report needs accurate counts of successful/failed/skipped rows
    //
    // A transaction would mean: if row 445/450 fails, all 444 previous inserts
    // get rolled back. This is NOT the desired behavior for a bulk import tool.
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2; // +2 because: +1 for 1-based indexing, +1 for header row

      try {
        // Validate email
        if (!isValidEmail(row.email)) {
          report.validationErrors++;
          report.errors.push({
            row: rowNumber,
            email: row.email,
            error: 'Invalid email format'
          });
          console.error(`✗ Row ${rowNumber}: ${row.email} - Invalid email format`);
          continue;
        }

        // Validate required fields
        if (!row.first_name || !row.last_name) {
          report.validationErrors++;
          report.errors.push({
            row: rowNumber,
            email: row.email,
            error: 'Missing required fields (first_name or last_name)'
          });
          console.error(`✗ Row ${rowNumber}: ${row.email} - Missing required fields`);
          continue;
        }

        // Generate unique token
        let token: string;
        try {
          token = await ensureUniqueToken();
        } catch (tokenError) {
          // Token generation failed after retries - skip this row
          report.validationErrors++;
          report.errors.push({
            row: rowNumber,
            email: row.email,
            error: tokenError instanceof Error ? tokenError.message : 'Token generation failed'
          });
          console.error(`✗ Row ${rowNumber}: ${row.email} - Token generation failed`);
          continue;
        }

        // Insert user
        try {
          await insertUser(row, token);
          report.successfulInserts++;

          // Prepare output data
          const onboardingLink = generateOnboardingLink(token);
          const qrCodeURL = generateQRCodeURL(onboardingLink);

          processedMembers.push({
            email: row.email,
            first_name: row.first_name,
            last_name: row.last_name,
            onboarding_token: token,
            qr_code_url: qrCodeURL,
            onboarding_link: onboardingLink
          });

          console.log(`✓ Row ${rowNumber}: ${row.email} - Successfully pre-seeded`);
        } catch (insertError) {
          // Check if it's a duplicate email error
          if (insertError instanceof Error &&
              (insertError.message.includes('unique') ||
               insertError.message.includes('duplicate'))) {
            report.skippedDuplicates++;
            console.warn(`⚠ Row ${rowNumber}: ${row.email} - Already exists (skipped)`);
          } else {
            report.validationErrors++;
            report.errors.push({
              row: rowNumber,
              email: row.email,
              error: insertError instanceof Error ? insertError.message : 'Unknown error'
            });
            console.error(`✗ Row ${rowNumber}: ${row.email} - Database error: ${insertError instanceof Error ? insertError.message : 'Unknown'}`);
          }
        }
      } catch (rowError) {
        report.validationErrors++;
        report.errors.push({
          row: rowNumber,
          email: row.email,
          error: rowError instanceof Error ? rowError.message : 'Unknown error'
        });
        console.error(`✗ Row ${rowNumber}: ${row.email} - Processing error: ${rowError instanceof Error ? rowError.message : 'Unknown'}`);
      }
    }

    // Write output CSV
    if (processedMembers.length > 0) {
      await writeOutputCSV(processedMembers, finalOutputPath);
      console.log(`\n✓ Output CSV written to: ${finalOutputPath}`);
    } else {
      console.log('\n⚠ No members were successfully processed - no output CSV generated');
    }

    // Display summary
    displaySummary(report, finalOutputPath);

  } catch (error) {
    console.error('\n✗ FATAL ERROR:');
    if (error instanceof Error) {
      console.error(`  ${error.message}`);
    } else {
      console.error('  Unknown error occurred');
    }
    process.exit(1);
  }
}

// ============================================================================
// CLI PROGRAM
// ============================================================================

const program = new Command();

program
  .name('seed:members')
  .description('Pre-seed existing URC Falke members with onboarding tokens')
  .requiredOption('--csv <path>', 'Path to CSV file with member data')
  .option('--output <path>', 'Path for output CSV file (default: same directory as input CSV)')
  .action(async (options) => {
    const csvPath = options.csv;
    const outputPath = options.output;
    await seedMembers(csvPath, outputPath);
  });

program.parse(process.argv);
