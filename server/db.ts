// Database connection setup
// Standard pg driver (both Replit and Production)

import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Check your .env file.");
}

// Standard PostgreSQL connection pool
const { Pool } = pg;

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: false  // Local PostgreSQL - SSL kapalı
});

export const db = drizzle({ client: pool, schema });

console.log("[DB] ✅ Using standard pg driver");
