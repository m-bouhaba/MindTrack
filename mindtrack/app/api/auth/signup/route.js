import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

/**
 * API Route for User Signup.
 */

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Check if user already exists
        const existingUser = await db.select()
            .from(users)
            .where(eq(users.email, email.toLowerCase()))
            .limit(1);

        if (existingUser.length > 0) {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }

        // Create new user
        const newUser = await db.insert(users).values({
            email: email.toLowerCase(),
            password: password, // In a real app, hash this!
        }).returning();

        return NextResponse.json(newUser[0]);
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Could not create account" }, { status: 500 });
    }
}
