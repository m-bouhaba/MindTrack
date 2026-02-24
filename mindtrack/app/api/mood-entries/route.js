import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { moodEntries } from "@/lib/schema";
import { eq } from "drizzle-orm";

/**
 * Handle Mood Entries with userId filtering.
 */

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const entries = await db.select()
            .from(moodEntries)
            .where(eq(moodEntries.userId, userId));

        return NextResponse.json(entries);
    } catch (error) {
        return NextResponse.json({ error: "Could not fetch mood entries" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        if (!body.userId || !body.mood || !body.date) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newEntry = await db.insert(moodEntries).values({
            userId: body.userId,
            date: body.date,
            mood: body.mood,
        }).returning();

        return NextResponse.json(newEntry[0], { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Could not save mood entry" }, { status: 500 });
    }
}
