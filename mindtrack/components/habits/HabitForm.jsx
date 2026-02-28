'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const habitIcons = ['✨', '💤', '🏃‍♀️', '🧘', '💧', '📚', '🥗', '🎯', '💪', '🌅', '🧠', '❤️'];

export default function HabitForm({
    show,
    editing,
    formData,
    onChange,
    onSubmit,
    onCancel,
}) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-3xl shadow-md p-6 mb-6 overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">
                            {editing ? 'Edit Habit' : 'Add New Habit'}
                        </h2>
                        <button onClick={onCancel}>
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => onChange({ ...formData, name: e.target.value })}
                            placeholder="Habit Name"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            required
                        />

                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) =>
                                onChange({ ...formData, description: e.target.value })
                            }
                            placeholder="Description"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            required
                        />

                        <div>
                            <p className="text-sm mb-2 text-gray-700">Choose an icon</p>
                            <div className="grid grid-cols-6 gap-3">
                                {habitIcons.map((icon) => (
                                    <button
                                        key={icon}
                                        type="button"
                                        onClick={() => onChange({ ...formData, icon })}
                                        className={`p-4 rounded-xl border-2 text-2xl transition-all ${formData.icon === icon
                                                ? 'border-blue-600 bg-blue-50 scale-110'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
                            >
                                {editing ? 'Update Habit' : 'Add Habit'}
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
