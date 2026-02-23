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
  // S'inscrire : vérifie l'existence, crée l'user et initialise les données
  const signup = async (email, password) => {
    try {
      // 1. On cherche si l'email existe. 
      // Note: On utilise encodeURIComponent pour gérer les caractères spéciaux dans l'URL.
      const res = await fetch(`https://6995e64fb081bc23e9c4ce17.mockapi.io/users?email=${encodeURIComponent(email)}`);
      const data = await res.json();

      // 2. MockAPI fait parfois des recherches partielles. On vérifie l'existence EXACTE.
      // Si MockAPI retourne une erreur (pas un tableau), on le traite comme non trouvé.
      const existingUsers = Array.isArray(data) ? data : [];
      const userExists = existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (userExists) {
        alert('Un compte avec cet email existe déjà.');
        return null;
      }

      // 3. Création du compte avec les données par défaut
      const response = await fetch('https://6995e64fb081bc23e9c4ce17.mockapi.io/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password,
          habits: [],
          history: [],
          onboardingCompleted: false,
          onboardingMood: null,
          createdAt: new Date().toISOString()
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la création');

      const newUser = await response.json();

      // 4. On sauve en local et dans le state
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
  // Connexion : récupère l'user par email et vérifie le mot de passe
  const login = async (email, password) => {
    try {
      const res = await fetch(`https://6995e64fb081bc23e9c4ce17.mockapi.io/users?email=${encodeURIComponent(email)}`);
      const data = await res.json();

      const users = Array.isArray(data) ? data : [];
      const loggedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!loggedUser) {
        alert('Utilisateur introuvable.');
        return null;
      }

      if (loggedUser.password !== password) {
        alert('Mot de passe incorrect.');
        return null;
      }

      // Succès : on sauve et on met à jour le state
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
  // Finalise l'onboarding et met à jour l'utilisateur sur le serveur
  const completeOnboarding = async (onboardingData) => {
    if (!user) {
      console.error('No user found in state during completeOnboarding');
      return null;
    }

    try {
      const res = await fetch(`https://6995e64fb081bc23e9c4ce17.mockapi.io/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...user,
          habits: onboardingData?.habits || [],
          onboardingMood: onboardingData?.mood || null,
          onboardingCompleted: true,
          updatedAt: new Date().toISOString()
        }),
      });

      if (!res.ok) throw new Error('Erreur lors de la mise à jour');

      const updatedUser = await res.json();

      // On met à jour partout pour que les guards (layouts) voient le changement
      localStorage.setItem('mindtrack-current-user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Onboarding update error:', err);
      alert('Erreur lors de la sauvegarde de votre profil.');
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
