import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { Toaster } from 'sonner';
import { VideoCameraIcon } from '@heroicons/react/24/outline';

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

    return (
        <div className="min-h-screen bg-slate-50">
            <Toaster position="top-right" richColors />
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Project Manager</h1>
                            <p className="text-sm text-slate-600">Admin Dashboard</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <NotificationCenter />
                            <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-slate-900">{user.full_name}</p>
                                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                                </div>
                                <form action="/api/auth/signout" method="POST">
                                    <button type="submit" className="btn-secondary text-sm">
                                        Sign Out
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-73px)]">
                    <nav className="p-4 space-y-2">
                        <a
                            href="/admin/dashboard"
                            className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span className="font-medium">Dashboard</span>
                            </div>
                        </a>

                        <a
                            href="/admin/projects"
                            className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span className="font-medium">Projects</span>
                                <span className="ml-auto badge badge-info">{projectCount || 0}</span>
                            </div>
                        </a>

                        <a
                            href="/admin/users"
                            className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span className="font-medium">Users</span>
                                <span className="ml-auto badge badge-info">{userCount || 0}</span>
                            </div>
                        </a>

                        <a
                            href="/admin/tasks"
                            className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                <span className="font-medium">All Tasks</span>
                                <span className="ml-auto badge badge-info">{taskCount || 0}</span>
                            </div>
                        </a>

                        <a
                            href="/admin/meetings"
                            className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <VideoCameraIcon className="w-5 h-5 text-indigo-500" />
                                <span className="font-medium">Meetings</span>
                            </div>
                        </a>

                        <a
                            href="/admin/audit-logs"
                            className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 21a11.955 11.955 0 01-9.618-7.016m18.236 0a11.958 11.958 0 00-18.236 0m18.236 0a11.956 11.956 0 01-18.236 0" />
                                </svg>
                                <span className="font-medium">Audit Logs</span>
                            </div>
                        </a>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
