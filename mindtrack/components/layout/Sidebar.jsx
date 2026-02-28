'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Home, Target, Clock, User } from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Habits', href: '/dashboard/habits', icon: Target },
    { name: 'History', href: '/dashboard/history', icon: Clock },
    { name: 'Insights', href: '/dashboard/insights', icon: Brain },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (href) =>
        href === '/dashboard' ? pathname === href : pathname.startsWith(href);

    return (
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
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
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
    );
}
