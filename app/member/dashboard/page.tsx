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
        <div className="space-y-10">
            {/* Header section with Personal Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-sm font-bold text-purple-600 uppercase tracking-widest">Workspace</h2>
                    <h1 className="text-4xl font-black text-slate-900">Hello, {user?.full_name?.split(' ')[0]}!</h1>
                    <p className="text-slate-500 text-lg font-medium">You have {activeTasks.length} tasks in your queue today.</p>
                </div>

                <div className="flex gap-4">
                    <div className="card p-4 border-slate-100 flex items-center gap-4 bg-purple-50/50">
                        <FireIcon className="w-8 h-8 text-orange-500" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Streak</p>
                            <p className="text-xl font-black text-slate-900">12 Days</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Performance Analytics */}
            <MemberPerformance />

            {/* Focus Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="card p-6 flex flex-col items-center text-center space-y-2 border-b-4 border-b-orange-500">
                    <ClockIcon className="w-8 h-8 text-orange-500" />
                    <h3 className="text-3xl font-black text-slate-900">{activeTasks.length}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase">Todo / In Progress</p>
                </div>
                <div className="card p-6 flex flex-col items-center text-center space-y-2 border-b-4 border-b-red-500">
                    <FireIcon className="w-8 h-8 text-red-500" />
                    <h3 className="text-3xl font-black text-slate-900">{urgentTasks}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase">Urgent Priority</p>
                </div>
                <div className="card p-6 flex flex-col items-center text-center space-y-2 border-b-4 border-b-emerald-500">
                    <CheckBadgeIcon className="w-8 h-8 text-emerald-500" />
                    <h3 className="text-3xl font-black text-slate-900">{completedThisWeek}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase">Tasks Completed</p>
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-slate-900">My Priority Tasks</h3>
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <ArrowPathIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {activeTasks.map((task: any) => (
                        <div key={task.id} className="card group hover:shadow-xl hover:shadow-purple-900/[0.03] transition-all duration-300">
                            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                            task.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {task.priority || 'medium'}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            {task.project?.name}
                                        </span>
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                                        {task.title}
                                    </h4>
                                    <p className="text-slate-500 text-sm line-clamp-1 italic">
                                        {task.description || 'No additional details provided.'}
                                    </p>
                                </div>

                                <div className="flex items-center gap-8 shrink-0">
                                    <div className="text-right">
                                        <div className="flex items-center gap-1.5 justify-end text-sm font-bold text-slate-400">
                                            <ClockIcon className="w-4 h-4" />
                                            {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No date'}
                                        </div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Deadline</p>
                                    </div>

                                    <div className="h-10 w-px bg-slate-100 hidden md:block"></div>

                                    <div className="flex items-center gap-2">
                                        <button className="btn-secondary py-2 border-slate-200 hover:border-purple-300 hover:text-purple-600 bg-white shadow-none text-xs">
                                            Update Status
                                        </button>
                                        <Link
                                            href={`/member/tasks/${task.id}`}
                                            className="p-2.5 bg-slate-50 text-slate-400 hover:bg-purple-600 hover:text-white rounded-xl transition-all"
                                        >
                                            <ChevronRightIcon className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {activeTasks.length === 0 && (
                        <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <CheckBadgeIcon className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900">All caught up!</h3>
                            <p className="text-slate-500 mt-1">You have no pending tasks in your queue.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
