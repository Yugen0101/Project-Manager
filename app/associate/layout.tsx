import Link from 'next/link';
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
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden lg:flex flex-col fixed inset-y-0 shadow-2xl z-20">
                <div className="p-6">
                    <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-black italic">P</div>
                        ProjectManager
                        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Assoc</span>
                    </h1>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    <Link href="/associate/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium">
                        <HomeIcon className="w-5 h-5 text-blue-400" />
                        Dashboard
                    </Link>
                    <Link href="/associate/projects" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium">
                        <FolderIcon className="w-5 h-5" />
                        My Projects
                    </Link>
                    <Link href="/associate/tasks" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium">
                        <ListBulletIcon className="w-5 h-5 text-emerald-400" />
                        Managed Tasks
                    </Link>
                    <Link href="/associate/sprints" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium">
                        <CalendarIcon className="w-5 h-5" />
                        Sprints
                    </Link>
                    <Link href="/associate/reports" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium">
                        <ChartBarIcon className="w-5 h-5 text-purple-400" />
                        Analytics
                    </Link>
                </nav>

                <div className="p-4 mt-auto border-t border-white/5">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-white/5 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold ring-2 ring-white/10">
                            {user?.full_name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{user?.full_name}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-black truncate">Associate Lead</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 min-h-screen">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 px-8 flex items-center justify-between shadow-sm">
                    <div className="lg:hidden flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-black italic">P</div>
                        <h1 className="text-sm font-black">ProjectManager</h1>
                    </div>
                    <div className="hidden lg:block relative w-96">
                        <input type="text" placeholder="Global search tasks or projects..." className="w-full bg-slate-50 border-0 rounded-lg py-2 pl-4 text-sm focus:ring-2 ring-blue-500/20" />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors relative">
                            <BellIcon className="w-6 h-6" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <SignOutButton />
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
