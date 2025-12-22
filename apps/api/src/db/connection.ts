import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@urc-falke/shared/db';

// NeonDB connection (HTTP driver for Serverless)
const sql = neon(process.env.DATABASE_URL!);

// Drizzle instance with schema
export const db = drizzle(sql, { schema });

// Type-safe database instance
export type Database = typeof db;
