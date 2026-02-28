'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Plus } from 'lucide-react';
import { getHabits, createHabit, updateHabit, deleteHabit } from '@/lib/api';
import HabitForm from '@/components/habits/HabitForm';
import HabitManager from '@/components/habits/HabitManager';

export default function HabitsPage() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '✨',
  });

  useEffect(() => {
    if (user?.id) fetchHabitsData();
  }, [user]);

  const fetchHabitsData = async () => {
    try {
      const data = await getHabits(user.id);
      setHabits(data);
    } catch (error) {
      console.error('Failed to fetch habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingHabit) {
        const res = await updateHabit(editingHabit.id, user.id, formData);
        if (res.ok) fetchHabitsData();
      } else {
        const res = await createHabit(user.id, formData);
        if (res.ok) fetchHabitsData();
      }
      handleCancel();
    } catch (error) {
      console.error('Error saving habit:', error);
    }
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name,
      description: habit.description,
      icon: habit.icon,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!user) return;
    if (confirm('Are you sure you want to delete this habit?')) {
      try {
        const res = await deleteHabit(id, user.id);
        if (res.ok) fetchHabitsData();
      } catch (error) {
        console.error('Error deleting habit:', error);
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingHabit(null);
    setFormData({ name: '', description: '', icon: '✨' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Manage Habits</h1>
            <p className="text-gray-600">
              Create, edit, and organize your daily habits
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Habit
          </button>
        </div>

        <HabitForm
          show={showAddForm}
          editing={editingHabit}
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />

        <HabitManager
          habits={habits}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </motion.div>
    </div>
  );
}