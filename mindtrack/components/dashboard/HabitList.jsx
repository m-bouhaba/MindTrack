'use client';

import { motion } from 'framer-motion';
import HabitCard from './HabitCard';

export default function HabitList({ habits, completedHabits, onToggle }) {
    const completedCount = completedHabits.length;

    return (
        <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
            <h2 className="mb-6">Today&apos;s Habits</h2>

            {habits.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No habits yet. Add your first habit to get started!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {habits.map((habit, index) => (
                        <HabitCard
                            key={habit.id}
                            habit={habit}
                            isCompleted={completedHabits.includes(habit.id)}
                            onToggle={onToggle}
                            index={index}
                        />
                    ))}
                </div>
            )}

            {habits.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-blue-600">
                            {completedCount} / {habits.length} completed 🎯
                        </span>
                    </div>

                    <div className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{
                                width: `${habits.length > 0
                                        ? (completedCount / habits.length) * 100
                                        : 0
                                    }%`,
                            }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
