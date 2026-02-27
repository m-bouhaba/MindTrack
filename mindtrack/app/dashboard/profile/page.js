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
      // Fetch habits
      const habitsRes = await fetch(`/api/habits?userId=${user.id}`);
      const habitsData = await habitsRes.json();
      setHabitsCount(Array.isArray(habitsData) ? habitsData.length : 0);

      // Fetch completions
      const completionsRes = await fetch(`/api/habit-completions?userId=${user.id}`);
      const completionsData = await completionsRes.json();
      setTotalHabitsCompleted(Array.isArray(completionsData) ? completionsData.length : 0);

      // Fetch mood entries (days tracked)
      const moodRes = await fetch(`/api/mood-entries?userId=${user.id}`);
      const moodData = await moodRes.json();
      setTotalDaysTracked(Array.isArray(moodData) ? moodData.length : 0);

    } catch (error) {
      console.error("Profile stats error:", error);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const successRate =
    totalDaysTracked > 0 && habitsCount > 0
      ? Math.round((totalHabitsCompleted / (totalDaysTracked * habitsCount)) * 100)
      : 0;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

        <h1 className="mb-2 text-2xl font-bold">Profile & Settings</h1>
        <p className="text-gray-600 mb-8">Manage your account and view your progress</p>

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
            <StatCard value={totalDaysTracked} label="Days Tracked" color="green" />
            <StatCard value={totalHabitsCompleted} label="Total Completions" color="purple" />
            <StatCard value={`${successRate}%`} label="Success Rate" color="orange" />
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

function StatCard({ value, label, color }) {
  const colorMap = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50',
  };

  return (
    <div className={`p-4 rounded-2xl text-center ${colorMap[color]}`}>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}