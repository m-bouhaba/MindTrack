import { NextResponse } from "next/server";

/**
 * API Route for AI Insights.
 * This route communicates with Google's Gemini AI.
 */

export async function POST(request) {
    try {
        const { summary } = await request.json();

        // Check if we have the API Key
        const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

        if (!GOOGLE_API_KEY) {
            // Fallback message if no API key is configured
            const fallback = "You're making great progress! Your consistency in tracking habits shows dedication. Keep maintaining this positive momentum. (Note: Configure GOOGLE_API_KEY in .env for full AI reflections)";
            return NextResponse.json({ text: fallback });
        }

        // Call Gemini API (using standard fetch for simplicity)
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`;

        const response = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a supportive life coach. Analyze this user data and provide a short, 3-sentence motivating reflection: ${summary}`
                    }]
                }]
            })
        });

        const data = await response.json();
        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        return NextResponse.json({ text: aiText || "I'm reflecting on your progress. Continue your great work!" });
    } catch (error) {
        console.error("AI Insights Error:", error);
        return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
    }
}
