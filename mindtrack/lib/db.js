import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Database connection for Neon PostgreSQL via Drizzle ORM.
 *
 * - `ssl: "require"` is mandatory for Neon.
 * - The globalThis guard prevents connection leaks during
 *   Next.js hot-module reloading in development.
 */

const connectionString = process.env.DATABASE_URL;

function createClient() {
    return postgres(connectionString, { ssl: "require" });
}

/**
 * In development Next.js re-imports this module on every hot reload.
 * Without caching we'd open a new connection pool each time.
 */
const globalForDb = globalThis;

const client = globalForDb.__dbClient ?? createClient();

if (process.env.NODE_ENV !== "production") {
    globalForDb.__dbClient = client;
}

export const db = drizzle(client, { schema });
