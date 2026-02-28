/**
 * Component tests for StatCard and Sidebar.
 */

import { render, screen } from '@testing-library/react';
import StatCard from '@/components/dashboard/StatCard';

describe('StatCard', () => {
    test('renders the correct value and label', () => {
        render(<StatCard value={42} label="Active Habits" color="blue" />);

        expect(screen.getByText('42')).toBeInTheDocument();
        expect(screen.getByText('Active Habits')).toBeInTheDocument();
    });

    test('renders a percentage string value', () => {
        render(<StatCard value="85%" label="Success Rate" color="orange" />);

        expect(screen.getByText('85%')).toBeInTheDocument();
        expect(screen.getByText('Success Rate')).toBeInTheDocument();
    });
});
