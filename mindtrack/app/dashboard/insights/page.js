'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Brain, Loader2 } from 'lucide-react';

export default function InsightsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState('');

  // This function prepares the data to be analyzed by the AI
  const prepareDataForAI = async () => {
    try {
      // 1. Fetch real data from our API
      const [moodRes, habitsRes, completionsRes] = await Promise.all([
        fetch(`/api/mood-entries?userId=${user.id}`),
        fetch(`/api/habits?userId=${user.id}`),
        fetch(`/api/habit-completions?userId=${user.id}`),
      ]);

      const moodData = await moodRes.json();
      const habitsData = await habitsRes.json();
      const completionsData = await completionsRes.json();

      // 2. Create a simple summary text
      const totalHabits = habitsData.length;
      const totalCompletions = completionsData.length;
      const recentMoods = moodData.slice(-7).map(m => m.mood).join(', ');

      return `
        User Profile:
        - Active Habits: ${totalHabits}
        - Total habit completions recorded: ${totalCompletions}
        - Last 7 mood entries: ${recentMoods || 'None yet'}
      `;
    } catch (error) {
      console.error("Error gathering data for AI:", error);
      return "Unable to gather recent data.";
    }
  };

  const handleGetInsights = async () => {
    if (!user) return;
    setLoading(true);
    setAiMessage('');

    // Prepare the raw data
    const summary = await prepareDataForAI();

    try {
      // Send the summary to our specialized AI route
      const res = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary }),
      });

      const data = await res.json();

      if (data.text) {
        setAiMessage(data.text);
      } else {
        setAiMessage("Your AI guide is taking a short break. Please try again in a moment! 🧘");
      }
    } catch (error) {
      setAiMessage("Oops! We couldn't reach the AI. Check your connection.");
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
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold">AI Mindful Insights</h1>
        </div>
        <p className="text-gray-600 mb-8">
          Your personal coach analyzes your patterns to provide helpful reflections.
        </p>

        {/* Action Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-purple-500" />
          </div>
          <h2 className="text-xl font-bold mb-3">Ready for your Weekly Review?</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Click below to generate a smart summary of your habits and emotional well-being using Gemini AI.
          </p>

          <button
            onClick={handleGetInsights}
            disabled={loading}
            className="w-full sm:w-auto bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-200 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing your data...
              </>
            ) : (
              'Get My Reflection ✨'
            )}
          </button>
        </div>

        {/* AI Message Result */}
        {aiMessage && (
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
              {aiMessage}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}