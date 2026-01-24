'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    HomeIcon,
    FolderIcon,
    UsersIcon,
    ClipboardDocumentListIcon,
    VideoCameraIcon,
    ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
    { href: '/admin/projects', label: 'Projects', icon: FolderIcon, badge: 'projectCount' },
    { href: '/admin/users', label: 'Users', icon: UsersIcon, badge: 'userCount' },
    { href: '/admin/tasks', label: 'All Tasks', icon: ClipboardDocumentListIcon, badge: 'taskCount' },
    { href: '/admin/meetings', label: 'Meetings', icon: VideoCameraIcon },
    { href: '/admin/audit-logs', label: 'Audit Logs', icon: ClipboardDocumentCheckIcon },
];

export default function AdminNav({
    counts = { projectCount: 0, userCount: 0, taskCount: 0 }
}: {
    counts?: { projectCount: number, userCount: number, taskCount: number }
}) {
    const pathname = usePathname();

    return (
        <nav className="p-6 space-y-3">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                const badgeCount = item.badge ? counts[item.badge as keyof typeof counts] : null;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-5 py-3 rounded-lg transition-all duration-300 group font-bold ${isActive
                                ? 'bg-accent-500 text-white shadow-md'
                                : 'text-[#1c1917]/60 hover:bg-beige-100 hover:text-accent-600'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 transition-transform ${!isActive && 'group-hover:scale-110'}`} />
                            <span className="text-[11px] uppercase tracking-widest">{item.label}</span>
                            {badgeCount !== null && (
                                <span className={`ml-auto badge ${isActive
                                        ? 'bg-white/20 text-white border-none'
                                        : 'badge-info bg-beige-100 text-[#1c1917]/60 border-beige-200'
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
