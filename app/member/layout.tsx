import Link from 'next/link';
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
import { Toaster } from 'sonner';

export default async function MemberLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Toaster position="top-right" richColors />
            {/* Simple Top Navigation */}
            <header className="h-16 bg-white border-b border-slate-100 px-6 sm:px-12 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-8">
                    <h1 className="text-xl font-black tracking-tighter text-slate-900 flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-black italic">P</div>
                        ProjectManager
                    </h1>

                    <nav className="hidden md:flex items-center gap-2">
                        <Link href="/member/dashboard" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-purple-600 transition-colors bg-slate-50 rounded-lg">
                            My Tasks
                        </Link>
                        <Link href="/member/activity" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-purple-600 transition-colors">
                            Recent Activity
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <NotificationCenter />
                    <div className="h-8 w-px bg-slate-100 mx-1"></div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600 border border-purple-200">
                            {user?.full_name?.charAt(0) || 'M'}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-xs font-bold text-slate-900 leading-none">{user?.full_name}</p>
                            <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mt-1">
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
            <main className="flex-1 max-w-6xl mx-auto w-full p-6 sm:p-12">
                {children}
            </main>
        </div>
    );
}
