import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/auth/session';
import {
    FolderIcon,
    CheckBadgeIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
    PlusIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function AssociateDashboard() {
    const user = await getCurrentUser();
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
            },
        }
    );

    // Fetch projects assigned to associate
    const { data: userProjects } = await supabase
        .from('user_projects')
        .select(`
            project:projects(
                *,
                tasks:tasks(count)
            )
        `)
        .eq('user_id', user?.id);

    const projects = userProjects?.map((up: any) => up.project) || [];

    // Fetch tasks managed by associate or assigned to associate
    const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .or(`created_by.eq.${user?.id},assigned_to.eq.${user?.id}`)
        .order('created_at', { ascending: false })
        .limit(10);

    const activeProjects = projects.filter((p: any) => p.status === 'active').length;
    const completedTasks = tasks?.filter((t: any) => t.status === 'completed').length || 0;

    return (
        <div className="space-y-8">
            {/* Welcome banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-900/10">
                <div className="relative z-10 space-y-2">
                    <h2 className="text-3xl font-bold">Good Day, {user?.full_name?.split(' ')[0]}! 👋</h2>
                    <p className="text-blue-100 max-w-lg">
                        You have {activeProjects} active projects and several urgent tasks that need your oversight today.
                    </p>
                </div>
                <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-white/5 -skew-x-12 translate-x-12"></div>
                <div className="absolute right-12 bottom-0 h-4/5 hidden md:block opacity-20">
                    <FolderIcon className="w-full h-full text-white" />
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card p-6 flex items-center justify-between group hover:border-blue-200 transition-all">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Projects</p>
                        <p className="text-3xl font-black text-slate-900">{activeProjects}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                        <FolderIcon className="w-8 h-8 text-blue-600" />
                    </div>
                </div>

                <div className="card p-6 flex items-center justify-between group hover:border-emerald-200 transition-all">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tasks Overview</p>
                        <p className="text-3xl font-black text-slate-900">{tasks?.length || 0}</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-2xl group-hover:bg-emerald-100 transition-colors">
                        <CheckBadgeIcon className="w-8 h-8 text-emerald-600" />
                    </div>
                </div>

                <div className="card p-6 flex items-center justify-between group hover:border-orange-200 transition-all">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Urgent Alerts</p>
                        <p className="text-3xl font-black text-slate-900">{tasks?.filter((t: any) => t.priority === 'high').length || 0}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors">
                        <ClockIcon className="w-8 h-8 text-orange-600" />
                    </div>
                </div>

                <div className="card p-6 flex items-center justify-between group hover:border-indigo-200 transition-all">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Team Velocity</p>
                        <p className="text-3xl font-black text-slate-900">82%</p>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-2xl group-hover:bg-indigo-100 transition-colors">
                        <ArrowTrendingUpIcon className="w-8 h-8 text-indigo-600" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* My Assigned Projects */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900">My Assigned Projects</h3>
                        <Link href="/associate/projects" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
                            View All <ChevronRightIcon className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {projects.slice(0, 3).map((project: any) => (
                            <Link key={project.id} href={`/associate/projects/${project.id}`} className="card p-5 group hover:bg-slate-50/50 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:border-blue-200 transition-colors">
                                        <FolderIcon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 truncate">{project.name}</h4>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                            <span>{project.tasks?.[0]?.count || 0} Tasks</span>
                                            <span>•</span>
                                            <span>{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
                                        </div>
                                    </div>
                                    <ChevronRightIcon className="w-5 h-5 text-slate-300 group-hover:translate-x-1 group-hover:text-blue-500 transition-all" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Task Feed */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900">Recent Tasks Managed</h3>
                        <button className="btn-secondary py-1 text-xs">Manage All</button>
                    </div>
                    <div className="card divide-y divide-slate-100 bg-white shadow-xl shadow-slate-200/5">
                        {tasks?.map((task: any) => (
                            <div key={task.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                <div className="space-y-1">
                                    <h5 className="text-sm font-bold text-slate-900">{task.title}</h5>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' :
                                                task.priority === 'medium' ? 'bg-orange-500' :
                                                    'bg-blue-500'
                                            }`}></span>
                                        {task.status.replace('_', ' ')}
                                    </div>
                                </div>
                                <div className="text-right text-[10px] font-bold text-slate-400 uppercase">
                                    {task.due_date ? format(new Date(task.due_date), 'MMM d') : 'No due date'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
