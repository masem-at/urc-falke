import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config({ path: './apps/api/.env' });

export default defineConfig({
  schema: './packages/shared/src/db/schema/*.ts',
  out: './packages/shared/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
  verbose: true,
  strict: true
});
