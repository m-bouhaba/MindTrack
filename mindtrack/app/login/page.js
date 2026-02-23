'use client';


import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const loggedUser = await login(email, password);

    if (loggedUser) {
      if (loggedUser.onboardingCompleted) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding/step1');
      }
    } else {
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

        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl text-white transition-colors shadow-md hover:shadow-lg mt-6 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
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
