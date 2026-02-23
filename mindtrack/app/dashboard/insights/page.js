'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function InsightsPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState('');

  // Exemple simple de résumé basé sur les habitudes
  const generateWeeklySummary = () => {
    const habits = user?.habits || [];

    const totalHabits = habits.length;

    return `
User has ${totalHabits} active habits.
This week the user has been tracking mood and habits consistently.
The goal is to improve emotional stability and productivity.
    `;
  };

  const handleGetInsights = async () => {
    setLoading(true);
    setAiMessage('');

    const summary = generateWeeklySummary();

    try {
      const res = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary }),
      });

      const data = await res.json();

      if (data.text) {
        setAiMessage(data.text);
      } else {
        setAiMessage("Unable to generate insights.");
      }
    } catch (error) {
      setAiMessage("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold mb-2">AI Insights</h1>
        <p className="text-gray-600 mb-8">
          Get a personalized weekly reflection based on your habits and mood.
        </p>

        {/* Button */}
        <button
          onClick={handleGetInsights}
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {loading ? 'Generating...' : '✨ Get My Weekly Reflection'}
        </button>

        {/* AI Message */}
        {aiMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 bg-white rounded-3xl shadow-md p-6 border border-purple-100"
          >
            <p className="text-gray-800 whitespace-pre-line">
              {aiMessage}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}