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

    const activeProjectCount = projects.filter((p: any) => p.status === 'active').length;
    const completedTasks = tasks?.filter((t: any) => t.status === 'completed').length || 0;

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Welcome banner (Sophisticated Beige) */}
            <div className="bg-white border border-[#e5dec9] rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl shadow-[#d9cfb0]/20">
                <div className="relative z-10 space-y-4 max-w-2xl">
                    <h2 className="text-4xl font-black text-[#1c1917] tracking-tight uppercase">
                        COMMAND DEPLOYED, <span className="text-[#d97757]">{user?.full_name?.split(' ')[0]}</span>
                    </h2>
                    <p className="text-[#1c1917]/50 font-semibold leading-relaxed italic border-l-2 border-[#d97757] pl-6">
                        Operational resonance is high. You are currently overseeing {activeProjectCount} critical streams and {tasks?.filter((t: any) => t.priority === 'high').length || 0} urgent vectors.
                    </p>
                </div>
                <div className="absolute top-[-20%] right-[-5%] w-[40%] h-[140%] bg-[#f7f3ed] -rotate-12 -z-0"></div>
                <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden md:block opacity-10 grayscale scale-150">
                    <FolderIcon className="w-48 h-48 text-[#1c1917]" />
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="card bg-white border-[#e5dec9] p-8 flex items-center justify-between group hover:border-[#d97757] transition-all duration-500">
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.3em]">Operational Streams</p>
                        <p className="text-4xl font-black text-[#1c1917] tracking-tighter">{activeProjectCount}</p>
                    </div>
                    <div className="w-14 h-14 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#d97757] border border-[#e5dec9] group-hover:bg-[#d97757] group-hover:text-white transition-all duration-500">
                        <FolderIcon className="w-7 h-7" />
                    </div>
                </div>

                <div className="card bg-white border-[#e5dec9] p-8 flex items-center justify-between group hover:border-[#d97757] transition-all duration-500">
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.3em]">Registry Load</p>
                        <p className="text-4xl font-black text-[#1c1917] tracking-tighter">{tasks?.length || 0}</p>
                    </div>
                    <div className="w-14 h-14 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#d97757] border border-[#e5dec9] group-hover:bg-[#d97757] group-hover:text-white transition-all duration-500">
                        <CheckBadgeIcon className="w-7 h-7" />
                    </div>
                </div>

                <div className="card bg-white border-[#e5dec9] p-8 flex items-center justify-between group hover:border-[#d97757] transition-all duration-500">
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.3em]">Priority Divergence</p>
                        <p className="text-4xl font-black text-red-800 tracking-tighter">{tasks?.filter((t: any) => t.priority === 'high').length || 0}</p>
                    </div>
                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-800 border border-red-100 group-hover:bg-red-800 group-hover:text-white transition-all duration-500">
                        <ClockIcon className="w-7 h-7" />
                    </div>
                </div>

                <div className="card bg-white border-[#e5dec9] p-8 flex items-center justify-between group hover:border-[#d97757] transition-all duration-500">
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.3em] font-serif italic">Operational Velocity</p>
                        <p className="text-4xl font-black text-[#1c1917] tracking-tighter">82%</p>
                    </div>
                    <div className="w-14 h-14 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#d97757] border border-[#e5dec9] group-hover:bg-[#d97757] group-hover:text-white transition-all duration-500">
                        <ArrowTrendingUpIcon className="w-7 h-7" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* My Assigned Projects */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-[#1c1917] tracking-tight uppercase">LEAD REPOSITORY</h3>
                        <Link href="/associate/projects" className="text-[10px] font-black text-[#d97757] uppercase tracking-[0.2em] border-b border-transparent hover:border-[#d97757] transition-all flex items-center gap-2">
                            EXPLORE ALL <ChevronRightIcon className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {projects.slice(0, 3).map((project: any) => (
                            <Link key={project.id} href={`/associate/projects/${project.id}`} className="card bg-white border-[#e5dec9] p-6 group hover:border-[#d97757]/40 transition-all duration-500">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-[#f7f3ed] rounded-xl flex items-center justify-center text-[#d97757] border border-[#e5dec9] group-hover:scale-110 transition-transform">
                                        <FolderIcon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-[#1c1917] tracking-tight uppercase text-lg group-hover:text-[#d97757] transition-colors">{project.name}</h4>
                                        <div className="flex items-center gap-4 text-[9px] font-black text-[#1c1917]/30 uppercase tracking-[0.2em] mt-1">
                                            <span>{project.tasks?.[0]?.count || 0} Critical Vectors</span>
                                            <span className="w-1 h-1 bg-[#d97757] rounded-full"></span>
                                            <span className="text-[#d97757]">{project.status}</span>
                                        </div>
                                    </div>
                                    <ChevronRightIcon className="w-6 h-6 text-[#1c1917]/10 group-hover:translate-x-2 group-hover:text-[#d97757] transition-all duration-500" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Task Feed */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-[#1c1917] tracking-tight uppercase">TASK SYNC</h3>
                        <button className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1c1917]/40 border border-[#e5dec9] px-4 py-2 rounded-lg bg-[#f7f3ed] hover:text-[#d97757] transition-all">MANAGE REGISTRY</button>
                    </div>
                    <div className="card bg-white border-[#e5dec9] divide-y divide-[#e5dec9] shadow-inner overflow-hidden">
                        {tasks?.map((task: any) => (
                            <div key={task.id} className="p-5 hover:bg-[#f7f3ed]/30 transition-colors flex items-center justify-between group">
                                <div className="space-y-2">
                                    <h5 className="text-sm font-black text-[#1c1917] uppercase tracking-tight group-hover:text-[#d97757] transition-colors">{task.title}</h5>
                                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-[#1c1917]/40">
                                        <div className={`flex items-center gap-1.5 ${task.priority === 'high' ? 'text-red-700' : 'text-[#1c1917]/40'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${task.priority === 'high' ? 'bg-red-700 animate-pulse' : 'bg-[#e5dec9]'}`}></span>
                                            {task.priority || 'NORMAL'}
                                        </div>
                                        <span className="w-1 h-1 bg-[#e5dec9] rounded-full"></span>
                                        <span className="italic font-serif">{task.status.replace('_', ' ')}</span>
                                    </div>
                                </div>
                                <div className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-[#1c1917]/20 italic font-serif">
                                    {task.due_date ? format(new Date(task.due_date), 'MMM dd') : 'FLOATING'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
