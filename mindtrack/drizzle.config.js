import { defineConfig } from "drizzle-kit";
import "dotenv/config"; // Imports dotenv to read the .env file

// This file tells Drizzle where our schema is and how to connect to the database
export default defineConfig({
    schema: "./lib/schema.js", // Path to our table definitions
    out: "./drizzle",          // Folder where migrations will be stored
    dialect: "postgresql",     // We are using PostgreSQL
    dbCredentials: {
        url: process.env.DATABASE_URL, // The secret link to our database from .env
    },
});
