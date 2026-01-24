'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    HomeIcon,
    FolderIcon,
    ListBulletIcon,
    CalendarIcon,
    ChartBarIcon,
    VideoCameraIcon
} from '@heroicons/react/24/outline';

const navItems = [
    { href: '/associate/dashboard', label: 'Dashboard', icon: HomeIcon },
    { href: '/associate/projects', label: 'My Projects', icon: FolderIcon },
    { href: '/associate/tasks', label: 'Managed Tasks', icon: ListBulletIcon },
    { href: '/associate/sprints', label: 'Sprints', icon: CalendarIcon },
    { href: '/associate/reports', label: 'Analytics', icon: ChartBarIcon },
    { href: '/associate/meetings', label: 'Meetings', icon: VideoCameraIcon },
];

export default function AssociateNav() {
    const pathname = usePathname();

    return (
        <nav className="flex-1 px-6 py-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isActive
                            ? 'bg-accent-500 text-white shadow-md'
                            : 'text-[#1c1917]/60 hover:text-accent-600 hover:bg-beige-100'
                            }`}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="uppercase tracking-wide">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
