import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
        redirect('/login');
    }

    const supabase = await createClient();

    // Get statistics
    const { count: totalProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

    const { count: activeProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

    const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

    const { count: totalTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true });

    const { count: completedTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

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
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Welcome back, {user.full_name}!</h2>
                <p className="text-slate-600 mt-1">Here's what's happening with your projects today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-primary-100 text-sm font-medium">Total Projects</p>
                            <p className="text-4xl font-bold mt-2">{totalProjects || 0}</p>
                            <p className="text-primary-100 text-sm mt-1">{activeProjects || 0} active</p>
                        </div>
                        <svg className="w-12 h-12 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Total Users</p>
                            <p className="text-4xl font-bold mt-2">{totalUsers || 0}</p>
                            <p className="text-green-100 text-sm mt-1">Team members</p>
                        </div>
                        <svg className="w-12 h-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Tasks</p>
                            <p className="text-4xl font-bold mt-2">{totalTasks || 0}</p>
                            <p className="text-blue-100 text-sm mt-1">{completedTasks || 0} completed</p>
                        </div>
                        <svg className="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-100 text-sm font-medium">Overdue Tasks</p>
                            <p className="text-4xl font-bold mt-2">{overdueTasks || 0}</p>
                            <p className="text-red-100 text-sm mt-1">Needs attention</p>
                        </div>
                        <svg className="w-12 h-12 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a href="/admin/projects?action=create" className="btn-primary text-center">
                        + Create New Project
                    </a>
                    <a href="/admin/users?action=create" className="btn-primary text-center">
                        + Add New User
                    </a>
                    <a href="/admin/tasks" className="btn-secondary text-center">
                        View All Tasks
                    </a>
                </div>
            </div>

            {/* Recent Projects and Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Projects */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900">Recent Projects</h3>
                        <a href="/admin/projects" className="text-sm text-primary-600 hover:text-primary-700">
                            View all →
                        </a>
                    </div>
                    <div className="space-y-3">
                        {recentProjects && recentProjects.length > 0 ? (
                            recentProjects.map((project: any) => (
                                <div key={project.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-slate-900">{project.name}</p>
                                        <p className="text-sm text-slate-600">
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
                            ))
                        ) : (
                            <p className="text-slate-500 text-center py-4">No projects yet</p>
                        )}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900">Recent Users</h3>
                        <a href="/admin/users" className="text-sm text-primary-600 hover:text-primary-700">
                            View all →
                        </a>
                    </div>
                    <div className="space-y-3">
                        {recentUsers && recentUsers.length > 0 ? (
                            recentUsers.map((u: any) => (
                                <div key={u.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-slate-900">{u.full_name}</p>
                                        <p className="text-sm text-slate-600">{u.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`badge ${u.role === 'admin' ? 'badge-danger' :
                                                u.role === 'associate' ? 'badge-info' :
                                                    'badge-success'
                                            }`}>
                                            {u.role}
                                        </span>
                                        {!u.is_active && (
                                            <span className="block text-xs text-red-600 mt-1">Inactive</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 text-center py-4">No users yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
