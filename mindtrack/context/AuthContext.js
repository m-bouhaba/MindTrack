'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('mindtrack-current-user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Signup
  const signup = async (email, password) => {
    // Vérifier si user existe sur MockAPI
    const res = await fetch(`https://mockapi.io/api/users?email=${email}`);
    const data = await res.json();
    if (data.length > 0) {
      alert('Utilisateur déjà existant');
      return;
    }

    // Créer user sur MockAPI
    const newUser = await fetch('https://mockapi.io/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password, // ici juste pour simulation, jamais en vrai en clair
        habits: [],
        history: []
      })
    }).then(r => r.json());

    // Stocker dans localStorage
    localStorage.setItem('mindtrack-current-user', JSON.stringify(newUser));
    setUser(newUser);

    router.push('/onboarding/step1');
  };

  // Login
  const login = async (email, password) => {
    const res = await fetch(`https://mockapi.io/api/users?email=${email}`);
    const data = await res.json();
    if (data.length === 0) {
      alert('Utilisateur introuvable');
      return;
    }
    const existingUser = data[0];

    // Vérification simple du password (simulation)
    if (existingUser.password !== password) {
      alert('Mot de passe incorrect');
      return;
    }

    localStorage.setItem('mindtrack-current-user', JSON.stringify(existingUser));
    setUser(existingUser);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('mindtrack-current-user');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
