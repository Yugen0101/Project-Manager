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
                        className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg border ${isActive
                                ? 'text-[#d97757] bg-[#f7f3ed] border-[#e5dec9]'
                                : 'text-[#1c1917]/50 hover:text-[#d97757] border-transparent'
                            }`}
                    >
                        {link.name}
                    </Link>
                );
            })}
        </nav>
    );
}
