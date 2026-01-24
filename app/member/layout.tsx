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
import MemberMobileMenu from '@/components/navigation/MemberMobileMenu';
import { Toaster } from 'sonner';

export default async function MemberLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    return (
        <div className="min-h-screen bg-beige-50 text-[#1c1917] flex flex-col relative overflow-hidden selection:bg-accent-500 selection:text-white">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-beige-100/50 blur-[100px] rounded-full -z-10"></div>

            <Toaster position="top-right" richColors />

            {/* Refined Top Navigation */}
            <header className="h-20 bg-white/80 border-b border-beige-200 px-6 sm:px-12 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl">
                <div className="flex items-center gap-4 sm:gap-10">
                    <div className="flex items-center gap-3">
                        <MemberMobileMenu />
                        <div className="relative w-12 h-12 flex items-center justify-center">
                            <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#1c1917] hidden sm:block">
                            Task<span className="text-accent-600">Forge</span>
                        </h1>
                    </div>

                    <MemberNav />
                </div>

                <div className="flex items-center gap-5">
                    <NotificationCenter />
                    <div className="h-6 w-px bg-beige-200 mx-1"></div>
                    <div className="flex items-center gap-3 bg-beige-50 p-1.5 pr-4 rounded-xl border border-beige-100">
                        <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-accent-500/20">
                            {user?.full_name?.charAt(0) || 'M'}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-xs font-bold text-[#1c1917] leading-tight">{user?.full_name}</p>
                            <p className="text-[10px] font-bold text-[#1c1917]/40 uppercase tracking-tight mt-0.5">
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
