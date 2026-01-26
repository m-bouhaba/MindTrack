'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setLifestyle } from '@/redux/onboardingSlice';

export default function OnboardingLifestyle() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [answers, setAnswers] = useState({
    sleepHours: '',
    exercise: '',
    stress: '',
    water: '',
  });

  const questions = [
    {
      id: 'sleepHours',
      question: 'How many hours do you sleep per night?',
      options: ['Less than 5', '5-6 hours', '7-8 hours', 'More than 8'],
    },
    {
      id: 'exercise',
      question: 'Do you exercise regularly?',
      options: ['Never', 'Sometimes', 'Often', 'Daily'],
    },
    {
      id: 'stress',
      question: 'Do you often feel stressed?',
      options: ['Rarely', 'Sometimes', 'Often', 'Very often'],
    },
    {
      id: 'water',
      question: 'Do you drink enough water daily?',
      options: ['No', 'Sometimes', 'Usually', 'Always'],
    },
  ];

  const handleSelect = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (Object.values(answers).every(a => a !== '')) {
      dispatch(setLifestyle(answers));
      router.push('/onboarding/step3');
    } else {
      alert('Please answer all questions');
    }
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
            <div className="w-12 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-12 h-2 bg-gray-200 rounded-full"></div>
          </div>
          <h2 className="text-center mb-2">Tell us about your lifestyle</h2>
          <p className="text-center text-gray-600">This helps us personalize your experience</p>
        </div>

        {/* Questions */}
        <div className="space-y-8 mb-8">
          {questions.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <h3 className="mb-4 text-lg">{q.question}</h3>
              <div className="grid grid-cols-2 gap-3">
                {q.options.map(option => (
                  <button
                    key={option}
                    onClick={() => handleSelect(q.id, option)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      answers[q.id] === option
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/onboarding/step1')}
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
