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
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Welcome Section */}
            <div className="flex flex-col gap-3">
                <h2 className="text-5xl font-black text-[#1c1917] tracking-tighter uppercase">
                    System Online, <span className="text-[#d97757]">{user.full_name.split(' ')[0]}</span>
                </h2>
                <div className="flex items-center gap-4">
                    <span className="w-12 h-0.5 bg-[#d97757]"></span>
                    <p className="text-[#1c1917]/40 font-black uppercase tracking-[0.3em] text-[10px]">
                        Environment: TaskForge Intelligence • Node 01
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="card bg-white border-[#e5dec9] p-8 group hover:border-[#d97757] transition-all duration-500 shadow-xl shadow-[#d9cfb0]/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.3em]">Total Projects</p>
                            <p className="text-5xl font-black text-[#1c1917] mt-3 tracking-tighter">{totalProjects || 0}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#d97757]"></span>
                                <p className="text-[#d97757] text-[10px] font-black uppercase tracking-widest">{activeProjects || 0} active</p>
                            </div>
                        </div>
                        <div className="w-14 h-14 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#d97757] border border-[#e5dec9] group-hover:bg-[#d97757] group-hover:text-white transition-all duration-500">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card bg-white border-[#e5dec9] p-8 group hover:border-[#d97757] transition-all duration-500 shadow-xl shadow-[#d9cfb0]/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.3em]">Total Users</p>
                            <p className="text-5xl font-black text-[#1c1917] mt-3 tracking-tighter">{totalUsers || 0}</p>
                            <p className="text-[#1c1917]/40 text-[10px] font-black uppercase tracking-widest mt-2">Team members</p>
                        </div>
                        <div className="w-14 h-14 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#d97757] border border-[#e5dec9] group-hover:bg-[#d97757] group-hover:text-white transition-all duration-500">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card bg-white border-[#e5dec9] p-8 group hover:border-[#d97757] transition-all duration-500 shadow-xl shadow-[#d9cfb0]/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.3em]">Total Tasks</p>
                            <p className="text-5xl font-black text-[#1c1917] mt-3 tracking-tighter">{totalTasks || 0}</p>
                            <p className="text-[#d97757] text-[10px] font-black uppercase tracking-widest mt-2">{completedTasks || 0} completed</p>
                        </div>
                        <div className="w-14 h-14 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#d97757] border border-[#e5dec9] group-hover:bg-[#d97757] group-hover:text-white transition-all duration-500">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card bg-[#fdfcf9] border-red-100 p-8 group hover:border-red-500 transition-all duration-500 shadow-xl shadow-red-900/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-red-900/30 uppercase tracking-[0.3em]">Overdue Tasks</p>
                            <p className="text-5xl font-black text-red-900 mt-3 tracking-tighter">{overdueTasks || 0}</p>
                            <p className="text-red-700/60 text-[10px] font-black uppercase tracking-widest mt-2">Needs attention</p>
                        </div>
                        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#f7f3ed]/50 border border-[#e5dec9] rounded-[2.5rem] p-10 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#1c1917]/30 mb-8 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#d97757]"></span>
                        Operations Hub
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <a href="/admin/projects?action=create" className="btn-primary py-4 text-[10px] text-center shadow-lg shadow-[#d97757]/20">
                            + Initialize Project
                        </a>
                        <a href="/admin/users?action=create" className="btn-primary py-4 text-[10px] text-center shadow-lg shadow-[#d97757]/20">
                            + Enroll Personnel
                        </a>
                        <a href="/admin/tasks" className="btn-secondary py-4 text-[10px] text-center bg-white">
                            Access All Registries
                        </a>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 -rotate-45 translate-x-32 -translate-y-32 rounded-full"></div>
            </div>

            {/* Recent Projects and Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Recent Projects */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-[#1c1917] tracking-tight uppercase">ACTIVE PROJECTIONS</h3>
                        <a href="/admin/projects" className="text-[10px] font-black text-[#d97757] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
                            View Repository →
                        </a>
                    </div>
                    <div className="space-y-4">
                        {recentProjects && recentProjects.length > 0 ? (
                            recentProjects.map((project: any) => (
                                <div key={project.id} className="card bg-white border-[#e5dec9] p-6 flex items-center justify-between hover:border-[#d97757]/40 transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-[#f7f3ed] rounded-xl flex items-center justify-center text-[#d97757] group-hover:bg-[#d97757] group-hover:text-white transition-all">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-[#1c1917] tracking-tight uppercase group-hover:text-[#d97757] transition-colors">{project.name}</p>
                                            <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-widest mt-1">
                                                Origin: {project.created_by?.full_name || 'System'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${project.status === 'active' ? 'bg-[#f7f3ed] text-[#d97757] border-[#e5dec9]' :
                                        project.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            'bg-orange-50 text-orange-700 border-orange-100'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 border-2 border-dashed border-[#e5dec9] rounded-[2rem] text-center text-[#1c1917]/30 font-black uppercase text-[10px] tracking-[0.3em]">
                                No active projections found
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-[#1c1917] tracking-tight uppercase">PERSONNEL ROSTER</h3>
                        <a href="/admin/users" className="text-[10px] font-black text-[#d97757] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
                            View All Personnel →
                        </a>
                    </div>
                    <div className="space-y-4">
                        {recentUsers && recentUsers.length > 0 ? (
                            recentUsers.map((u: any) => (
                                <div key={u.id} className="card bg-white border-[#e5dec9] p-6 hover:border-[#d97757]/40 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-xl bg-[#f7f3ed] flex items-center justify-center text-[#1c1917] font-black border border-[#e5dec9] group-hover:bg-[#d97757] group-hover:text-white transition-all text-sm">
                                                {u.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-[#1c1917] tracking-tight uppercase">{u.full_name}</p>
                                                <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-widest mt-1 italic font-serif lowercase">{u.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${u.role === 'admin' ? 'bg-red-50 text-red-700 border-red-100' :
                                                u.role === 'associate' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    'bg-green-50 text-green-700 border-green-100'
                                                }`}>
                                                {u.role}
                                            </span>
                                            {!u.is_active && (
                                                <span className="block text-[8px] font-black text-red-600 uppercase tracking-widest mt-2 translate-x-[-4px]">● Deactivated</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 border-2 border-dashed border-[#e5dec9] rounded-[2rem] text-center text-[#1c1917]/30 font-black uppercase text-[10px] tracking-[0.3em]">
                                Registry is currently empty
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
