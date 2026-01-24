'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MemberNav() {
    const pathname = usePathname();

    const links = [
        { name: 'Workspace', href: '/member/tasks' },
        { name: 'Projects', href: '/member/projects' },
        { name: 'Activity', href: '/member/activity' },
        { name: 'Meetings', href: '/member/meetings' },
    ];

    return (
        <nav className="hidden md:flex items-center gap-2">
            {links.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`px-4 py-2 text-xs font-bold transition-all rounded-xl border ${isActive
                            ? 'bg-accent-500 text-white shadow-md border-transparent'
                            : 'text-[#1c1917]/60 hover:text-accent-600 hover:bg-beige-100 border-transparent'
                            }`}
                    >
                        {link.name}
                    </Link>
                );
            })}
        </nav>
    );
}
