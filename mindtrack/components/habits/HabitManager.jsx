'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, AlertTriangle, X } from 'lucide-react';

export default function HabitManager({ habits, onEdit, onDelete }) {
    const [habitToDelete, setHabitToDelete] = useState(null);

    const handleDeleteClick = (habit) => {
        setHabitToDelete(habit);
    };

    const confirmDelete = () => {
        if (habitToDelete) {
            onDelete(habitToDelete.id);
            setHabitToDelete(null);
        }
    };

    const cancelDelete = () => {
        setHabitToDelete(null);
    };

    return (
        <div className="bg-white rounded-3xl shadow-md p-6 relative">
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
                                <button onClick={() => handleDeleteClick(habit)}>
                                    <Trash2 className="w-5 h-5 text-red-600" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {habitToDelete && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 z-40"
                            onClick={cancelDelete}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 shadow-2xl z-50 w-full max-w-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3 text-red-600">
                                    <AlertTriangle className="w-6 h-6" />
                                    <h3 className="text-lg font-bold">Delete Habit</h3>
                                </div>
                                <button onClick={cancelDelete} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete <span className="font-semibold text-gray-800">"{habitToDelete.name}"</span>?
                                This action cannot be undone.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={cancelDelete}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-sm"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
