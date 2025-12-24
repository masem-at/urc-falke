import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/lib/shared/db';

// Lazy database connection (initialized on first use, not at module load)
let _db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!_db) {
    const sql = neon(process.env.DATABASE_URL || 'postgresql://placeholder');
    _db = drizzle(sql, { schema });
  }
  return _db;
}

// Export database instance as a getter
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get: (_target, prop) => {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  }
});

// Type-safe database instance
export type Database = typeof db;
