import { format } from 'date-fns';
import {
    ClipboardDocumentListIcon,
    CalendarIcon,
    ArrowPathIcon,
    MagnifyingGlassIcon,
    ChevronRightIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function MemberTasksPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const { status: filterStatus = 'all' } = await searchParams;
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    const supabase = await createClient();

    let query = supabase
        .from('tasks')
        .select(`
            *,
            project:projects(name, status)
        `)
        .eq('assigned_to', user.id);

    if (filterStatus !== 'all') {
        const dbStatus = filterStatus === 'in_progress' ? 'in_progress' :
            filterStatus === 'completed' ? 'completed' :
                filterStatus === 'not_started' ? 'not_started' : 'all';
        if (dbStatus !== 'all') {
            query = query.eq('status', dbStatus);
        }
    }

    const { data: tasks, error } = await query
        .order('due_date', { ascending: true, nullsFirst: false });

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-500 border border-slate-100 shadow-lg shadow-primary-500/5">
                            <ClipboardDocumentListIcon className="w-7 h-7" />
                        </div>
                        Workspace
                    </h1>
                    <p className="text-slate-400 mt-2 font-semibold text-sm">
                        You have {tasks?.filter(t => t.status !== 'completed').length || 0} active tasks requiring attention.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex border-b border-slate-100 gap-10">
                <Link
                    href="/member/tasks?status=all"
                    className={`pb-4 text-sm font-bold transition-all relative ${filterStatus === 'all' ? 'text-primary-500' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    All Tasks
                    {filterStatus === 'all' && <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-primary-500 rounded-full"></div>}
                </Link>
                <Link
                    href="/member/tasks?status=in_progress"
                    className={`pb-4 text-sm font-bold transition-all relative ${filterStatus === 'in_progress' ? 'text-primary-500' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    In Progress
                    {filterStatus === 'in_progress' && <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-primary-500 rounded-full"></div>}
                </Link>
                <Link
                    href="/member/tasks?status=completed"
                    className={`pb-4 text-sm font-bold transition-all relative ${filterStatus === 'completed' ? 'text-primary-500' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Completed
                    {filterStatus === 'completed' && <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-primary-500 rounded-full"></div>}
                </Link>
            </div>

            {/* Task Cards/List */}
            <div className="grid grid-cols-1 gap-6">
                {tasks?.map((task) => (
                    <div key={task.id} className="group bg-white border border-slate-50 shadow-sm rounded-3xl p-8 hover:shadow-xl hover:shadow-secondary-500/5 hover:border-primary-100/50 transition-all duration-500">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="px-3 py-1 bg-slate-50 text-[10px] font-bold uppercase text-slate-400 rounded-lg border border-slate-100 tracking-tight">
                                        {task.project?.name}
                                    </span>
                                    <span className={`badge ${task.status === 'completed' ? 'badge-success' :
                                        task.status === 'in_progress' ? 'badge-info' :
                                            'badge-warning'
                                        }`}>
                                        {task.status?.replace('_', ' ')}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight group-hover:text-primary-500 transition-colors">
                                    {task.title}
                                </h3>
                                <p className="text-slate-500 text-sm font-medium line-clamp-1">
                                    {task.description || 'No description provided.'}
                                </p>
                            </div>

                            <div className="flex items-center gap-10 shrink-0">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-bold uppercase text-slate-300 tracking-wider mb-1">DUE DATE</p>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                        <CalendarIcon className="w-4 h-4 text-slate-300" />
                                        {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'No date'}
                                    </div>
                                </div>
                                <Link
                                    href={`/member/tasks/${task.id}`}
                                    className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-primary-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-all duration-500 border border-slate-100"
                                >
                                    <ChevronRightIcon className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {(!tasks || tasks.length === 0) && (
                    <div className="py-24 flex flex-col items-center justify-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                            <ClipboardDocumentListIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">No tasks found</h3>
                        <p className="text-slate-400 font-medium mt-2 text-center max-w-sm">You're all caught up! Enjoy your free time or check back later for new assignments.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
