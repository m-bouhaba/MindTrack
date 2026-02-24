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
  const [moodEntries, setMoodEntries] = useState([]);
  const [habitCompletions, setHabitCompletions] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchHistoryData();
    }
  }, [user, router]);

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      const [moodRes, habitsRes, completionsRes] = await Promise.all([
        fetch(`/api/mood-entries?userId=${user.id}`),
        fetch(`/api/habits?userId=${user.id}`),
        fetch(`/api/habit-completions?userId=${user.id}`),
      ]);

      const moodData = await moodRes.json();
      const habitsData = await habitsRes.json();
      const completionsData = await completionsRes.json();

      setMoodEntries(Array.isArray(moodData) ? moodData : []);
      setHabits(Array.isArray(habitsData) ? habitsData : []);
      setHabitCompletions(Array.isArray(completionsData) ? completionsData : []);
    } catch (error) {
      console.error("Failed to fetch history data:", error);
    } finally {
      setLoading(false);
    }
  };

  const moodColors = {
    veryHappy: '#10b981',
    happy: '#34d399',
    neutral: '#6b7280',
    sad: '#3b82f6',
    stressed: '#f59e0b',
    angry: '#ef4444',
  };

  const moodEmojis = {
    veryHappy: '😄',
    happy: '🙂',
    neutral: '😐',
    sad: '😔',
    stressed: '😣',
    angry: '😡',
  };

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
  const selectedCompletions = selectedDate ? habitCompletions.filter(c => c.date === selectedDate) : [];

  const getWeeklyMoodData = () => {
    const today = new Date();
    const weekData = [];
    const moodLevels = {
      veryHappy: 5,
      happy: 4,
      neutral: 3,
      sad: 2,
      stressed: 1.5,
      angry: 1
    };

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const entry = moodEntries.find(e => e.date === dateStr);

      weekData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        level: entry ? moodLevels[entry.mood] : 0,
        mood: entry?.mood || 'None'
      });
    }
    return weekData;
  };

  const getMonthlyCompletionData = () => {
    const thisMonthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    const completionsThisMonth = habitCompletions.filter(c => c.date.startsWith(thisMonthStr));

    // Approximate days that passed this month
    const totalDays = month === new Date().getMonth() ? new Date().getDate() : daysInMonth;
    const totalPossible = totalDays * habits.length;

    if (totalPossible === 0) return [];

    const count = completionsThisMonth.length;
    const completionRate = Math.round((count / totalPossible) * 100);

    return [
      { name: 'Completed', value: completionRate },
      { name: 'Remaining', value: 100 - completionRate },
    ];
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (loading) {
    return <div className="flex items-center justify-center p-12">Chargement de l'historique...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="mb-2 text-2xl font-bold">History & Insights</h1>
        <p className="text-gray-600 mb-8">Visualize your progress and emotional trends</p>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar */}
            <div className="bg-white rounded-3xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-6 h-6" /></button>
                <h2 className="text-xl font-semibold">{monthNames[month]} {year}</h2>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-6 h-6" /></button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-bold text-gray-400 py-2 uppercase">{day}</div>
                ))}
                {Array.from({ length: startingDayOfWeek }).map((_, i) => <div key={`empty-${i}`} className="aspect-square" />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const entry = getMoodForDate(day);
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isSelected = selectedDate === dateStr;
                  const isToday = new Date().toISOString().split('T')[0] === dateStr;

                  return (
                    <button key={day} onClick={() => handleDateClick(day)}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-sm transition-all border-2 ${isSelected ? 'border-blue-600 bg-blue-50' : isToday ? 'border-blue-300' : 'border-transparent hover:bg-gray-50'}`}
                      style={{ backgroundColor: entry ? `${moodColors[entry.mood]}15` : '' }}>
                      <span className={isToday ? "font-bold text-blue-600" : ""}>{day}</span>
                      {entry && <div className="text-lg">{moodEmojis[entry.mood]}</div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weekly Mood Chart */}
            <div className="bg-white rounded-3xl shadow-md p-6">
              <h3 className="mb-6 font-semibold">Mood Level (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={getWeeklyMoodData()}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: '#f3f4f6' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 shadow-lg rounded-xl border border-gray-100">
                            <p className="font-bold">{payload[0].payload.day}</p>
                            <p className="text-sm">Mood: {payload[0].payload.mood}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="level" radius={[10, 10, 0, 0]}>
                    {getWeeklyMoodData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={moodColors[entry.mood] || '#e5e7eb'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            {/* Selected Date Details */}
            <div className="bg-white rounded-3xl shadow-md p-6 h-fit min-h-[300px]">
              {selectedDate ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-gray-500 text-sm mb-1">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                  <h3 className="text-xl font-bold mb-6">{new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h3>

                  <div className="mb-8 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-3">Mood</p>
                    {selectedEntry ? (
                      <div className="flex items-center gap-4">
                        <span className="text-5xl">{moodEmojis[selectedEntry.mood]}</span>
                        <span className="text-lg font-medium capitalize text-gray-700">{selectedEntry.mood}</span>
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">No mood recorded</p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-3">Completed Habits</p>
                    <div className="space-y-3">
                      {selectedCompletions.length === 0 ? (
                        <p className="text-gray-400 italic">No habits completed</p>
                      ) : (
                        selectedCompletions.map(c => {
                          const habit = habits.find(h => h.id === c.habitId);
                          return habit ? (
                            <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-green-50 text-green-700">
                              <span className="text-xl">{habit.icon}</span>
                              <span className="font-medium">{habit.name}</span>
                            </div>
                          ) : null;
                        })
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="text-4xl mb-4">📅</div>
                  <p className="text-gray-500">Select a date from the calendar to see details</p>
                </div>
              )}
            </div>

            {/* Monthly Progress */}
            <div className="bg-white rounded-3xl shadow-md p-6">
              <h3 className="mb-6 font-semibold">Monthly Consistency</h3>
              {getMonthlyCompletionData().length > 0 ? (
                <div className="relative flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={getMonthlyCompletionData()} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" startAngle={90} endAngle={-270}>
                        <Cell fill="#10b981" />
                        <Cell fill="#f3f4f6" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-2">
                    <span className="text-3xl font-black text-green-600">{getMonthlyCompletionData()[0]?.value || 0}%</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-4 text-center">Your habit completion rate for {monthNames[month]}</p>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-12 italic">Need more data to calculate progress</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
