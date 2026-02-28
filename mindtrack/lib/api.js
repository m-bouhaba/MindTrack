/**
 * Centralized data-access layer.
 * Every fetch call in the app goes through this file
 * so pages stay thin and concerns are separated.
 */

// ─── Habits ────────────────────────────────────────────

export async function getHabits(userId) {
    const res = await fetch(`/api/habits?userId=${userId}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

export async function createHabit(userId, { name, description, icon }) {
    const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name, description, icon }),
    });
    return res;
}

export async function updateHabit(id, userId, { name, description, icon }) {
    const res = await fetch('/api/habits', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, userId, name, description, icon }),
    });
    return res;
}

export async function deleteHabit(id, userId) {
    const res = await fetch(`/api/habits?id=${id}&userId=${userId}`, {
        method: 'DELETE',
    });
    return res;
}

// ─── Habit Completions ─────────────────────────────────

export async function getHabitCompletions(userId, date) {
    const url = date
        ? `/api/habit-completions?userId=${userId}&date=${date}`
        : `/api/habit-completions?userId=${userId}`;
    const res = await fetch(url);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

export async function toggleHabitCompletion(habitId, userId, date) {
    const res = await fetch('/api/habit-completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId, userId, date }),
    });
    return res.json();
}

// ─── Mood Entries ──────────────────────────────────────

export async function getMoodEntries(userId) {
    const res = await fetch(`/api/mood-entries?userId=${userId}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

export async function submitMood(userId, date, mood) {
    const res = await fetch('/api/mood-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, date, mood }),
    });
    return res;
}

// ─── AI Insights ───────────────────────────────────────

export async function getAIInsights(summary) {
    const res = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary }),
    });
    return res.json();
}
