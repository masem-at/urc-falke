import { db } from './src/db/connection.js';
import { users } from '@urc-falke/shared/db';

async function main() {
  const allUsers = await db.select().from(users);
  console.log('=== Benutzer in Datenbank ===');
  console.log('Anzahl:', allUsers.length);
  allUsers.forEach(u => {
    console.log(`- ${u.email} | Passwort ändern: ${u.must_change_password}`);
  });
  process.exit(0);
}

main().catch(console.error);
