'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';
import { getHabits, getHabitCompletions, getMoodEntries } from '@/lib/api';
import StatCard from '@/components/dashboard/StatCard';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [totalDaysTracked, setTotalDaysTracked] = useState(0);
  const [totalHabitsCompleted, setTotalHabitsCompleted] = useState(0);
  const [habitsCount, setHabitsCount] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadStats();
  }, [user]);

  const loadStats = async () => {
    try {
      const [habitsData, completionsData, moodData] = await Promise.all([
        getHabits(user.id),
        getHabitCompletions(user.id),
        getMoodEntries(user.id),
      ]);

      setHabitsCount(habitsData.length);
      setTotalHabitsCompleted(completionsData.length);
      setTotalDaysTracked(moodData.length);
    } catch (error) {
      console.error('Profile stats error:', error);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const successRate =
    totalDaysTracked > 0 && habitsCount > 0
      ? Math.round(
        (totalHabitsCompleted / (totalDaysTracked * habitsCount)) * 100
      )
      : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="mb-2 text-2xl font-bold">Profile & Settings</h1>
        <p className="text-gray-600 mb-8">
          Manage your account and view your progress
        </p>

        <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="mb-1">{user?.email}</h2>
              <p className="text-gray-600">Your wellness journey</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value={habitsCount} label="Active Habits" color="blue" />
            <StatCard
              value={totalDaysTracked}
              label="Days Tracked"
              color="green"
            />
            <StatCard
              value={totalHabitsCompleted}
              label="Total Completions"
              color="purple"
            />
            <StatCard
              value={`${successRate}%`}
              label="Success Rate"
              color="orange"
            />
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-4 rounded-2xl hover:bg-red-700 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </motion.div>
    </div>
  );
}