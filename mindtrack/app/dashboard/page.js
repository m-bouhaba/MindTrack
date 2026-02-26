'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [completedHabits, setCompletedHabits] = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);

    try {
      // 1️⃣ Fetch habits
      const habitsRes = await fetch(`/api/habits?userId=${user.id}`);
      const habitsData = await habitsRes.json();
      setHabits(Array.isArray(habitsData) ? habitsData : []);

      // 2️⃣ Fetch today's habit completions
      const completionsRes = await fetch(
        `/api/habit-completions?userId=${user.id}&date=${today}`
      );
      const completionsData = await completionsRes.json();

      setCompletedHabits(
        Array.isArray(completionsData)
          ? completionsData.map((c) => c.habitId)
          : []
      );

      // 3️⃣ Fetch today's mood (ROBUST VERSION)
      const moodRes = await fetch(`/api/mood-entries?userId=${user.id}`);
      const moodData = await moodRes.json();
console.log("ALL mood data:", moodData);
      if (Array.isArray(moodData)) {
        const todayEntry = moodData.find((m) => {
          // Support both "date" and "createdAt"
          if (m.date) {
            return m.date === today;
          }
          if (m.createdAt) {
            return m.createdAt.startsWith(today);
          }
          return false;
        });

        if (todayEntry) {
          
          console.log("Mood from DB:", todayEntry);
          setTodayMood(todayEntry.mood);
        }
      }
    } catch (error) {
      console.error('Dashboard data load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHabitToggle = async (habitId) => {
    try {
      const res = await fetch('/api/habit-completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          habitId,
          userId: user.id,
          date: today,
        }),
      });

      const result = await res.json();

      if (result.status === 'added') {
        setCompletedHabits((prev) => [...prev, habitId]);
      } else if (result.status === 'removed') {
        setCompletedHabits((prev) => prev.filter((id) => id !== habitId));
      }
    } catch (error) {
      console.error('Habit toggle error:', error);
    }
  };

  const handleMoodSelect = async (moodValue) => {
    try {
      const res = await fetch('/api/mood-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          date: today,
          mood: moodValue,
        }),
      });

      if (res.ok) {
        setTodayMood(moodValue);
      }
    } catch (error) {
      console.error('Mood select error:', error);
    }
  };

  const moods = [
    { value: 'veryHappy', emoji: '😄', label: 'Very Happy' },
    { value: 'happy', emoji: '🙂', label: 'Happy' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'sad', emoji: '😔', label: 'Sad' },
    { value: 'stressed', emoji: '😣', label: 'Stressed' },
    { value: 'angry', emoji: '😡', label: 'Angry' },
  ];

  const motivationalMessages = [
    'Great job! Keep going! 🌟',
    "You're doing amazing! 💪",
    'Small steps matter! 🚀',
    'Progress over perfection! ✨',
    "You've got this! 🎯",
  ];

  const randomMessage =
    motivationalMessages[
      Math.floor(Math.random() * motivationalMessages.length)
    ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        Chargement...
      </div>
    );
  }

  const completedCount = completedHabits.length;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="mb-2">Welcome back!</h1>
        <p className="text-gray-600 mb-6">
          Track your habits and mood for today
        </p>

        {/* Mood Selector */}
        <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
          <h2 className="mb-6">How do you feel today?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {moods.map((mood, index) => (
              <motion.button
                key={mood.value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => handleMoodSelect(mood.value)}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center ${
                  todayMood === mood.value
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
                      isCompleted
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <button
                      onClick={() => handleHabitToggle(habit.id)}
                      className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                        isCompleted
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
                        className={`font-medium ${
                          isCompleted
                            ? 'line-through text-gray-500'
                            : ''
                        }`}
                      >
                        {habit.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {habit.description}
                      </div>
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
                  animate={{
                    width: `${
                      habits.length > 0
                        ? (completedCount / habits.length) * 100
                        : 0
                    }%`,
                  }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick Feedback */}
        {(completedCount > 0 || todayMood) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl shadow-md p-6 text-center"
          >
            <p className="text-lg text-purple-900 font-medium">
              {randomMessage}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}