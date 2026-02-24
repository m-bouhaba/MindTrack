import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habitCompletions } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

/**
 * Handle Habit Completions (tracking if a habit was done today).
 */

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const date = searchParams.get("date"); // YYYY-MM-DD

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        let query = db.select()
            .from(habitCompletions)
            .where(eq(habitCompletions.userId, userId));

        if (date) {
            query = db.select()
                .from(habitCompletions)
                .where(
                    and(
                        eq(habitCompletions.userId, userId),
                        eq(habitCompletions.date, date)
                    )
                );
        }

        const completions = await query;
        return NextResponse.json(completions);
    } catch (error) {
        return NextResponse.json({ error: "Could not fetch completions" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { habitId, userId, date } = body;

        if (!habitId || !userId || !date) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Toggle logic: if exists, delete it (uncheck), if not, create it (check)
        const existing = await db.select()
            .from(habitCompletions)
            .where(
                and(
                    eq(habitCompletions.habitId, habitId),
                    eq(habitCompletions.userId, userId),
                    eq(habitCompletions.date, date)
                )
            ).limit(1);

        if (existing.length > 0) {
            await db.delete(habitCompletions)
                .where(eq(habitCompletions.id, existing[0].id));
            return NextResponse.json({ message: "Completion removed", status: "removed" });
        } else {
            const newCompletion = await db.insert(habitCompletions).values({
                habitId,
                userId,
                date,
            }).returning();
            return NextResponse.json({ ...newCompletion[0], status: "added" });
        }
    } catch (error) {
        return NextResponse.json({ error: "Could not toggle completion" }, { status: 500 });
    }
}
