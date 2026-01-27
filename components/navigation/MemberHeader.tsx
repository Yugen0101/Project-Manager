'use client';

import { usePathname } from 'next/navigation';
import {
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    Bars3Icon
} from '@heroicons/react/24/outline';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import MemberMobileMenu from '@/components/navigation/MemberMobileMenu';

export default function MemberHeader() {
    const pathname = usePathname();

    // Determine the page title based on the current path
    const getPageTitle = () => {
        if (pathname.includes('/member/tasks')) return 'Operational Matrix';
        if (pathname.includes('/member/projects')) return 'Project Nodes';
        if (pathname.includes('/member/id-card')) return 'Unit Identification';
        if (pathname.includes('/member/activity')) return 'Activity Protocol';
        if (pathname.includes('/member/meetings')) return 'Synchronized Syncs';
        if (pathname.includes('/member/guide')) return 'Operational Manual';
        return 'Team Node';
    };

    const getPageSubtitle = () => {
        if (pathname.includes('/member/tasks')) return 'Workspace';
        if (pathname.includes('/member/projects')) return 'Deployment Registry';
        if (pathname.includes('/member/id-card')) return 'Security Clearance';
        if (pathname.includes('/member/activity')) return 'System Logs';
        if (pathname.includes('/member/meetings')) return 'Communications';
        if (pathname.includes('/member/guide')) return 'Documentation';
        return 'Dashboard';
    };

    return (
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-[#e5dec9] sticky top-0 z-40 flex items-center justify-between px-10 shadow-sm shadow-[#d9cfb0]/5">
            <div className="flex items-center gap-10 flex-1">
                {/* Mobile Menu Trigger */}
                <div className="lg:hidden">
                    <MemberMobileMenu />
                </div>

                {/* Dynamic Title Section */}
                <div className="hidden sm:flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-6 h-0.5 bg-accent-500 rounded-full"></span>
                        <span className="text-[9px] font-bold text-accent-500 uppercase tracking-[0.3em]">{getPageTitle()}</span>
                    </div>
                    <h2 className="text-xl font-bold text-[#1c1917] tracking-tight uppercase leading-none">
                        {getPageSubtitle()}
                    </h2>
                </div>

                <div className="h-10 w-px bg-[#e5dec9] hidden md:block mx-2"></div>

                {/* Global Search Bar */}
                <div className="flex-1 max-w-md hidden md:block">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1c1917]/20 group-focus-within:text-accent-500 transition-colors">
                            <MagnifyingGlassIcon className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Interrogate data matrix..."
                            className="w-full bg-[#f7f3ed]/50 border-none rounded-xl py-2.5 pl-11 pr-4 text-xs font-medium focus:ring-2 focus:ring-accent-500/20 focus:bg-white transition-all outline-none placeholder:text-[#1c1917]/20 text-[#1c1917]"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button className="p-1.5 text-[#1c1917]/20 hover:text-accent-500 transition-colors">
                                <AdjustmentsHorizontalIcon className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Status Indicator */}
                <div className="hidden lg:flex items-center gap-2.5 px-4 py-2 bg-[#f7f3ed]/50 rounded-lg border border-[#e5dec9]/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[9px] font-bold text-[#1c1917]/40 uppercase tracking-widest">Live Link</span>
                </div>

                <div className="h-8 w-px bg-[#e5dec9]"></div>

                <NotificationCenter />
            </div>
        </header>
    );
}
