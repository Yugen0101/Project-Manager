import { format } from 'date-fns';
import {
    ClipboardDocumentListIcon,
    CalendarIcon,
    UserIcon,
    TagIcon,
    ArrowPathIcon,
    MagnifyingGlassIcon,
    ChevronRightIcon,
    Squares2X2Icon,
    MapIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Pagination from '@/components/ui/Pagination';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function AdminTasksPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string, status?: string }>;
}) {
    const { page, status: filterStatus = 'all' } = await searchParams;
    const currentPage = parseInt(page || '1');
    const pageSize = 15;
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;

    const supabase = await createAdminClient();

    let query = supabase
        .from('tasks')
        .select(`
            *,
            project:projects!project_id(name),
            assigned_user:users!assigned_to(full_name, email)
        `, { count: 'exact' });

    if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
    }

    const { data: tasks, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

    const totalPages = Math.ceil((count || 0) / pageSize);

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                        <ClipboardDocumentListIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <div>
                            <h1 className="text-3xl font-semibold text-secondary-900 tracking-tight">Task List</h1>
                            <p className="text-secondary-400 text-sm font-normal mt-1">
                                Overseeing {count || 0} tasks across all organizational projects.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary h-11 px-5 flex items-center gap-2">
                        <ArrowPathIcon className="w-4 h-4" />
                        <span>Refresh List</span>
                    </button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="relative flex-1 w-full lg:max-w-md group">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 group-focus-within:text-primary-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search tasks, projects, or users..."
                        className="input pl-11 w-full"
                    />
                </div>
                <div className="flex items-center p-1 bg-secondary-100 rounded-xl">
                    {[
                        { label: 'All Tasks', value: 'all' },
                        { label: 'In Progress', value: 'in_progress' },
                        { label: 'Completed', value: 'completed' }
                    ].map((tab) => (
                        <Link
                            key={tab.value}
                            href={`/admin/tasks?status=${tab.value}`}
                            className={`px-6 py-2 rounded-lg text-xs font-medium transition-all ${filterStatus === tab.value ? 'bg-white text-secondary-900 shadow-sm' : 'text-secondary-500 hover:text-secondary-900'}`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Tasks Table Card */}
            <div className="card p-0 overflow-hidden">
                <div className="p-8 border-b border-border bg-secondary-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-secondary-900 uppercase tracking-widest flex items-center gap-2">
                        <MapIcon className="w-5 h-5 text-primary-600" />
                        Live Tasks
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.5)]"></span>
                        <span className="text-[10px] font-medium text-secondary-400 uppercase tracking-widest">Live Updates</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-border text-[10px] font-medium uppercase text-secondary-400 tracking-widest">
                                <th className="px-8 py-5">Task Name</th>
                                <th className="px-8 py-5">Project</th>
                                <th className="px-8 py-5">Assignee</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Deadline</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {tasks?.map((task) => (
                                <tr key={task.id} className="hover:bg-secondary-50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="max-w-[300px]">
                                            <p className="text-sm font-medium text-secondary-900 group-hover:text-primary-600 transition-colors truncate">{task.title}</p>
                                            <p className="text-[11px] font-normal text-secondary-400 mt-1 line-clamp-1">{task.description || 'No additional details provided.'}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[10px] font-medium text-secondary-900 bg-secondary-100 px-3 py-1 rounded-lg border border-border">
                                            {task.project?.name || 'Global'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        {task.assigned_user ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center font-medium text-xs group-hover:bg-primary-600 group-hover:text-white transition-all">
                                                    {task.assigned_user.full_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-secondary-900">{task.assigned_user.full_name}</p>
                                                    <p className="text-[10px] font-normal text-secondary-400">{task.assigned_user.email}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-[11px] font-medium text-secondary-300 italic">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`badge ${task.status === 'completed' ? 'badge-success' :
                                            task.status === 'in_progress' ? 'badge-info' :
                                                'badge-warning'
                                            }`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-xs font-medium text-secondary-500">
                                            <CalendarIcon className="w-4 h-4 text-primary-500" />
                                            {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'No Date'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Link
                                            href={`/admin/tasks/${task.id}`}
                                            className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-secondary-300 hover:text-primary-600 hover:shadow-soft transition-all border border-transparent hover:border-border"
                                        >
                                            <ChevronRightIcon className="w-5 h-5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {error && (
                    <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl mx-8 mb-8 border border-red-200">
                        <p className="font-bold">System Error: Unable to retrieve tasks.</p>
                        <code className="text-xs mt-2 block bg-red-100 p-2 rounded">{JSON.stringify(error, null, 2)}</code>
                    </div>
                )}
                {(!tasks || tasks.length === 0) && !error && (
                    <div className="py-24 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-secondary-50 rounded-full flex items-center justify-center text-secondary-200 mb-6">
                            <ClipboardDocumentListIcon className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-secondary-900">No tasks found</h3>
                        <p className="text-xs font-medium text-secondary-400 uppercase tracking-widest mt-2">There are currently no tasks to show.</p>
                    </div>
                )}
            </div>

            <div className="flex justify-center pt-8">
                <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
        </div>
    );
}
