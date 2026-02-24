import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * This file sets up the connection to our Neon database.
 * We use the 'DATABASE_URL' from our .env file.
 */

// Create the connection to the database
const connectionString = process.env.DATABASE_URL;

// This is the client that talks to PostgreSQL
const client = postgres(connectionString);

// This is the Drizzle object we will use to run queries
export const db = drizzle(client, { schema });

// We export 'db' so we can use it in other parts of our app