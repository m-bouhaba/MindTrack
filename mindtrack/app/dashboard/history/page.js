'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function MoodHistoryPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const moodColors = {
    happy: '#10b981',
    neutral: '#6b7280',
    angry: '#ef4444',
    sad: '#3b82f6',
  };

  const moodEmojis = {
    happy: '😃',
    neutral: '😐',
    angry: '😤',
    sad: '😔',
  };

  const habits = user?.habits || [];
  const moodEntries = user?.history || [];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const previousMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));

  const getMoodForDate = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return moodEntries.find(e => e.date === dateStr);
  };

  const handleDateClick = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  const selectedEntry = selectedDate ? moodEntries.find(e => e.date === selectedDate) : null;

  const getWeeklyMoodData = () => {
    const today = new Date();
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const entry = moodEntries.find(e => e.date === dateStr);
      weekData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        happy: entry?.mood === 'happy' ? 1 : 0,
        neutral: entry?.mood === 'neutral' ? 1 : 0,
        angry: entry?.mood === 'angry' ? 1 : 0,
        sad: entry?.mood === 'sad' ? 1 : 0,
      });
    }
    return weekData;
  };

  const getMonthlyCompletionData = () => {
    const thisMonth = currentDate.getMonth();
    const thisYear = currentDate.getFullYear();
    const entriesThisMonth = moodEntries.filter(entry => {
      const d = new Date(entry.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });
    const totalDays = entriesThisMonth.length;
    if (totalDays === 0) return [];
    const completedCount = entriesThisMonth.reduce((sum, entry) => sum + (entry.completedHabits?.length || 0), 0);
    const totalPossible = totalDays * habits.length;
    const completionRate = totalPossible > 0 ? Math.round((completedCount / totalPossible) * 100) : 0;
    return [
      { name: 'Completed', value: completionRate },
      { name: 'Remaining', value: 100 - completionRate },
    ];
  };

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="mb-2 text-2xl font-bold">Mood & History</h1>
        <p className="text-gray-600 mb-8">Track your emotional patterns and progress</p>

        {/* Calendar */}
        <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-6 h-6" /></button>
            <h2>{monthNames[month]} {year}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-6 h-6" /></button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
              <div key={day} className="text-center text-sm text-gray-600 py-2">{day}</div>
            ))}
            {Array.from({ length: startingDayOfWeek }).map((_, i) => <div key={`empty-${i}`} className="aspect-square" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i+1;
              const entry = getMoodForDate(day);
              const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
              const isSelected = selectedDate === dateStr;
              const isToday = new Date().toISOString().split('T')[0] === dateStr;

              return (
                <button key={day} onClick={() => handleDateClick(day)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all ${isSelected ? 'ring-2 ring-blue-600 scale-105' : isToday ? 'ring-2 ring-blue-400' : 'hover:bg-gray-100'}`}
                  style={{ backgroundColor: entry ? `${moodColors[entry.mood]}20` : 'transparent' }}>
                  <div>{day}</div>
                  {entry && <div className="text-lg">{moodEmojis[entry.mood]}</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date */}
        {selectedEntry && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity:1, y:0 }} className="bg-white rounded-3xl shadow-md p-6 mb-6">
            <h3 className="mb-4">{new Date(selectedDate).toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Mood</p>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{moodEmojis[selectedEntry.mood]}</span>
                  <span className="text-xl capitalize">{selectedEntry.mood}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Completed Habits</p>
                <div className="space-y-2">
                  {selectedEntry.completedHabits.length === 0 ? (
                    <p className="text-gray-500">No habits completed</p>
                  ) : (
                    selectedEntry.completedHabits.map(habitId => {
                      const habit = habits.find(h => h.id === habitId);
                      return habit ? (
                        <div key={habitId} className="flex items-center gap-2">
                          <span className="text-xl">{habit.icon}</span>
                          <span>{habit.name}</span>
                        </div>
                      ) : null;
                    })
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Weekly Mood */}
          <div className="bg-white rounded-3xl shadow-md p-6">
            <h3 className="mb-6">Weekly Mood Summary</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getWeeklyMoodData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="happy" stackId="a" fill={moodColors.happy} />
                <Bar dataKey="neutral" stackId="a" fill={moodColors.neutral} />
                <Bar dataKey="angry" stackId="a" fill={moodColors.angry} />
                <Bar dataKey="sad" stackId="a" fill={moodColors.sad} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Completion */}
          <div className="bg-white rounded-3xl shadow-md p-6">
            <h3 className="mb-6">Monthly Habit Completion</h3>
            {getMonthlyCompletionData().length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={getMonthlyCompletionData()} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" label={({ value }) => `${value}%`}>
                      <Cell fill="#10b981" />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-4">
                  <p className="text-3xl font-bold text-green-600">{getMonthlyCompletionData()[0]?.value || 0}%</p>
                  <p className="text-gray-600">Completion Rate</p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-gray-500">
                <p>No data for this month yet</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
