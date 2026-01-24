import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { Toaster } from 'sonner';
import { VideoCameraIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import AdminNav from '@/components/navigation/AdminNav';
import AdminMobileMenu from '@/components/navigation/AdminMobileMenu';
import SignOutButton from '@/components/auth/SignOutButton';
import TaskForgeLogo from '@/components/ui/TaskForgeLogo';

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

    // Optimized: Parallel Operational Synchronization
    const [projectRes, userRes, taskRes] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('tasks').select('*', { count: 'exact', head: true })
    ]);

    const projectCount = projectRes.count || 0;
    const userCount = userRes.count || 0;
    const taskCount = taskRes.count || 0;

    const counts = {
        projectCount,
        userCount,
        taskCount
    };

    return (
        <div className="min-h-screen bg-[#fdfcf9] text-[#1c1917]">
            <Toaster position="top-right" richColors />

            {/* Main Header - Increased height for prominent branding */}
            <header className="h-24 bg-white border-b border-[#e5dec9] sticky top-0 z-50 flex items-center justify-between px-10 shadow-sm shadow-[#d9cfb0]/10">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-5">
                        <TaskForgeLogo size="lg" />
                        <div className="flex flex-col justify-center">
                            <h1 className="text-2xl font-black tracking-tight uppercase leading-none">
                                Task<span className="text-accent-500">Forge</span>
                            </h1>
                            <span className="text-[10px] text-[#1c1917]/30 font-black tracking-[0.3em] uppercase mt-1">Registry Command</span>
                        </div>
                    </div>

                    {/* Module Indicators */}
                    <div className="hidden lg:flex items-center gap-6 border-l border-[#e5dec9] pl-8">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-status-success shadow-[0_0_8px_rgba(124,148,115,0.4)]"></div>
                            <span className="text-[10px] font-black text-[#1c1917]/40 uppercase tracking-widest">System Healthy</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <NotificationCenter />
                    <div className="flex items-center gap-6 pl-6 border-l border-[#e5dec9]">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black uppercase tracking-tight">{user.full_name}</p>
                            <p className="text-[9px] font-black text-accent-500 uppercase tracking-[0.2em]">Systems Executive</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-accent-500 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-accent-500/20">
                            {user.full_name.charAt(0)}
                        </div>
                        <div className="border-l border-[#e5dec9] pl-6">
                            <SignOutButton />
                        </div>
                    </div>
                    <div className="lg:hidden">
                        <AdminMobileMenu
                            counts={{
                                projectCount: projectCount || 0,
                                userCount: userCount || 0,
                                taskCount: taskCount || 0
                            }}
                        />
                    </div>
                </div>
            </header>

            <div className="flex items-start">
                {/* Sidebar */}
                <aside className="w-72 bg-white/50 border-r border-[#e5dec9] h-[calc(100vh-96px)] sticky top-24 overflow-y-auto hidden lg:block">
                    <AdminNav
                        counts={{
                            projectCount: projectCount || 0,
                            userCount: userCount || 0,
                            taskCount: taskCount || 0
                        }}
                    />
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-12 bg-white/30 min-h-[calc(100vh-96px)] max-w-[1600px] mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
