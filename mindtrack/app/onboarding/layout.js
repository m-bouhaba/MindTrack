"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingLayout({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Si l'utilisateur a déjà fini l'onboarding, on l'envoie direct au dashboard
    if (!loading && user?.onboardingCompleted) {
      router.replace("/dashboard");
    }
    // Si pas connecté et pas en train de charger, on pourrait rediriger vers /signup
    // mais on laisse les pages individuelles ou un middleware gérer ça si besoin.
    // Pour l'onboarding, on attend surtout que le user soit chargé.
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  // Si onboarding déjà fini, on ne rend rien (le useEffect va rediriger)
  if (user?.onboardingCompleted) return null;

  return <>{children}</>;
}
