import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habits, users } from "@/lib/schema";
import { eq } from "drizzle-orm";

/**
 * Handle Onboarding completion.
 */

export async function POST(request) {
    try {
        const { userId, onboardingMood, selectedHabits } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // 1. Update user record
        await db.update(users)
            .set({
                onboardingCompleted: true,
                onboardingMood: onboardingMood,
            })
            .where(eq(users.id, userId));

        // 2. Add initial habits
        if (selectedHabits && selectedHabits.length > 0) {
            const habitsToInsert = selectedHabits.map(h => ({
                userId,
                name: h.name,
                icon: h.icon || "✨",
                description: h.description || "Routine de début",
            }));

            await db.insert(habits).values(habitsToInsert);
        }

        return NextResponse.json({ message: "Onboarding completed" });
    } catch (error) {
        console.error("Onboarding error:", error);
        return NextResponse.json({ error: "Could not complete onboarding" }, { status: 500 });
    }
}
