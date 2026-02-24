import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

/**
 * API Route for User Login.
 */

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Find the user with matching email and password
        const user = await db.select()
            .from(users)
            .where(
                and(
                    eq(users.email, email.toLowerCase()),
                    eq(users.password, password)
                )
            )
            .limit(1);

        if (user.length === 0) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        return NextResponse.json(user[0]);
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}
