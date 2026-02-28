/**
 * Unit tests for success rate calculation logic.
 * This logic is used in the Profile page to calculate
 * the user's habit completion percentage.
 */

/**
 * Extracted pure function matching the profile page logic:
 *   successRate = totalCompletions / (daysTracked * habitsCount) * 100
 */
function calculateSuccessRate(totalCompletions, daysTracked, habitsCount) {
    if (daysTracked <= 0 || habitsCount <= 0) return 0;
    return Math.round((totalCompletions / (daysTracked * habitsCount)) * 100);
}

describe('calculateSuccessRate', () => {
    test('calculates correct percentage with valid data', () => {
        // 10 completions over 5 days with 4 habits = 10 / 20 = 50%
        expect(calculateSuccessRate(10, 5, 4)).toBe(50);

        // 14 completions over 7 days with 2 habits = 14 / 14 = 100%
        expect(calculateSuccessRate(14, 7, 2)).toBe(100);

        // 3 completions over 7 days with 3 habits = 3 / 21 ≈ 14%
        expect(calculateSuccessRate(3, 7, 3)).toBe(14);
    });

    test('returns 0 when habits or days tracked is zero (no division by zero)', () => {
        expect(calculateSuccessRate(0, 0, 0)).toBe(0);
        expect(calculateSuccessRate(5, 0, 3)).toBe(0);
        expect(calculateSuccessRate(5, 3, 0)).toBe(0);
        expect(calculateSuccessRate(0, 5, 3)).toBe(0);
    });
});
