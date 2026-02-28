'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  getHabits,
  getHabitCompletions,
  getMoodEntries,
  toggleHabitCompletion,
  submitMood,
} from '@/lib/api';
import MoodSelector from '@/components/dashboard/MoodSelector';
import HabitList from '@/components/dashboard/HabitList';

export default function Dashboard() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [completedHabits, setCompletedHabits] = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (user?.id) loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [habitsData, completionsData, moodData] = await Promise.all([
        getHabits(user.id),
        getHabitCompletions(user.id, today),
        getMoodEntries(user.id),
      ]);

      setHabits(habitsData);
      setCompletedHabits(completionsData.map((c) => c.habitId));

      if (Array.isArray(moodData)) {
        const todayEntry = moodData.find((m) => {
          if (m.date) return m.date === today;
          if (m.createdAt) return m.createdAt.startsWith(today);
          return false;
        });
        if (todayEntry) setTodayMood(todayEntry.mood);
      }
    } catch (error) {
      console.error('Dashboard data load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHabitToggle = async (habitId) => {
    try {
      const result = await toggleHabitCompletion(habitId, user.id, today);
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
      const res = await submitMood(user.id, today, moodValue);
      if (res.ok) setTodayMood(moodValue);
    } catch (error) {
      console.error('Mood select error:', error);
    }
  };

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
        Loading...
      </div>
    );
  }

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

        <MoodSelector todayMood={todayMood} onSelect={handleMoodSelect} />

        <HabitList
          habits={habits}
          completedHabits={completedHabits}
          onToggle={handleHabitToggle}
        />

        {(completedHabits.length > 0 || todayMood) && (
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