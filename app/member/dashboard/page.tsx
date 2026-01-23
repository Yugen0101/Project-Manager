import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/auth/session';
import {
    ClockIcon,
    CheckBadgeIcon,
    FireIcon,
    ChatBubbleLeftIcon,
    ChevronRightIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { format } from 'date-fns';
import MemberPerformance from '@/components/analytics/MemberPerformance';

export default async function MemberDashboard() {
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

    // Fetch tasks specifically assigned to the member
    const { data: tasks } = await supabase
        .from('tasks')
        .select(`
            *,
            project:projects(name)
        `)
        .eq('assigned_to', user?.id)
        .order('due_date', { ascending: true, nullsFirst: false });

    // Separate tasks by status
    const activeTasks = tasks?.filter((t: any) => t.status !== 'completed') || [];
    const urgentTasks = activeTasks.filter((t: any) => t.priority === 'high').length;
    const completedThisWeek = tasks?.filter((t: any) => t.status === 'completed').length || 0;

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            {/* Header section with Personal Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-px bg-[#d97757]"></span>
                        <h2 className="text-[10px] font-black text-[#d97757] uppercase tracking-[0.4em]">Personal Workspace</h2>
                    </div>
                    <h1 className="text-5xl font-black text-[#1c1917] tracking-tighter uppercase">Active, {user?.full_name?.split(' ')[0]}</h1>
                    <p className="text-[#1c1917]/50 text-xl font-black italic font-serif">System reports {activeTasks.length} active threads in your queue.</p>
                </div>

                <div className="card p-6 bg-white border-[#e5dec9] flex items-center gap-6 shadow-xl shadow-[#d9cfb0]/10 shrink-0">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-[#d97757] border border-orange-100">
                        <FireIcon className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.2em]">Efficiency Rating</p>
                        <p className="text-2xl font-black text-[#1c1917]">98.4%</p>
                    </div>
                </div>
            </div>

            {/* Focus Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="card bg-[#f7f3ed]/50 border-[#e5dec9] p-10 flex flex-col items-center text-center space-y-4 group hover:bg-white hover:border-[#d97757] transition-all duration-500">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#1c1917]/20 group-hover:text-[#d97757] border border-[#e5dec9] transition-all">
                        <ClockIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-5xl font-black text-[#1c1917] tracking-tighter">{activeTasks.length}</p>
                        <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.3em] mt-2">Active Threads</p>
                    </div>
                </div>

                <div className="card bg-[#f7f3ed]/50 border-[#e5dec9] p-10 flex flex-col items-center text-center space-y-4 group hover:bg-white hover:border-red-500 transition-all duration-500">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#1c1917]/20 group-hover:text-red-500 border border-[#e5dec9] transition-all">
                        <FireIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-5xl font-black text-red-900 tracking-tighter">{urgentTasks}</p>
                        <p className="text-[10px] font-black text-red-900/30 uppercase tracking-[0.3em] mt-2">Critical Vectors</p>
                    </div>
                </div>

                <div className="card bg-[#f7f3ed]/50 border-[#e5dec9] p-10 flex flex-col items-center text-center space-y-4 group hover:bg-white hover:border-emerald-500 transition-all duration-500">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#1c1917]/20 group-hover:text-emerald-500 border border-[#e5dec9] transition-all">
                        <CheckBadgeIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-5xl font-black text-[#1c1917] tracking-tighter">{completedThisWeek}</p>
                        <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.3em] mt-2">Resolved Units</p>
                    </div>
                </div>
            </div>

            {/* Performance Visualization Placeholder */}
            <div className="bg-white border border-[#e5dec9] rounded-[2.5rem] p-4 shadow-sm overflow-hidden">
                <MemberPerformance />
            </div>

            {/* Tasks Repository */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-3xl font-black text-[#1c1917] tracking-tight uppercase">REGISTRY SYNC</h3>
                    <div className="flex items-center gap-4">
                        <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-widest italic font-serif">Live Buffer</p>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#e5dec9] text-[#1c1917]/40 hover:text-[#d97757] transition-all">
                            <ArrowPathIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {activeTasks.map((task: any) => (
                        <div key={task.id} className="card bg-white border-[#e5dec9] group hover:border-[#d97757]/40 transition-all duration-500 overflow-hidden">
                            <div className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-4">
                                        <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${task.priority === 'high' ? 'bg-red-50 text-red-700 border-red-100' :
                                            task.priority === 'medium' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                'bg-[#f7f3ed] text-[#1c1917]/60 border-[#e5dec9]'
                                            }`}>
                                            {task.priority || 'NORMAL'}
                                        </span>
                                        <span className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-[#d97757]"></span>
                                            {task.project?.name}
                                        </span>
                                    </div>
                                    <h4 className="text-2xl font-black text-[#1c1917] tracking-tight uppercase group-hover:text-[#d97757] transition-colors leading-none">
                                        {task.title}
                                    </h4>
                                    <p className="text-[#1c1917]/40 text-sm italic font-serif max-w-2xl line-clamp-1">
                                        {task.description || 'No additional telemetry data provided for this assignment.'}
                                    </p>
                                </div>

                                <div className="flex items-center gap-10 shrink-0">
                                    <div className="text-right space-y-1">
                                        <div className="flex items-center gap-2 justify-end text-[11px] font-black text-[#1c1917]/60 uppercase tracking-widest">
                                            <ClockIcon className="w-4 h-4 text-[#d97757]" />
                                            {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'UNSET'}
                                        </div>
                                        <p className="text-[8px] font-black text-[#1c1917]/20 uppercase tracking-[0.4em]">Operational Window</p>
                                    </div>

                                    <div className="h-12 w-px bg-[#e5dec9] hidden lg:block"></div>

                                    <div className="flex items-center gap-4">
                                        <Link
                                            href={`/member/tasks/${task.id}`}
                                            className="px-8 py-4 bg-[#f7f3ed]/50 text-[#1c1917]/60 border border-[#e5dec9] hover:bg-[#d97757] hover:text-white hover:border-[#d97757] rounded-2xl transition-all text-[9px] font-black uppercase tracking-[0.2em] shadow-sm"
                                        >
                                            View File
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {activeTasks.length === 0 && (
                        <div className="py-24 text-center bg-[#f7f3ed]/30 rounded-[3rem] border-2 border-dashed border-[#e5dec9]">
                            <CheckBadgeIcon className="w-20 h-20 text-[#e5dec9] mx-auto mb-6" />
                            <h3 className="text-2xl font-black text-[#1c1917] uppercase tracking-tighter">Repository Clean</h3>
                            <p className="text-[#1c1917]/30 text-xs font-black uppercase tracking-widest mt-2">All operational streams have been synchronized.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
