'use client';


import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');

    // Client-side validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else if (result) {
      if (result.onboardingCompleted) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding/step1');
      }
    } else {
      setError('An unexpected error occurred.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <Brain className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <h2 className="text-center mb-2">Welcome back</h2>
        <p className="text-center text-gray-600 mb-8">Log in to continue your journey</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${error && !email.trim() ? 'border-red-400' : 'border-gray-300'}`}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${error && !password.trim() ? 'border-red-400' : 'border-gray-300'}`}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl text-white transition-colors shadow-md hover:shadow-lg mt-6 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isSubmitting ? 'Connexion...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <button onClick={() => router.push('/signup')} className="text-blue-600 hover:underline">Sign up</button>
        </p>
      </motion.div>
    </div>
  );
}
