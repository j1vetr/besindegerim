// Database connection setup
// - Development (Replit): Uses Neon serverless (WebSocket)
// - Production (Ubuntu): Uses standard pg driver

import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { drizzle as neonDrizzle } from 'drizzle-orm/neon-serverless';
import pg from 'pg';
import { drizzle as pgDrizzle } from 'drizzle-orm/node-postgres';
import ws from 'ws';
import * as schema from "@shared/schema";

const isReplit = process.env.REPL_ID !== undefined;

let db: any;
let pool: any;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Check your .env file.");
}

if (isReplit) {
  // Replit: Neon WebSocket driver
  neonConfig.webSocketConstructor = ws;
  
  pool = new NeonPool({ connectionString: process.env.DATABASE_URL });
  db = neonDrizzle({ client: pool, schema });
  
  console.log("[DB] Using Neon WebSocket driver (Replit)");
} else {
  // Production: Standard pg driver (NO NEON!)
  const { Pool: PgPool } = pg;
  
  pool = new PgPool({ 
    connectionString: process.env.DATABASE_URL,
    // Local PostgreSQL - SSL kapalı
    ssl: false
  });
  
  db = pgDrizzle({ client: pool, schema });
  
  console.log("[DB] ✅ Using standard pg driver (Production - NO NEON)");
}

export { db, pool };
