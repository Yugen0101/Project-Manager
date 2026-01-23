import { format } from 'date-fns';
import {
    ClipboardDocumentListIcon,
    CalendarIcon,
    UserIcon,
    TagIcon,
    ArrowPathIcon,
    MagnifyingGlassIcon,
    ChevronRightIcon
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
            project:projects(name),
            assigned_user:users(full_name, email)
        `, { count: 'exact' })
        .is('deleted_at', null);

    if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
    }

    const { data: tasks, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

    const totalPages = Math.ceil((count || 0) / pageSize);

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-[#1c1917] tracking-tighter uppercase flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#d97757] border border-[#e5dec9]">
                            <ClipboardDocumentListIcon className="w-7 h-7" />
                        </div>
                        TASK REGISTRY
                    </h1>
                    <p className="text-[#1c1917]/40 mt-3 font-black uppercase tracking-[0.2em] text-[11px]">
                        Global Operational Node: {count || 0} Registered Vectors
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1c1917]/40 border border-[#e5dec9] px-6 py-3 rounded-xl bg-white hover:bg-[#f7f3ed] transition-all flex items-center gap-2">
                        <ArrowPathIcon className="w-4 h-4" />
                        Reflow Registry
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="relative flex-1 group">
                    <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1c1917]/30 transition-colors group-focus-within:text-[#d97757]" />
                    <input
                        type="text"
                        placeholder="Scan registry by name or project node..."
                        className="input pl-14 py-4 bg-white"
                    />
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/tasks?status=all"
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${filterStatus === 'all' ? 'bg-[#d97757] border-[#d97757] text-white shadow-xl shadow-[#d97757]/20' : 'bg-white border-[#e5dec9] text-[#1c1917]/40 hover:text-[#d97757] hover:border-[#d97757]/30'}`}
                    >
                        Aggregate
                    </Link>
                    <Link
                        href="/admin/tasks?status=in_progress"
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${filterStatus === 'in_progress' ? 'bg-[#d97757] border-[#d97757] text-white shadow-xl shadow-[#d97757]/20' : 'bg-white border-[#e5dec9] text-[#1c1917]/40 hover:text-[#d97757] hover:border-[#d97757]/30'}`}
                    >
                        Active
                    </Link>
                    <Link
                        href="/admin/tasks?status=completed"
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${filterStatus === 'completed' ? 'bg-[#d97757] border-[#d97757] text-white shadow-xl shadow-[#d97757]/20' : 'bg-white border-[#e5dec9] text-[#1c1917]/40 hover:text-[#d97757] hover:border-[#d97757]/30'}`}
                    >
                        Resolved
                    </Link>
                </div>
            </div>

            <div className="card bg-white border-[#e5dec9] overflow-hidden shadow-2xl shadow-[#d9cfb0]/20 rounded-[2rem]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f7f3ed]/50 border-b border-[#e5dec9]">
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-[#1c1917]/30 tracking-[0.2em] italic font-serif">Registry Entry</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-[#1c1917]/30 tracking-[0.2em] italic font-serif">Project Node</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-[#1c1917]/30 tracking-[0.2em] italic font-serif">Asset Allocation</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-[#1c1917]/30 tracking-[0.2em] italic font-serif">State</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-[#1c1917]/30 tracking-[0.2em] italic font-serif">Target Chronos</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-[#1c1917]/30 tracking-[0.2em] italic font-serif"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f7f3ed]">
                            {tasks?.map((task) => (
                                <tr key={task.id} className="hover:bg-[#fdfcf9] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div>
                                            <p className="text-sm font-black text-[#1c1917] group-hover:text-[#d97757] transition-all uppercase tracking-tight">{task.title}</p>
                                            <p className="text-[10px] font-semibold text-[#1c1917]/40 italic truncate max-w-[200px] mt-1">{task.description || 'Parameters pending.'}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[10px] font-black uppercase text-[#1c1917]/60 tracking-widest bg-[#f7f3ed] px-3 py-1 rounded-full border border-[#e5dec9]">
                                            {task.project?.name || 'ROOT'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        {task.assigned_user ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-[#f7f3ed] rounded-xl flex items-center justify-center text-[10px] font-black text-[#d97757] border border-[#e5dec9] shadow-inner group-hover:bg-[#d97757] group-hover:text-white transition-all">
                                                    {task.assigned_user.full_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-[#1c1917] tracking-tight uppercase">{task.assigned_user.full_name}</p>
                                                    <p className="text-[9px] text-[#1c1917]/30 font-black uppercase tracking-tighter italic">{task.assigned_user.email}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-black text-[#1c1917]/20 uppercase tracking-widest italic leading-none">Unallocated</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`badge ${task.status === 'completed' ? 'badge-success' :
                                            task.status === 'in_progress' ? 'badge-info' :
                                                'badge-warning'
                                            }`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3 text-[10px] font-black text-[#1c1917]/40 uppercase tracking-widest italic">
                                            <CalendarIcon className="w-3.5 h-3.5 text-[#d97757]" />
                                            {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'Floating'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Link
                                            href={`/admin/tasks/${task.id}`}
                                            className="w-10 h-10 bg-[#f7f3ed] rounded-xl flex items-center justify-center text-[#1c1917]/10 hover:text-[#d97757] hover:border-[#d97757]/40 transition-all border border-transparent"
                                        >
                                            <ChevronRightIcon className="w-5 h-5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {(!tasks || tasks.length === 0) && (
                    <div className="py-32 flex flex-col items-center justify-center bg-[#fdfcf9]">
                        <div className="w-20 h-20 bg-[#f7f3ed] rounded-full flex items-center justify-center text-[#1c1917]/20 mb-6">
                            <ClipboardDocumentListIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-[#1c1917] tracking-tight uppercase">Registry Void</h3>
                        <p className="text-[11px] font-black text-[#1c1917]/40 uppercase tracking-[0.2em] mt-2 italic">Zero entries detected in the operational quadrant.</p>
                    </div>
                )}
            </div>

            <div className="flex justify-center pt-8">
                <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
        </div>
    );
}
