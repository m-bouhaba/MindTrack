'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useAuth } from '@/context/AuthContext';

export default function OnboardingRecap() {
  const router = useRouter();
  const { user, loading, completeOnboarding } = useAuth();
  const { goals, lifestyle, suggestedHabits, mood } = useSelector(
    (state) => state.onboarding || {}
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirection si user non trouvé
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const handleStartJourney = async () => {
    if (!user || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const updatedUser = await completeOnboarding({
        habits: suggestedHabits,
        mood: mood,
      });

      if (!updatedUser) {
        setIsSubmitting(false);
        return;
      }

      await fetch("/api/mood-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          date: new Date().toISOString().split("T")[0],
          mood: mood,
        }),
      });

      await fetch("https://n8n.deontex.com/webhook/mind", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          habits: suggestedHabits,
          mood: mood,
        }),
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Webhook error:", error);
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl text-center"
      >
        <h2 className="text-2xl font-semibold mb-2">Your Personal Summary</h2>
        <p className="text-gray-600 mb-8">
          Here’s a quick overview of what matters to you 🌱
        </p>

        {/* Mood */}
        {mood && (
          <div className="mb-8">
            <div className="text-sm text-gray-500 mb-2">Your current mood</div>
            <div className="text-5xl">{getMoodEmoji(mood)}</div>
          </div>
        )}

        {/* Goals */}
        <div className="mb-8">
          <div className="text-sm text-gray-500 mb-3">Your goals</div>
          <div className="flex flex-wrap justify-center gap-2">
            {goals &&
              Object.entries(goals).map(
                ([key, value]) =>
                  value && (
                    <span
                      key={key}
                      className="px-4 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium"
                    >
                      {formatGoalLabel(key)}
                    </span>
                  )
              )}
          </div>
        </div>

        {/* Lifestyle */}
        <div className="mb-8">
          <div className="text-sm text-gray-500 mb-3">Your lifestyle</div>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {lifestyle &&
              Object.entries(lifestyle).map(([key, value]) => (
                <div
                  key={key}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700"
                >
                  <span className="font-medium">{formatLifestyleLabel(key)}</span>
                  <div className="text-gray-500">{value || '—'}</div>
                </div>
              ))}
          </div>
        </div>

        {/* Habits */}
        <div className="mt-10 text-center">
          <div className="text-sm text-gray-500 mb-5">Selected habits</div>
          <div className="flex flex-wrap justify-center gap-5 mb-8">
            {suggestedHabits?.map((habit) => (
              <div
                key={habit.id}
                className="w-32 h-32 flex flex-col items-center justify-center rounded-2xl bg-green-50/60"
              >
                <span className="text-4xl mb-3">{habit.icon}</span>
                <div className="text-sm font-medium text-gray-800 text-center px-2">
                  {habit.name}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleStartJourney}
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl text-white ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isSubmitting ? 'Starting...' : 'Start my journey 🚀'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* Helpers */
function getMoodEmoji(mood) {
  const map = {
    veryHappy: '😄',
    happy: '🙂',
    neutral: '😐',
    sad: '😔',
    stressed: '😣',
    angry: '😡',
  };
  return map[mood] || '😐';
}

function formatGoalLabel(key) {
  const map = {
    improveSleep: 'Improve sleep',
    reduceStress: 'Reduce stress',
    beProductive: 'Be productive',
    improveHealth: 'Improve health',
    buildHabit: 'Build habits',
  };
  return map[key] || key;
}

function formatLifestyleLabel(key) {
  const map = {
    sleepHours: 'Sleep',
    exercise: 'Exercise',
    stress: 'Stress',
    water: 'Water',
  };
  return map[key] || key;
}
