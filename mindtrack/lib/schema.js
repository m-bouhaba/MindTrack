import { pgTable, text, uuid, timestamp, varchar, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    onboardingCompleted: boolean("onboarding_completed").default(false), // Track if user finished onboarding
    onboardingMood: varchar("onboarding_mood", { length: 50 }),        // Store initial mood
    createdAt: timestamp("created_at").defaultNow(),
});

export const habits = pgTable("habits", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    icon: varchar("icon", { length: 10 }),
});

export const moodEntries = pgTable("mood_entries", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    date: varchar("date", { length: 20 }).notNull(),
    mood: varchar("mood", { length: 50 }).notNull(),
});

export const habitCompletions = pgTable("habit_completions", {
    id: uuid("id").defaultRandom().primaryKey(),
    habitId: uuid("habit_id").notNull(),
    userId: uuid("user_id").notNull(),
    date: varchar("date", { length: 20 }).notNull(), // format YYYY-MM-DD
});