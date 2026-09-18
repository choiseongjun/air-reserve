import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { parseEnv } from "node:util";
import pg from "pg";
const file = resolve(".env.local");
const env = existsSync(file) ? parseEnv(readFileSync(file, "utf8")) : {};
const connectionString = process.env.DATABASE_URL || env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");
const client = new pg.Client({
  connectionString,
  connectionTimeoutMillis: 10000,
});
try {
  await client.connect();
  await client.query("BEGIN");
  await client.query(readFileSync(resolve("db/001-bookings.sql"), "utf8"));
  await client.query("COMMIT");
  console.log(
    "air_reserve schema ready. Existing application schemas unchanged.",
  );
} catch {
  await client.query("ROLLBACK").catch(() => {});
  console.error("Migration failed. Check database access and configuration.");
  process.exitCode = 1;
} finally {
  await client.end();
}
