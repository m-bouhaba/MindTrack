'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setMood } from '@/redux/onboardingSlice';

export default function OnboardingMood() {
  const router = useRouter();
  const dispatch = useDispatch();
  const moodFromRedux = useSelector(state => state.onboarding.mood);

  const [selectedMood, setSelectedMood] = useState(moodFromRedux || '');

  const moods = [
    { id: 'veryHappy', label: 'Very Happy', emoji: '😄' },
    { id: 'happy', label: 'Happy', emoji: '🙂' },
    { id: 'neutral', label: 'Neutral', emoji: '😐' },
    { id: 'sad', label: 'Sad', emoji: '😔' },
    { id: 'stressed', label: 'Stressed', emoji: '😣' },
    { id: 'angry', label: 'Angry', emoji: '😡' },
  ];

  const handleSelect = (id) => {
    setSelectedMood(id);
  };

  const handleNext = () => {
    if (!selectedMood) {
      alert('Please select your current mood');
      return;
    }
    dispatch(setMood(selectedMood));
    router.push('/onboarding/step5'); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl"
      >
        <div className="mb-8">
          <div className="flex justify-center gap-2 mb-6">
            <div className="w-12 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-12 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-12 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-12 h-2 bg-gray-200 rounded-full"></div>
          </div>
          <h2 className="text-center mb-2">How are you feeling today?</h2>
          <p className="text-center text-gray-600">Select the mood that best matches your current state</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {moods.map((mood, index) => (
            <motion.button
              key={mood.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => handleSelect(mood.id)}
              className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                selectedMood === mood.id
                  ? 'border-blue-600 scale-105 shadow-lg'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className="text-4xl">{mood.emoji}</span>
              <span className="mt-2 font-medium">{mood.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => router.push('/onboarding/step3')}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Next
          </button>
        </div>
      </motion.div>
    </div>
  );
}
