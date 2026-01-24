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
        <div className="min-h-screen bg-background text-foreground flex">
            <Toaster position="top-right" richColors />
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
