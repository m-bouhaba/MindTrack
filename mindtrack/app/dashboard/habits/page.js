'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function HabitsPage() {
  const { user, setUser } = useAuth();

  const habits = user?.habits || [];

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '✨',
  });

  const habitIcons = ['✨', '💤', '🏃‍♀️', '🧘', '💧', '📚', '🥗', '🎯', '💪', '🌅', '🧠', '❤️'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return;

    if (editingHabit) {
      const updatedHabits = habits.map((habit) =>
        habit.id === editingHabit.id
          ? { ...habit, ...formData }
          : habit
      );

      setUser({ ...user, habits: updatedHabits });
      setEditingHabit(null);
    } else {
      const newHabit = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        frequency: 'Daily',
        enabled: true,
      };

      setUser({
        ...user,
        habits: [...habits, newHabit],
      });
    }

    setFormData({ name: '', description: '', icon: '✨' });
    setShowAddForm(false);
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

  const handleDelete = (id) => {
    if (!user) return;

    if (confirm('Are you sure you want to delete this habit?')) {
      const filteredHabits = habits.filter((habit) => habit.id !== id);
      setUser({ ...user, habits: filteredHabits });
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingHabit(null);
    setFormData({ name: '', description: '', icon: '✨' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
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

        {/* Add / Edit Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-3xl shadow-md p-6 mb-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {editingHabit ? 'Edit Habit' : 'Add New Habit'}
                </h2>
                <button onClick={handleCancel}>
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Habit Name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                />

                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Description"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                />

                <div>
                  <p className="text-sm mb-2 text-gray-700">Choose an icon</p>
                  <div className="grid grid-cols-6 gap-3">
                    {habitIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, icon })
                        }
                        className={`p-4 rounded-xl border-2 text-2xl transition-all ${
                          formData.icon === icon
                            ? 'border-blue-600 bg-blue-50 scale-110'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
                  >
                    {editingHabit ? 'Update Habit' : 'Add Habit'}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Habits List */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-6">
            Your Habits ({habits.length})
          </h2>

          {habits.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-4">🎯</div>
              <p>No habits yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {habits.map((habit, index) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all"
                >
                  <span className="text-3xl">{habit.icon}</span>

                  <div className="flex-1">
                    <div className="font-medium">{habit.name}</div>
                    <div className="text-sm text-gray-600">
                      {habit.description}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(habit)}>
                      <Edit2 className="w-5 h-5 text-blue-600" />
                    </button>
                    <button onClick={() => handleDelete(habit.id)}>
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}