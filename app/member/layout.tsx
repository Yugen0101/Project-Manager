import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import {
    BellIcon,
} from '@heroicons/react/24/outline';
import SignOutButton from '@/components/auth/SignOutButton';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import MemberNav from '@/components/member/MemberNav';
import MemberMobileMenu from '@/components/navigation/MemberMobileMenu';
import TaskForgeLogo from '@/components/ui/TaskForgeLogo';
import { Toaster } from 'sonner';
import MemberHeader from '@/components/navigation/MemberHeader';

export default async function MemberLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    return (
        <div className="min-h-screen bg-[#fdfcf9] text-[#1c1917] flex">
            <Toaster position="top-right" richColors />

            {/* Sidebar */}
            <aside className="w-72 bg-white/50 backdrop-blur-md border-r border-[#e5dec9] hidden lg:flex flex-col fixed inset-y-0 z-50">
                <div className="p-10 pb-4">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <TaskForgeLogo size="lg" />
                        <div>
                            <h1 className="text-xl font-bold tracking-tight uppercase leading-none">
                                Task<span className="text-accent-500">Forge</span>
                            </h1>
                            <span className="block text-[10px] text-accent-500 uppercase tracking-[0.35em] font-bold mt-2">Team Portal</span>
                        </div>
                    </div>
                </div>

                <MemberNav />

                <div className="p-6 mt-auto border-t border-[#e5dec9]">
                    <div className="flex items-center gap-3 px-4 py-4 bg-[#f7f3ed] rounded-[1.25rem] border border-[#e5dec9] shadow-sm mb-4 group hover:border-accent-200 transition-all">
                        <div className="w-9 h-9 rounded-xl bg-accent-500 text-white flex items-center justify-center font-semibold text-xs shadow-lg shadow-accent-500/20 group-hover:scale-105 transition-transform">
                            {user?.full_name?.charAt(0) || 'M'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-semibold text-[#1c1917] truncate uppercase tracking-tight">{user?.full_name}</p>
                            <p className="text-[8px] font-semibold text-accent-500 uppercase tracking-[0.2em] truncate">Active Member</p>
                        </div>
                    </div>
                    <div className="px-4">
                        <SignOutButton />
                    </div>
                </div>
            </aside>

            {/* Design accents */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#e5dec9]/30 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-[#fbd3c4]/20 blur-[100px] rounded-full"></div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
                <MemberHeader />

                <main className="p-8 lg:p-12 relative z-10 max-w-[1400px] w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
