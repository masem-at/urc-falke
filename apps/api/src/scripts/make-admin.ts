import 'dotenv/config';
import { db } from '../db/connection.js';
import { users } from '../../../../packages/shared/src/db/schema/users.js';
import { eq } from 'drizzle-orm';

async function makeAdmin(email: string) {
  const result = await db.update(users)
    .set({ role: 'admin' })
    .where(eq(users.email, email))
    .returning();

  if (result.length > 0) {
    console.log(`✓ ${email} is now admin`);
  } else {
    console.log(`✗ User ${email} not found`);
  }
}

const email = process.argv[2] || 'mario.semper@masem.at';
makeAdmin(email).then(() => process.exit(0));
