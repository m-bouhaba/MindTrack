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
        const error = await response.json();
        alert(error.error || 'Erreur lors de la création');
        return null;
      }

      const newUser = await response.json();
      localStorage.setItem('mindtrack-current-user', JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    } catch (err) {
      console.error('Signup error:', err);
      alert('Impossible de créer le compte. Veuillez réessayer.');
      return null;
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
        const error = await res.json();
        alert(error.error || 'Identifiants incorrects');
        return null;
      }

      const loggedUser = await res.json();
      localStorage.setItem('mindtrack-current-user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      console.error('Login error:', err);
      alert('Erreur de connexion. Vérifiez votre réseau.');
      return null;
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
