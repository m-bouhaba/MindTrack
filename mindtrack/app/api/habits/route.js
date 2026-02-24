import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habits } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

/**
 * Handle Habits with full CRUD for a specific user.
 */

// Handle GET: Fetch all habits for a user
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const userHabits = await db.select()
            .from(habits)
            .where(eq(habits.userId, userId));

        return NextResponse.json(userHabits);
    } catch (error) {
        return NextResponse.json({ error: "Could not fetch habits" }, { status: 500 });
    }
}

// Handle POST: Create a new habit
export async function POST(request) {
    try {
        const body = await request.json();
        

        if (!body.userId || !body.name) {
            return NextResponse.json({ error: "Missing userId or name" }, { status: 400 });
        }

        const newHabit = await db.insert(habits).values({
            userId: body.userId,
            name: body.name,
            description: body.description,
            icon: body.icon,
        }).returning();

        return NextResponse.json(newHabit[0], { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Could not create habit" }, { status: 500 });
    }
}

// Handle PUT: Update an existing habit
export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, userId, ...updateData } = body;

        if (!id || !userId) {
            return NextResponse.json({ error: "Missing id or userId" }, { status: 400 });
        }

        const updatedHabit = await db.update(habits)
            .set(updateData)
            .where(and(eq(habits.id, id), eq(habits.userId, userId)))
            .returning();

        if (updatedHabit.length === 0) {
            return NextResponse.json({ error: "Habit not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json(updatedHabit[0]);
    } catch (error) {
        return NextResponse.json({ error: "Could not update habit" }, { status: 500 });
    }
}

// Handle DELETE: Remove a habit
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const userId = searchParams.get("userId");

        if (!id || !userId) {
            return NextResponse.json({ error: "Missing id or userId" }, { status: 400 });
        }

        const deletedHabit = await db.delete(habits)
            .where(and(eq(habits.id, id), eq(habits.userId, userId)))
            .returning();

        if (deletedHabit.length === 0) {
            return NextResponse.json({ error: "Habit not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ message: "Habit deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Could not delete habit" }, { status: 500 });
    }
}
