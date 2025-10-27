// Database connection setup
// - Development (Replit): Uses Neon serverless (WebSocket)
// - Production (Ubuntu): Uses standard pg driver

import * as schema from "@shared/schema";

const isReplit = process.env.REPL_ID !== undefined;

let db: any;
let pool: any;

if (isReplit) {
  // Replit: Neon WebSocket driver
  const { Pool: NeonPool, neonConfig } = await import('@neondatabase/serverless');
  const ws = await import('ws');
  const { drizzle: neonDrizzle } = await import('drizzle-orm/neon-serverless');
  
  neonConfig.webSocketConstructor = ws.default || ws;
  
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
  }
  
  pool = new NeonPool({ connectionString: process.env.DATABASE_URL });
  db = neonDrizzle({ client: pool, schema });
  
  console.log("[DB] Using Neon WebSocket driver (Replit)");
} else {
  // Production: Standard pg driver
  const pg = await import('pg');
  const { drizzle: pgDrizzle } = await import('drizzle-orm/node-postgres');
  
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Check your .env file.");
  }
  
  pool = new pg.default.Pool({ 
    connectionString: process.env.DATABASE_URL,
    // Local PostgreSQL için SSL kapalı
    ssl: false
  });
  
  db = pgDrizzle({ client: pool, schema });
  
  console.log("[DB] Using standard pg driver (Production)");
}

export { db, pool };
