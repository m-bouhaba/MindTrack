'use client';

import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';

export default function HabitManager({ habits, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-3xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-6">
                Your Habits ({habits.length})
            </h2>

            {habits.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <div className="text-5xl mb-4">🎯</div>
                    <p>No habits yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {habits.map((habit, index) => (
                        <motion.div
                            key={habit.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all"
                        >
                            <span className="text-3xl">{habit.icon}</span>

                            <div className="flex-1">
                                <div className="font-medium">{habit.name}</div>
                                <div className="text-sm text-gray-600">{habit.description}</div>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => onEdit(habit)}>
                                    <Edit2 className="w-5 h-5 text-blue-600" />
                                </button>
                                <button onClick={() => onDelete(habit.id)}>
                                    <Trash2 className="w-5 h-5 text-red-600" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
