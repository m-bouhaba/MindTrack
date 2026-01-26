'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setGoals } from '@/redux/onboardingSlice';

export default function OnboardingGoals() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedGoals, setSelectedGoals] = useState({
    reduceStress: false,
    improveSleep: false,
    beProductive: false,
    improveHealth: false,
    buildHabit: false,
  });

  const goals = [
    { id: 'reduceStress', label: 'Reduce stress', emoji: '😌' },
    { id: 'improveSleep', label: 'Improve sleep', emoji: '💤' },
    { id: 'beProductive', label: 'Be more productive', emoji: '⚡' },
    { id: 'improveHealth', label: 'Improve health / weight', emoji: '🏃‍♀️' },
    { id: 'buildHabit', label: 'Build a new habit', emoji: '🎯' },
  ];

  const handleToggle = (id) => {
    setSelectedGoals(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNext = () => {
    dispatch(setGoals(selectedGoals));
    router.push('/onboarding/step2');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl"
      >
        {/* Progress Bars */}
        <div className="mb-8">
          <div className="flex justify-center gap-2 mb-6">
            <div className="w-12 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-12 h-2 bg-gray-200 rounded-full"></div>
            <div className="w-12 h-2 bg-gray-200 rounded-full"></div>
          </div>
          <h2 className="text-center mb-2">What do you want to improve?</h2>
          <p className="text-center text-gray-600">Select all that apply</p>
        </div>

        {/* Goals Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {goals.map((goal, index) => (
            <motion.button
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => handleToggle(goal.id)}
              className={`p-6 rounded-2xl border-2 transition-all text-left ${
                selectedGoals[goal.id]
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{goal.emoji}</span>
                <span className="text-lg">{goal.label}</span>
              </div>
            </motion.button>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          Next
        </button>
      </motion.div>
    </div>
  );
}
