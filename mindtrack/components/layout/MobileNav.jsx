'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Target, Clock, Brain, User } from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Habits', href: '/dashboard/habits', icon: Target },
    { name: 'History', href: '/dashboard/history', icon: Clock },
    { name: 'Insights', href: '/dashboard/insights', icon: Brain },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function MobileNav() {
    const pathname = usePathname();

    const isActive = (href) =>
        href === '/dashboard' ? pathname === href : pathname.startsWith(href);

    return (
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
                                    ? 'text-blue-600'
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : ''}`} />
                            <span className={`text-[11px] font-medium ${active ? 'text-blue-600' : ''}`}>
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
    );
}
