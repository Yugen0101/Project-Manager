import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/auth/session';
import {
    ClockIcon,
    CheckBadgeIcon,
    FireIcon,
    ChatBubbleLeftIcon,
    ChevronRightIcon,
    ArrowPathIcon,
    VideoCameraIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { format } from 'date-fns';
import MemberPerformance from '@/components/analytics/MemberPerformance';
import MeetingList from '@/components/meetings/MeetingList';
import { getProjectMeetings } from '@/app/actions/meetings';

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

    // Fetch meetings for all assigned projects
    const { data: userProjects } = await supabase
        .from('user_projects')
        .select('project_id')
        .eq('user_id', user?.id);

    const projectIds = userProjects?.map((up: any) => up.project_id) || [];
    let allMeetings: any[] = [];

    if (projectIds.length > 0) {
        const { data: meetings } = await supabase
            .from('meetings')
            .select(`
                *,
                creator:users!meetings_created_by_fkey(full_name)
            `)
            .in('project_id', projectIds)
            .neq('status', 'cancelled')
            .order('scheduled_at', { ascending: true });

        allMeetings = meetings || [];
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            {/* Header section with Personal Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-1 bg-accent-500 rounded-full"></span>
                        <h2 className="text-xs font-black text-accent-500 uppercase tracking-wider">Personal Workspace</h2>
                    </div>
                    <h1 className="text-5xl font-black text-[#1c1917] tracking-tight">Welcome, {user?.full_name?.split(' ')[0]}</h1>
                    <p className="text-[#1c1917]/60 text-xl font-medium">You have {activeTasks.length} active tasks requiring your attention today.</p>
                </div>

                <div className="card !p-6 bg-white border-[#e5dec9] flex items-center gap-6 shadow-lg shadow-[#d9cfb0]/20 shrink-0 rounded-2xl">
                    <div className="w-12 h-12 bg-[#f7f3ed] rounded-xl flex items-center justify-center text-[#d97757] border border-[#d9cfb0]">
                        <FireIcon className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#1c1917]/40 uppercase tracking-wider">Efficiency Rating</p>
                        <p className="text-2xl font-black text-[#1c1917] tracking-tight">98.4%</p>
                    </div>
                </div>
            </div>

            {/* Focus Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="card bg-white border-[#e5dec9] p-10 flex flex-col items-center text-center space-y-4 group hover:border-accent-200 transition-all duration-500 shadow-sm shadow-[#d9cfb0]/10">
                    <div className="w-16 h-16 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#1c1917]/30 group-hover:text-accent-500 border border-[#d9cfb0] transition-all">
                        <ClockIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-5xl font-black text-[#1c1917] tracking-tight">{activeTasks.length}</p>
                        <p className="text-[10px] font-black text-[#1c1917]/40 uppercase tracking-widest mt-2">Active Tasks</p>
                    </div>
                </div>

                <div className="card bg-white border-[#e5dec9] p-10 flex flex-col items-center text-center space-y-4 group hover:border-[#d97757]/30 transition-all duration-500 shadow-sm shadow-[#d9cfb0]/10">
                    <div className="w-16 h-16 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#1c1917]/30 group-hover:text-[#d97757] border border-[#d9cfb0] transition-all">
                        <FireIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-5xl font-black text-[#d97757] tracking-tight">{urgentTasks}</p>
                        <p className="text-[10px] font-black text-[#d97757]/60 uppercase tracking-widest mt-2">Urgent Items</p>
                    </div>
                </div>

                <div className="card bg-white border-[#e5dec9] p-10 flex flex-col items-center text-center space-y-4 group hover:border-emerald-100 transition-all duration-500 shadow-sm shadow-[#d9cfb0]/10">
                    <div className="w-16 h-16 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#1c1917]/30 group-hover:text-emerald-500 border border-[#d9cfb0] transition-all">
                        <CheckBadgeIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-5xl font-black text-[#1c1917] tracking-tight">{completedThisWeek}</p>
                        <p className="text-[10px] font-black text-[#1c1917]/40 uppercase tracking-widest mt-2">Completed</p>
                    </div>
                </div>
            </div>

            {/* Upcoming Meetings & Performance Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-1 bg-accent-500 rounded-full"></span>
                        <h3 className="text-xl font-black text-[#1c1917] tracking-tight">Upcoming Syncs</h3>
                    </div>
                    <div className="card bg-white border-[#e5dec9] p-2 overflow-hidden shadow-sm shadow-[#d9cfb0]/10">
                        <MeetingList
                            meetings={allMeetings}
                            projectId=""
                            currentUser={user}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-1 bg-accent-500 rounded-full"></span>
                        <h3 className="text-xl font-black text-[#1c1917] tracking-tight">Performance</h3>
                    </div>
                    <div className="bg-white border border-[#e5dec9] rounded-[2rem] p-6 shadow-sm shadow-[#d9cfb0]/10 overflow-hidden h-full">
                        <MemberPerformance />
                    </div>
                </div>
            </div>

            {/* Tasks Repository */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-1 bg-accent-500 rounded-full"></span>
                        <h3 className="text-3xl font-black text-[#1c1917] tracking-tight">Recent Tasks</h3>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#e5dec9] text-[#1c1917]/30 hover:text-accent-500 transition-all shadow-sm">
                            <ArrowPathIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {activeTasks.map((task: any) => (
                        <div key={task.id} className="card bg-white border-[#e5dec9] shadow-sm shadow-[#d9cfb0]/10 group hover:border-[#d97757]/30 transition-all duration-500 overflow-hidden !p-0">
                            <div className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className={`badge ${task.priority === 'high' ? 'bg-[#d97757]/10 text-[#d97757] border-[#d97757]/20' :
                                            task.priority === 'medium' ? 'badge-warning' :
                                                'bg-[#f7f3ed] text-[#1c1917]/40 border-[#e5dec9]'
                                            }`}>
                                            {task.priority || 'NORMAL'}
                                        </span>
                                        <span className="text-[10px] font-black text-[#1c1917]/40 uppercase tracking-wider flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-accent-500"></span>
                                            {task.project?.name}
                                        </span>
                                    </div>
                                    <h4 className="text-xl font-black text-[#1c1917] tracking-tight group-hover:text-accent-500 transition-colors">
                                        {task.title}
                                    </h4>
                                    <p className="text-[#1c1917]/60 text-sm font-medium max-w-2xl line-clamp-1 italic">
                                        {task.description || 'No additional details provided.'}
                                    </p>
                                </div>

                                <div className="flex items-center gap-10 shrink-0">
                                    <div className="text-right space-y-1">
                                        <div className="flex items-center gap-2 justify-end text-[11px] font-bold text-[#1c1917]/30 uppercase tracking-wide">
                                            <ClockIcon className="w-4 h-4 text-accent-500" />
                                            {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'UNSET'}
                                        </div>
                                    </div>

                                    <div className="h-10 w-px bg-[#e5dec9] hidden lg:block"></div>

                                    <Link
                                        href={`/member/tasks/${task.id}`}
                                        className="btn-secondary !px-6 !py-2.5 !text-xs !rounded-xl !border-[#e5dec9]"
                                    >
                                        View Task
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {activeTasks.length === 0 && (
                        <div className="py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-[#e5dec9]">
                            <CheckBadgeIcon className="w-16 h-16 text-[#e5dec9] mx-auto mb-4" />
                            <h3 className="text-xl font-black text-[#1c1917] tracking-tight">Repository Clean</h3>
                            <p className="text-[#1c1917]/40 text-sm font-medium mt-1">All tasks have been synchronized.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
