import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { Toaster } from 'sonner';
import { VideoCameraIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import AdminNav from '@/components/navigation/AdminNav';
import AdminMobileMenu from '@/components/navigation/AdminMobileMenu';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
        redirect('/login');
    }

    const supabase = await createClient();

    // Get stats for sidebar
    const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

    const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

    const { count: taskCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true });

    const counts = {
        projectCount: projectCount || 0,
        userCount: userCount || 0,
        taskCount: taskCount || 0
    };

    return (
        <div className="min-h-screen bg-[#fdfcf9] text-[#1c1917]">
            <Toaster position="top-right" richColors />
            {/* Header */}
            <header className="bg-white/80 border-b border-[#e5dec9] sticky top-0 z-50 backdrop-blur-xl">
                <div className="px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 py-2">
                            <AdminMobileMenu counts={counts} />
                            <div className="relative w-32 h-32 -my-6 hidden md:block">
                                <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-[#1c1917] tracking-tight">Task<span className="text-[#c26242]">Forge</span></h1>
                                <p className="text-[14px] font-black text-[#c26242] uppercase tracking-[0.2em]">Operations HUB</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <NotificationCenter />
                            {user && (
                                <div className="flex items-center gap-4 border-l border-[#e5dec9] pl-6">
                                    <div className="text-right">
                                        <p className="text-sm font-black text-[#1c1917]">{user.full_name}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#d97757]">{user.role}</p>
                                    </div>
                                    <form action="/api/auth/signout" method="POST">
                                        <button type="submit" className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-red-600 bg-red-50 border border-red-100 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300">
                                            Sign Out
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex items-start">
                {/* Sidebar */}
                <aside className="w-72 bg-white/50 border-r border-[#e5dec9] h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
                    <AdminNav
                        counts={{
                            projectCount: projectCount || 0,
                            userCount: userCount || 0,
                            taskCount: taskCount || 0
                        }}
                    />
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-12 bg-white/30 min-h-[calc(100vh-73px)]">
                    {children}
                </main>
            </div>
        </div>
    );
}
