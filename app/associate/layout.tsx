import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import {
    HomeIcon,
    FolderIcon,
    ListBulletIcon,
    CalendarIcon,
    ChartBarIcon,
    ArrowRightOnRectangleIcon,
    BellIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';
import SignOutButton from '@/components/auth/SignOutButton';

export default async function AssociateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    return (
        <div className="min-h-screen bg-[#fdfcf9] text-[#1c1917] flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-[#e5dec9] hidden lg:flex flex-col fixed inset-y-0 z-50">
                <div className="p-8">
                    <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8">
                            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <h1 className="text-xl font-black tracking-tighter text-[#1c1917]">
                            TaskForge
                            <span className="block text-[9px] text-[#d97757] uppercase tracking-[0.2em]">Project Lead</span>
                        </h1>
                    </div>
                </div>

                <nav className="flex-1 px-6 py-4 space-y-2 overflow-y-auto">
                    <Link href="/associate/dashboard" className="flex items-center gap-3 px-4 py-3 text-[#1c1917]/60 hover:text-[#d97757] hover:bg-[#f7f3ed] rounded-xl transition-all">
                        <HomeIcon className="w-5 h-5" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Dashboard</span>
                    </Link>
                    <Link href="/associate/projects" className="flex items-center gap-3 px-4 py-3 text-[#1c1917]/60 hover:text-[#d97757] hover:bg-[#f7f3ed] rounded-xl transition-all">
                        <FolderIcon className="w-5 h-5" />
                        <span className="text-[11px] font-black uppercase tracking-widest">My Projects</span>
                    </Link>
                    <Link href="/associate/tasks" className="flex items-center gap-3 px-4 py-3 text-[#1c1917]/60 hover:text-[#d97757] hover:bg-[#f7f3ed] rounded-xl transition-all">
                        <ListBulletIcon className="w-5 h-5" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Managed Tasks</span>
                    </Link>
                    <Link href="/associate/sprints" className="flex items-center gap-3 px-4 py-3 text-[#1c1917]/60 hover:text-[#d97757] hover:bg-[#f7f3ed] rounded-xl transition-all">
                        <CalendarIcon className="w-5 h-5" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Sprints</span>
                    </Link>
                    <Link href="/associate/reports" className="flex items-center gap-3 px-4 py-3 text-[#1c1917]/60 hover:text-[#d97757] hover:bg-[#f7f3ed] rounded-xl transition-all">
                        <ChartBarIcon className="w-5 h-5" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Analytics</span>
                    </Link>
                </nav>

                <div className="p-6 mt-auto border-t border-[#e5dec9]">
                    <div className="flex items-center gap-3 px-4 py-3 bg-[#fdfcf9] rounded-xl border border-[#e5dec9]">
                        <div className="w-9 h-9 rounded-lg bg-[#f7f3ed] flex items-center justify-center text-xs font-black text-[#d97757] border border-[#e5dec9]">
                            {user?.full_name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-[#1c1917] truncate">{user?.full_name}</p>
                            <p className="text-[9px] text-[#d97757] uppercase font-black tracking-widest truncate">Project Lead</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 min-h-screen">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-[#e5dec9] sticky top-0 z-40 px-10 flex items-center justify-between">
                    <div className="lg:hidden flex items-center gap-3">
                        <div className="relative w-8 h-8">
                            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <h1 className="text-sm font-black text-[#1c1917]">TaskForge</h1>
                    </div>
                    <div className="hidden lg:block relative w-96">
                        <input type="text" placeholder="Global search..." className="input bg-white/50" />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-[#1c1917]/40 hover:text-[#d97757] transition-all">
                            <BellIcon className="w-6 h-6" />
                        </button>
                        <SignOutButton />
                    </div>
                </header>

                <div className="p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
