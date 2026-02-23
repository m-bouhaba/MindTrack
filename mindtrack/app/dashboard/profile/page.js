'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Target, TrendingUp, Calendar, User as UserIcon } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [totalDaysTracked, setTotalDaysTracked] = useState(0);
  const [totalHabitsCompleted, setTotalHabitsCompleted] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const daysTracked = user.history?.length || 0;
    let habitsCompleted = 0;
    user.history?.forEach((entry) => {
      habitsCompleted += entry.completedHabits?.length || 0;
    });

    setTotalDaysTracked(daysTracked);
    setTotalHabitsCompleted(habitsCompleted);
  }, [user, router]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all your data? This cannot be undone.')) {
      localStorage.removeItem('mindtrack-current-user');
      router.push('/signup');
    }
  };

  const selectedGoals = user?.goals
    ? Object.entries(user.goals)
        .filter(([_, value]) => value)
        .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim())
    : [];

  const goalEmojis = {
    'reduce Stress': '😌',
    'improve Sleep': '💤',
    'be Productive': '⚡',
    'improve Health': '🏃‍♀️',
    'build Habit': '🎯',
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="mb-2 text-2xl font-bold">Profile & Settings</h1>
        <p className="text-gray-600 mb-8">Manage your account and view your progress</p>

        {/* User Info */}
        <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="mb-1">{user?.email || 'Welcome'}</h2>
              <p className="text-gray-600">Your wellness journey</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{user?.habits?.length || 0}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Target className="w-4 h-4" />
                Active Habits
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{totalDaysTracked}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Calendar className="w-4 h-4" />
                Days Tracked
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-2xl text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">{totalHabitsCompleted}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Total Completions
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-2xl text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {totalDaysTracked > 0 && user?.habits?.length
                  ? Math.round((totalHabitsCompleted / (totalDaysTracked * user.habits.length)) * 100)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Target className="w-4 h-4" />
                Success Rate
              </div>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
          <h2 className="mb-4">Your Goals</h2>
          {selectedGoals.length === 0 ? (
            <p className="text-gray-600">No goals selected</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {selectedGoals.map((goal, index) => (
                <motion.div
                  key={goal}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl"
                >
                  <span className="text-2xl">{goalEmojis[goal] || '🎯'}</span>
                  <span className="capitalize">{goal}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
          <h2 className="mb-4">Settings</h2>
          <div className="space-y-3">
            <button
              onClick={handleResetData}
              className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all text-left"
            >
              <span>Reset All Data</span>
              <span className="text-orange-600">⚠️</span>
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-4 rounded-2xl hover:bg-red-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>MindTrack v1.0</p>
          <p className="mt-2">Built with care for your well-being 💙</p>
        </div>
      </motion.div>
    </div>
  );
}
