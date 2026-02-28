'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Brain, Loader2 } from 'lucide-react';
import { getHabits, getHabitCompletions, getMoodEntries, getAIInsights } from '@/lib/api';
import InsightsCard from '@/components/insights/InsightsCard';

export default function InsightsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState('');

  const prepareDataForAI = async () => {
    try {
      const [moodData, habitsData, completionsData] = await Promise.all([
        getMoodEntries(user.id),
        getHabits(user.id),
        getHabitCompletions(user.id),
      ]);

      const totalHabits = habitsData.length;
      const totalCompletions = completionsData.length;
      const recentMoods = moodData.slice(-7).map((m) => m.mood).join(', ');

      return `
        User Profile:
        - Active Habits: ${totalHabits}
        - Total habit completions recorded: ${totalCompletions}
        - Last 7 mood entries: ${recentMoods || 'None yet'}
      `;
    } catch (error) {
      console.error('Error gathering data for AI:', error);
      return 'Unable to gather recent data.';
    }
  };

  const handleGetInsights = async () => {
    if (!user) return;
    setLoading(true);
    setAiMessage('');

    const summary = await prepareDataForAI();

    try {
      const data = await getAIInsights(summary);
      if (data.text) {
        setAiMessage(data.text);
      } else {
        setAiMessage(
          'Your AI guide is taking a short break. Please try again in a moment! 🧘'
        );
      }
    } catch (error) {
      setAiMessage("Oops! We couldn't reach the AI. Check your connection.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
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
          Your personal coach analyzes your patterns to provide helpful
          reflections.
        </p>

        {/* Action Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-purple-500" />
          </div>
          <h2 className="text-xl font-bold mb-3">
            Ready for your Weekly Review?
          </h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Click below to generate a smart summary of your habits and emotional
            well-being using Gemini AI.
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

        <InsightsCard message={aiMessage} />
      </motion.div>
    </div>
  );
}