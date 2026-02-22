'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('mindtrack-current-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // =========================
  // SIGNUP
  // =========================
  const signup = async (email, password) => {
    const res = await fetch(
      `https://6995e64fb081bc23e9c4ce17.mockapi.io/users?email=${email}`
    );
    const data = await res.json();

    if (data.length > 0) {
      alert('Utilisateur déjà existant');
      return;
    }

    const newUser = await fetch(
      'https://6995e64fb081bc23e9c4ce17.mockapi.io/users',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          habits: [],
          history: [],
          onboardingCompleted: false, // 👈 IMPORTANT
        }),
      }
    ).then((r) => r.json());

    localStorage.setItem('mindtrack-current-user', JSON.stringify(newUser));
    setUser(newUser);

    router.push('/onboarding/step1');
  };

  // =========================
  // LOGIN
  // =========================
  const login = async (email, password) => {
    const res = await fetch(
      `https://6995e64fb081bc23e9c4ce17.mockapi.io/users?email=${email}`
    );
    const data = await res.json();

    if (data.length === 0) {
      alert('Utilisateur introuvable');
      return;
    }

    const existingUser = data[0];

    if (existingUser.password !== password) {
      alert('Mot de passe incorrect');
      return;
    }

    localStorage.setItem(
      'mindtrack-current-user',
      JSON.stringify(existingUser)
    );

    setUser(existingUser);

    // 👇 REDIRECTION INTELLIGENTE
    if (existingUser.onboardingCompleted) {
      router.push('/dashboard');
    } else {
      router.push('/onboarding/step1');
    }
  };


  // =========================
// COMPLETE ONBOARDING
// =========================
const completeOnboarding = async () => {
  if (!user) return;

  // Update MockAPI
  const updatedUser = await fetch(
    `https://6995e64fb081bc23e9c4ce17.mockapi.io/users/${user.id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        onboardingCompleted: true,
      }),
    }
  ).then((r) => r.json());

  // Update localStorage
  localStorage.setItem(
    'mindtrack-current-user',
    JSON.stringify(updatedUser)
  );

  setUser(updatedUser);

  // Redirect to dashboard
  router.push('/dashboard');
};

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem('mindtrack-current-user');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, completeOnboarding}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);