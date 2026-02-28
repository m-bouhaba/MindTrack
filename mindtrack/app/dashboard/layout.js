'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Brain } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (!user.onboardingCompleted) {
        router.replace('/onboarding/step1');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || !user.onboardingCompleted) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Brain className="w-10 h-10 text-blue-600 animate-pulse" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-24 md:pb-6">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}