import "server-only";
import { Pool } from "pg";
import { attachDatabasePool } from "@vercel/functions";
const globalDb = globalThis as typeof globalThis & { airReservePool?: Pool };
export function getPool() {
  if (!process.env.DATABASE_URL)
    throw new Error("Database configuration is missing");
  if (!globalDb.airReservePool) {
    const url = new URL(process.env.DATABASE_URL);
    if (
      process.env.VERCEL &&
      url.hostname.endsWith(".pooler.supabase.com") &&
      url.port === "5432"
    )
      url.port = "6543";
    const pool = new Pool({
      connectionString: url.toString(),
      max: 2,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 1000,
      statement_timeout: 10000,
    });
    pool.on("error", () => console.error("Database connection failed"));
    if (process.env.VERCEL) attachDatabasePool(pool);
    globalDb.airReservePool = pool;
  }
  return globalDb.airReservePool;
}
