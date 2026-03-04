'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Plus } from 'lucide-react';
import { getHabits, createHabit, updateHabit, deleteHabit } from '@/lib/api';
import HabitForm from '@/components/habits/HabitForm';
import HabitManager from '@/components/habits/HabitManager';
import Toast from '@/components/ui/Toast';

export default function HabitsPage() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [formError, setFormError] = useState('');

  // Toast state
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '✨',
  });

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    if (user?.id) fetchHabitsData();
  }, [user]);

  const fetchHabitsData = async () => {
    try {
      const data = await getHabits(user.id);
      setHabits(data);
    } catch (error) {
      console.error('Failed to fetch habits:', error);
      showToast('Internal Error: Could not load habits.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setFormError('');

    // Client-side validation
    if (!formData.name.trim()) {
      setFormError('Habit name is required.');
      return;
    }

    try {
      if (editingHabit) {
        const res = await updateHabit(editingHabit.id, user.id, formData);
        if (res.ok) {
          fetchHabitsData();
          showToast('Habit updated successfully!', 'success');
        } else {
          setFormError('Could not update habit. Please try again.');
          return;
        }
      } else {
        const res = await createHabit(user.id, formData);
        if (res.ok) {
          fetchHabitsData();
          showToast('Habit created successfully!', 'success');
        } else {
          setFormError('Could not create habit. Please try again.');
          return;
        }
      }
      handleCancel();
    } catch (error) {
      console.error('Error saving habit:', error);
      setFormError('Server error. Please try again later.');
    }
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name,
      description: habit.description,
      icon: habit.icon,
    });
    setFormError('');
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!user) return;

    // Note: The HabitManager component now handles the confirmation modal,
    // so when this is called, the user has already confirmed.
    try {
      const res = await deleteHabit(id, user.id);
      if (res.ok) {
        fetchHabitsData();
        showToast('Habit deleted successfully', 'success');
      } else {
        showToast('Failed to delete habit. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      showToast('Something went wrong. Please try again.', 'error');
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingHabit(null);
    setFormData({ name: '', description: '', icon: '✨' });
    setFormError('');
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

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
            onClick={() => { setShowAddForm(true); setFormError(''); }}
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
          onChange={(data) => { setFormData(data); setFormError(''); }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          error={formError}
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