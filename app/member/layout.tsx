import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import {
    HomeIcon,
    ListBulletIcon,
    ClockIcon,
    ChatBubbleLeftRightIcon,
    ArrowRightOnRectangleIcon,
    BellIcon
} from '@heroicons/react/24/outline';
import SignOutButton from '@/components/auth/SignOutButton';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import MemberNav from '@/components/member/MemberNav';
import { Toaster } from 'sonner';

export default async function MemberLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    return (
        <div className="min-h-screen bg-[#fdfcf9] text-[#1c1917] flex flex-col">
            <Toaster position="top-right" richColors />
            {/* Simple Top Navigation */}
            <header className="h-20 bg-white/80 border-b border-[#e5dec9] px-6 sm:px-12 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4">
                        <div className="relative w-24 h-24">
                            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-[#1c1917]">
                            TaskForge
                        </h1>
                    </div>

                    <MemberNav />

                </div>

                <div className="flex items-center gap-4">
                    <NotificationCenter />
                    <div className="h-8 w-px bg-[#e5dec9] mx-1"></div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#f7f3ed] flex items-center justify-center text-xs font-black text-[#d97757] border border-[#e5dec9]">
                            {user?.full_name?.charAt(0) || 'M'}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-xs font-black text-[#1c1917] leading-none">{user?.full_name}</p>
                            <p className="text-[9px] font-black text-[#d97757] uppercase tracking-widest mt-1">
                                {user?.role === 'admin' ? 'Administrator' :
                                    user?.role === 'associate' ? 'Project Lead' :
                                        user?.role === 'guest' ? 'Guest View' : 'Contributor'}
                            </p>
                        </div>
                    </div>
                    <SignOutButton />
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-8 sm:p-12">
                {children}
            </main>
        </div>
    );
}
