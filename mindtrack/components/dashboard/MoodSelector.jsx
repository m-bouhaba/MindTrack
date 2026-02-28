'use client';

import { motion } from 'framer-motion';

const moods = [
    { value: 'veryHappy', emoji: '😄', label: 'Very Happy' },
    { value: 'happy', emoji: '🙂', label: 'Happy' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'sad', emoji: '😔', label: 'Sad' },
    { value: 'stressed', emoji: '😣', label: 'Stressed' },
    { value: 'angry', emoji: '😡', label: 'Angry' },
];

export default function MoodSelector({ todayMood, onSelect }) {
    return (
        <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
            <h2 className="mb-6">How do you feel today?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {moods.map((mood, index) => (
                    <motion.button
                        key={mood.value}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        onClick={() => onSelect(mood.value)}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center ${todayMood === mood.value
                                ? 'border-blue-600 bg-blue-50 scale-105 shadow-sm'
                                : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                            }`}
                    >
                        <div className="text-4xl mb-2">{mood.emoji}</div>
                        <div className="text-xs text-center text-gray-700 font-medium">
                            {mood.label}
                        </div>
                        {todayMood === mood.value && (
                            <motion.div
                                layoutId="mood-active"
                                className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"
                            />
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
