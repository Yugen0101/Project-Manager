'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    HomeIcon,
    FolderIcon,
    UsersIcon,
    ClipboardDocumentListIcon,
    VideoCameraIcon,
    ClipboardDocumentCheckIcon,
    BookOpenIcon,
    IdentificationIcon
} from '@heroicons/react/24/outline';

const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
    { href: '/admin/projects', label: 'Projects', icon: FolderIcon, badge: 'projectCount' },
    { href: '/admin/users', label: 'Team', icon: UsersIcon, badge: 'userCount' },
    { href: '/admin/id-cards', label: 'Team ID Cards', icon: IdentificationIcon },
    { href: '/admin/tasks', label: 'Tasks', icon: ClipboardDocumentListIcon, badge: 'taskCount' },
    { href: '/admin/meetings', label: 'Meetings', icon: VideoCameraIcon },

    { href: '/admin/guide', label: 'User Guide', icon: BookOpenIcon },
];

export default function AdminNav({
    counts = { projectCount: 0, userCount: 0, taskCount: 0 }
}: {
    counts?: { projectCount: number, userCount: number, taskCount: number }
}) {
    const pathname = usePathname();

    return (
        <nav className="p-6 space-y-1">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                const badgeCount = item.badge ? counts[item.badge as keyof typeof counts] : null;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-5 py-3 rounded-xl transition-all duration-300 group ${isActive
                            ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/30'
                            : 'text-[#1c1917]/70 hover:bg-[#f7f3ed] hover:text-accent-600'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <Icon className={`w-5 h-5 transition-all duration-300 ${!isActive && 'group-hover:scale-110'}`} />
                            <span className="text-[10px] uppercase font-semibold tracking-[0.15em] transition-all">{item.label}</span>
                            {badgeCount !== null && (
                                <span className={`ml-auto text-[9px] px-2 py-0.5 rounded-full font-medium ${isActive
                                    ? 'bg-white/20 text-white'
                                    : 'bg-[#f7f3ed] text-[#1c1917]/60 border border-[#e5dec9]'
                                    }`}>
                                    {badgeCount || 0}
                                </span>
                            )}
                        </div>
                    </Link>
                );
            })}
        </nav>
    );
}
