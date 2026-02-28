/**
 * API route tests for mood-entries and habits.
 * We mock the database layer so no real DB connection is needed.
 */

import { NextResponse } from 'next/server';

// ─── Mock the database ─────────────────────────────────
// We mock `@/lib/db` so routes never touch a real database.

const mockSelect = jest.fn();
const mockInsert = jest.fn();
const mockUpdate = jest.fn();

jest.mock('@/lib/db', () => ({
    db: {
        select: () => ({ from: () => ({ where: mockSelect }) }),
        insert: () => ({ values: () => ({ returning: mockInsert }) }),
        update: () => ({ set: () => ({ where: mockUpdate }) }),
    },
}));

jest.mock('@/lib/schema', () => ({
    moodEntries: {},
    habits: {},
}));

jest.mock('drizzle-orm', () => ({
    eq: jest.fn(),
    and: jest.fn(),
}));

// ─── Tests ──────────────────────────────────────────────

describe('POST /api/mood-entries', () => {
    let POST;

    beforeAll(async () => {
        const mod = await import('@/app/api/mood-entries/route');
        POST = mod.POST;
    });

    test('creates a new mood entry and returns 201', async () => {
        // Mock: no existing entry found, then insert returns the new entry
        mockSelect.mockResolvedValueOnce([]);
        mockInsert.mockResolvedValueOnce([
            { id: 'uuid-1', userId: 'user-1', date: '2026-02-28', mood: 'happy' },
        ]);

        const request = new Request('http://localhost/api/mood-entries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 'user-1',
                date: '2026-02-28',
                mood: 'happy',
            }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.mood).toBe('happy');
        expect(data.userId).toBe('user-1');
    });
});

describe('POST /api/habits', () => {
    let POST;

    beforeAll(async () => {
        const mod = await import('@/app/api/habits/route');
        POST = mod.POST;
    });

    test('creates a new habit and returns 201 with correct data', async () => {
        mockInsert.mockResolvedValueOnce([
            { id: 'habit-1', userId: 'user-1', name: 'Meditate', description: 'Daily meditation', icon: '🧘' },
        ]);

        const request = new Request('http://localhost/api/habits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 'user-1',
                name: 'Meditate',
                description: 'Daily meditation',
                icon: '🧘',
            }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.name).toBe('Meditate');
        expect(data.icon).toBe('🧘');
    });
});
