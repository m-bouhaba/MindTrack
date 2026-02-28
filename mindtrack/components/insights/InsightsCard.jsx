'use client';

import { motion } from 'framer-motion';
import { Sparkles, Brain } from 'lucide-react';

export default function InsightsCard({ message }) {
    if (!message) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-md p-8 border border-purple-100 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Brain className="w-24 h-24" />
            </div>

            <h3 className="text-purple-800 font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Daily Wisdom
            </h3>
            <p className="text-gray-800 leading-relaxed whitespace-pre-line relative z-10">
                {message}
            </p>
        </motion.div>
    );
}
