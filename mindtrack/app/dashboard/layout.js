'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Brain, Home, Target, Clock, User } from "lucide-react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (!user.onboardingCompleted) {
        router.replace("/onboarding/step1");
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

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Habits", href: "/dashboard/habits", icon: Target },
    { name: "History", href: "/dashboard/history", icon: Clock },
    { name: "Insights", href: "/dashboard/insights", icon: Brain },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  const isActive = (href) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">

        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="bg-blue-50 p-2 rounded-xl">
            <Brain className="w-7 h-7 text-blue-600" />
          </div>
          <span className="text-xl font-bold text-blue-600 tracking-tight">
            MindTrack
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-blue-600" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">© 2026 MindTrack</p>
        </div>
      </aside>

      {/* ── Main Content (scrollable) ── */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-6">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* ── Mobile Bottom Navbar ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-lg rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)] border-t border-gray-100">
        <div className="flex justify-around items-center px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-200
                  ${active
                    ? "text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-blue-600" : ""}`} />
                <span className={`text-[11px] font-medium ${active ? "text-blue-600" : ""}`}>
                  {item.name}
                </span>
                {active && (
                  <span className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
}