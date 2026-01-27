'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const isCompleted = useSelector(
    (state) => state.onboarding.isCompleted
  );

  useEffect(() => {
    if (!isCompleted) {
      router.replace('/onboarding/step1');
    }
  }, [isCompleted, router]);

  if (!isCompleted) return null; // évite le flash

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {/* ton contenu */}
    </div>
  );
}
