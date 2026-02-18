'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import Layout from '../layout';
import { Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { habits, moodEntries } = useSelector((state) => state.user || { habits: [], moodEntries: [] });
  const onboardingMood = useSelector((state) => state.onboarding.mood);

  const [todayMood, setTodayMood] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const todayEntry = moodEntries.find((e) => e.date === today);
    if (todayEntry) {
      setTodayMood(todayEntry.mood);
      setCompletedCount(todayEntry.completedHabits.length);
    }
  }, [moodEntries, today]);

  const handleHabitToggle = (habitId) => {
    const todayEntry = moodEntries.find((e) => e.date === today);
    const currentCompleted = todayEntry?.completedHabits || [];
    const isCompleted = currentCompleted.includes(habitId);

    setCompletedCount(isCompleted ? completedCount - 1 : completedCount + 1);
  };

  const handleMoodSelect = (mood) => {
    setTodayMood(mood);
  };

  const todayEntry = moodEntries.find((e) => e.date === today);
  const completedHabits = todayEntry?.completedHabits || [];

  const moods = [
    { value: 'veryHappy', emoji: '😄', label: 'Very Happy' },
    { value: 'happy', emoji: '🙂', label: 'Happy' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'sad', emoji: '😔', label: 'Sad' },
    { value: 'stressed', emoji: '😣', label: 'Stressed' },
    { value: 'angry', emoji: '😡', label: 'Angry' },
  ];

  const motivationalMessages = [
    "Great job! Keep going! 🌟",
    "You're doing amazing! 💪",
    "Small steps matter! 🚀",
    "Progress over perfection! ✨",
    "You've got this! 🎯",
  ];

  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  const onboardingMoodEmojiMap = {
    veryHappy: "😄",
    happy: "🙂",
    neutral: "😐",
    sad: "😔",
    stressed: "😣",
    angry: "😡",
  };

  const onboardingMoodEmoji = onboardingMood ? onboardingMoodEmojiMap[onboardingMood] : null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="mb-2">Welcome back!</h1>
          <p className="text-gray-600 mb-4">Track your habits and mood for today</p>

          {/* Mood onboarding */}
          {onboardingMoodEmoji && (
            <div className="mb-6 flex items-center justify-center gap-3 text-gray-700">
              <span className="text-3xl">{onboardingMoodEmoji}</span>
              <span className="text-sm">
                This is how you felt when you started your journey
              </span>
            </div>
          )}

          {/* Today's Habits */}
          <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
            <h2 className="mb-6">Today's Habits</h2>
            {habits.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No habits yet. Add your first habit to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {habits.map((habit, index) => {
                  const isCompleted = completedHabits.includes(habit.id);
                  return (
                    <motion.div
                      key={habit.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                        isCompleted ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <button
                        onClick={() => handleHabitToggle(habit.id)}
                        className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                          isCompleted ? 'bg-green-500 border-green-500 scale-110' : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {isCompleted && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-white text-sm">
                            ✓
                          </motion.div>
                        )}
                      </button>
                      <span className="text-2xl">{habit.icon}</span>
                      <div className="flex-1">
                        <div className={`font-medium ${isCompleted ? 'line-through text-gray-500' : ''}`}>{habit.name}</div>
                        <div className="text-sm text-gray-600">{habit.description}</div>
                      </div>
                      {isCompleted && (
                        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} className="text-green-500">
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {habits.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-blue-600">
                    {completedCount} / {habits.length} completed 🎯
                  </span>
                </div>
                <div className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedCount / habits.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Mood Selector */}
          <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
            <h2 className="mb-6">How do you feel today?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {moods.map((mood, index) => (
                <motion.button
                  key={mood.value}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => handleMoodSelect(mood.value)}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    todayMood === mood.value ? 'border-blue-600 bg-blue-50 scale-105' : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                  }`}
                >
                  <div className="text-5xl mb-2">{mood.emoji}</div>
                  <div className="text-sm text-gray-700">{mood.label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quick Feedback */}
          {(completedCount > 0 || todayMood) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl shadow-md p-6 text-center"
            >
              <p className="text-lg text-purple-900">{randomMessage}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}