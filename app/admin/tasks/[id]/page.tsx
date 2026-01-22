import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import {
    ClockIcon,
    CalendarIcon,
    UserIcon,
    ChevronLeftIcon,
    ArrowPathIcon,
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import TaskComments from '@/components/collaboration/TaskComments';
import ActivityFeed from '@/components/activity/ActivityFeed';

export default async function AdminTaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
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

    const { data: task, error } = await supabase
        .from('tasks')
        .select(`
            *,
            project:projects(id, name),
            assignee:users!tasks_assigned_to_fkey(*)
        `)
        .eq('id', id)
        .single();

    if (error || !task) {
        return notFound();
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Admin Header & Actions */}
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/admin/projects/${task.project.id}`}
                        className="p-2 bg-slate-50 text-slate-400 hover:text-primary-600 rounded-xl transition-all"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            Project: {task.project.name}
                        </div>
                        <h1 className="text-2xl font-black text-slate-900">Task Management</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary py-2.5 flex items-center gap-2">
                        <PencilSquareIcon className="w-4 h-4" />
                        Edit Task
                    </button>
                    <button className="p-2.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="card p-8 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                    task.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                    {task.priority || 'medium'} Priority
                                </span>
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                    task.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                                        'bg-slate-100 text-slate-700'
                                    }`}>
                                    {task.status?.replace('_', ' ') || 'todo'}
                                </span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 leading-tight">
                                {task.title}
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
                                <p className="text-sm font-bold text-slate-700">{task.status || 'To Do'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Due Date</p>
                                <p className="text-sm font-bold text-slate-700">
                                    {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No Date'}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Created</p>
                                <p className="text-sm font-bold text-slate-700">{format(new Date(task.created_at), 'MMM d')}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Owner</p>
                                <p className="text-sm font-bold text-slate-700">{task.assignee?.full_name?.split(' ')[0] || 'Member'}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Description</h3>
                            <div className="p-6 bg-white border border-slate-100 rounded-2xl text-slate-600 leading-relaxed font-medium">
                                {task.description || 'No detailed description was provided for this task.'}
                            </div>
                        </div>
                    </div>

                    {/* Collaboration Section */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-slate-900">Team Discussion</h3>
                        <TaskComments taskId={id} projectPath={`/admin/projects/${task.project.id}`} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Activity Feed */}
                    <div className="card p-0 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                            <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm uppercase tracking-widest">
                                <ArrowPathIcon className="w-5 h-5 text-primary-600" />
                                Audit log
                            </h3>
                        </div>
                        <div className="p-6">
                            <ActivityFeed taskId={id} />
                        </div>
                    </div>

                    {/* Assignment Card */}
                    <div className="card p-6 space-y-6 bg-primary-600 text-white border-0 shadow-xl shadow-primary-900/20">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-200">Task Assignee</h4>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl font-black text-white border border-white/30">
                                    {task.assignee?.full_name?.charAt(0) || '?'}
                                </div>
                                <div>
                                    <p className="text-lg font-black">{task.assignee?.full_name || 'Unassigned'}</p>
                                    <p className="text-[10px] font-bold text-primary-200 uppercase tracking-widest">Active Contributor</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full py-4 bg-white text-primary-600 font-black rounded-2xl hover:bg-slate-50 transition-colors shadow-lg shadow-black/10">
                            Reassign User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
