'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Pas connecté -> direction login
        router.replace("/login");
      } else if (!user.onboardingCompleted) {
        // Connecté mais onboarding pas fini -> direction onboarding
        router.replace("/onboarding/step1");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || !user.onboardingCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Habits", href: "/dashboard/habits" },
    { name: "Insights", href: "/dashboard/insights" },
    { name: "Profile", href: "/dashboard/profile" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold mb-8 text-indigo-600">
          MindTrack
        </h2>

        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg transition ${pathname === item.href
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 pb-20 md:pb-6">
        {children}
      </main>

      {/* Mobile Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t md:hidden flex justify-around py-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm ${pathname === item.href
              ? "text-indigo-600 font-semibold"
              : "text-gray-500"
              }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

    </div>
  );
}