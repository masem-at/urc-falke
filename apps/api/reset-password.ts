import { db } from './src/db/connection.js';
import { users } from '@urc-falke/shared/db';
import { hashPassword } from './src/lib/password.js';
import { eq } from 'drizzle-orm';

async function main() {
  const email = 'mario@test.com';
  const newPassword = 'Test1234!';

  console.log(`Setze Passwort für ${email}...`);

  const hash = await hashPassword(newPassword);

  await db.update(users)
    .set({ password_hash: hash })
    .where(eq(users.email, email));

  console.log('✓ Passwort gesetzt!');
  console.log('');
  console.log('=== LOGIN DATEN ===');
  console.log(`Email:    ${email}`);
  console.log(`Passwort: ${newPassword}`);
  console.log('');
  console.log('HINWEIS: Dieser User hat must_change_password=true');
  console.log('         Nach Login wird Redirect zu Passwort-Änderung erwartet.');

  process.exit(0);
}

main().catch(console.error);
