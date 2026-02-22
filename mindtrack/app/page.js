'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, Target, Smile, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Habit Tracking',
      description: 'Build and maintain healthy habits with simple daily check-ins',
    },
    {
      icon: <Smile className="w-8 h-8" />,
      title: 'Mood Tracking',
      description: 'Understand your emotions and discover patterns in your well-being',
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI-Powered Insights',
      description: 'Get personalized recommendations based on your unique patterns',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">

      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-20 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <Brain className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <h1 className="mb-6 max-w-3xl mx-auto text-4xl md:text-5xl font-bold">
          Build better habits. <br /> Understand your emotions.
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Track your habits, moods, and receive smart insights to improve your
          well-being—one day at a time.
        </p>

        <button
          onClick={() => router.push('/signup')}
          className="bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition-colors text-lg shadow-lg hover:shadow-xl"
        >
          Get Started
        </button>

        <p className="mt-6 text-gray-500">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:underline"
          >
            Log in
          </button>
        </p>
      </motion.div>

      {/* FEATURES */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="mb-3 text-xl font-semibold">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* PREVIEW */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
              <h4 className="mb-4 font-semibold text-blue-900">
                Today’s Habits
              </h4>
              <div className="space-y-3">
                {['Morning meditation', 'Drink water', 'Exercise'].map(
                  (habit, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-white p-3 rounded-xl"
                    >
                      <div className="w-5 h-5 rounded border-2 border-blue-400" />
                      <span className="text-gray-700">{habit}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl">
              <h4 className="mb-4 font-semibold text-green-900">
                How do you feel?
              </h4>
              <div className="flex justify-around">
                {['😃', '😐', '😤', '😔'].map((emoji, i) => (
                  <div
                    key={i}
                    className="text-4xl cursor-pointer hover:scale-110 transition-transform"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          © 2026 MindTrack. Built with care for your well-being.
        </div>
      </footer>

    </div>
  );
}
