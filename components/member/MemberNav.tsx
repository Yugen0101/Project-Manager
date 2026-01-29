'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ClipboardDocumentListIcon,
    FolderIcon,
    ClockIcon,
    VideoCameraIcon,
    BookOpenIcon,
    IdentificationIcon
} from '@heroicons/react/24/outline';

export default function MemberNav() {
    const pathname = usePathname();

    const links = [
        { name: 'Tasks', href: '/member/tasks', icon: ClipboardDocumentListIcon },
        { name: 'Projects', href: '/member/projects', icon: FolderIcon },
        { name: 'ID Card', href: '/member/id-card', icon: IdentificationIcon },
        { name: 'Activity', href: '/member/activity', icon: ClockIcon },
        { name: 'Meetings', href: '/member/meetings', icon: VideoCameraIcon },
        { name: 'User Guide', href: '/member/guide', icon: BookOpenIcon },
    ];

    return (
        <nav className="flex-1 px-6 py-6 space-y-3 overflow-y-auto">
            {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all ${isActive
                            ? 'bg-accent-500 text-white shadow-xl shadow-accent-500/20'
                            : 'text-[#1c1917]/70 hover:text-accent-500 hover:bg-[#f7f3ed]'
                            }`}
                    >
                        <Icon className={`w-5 h-5 transition-transform ${!isActive && 'hover:scale-110'}`} />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">{link.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
