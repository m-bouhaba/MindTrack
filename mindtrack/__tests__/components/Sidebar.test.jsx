/**
 * Component test for Sidebar navigation links.
 */

import { render, screen } from '@testing-library/react';

// Mock next/navigation since Sidebar uses usePathname
jest.mock('next/navigation', () => ({
    usePathname: () => '/dashboard',
}));

import Sidebar from '@/components/layout/Sidebar';

describe('Sidebar', () => {
    test('renders all navigation links', () => {
        render(<Sidebar />);

        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Habits')).toBeInTheDocument();
        expect(screen.getByText('History')).toBeInTheDocument();
        expect(screen.getByText('Insights')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    test('renders the brand name', () => {
        render(<Sidebar />);

        expect(screen.getByText('MindTrack')).toBeInTheDocument();
    });
});
