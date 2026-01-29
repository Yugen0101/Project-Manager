import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import {
    BriefcaseIcon,
    UserGroupIcon,
    ClipboardDocumentCheckIcon,
    ExclamationTriangleIcon,
    PlusIcon,
    ArrowRightIcon,
    ChartBarIcon,
    ShieldCheckIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default async function AdminDashboard() {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
        redirect('/login');
    }

    const supabase = await createClient();

    // Get statistics
    const stats = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('tasks').select('*', { count: 'exact', head: true }),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    ]);

    const totalProjects = stats[0].count || 0;
    const activeProjects = stats[1].count || 0;
    const totalUsers = stats[2].count || 0;
    const totalTasks = stats[3].count || 0;
    const completedTasks = stats[4].count || 0;

    const { count: overdueTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .lt('deadline', new Date().toISOString().split('T')[0])
        .neq('status', 'completed');

    // Get recent projects
    const { data: recentProjects } = await supabase
        .from('projects')
        .select('*, created_by:users!projects_created_by_fkey(full_name)')
        .order('created_at', { ascending: false })
        .limit(5);

    // Get recent users
    const { data: recentUsers } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Welcome Section */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <span className="w-8 h-1 bg-accent-500 rounded-full"></span>
                    <h2 className="text-xs font-medium text-accent-600 uppercase tracking-wider">Control Center</h2>
                </div>
                <h1 className="text-5xl font-semibold text-[#1c1917] tracking-tight">
                    System Online, <span className="text-accent-600">{user.full_name.split(' ')[0]}</span>
                </h1>
                <p className="text-[#1c1917]/75 font-normal text-lg">
                    Monitoring {activeProjects || 0} active project nodes across the organization.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="card bg-white border-beige-200 p-8 group hover:border-beige-300 transition-all duration-500 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-medium text-[#1c1917]/70 uppercase tracking-widest">Total Projects</p>
                            <p className="text-5xl font-semibold text-[#1c1917] mt-3 tracking-tight">{totalProjects || 0}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span>
                                <p className="text-status-success text-[10px] font-medium uppercase tracking-tight">{activeProjects || 0} active</p>
                            </div>
                        </div>
                        <div className="w-14 h-14 bg-beige-100 rounded-2xl flex items-center justify-center text-[#1c1917]/30 border border-beige-200 group-hover:bg-accent-500 group-hover:text-white transition-all duration-500">
                            <BriefcaseIcon className="w-7 h-7" />
                        </div>
                    </div>
                </div>

                <div className="card bg-white border-beige-200 p-8 group hover:border-beige-300 transition-all duration-500 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-medium text-[#1c1917]/70 uppercase tracking-widest">Total Users</p>
                            <p className="text-5xl font-semibold text-[#1c1917] mt-3 tracking-tight">{totalUsers || 0}</p>
                            <p className="text-[#1c1917]/60 text-[10px] font-medium uppercase tracking-tight mt-2">Team members</p>
                        </div>
                        <div className="w-14 h-14 bg-beige-100 rounded-2xl flex items-center justify-center text-[#1c1917]/30 border border-beige-200 group-hover:bg-accent-500 group-hover:text-white transition-all duration-500">
                            <UserGroupIcon className="w-7 h-7" />
                        </div>
                    </div>
                </div>

                <div className="card bg-white border-beige-200 p-8 group hover:border-beige-300 transition-all duration-500 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-medium text-[#1c1917]/70 uppercase tracking-widest">Total Tasks</p>
                            <p className="text-5xl font-semibold text-[#1c1917] mt-3 tracking-tight">{totalTasks || 0}</p>
                            <p className="text-status-success text-[10px] font-medium uppercase tracking-tight mt-2">{completedTasks || 0} completed</p>
                        </div>
                        <div className="w-14 h-14 bg-beige-100 rounded-2xl flex items-center justify-center text-[#1c1917]/30 border border-beige-200 group-hover:bg-accent-500 group-hover:text-white transition-all duration-500">
                            <ClipboardDocumentCheckIcon className="w-7 h-7" />
                        </div>
                    </div>
                </div>

                <div className="card bg-status-error/5 border-status-error/20 p-8 group hover:border-status-error/30 transition-all duration-500 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-medium text-status-error/60 uppercase tracking-widest">Overdue Tasks</p>
                            <p className="text-5xl font-semibold text-status-error mt-3 tracking-tight">{overdueTasks || 0}</p>
                            <p className="text-status-error/70 text-[10px] font-medium uppercase tracking-tight mt-2">Attention Required</p>
                        </div>
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-status-error border border-status-error/20 group-hover:bg-status-error group-hover:text-white transition-all duration-500 shadow-sm">
                            <ExclamationTriangleIcon className="w-7 h-7" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-beige-200 rounded-[2rem] p-10 relative overflow-hidden shadow-sm">
                <div className="relative z-10">
                    <h3 className="text-xs font-medium uppercase tracking-wider text-[#1c1917]/70 mb-8 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-accent-500"></span>
                        Management Interface
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link href="/admin/projects?action=create" className="btn-primary py-4 text-sm font-medium">
                            + Create Project
                        </Link>
                        <Link href="/admin/users?action=create" className="btn-secondary py-4 text-sm font-medium">
                            + Create User
                        </Link>
                        <Link href="/admin/audit-logs" className="btn-secondary py-4 text-sm font-medium">
                            Activity Logs
                        </Link>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-beige-50/50 -rotate-45 translate-x-32 -translate-y-32 rounded-full"></div>
            </div>

            {/* Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Recent Projects */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-2xl font-semibold text-[#1c1917] tracking-tight">Active Projects</h3>
                        <Link href="/admin/projects" className="text-xs font-medium text-accent-600 uppercase tracking-tight hover:opacity-70 transition-opacity flex items-center gap-2">
                            VIEW ALL →
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentProjects && recentProjects.length > 0 ? (
                            recentProjects.map((project: any) => (
                                <Link
                                    key={project.id}
                                    href={`/admin/projects/${project.id}`}
                                    className="block card p-6 group hover:border-beige-300 transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-[#1c1917] text-lg group-hover:text-accent-600 transition-colors uppercase tracking-tight">
                                                {project.name}
                                            </h4>
                                            <p className="text-sm text-[#1c1917]/75 mt-1">
                                                Created by {project.created_by?.full_name || 'Unknown'}
                                            </p>
                                        </div>
                                        <span className={`badge ${project.status === 'active' ? 'badge-success' :
                                            project.status === 'completed' ? 'badge-info' :
                                                'badge-warning'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                </Link >
                            ))
                        ) : (
                            <div className="py-12 border-2 border-dashed border-beige-200 rounded-[2rem] text-center text-[#1c1917]/30 font-bold uppercase text-sm tracking-widest">
                                No projects yet
                            </div>
                        )
                        }
                    </div>
                </div>

                {/* Team Roster */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-2xl font-semibold text-[#1c1917] tracking-tight">Team Roster</h3>
                        <Link href="/admin/users" className="text-xs font-medium text-accent-600 uppercase tracking-tight hover:opacity-70 transition-opacity flex items-center gap-2">
                            VIEW ALL →
                        </Link>
                    </div>
                    <div className="card p-0 divide-y divide-beige-200 shadow-sm overflow-hidden">
                        {recentUsers && recentUsers.length > 0 ? (
                            recentUsers.map((u: any) => (
                                <div key={u.id} className="p-5 hover:bg-beige-50 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-beige-100 flex items-center justify-center text-sm font-semibold text-accent-600 border border-beige-200">
                                            {u.full_name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-[#1c1917] group-hover:text-accent-600 transition-colors uppercase tracking-tight">
                                                {u.full_name}
                                            </h5>
                                            <p className="text-xs text-[#1c1917]/65 uppercase tracking-tight font-medium">
                                                {u.role}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-warning'
                                        }`}>
                                        {u.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center text-[#1c1917]/30 font-bold uppercase text-sm tracking-widest">
                                No users yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
