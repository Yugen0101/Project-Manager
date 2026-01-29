'use client';

import { usePathname } from 'next/navigation';
import {
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import AdminMobileMenu from '@/components/navigation/AdminMobileMenu';
import TaskForgeLogo from '@/components/ui/TaskForgeLogo';
import GlobalSearch from '@/components/navigation/GlobalSearch';

export default function AdminHeader({ counts }: { counts: { projectCount: number, userCount: number, taskCount: number } }) {
    const pathname = usePathname();

    // Determine the page title based on the current path
    const getPageTitle = () => {
        if (pathname.includes('/admin/dashboard')) return 'Home';
        if (pathname.includes('/admin/projects')) return 'Projects';
        if (pathname.includes('/admin/users')) return 'Team';
        if (pathname.includes('/admin/id-cards')) return 'Team ID Cards';
        if (pathname.includes('/admin/tasks')) return 'Tasks';
        if (pathname.includes('/admin/meetings')) return 'Meetings';
        if (pathname.includes('/admin/guide')) return 'Guide';
        return 'System';
    };

    const getPageSubtitle = () => {
        if (pathname.includes('/admin/dashboard')) return 'Admin Hub';
        if (pathname.includes('/admin/projects')) return 'Projects';
        if (pathname.includes('/admin/users')) return 'Team';
        if (pathname.includes('/admin/id-cards')) return 'ID Cards';
        if (pathname.includes('/admin/tasks')) return 'Tasks';
        if (pathname.includes('/admin/meetings')) return 'Meetings';
        if (pathname.includes('/admin/guide')) return 'Guide';
        return 'Control';
    };

    return (
        <header className="h-24 bg-white border-b border-[#e1d8bc] sticky top-0 z-40 flex items-center justify-between px-10 shadow-md shadow-[#d9cfb0]/10">
            <div className="flex items-center gap-10 flex-1">
                {/* Mobile Trigger & Branding fallback */}
                <div className="lg:hidden flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <TaskForgeLogo size="sm" />
                        <div className="h-6 w-px bg-[#e5dec9]"></div>
                    </div>
                    <AdminMobileMenu counts={counts} />
                </div>

                {/* Dynamic Title Section - Aligned Left for Desktop */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-8 h-0.5 bg-accent-600 rounded-full"></span>
                        <span className="text-[10px] font-bold text-accent-600 uppercase tracking-[0.4em]">{getPageTitle()}</span>
                    </div>
                    <h2 className="text-2xl font-black text-[#1c1917] tracking-tight uppercase leading-none">
                        {getPageSubtitle()}
                    </h2>
                </div>

                <div className="h-10 w-px bg-[#e5dec9] hidden xl:block mx-6"></div>

                <GlobalSearch />
            </div>

            <div className="flex items-center gap-8">
                {/* Status Indicator - Executive Finish */}
                <div className="flex items-center gap-3 px-5 py-2.5 bg-[#f7f3ed] rounded-xl border border-[#e5dec9] shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[10px] font-bold text-[#1c1917]/80 uppercase tracking-widest">Live Link</span>
                </div>

                <div className="h-10 w-px bg-[#e5dec9] hidden sm:block"></div>

                <NotificationCenter />
            </div>
        </header>
    );
}
