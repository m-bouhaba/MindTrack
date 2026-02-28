'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function HabitCard({ habit, isCompleted, onToggle, index = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${isCompleted
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
        >
            <button
                onClick={() => onToggle(habit.id)}
                className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${isCompleted
                        ? 'bg-green-500 border-green-500 scale-110'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
            >
                {isCompleted && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-white text-sm"
                    >
                        ✓
                    </motion.div>
                )}
            </button>

            <span className="text-2xl">{habit.icon}</span>

            <div className="flex-1">
                <div
                    className={`font-medium ${isCompleted ? 'line-through text-gray-500' : ''
                        }`}
                >
                    {habit.name}
                </div>
                <div className="text-sm text-gray-600">{habit.description}</div>
            </div>

            {isCompleted && (
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-green-500"
                >
                    <Sparkles className="w-5 h-5" />
                </motion.div>
            )}
        </motion.div>
    );
}
