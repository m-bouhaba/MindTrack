import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habits, habitCompletions, moodEntries } from "@/lib/schema";
import { eq, and, gte } from "drizzle-orm";

/**
 * POST /api/ai-insights
 *
 * Accepts: { userId: string }
 * Returns: { text: string }
 *
 * All behavioral analysis is performed server-side from the database.
 * The structured summary is forwarded to the n8n webhook for AI processing.
 */
export async function POST(request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        // ─── Date window: last 7 days (YYYY-MM-DD string) ──
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

        // 1️⃣ All habits for this user
        const allHabits = await db
            .select()
            .from(habits)
            .where(eq(habits.userId, userId));

        const activeHabitsCount = allHabits.length;
        const habitNames = allHabits.map((h) => h.name).join(", ");

        // 2️⃣ Habit completions in the last 7 days
        const completionsResult = await db
            .select()
            .from(habitCompletions)
            .where(
                and(
                    eq(habitCompletions.userId, userId),
                    gte(habitCompletions.date, sevenDaysAgoStr)
                )
            );

        const totalCompletions = completionsResult.length;

        // 3️⃣ Completion rate
        const totalPossible = activeHabitsCount * 7;
        const completionRate =
            totalPossible > 0
                ? Math.round((totalCompletions / totalPossible) * 100)
                : 0;

        // 4️⃣ Moods in the last 7 days
        const moodsResult = await db
            .select()
            .from(moodEntries)
            .where(
                and(
                    eq(moodEntries.userId, userId),
                    gte(moodEntries.date, sevenDaysAgoStr)
                )
            );

        // Mood frequency analysis
        const moodCounts = {};
        moodsResult.forEach((m) => {
            moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
        });

        const dominantMood =
            Object.keys(moodCounts).length > 0
                ? Object.keys(moodCounts).reduce((a, b) =>
                    moodCounts[a] > moodCounts[b] ? a : b
                )
                : "neutral";

        const moodBreakdown = Object.entries(moodCounts)
            .map(([mood, count]) => `${mood}: ${count} day(s)`)
            .join(", ");

        // 5️⃣ Structured analytical prompt for AI
        const summary = `
You are a behavioral wellness analyst. Analyze this user's weekly data and respond in a warm, professional, data-driven tone.

=== USER WEEKLY BEHAVIORAL REPORT ===

Period: Last 7 days (since ${sevenDaysAgoStr})

HABITS:
- Total tracked habits: ${activeHabitsCount}
- Habit names: ${habitNames || "None"}
- Completions this week: ${totalCompletions} / ${totalPossible} possible
- Weekly completion rate: ${completionRate}%

EMOTIONAL STATE:
- Mood entries recorded: ${moodsResult.length}
- Dominant mood: ${dominantMood}
- Mood breakdown: ${moodBreakdown || "No mood data"}

=== INSTRUCTIONS ===

Based on this data, provide:
1) A behavioral insight linking their habit consistency to patterns
2) An emotional interpretation of their mood trends
3) One specific, actionable improvement suggestion
4) A short motivational closing (1-2 sentences)

Keep the response concise (under 200 words), structured, and personalized.
`;

        // ─── Forward to n8n webhook ────────────────────────
        const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

        if (!N8N_WEBHOOK_URL) {
            return NextResponse.json({
                text: "AI service is not configured yet.",
            });
        }

        const response = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ summary }),
        });

        const data = await response.json();

        return NextResponse.json({
            text: data.text || "Keep going, you're doing great!",
        });
    } catch (error) {
        console.error("AI Insights Error:", error);
        return NextResponse.json(
            { error: "Failed to generate insights" },
            { status: 500 }
        );
    }
}