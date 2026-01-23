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
        .eq('assigned_to', user.id)
        .is('deleted_at', null);

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
                    <h1 className="text-4xl font-black text-[#1c1917] tracking-tighter uppercase flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#d97757] border border-[#e5dec9]">
                            <ClipboardDocumentListIcon className="w-7 h-7" />
                        </div>
                        WORKSPACE
                    </h1>
                    <p className="text-[#1c1917]/40 mt-3 font-black uppercase tracking-[0.2em] text-[11px]">
                        Active Resonance: {tasks?.filter(t => t.status !== 'completed').length || 0} Critical Vectors
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex border-b border-[#e5dec9] gap-10">
                <Link
                    href="/member/tasks?status=all"
                    className={`pb-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${filterStatus === 'all' ? 'text-[#d97757]' : 'text-[#1c1917]/30 hover:text-[#d97757]/60'}`}
                >
                    Registry
                    {filterStatus === 'all' && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#d97757] rounded-full"></div>}
                </Link>
                <Link
                    href="/member/tasks?status=in_progress"
                    className={`pb-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${filterStatus === 'in_progress' ? 'text-[#d97757]' : 'text-[#1c1917]/30 hover:text-[#d97757]/60'}`}
                >
                    In Progress
                    {filterStatus === 'in_progress' && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#d97757] rounded-full"></div>}
                </Link>
                <Link
                    href="/member/tasks?status=completed"
                    className={`pb-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${filterStatus === 'completed' ? 'text-[#d97757]' : 'text-[#1c1917]/30 hover:text-[#d97757]/60'}`}
                >
                    Resolved
                    {filterStatus === 'completed' && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#d97757] rounded-full"></div>}
                </Link>
            </div>

            {/* Task Cards/List */}
            <div className="grid grid-cols-1 gap-6">
                {tasks?.map((task) => (
                    <div key={task.id} className="group bg-white border border-[#e5dec9] rounded-3xl p-8 hover:shadow-2xl hover:shadow-[#d9cfb0]/20 hover:border-[#d97757]/30 transition-all duration-500">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="px-3 py-1 bg-[#f7f3ed] text-[9px] font-black uppercase text-[#1c1917]/40 rounded-full border border-[#e5dec9] tracking-widest italic font-serif">
                                        {task.project?.name}
                                    </span>
                                    <span className={`badge ${task.status === 'completed' ? 'badge-success' :
                                        task.status === 'in_progress' ? 'badge-info' :
                                            'badge-warning'
                                        }`}>
                                        {task.status}
                                    </span>
                                </div>
                                <h3 className="text-xl font-black text-[#1c1917] mb-2 tracking-tight group-hover:text-[#d97757] transition-colors uppercase">
                                    {task.title}
                                </h3>
                                <p className="text-[#1c1917]/40 text-xs font-semibold line-clamp-1 italic">
                                    {task.description || 'Global operational parameters pending.'}
                                </p>
                            </div>

                            <div className="flex items-center gap-10 shrink-0">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[9px] font-black uppercase text-[#1c1917]/30 tracking-widest mb-2">TARGET DATE</p>
                                    <div className="flex items-center gap-2 text-sm font-black text-[#1c1917]">
                                        {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'Indeterminate'}
                                    </div>
                                </div>
                                <Link
                                    href={`/member/tasks/${task.id}`}
                                    className="w-12 h-12 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#1c1917]/20 group-hover:bg-[#d97757] group-hover:text-white transition-all duration-500 border border-[#e5dec9]"
                                >
                                    <ChevronRightIcon className="w-6 h-6" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {(!tasks || tasks.length === 0) && (
                    <div className="py-32 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-[#e5dec9]">
                        <div className="w-20 h-20 bg-[#f7f3ed] rounded-full flex items-center justify-center text-[#1c1917]/20 mb-6">
                            <ClipboardDocumentListIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-[#1c1917] tracking-tight uppercase">Registry Idle</h3>
                        <p className="text-[11px] font-black text-[#1c1917]/40 uppercase tracking-[0.2em] mt-2 italic text-center">Zero critical vectors detected. Operations nominal.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
