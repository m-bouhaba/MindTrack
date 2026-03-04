'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Charger l'utilisateur depuis localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('mindtrack-current-user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  // SIGNUP
  const signup = async (email, password) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        return { error: data.error || 'Could not create account.' };
      }

      const newUser = await response.json();
      localStorage.setItem('mindtrack-current-user', JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    } catch (err) {
      console.error('Signup error:', err);
      return { error: 'Server error, please try again later.' };
    }
  };

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        return { error: data.error || 'Invalid email or password.' };
      }

      const loggedUser = await res.json();
      localStorage.setItem('mindtrack-current-user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      console.error('Login error:', err);
      return { error: 'Server error, please try again later.' };
    }
  };

  // COMPLETE ONBOARDING
  // Note: Since onboarding updates full user, we might need a general user update route.
  // For now, let's keep it simple or create a profile update route.
  const completeOnboarding = async (onboardingData) => {
    if (!user) return null;

    try {
      const res = await fetch('/api/auth/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          onboardingMood: onboardingData?.mood || null,
          selectedHabits: onboardingData?.habits || [],
        }),
      });

      if (!res.ok) throw new Error('Erreur lors de la mise à jour');

      const updatedUser = {
        ...user,
        onboardingCompleted: true,
        onboardingMood: onboardingData?.mood || null,
      };

      localStorage.setItem('mindtrack-current-user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Onboarding update error:', err);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('mindtrack-current-user');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, completeOnboarding, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
