import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import {
    PlusIcon,
    FolderIcon,
    CalendarIcon,
    UserGroupIcon,
    ChevronRightIcon,
    MagnifyingGlassIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import Pagination from '@/components/ui/Pagination';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function AdminProjectsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string, page?: string }>;
}) {
    const { status: filterStatus = 'active', page } = await searchParams;
    const currentPage = parseInt(page || '1');
    const pageSize = 9; // Grid 3x3
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;
    const supabase = await createAdminClient();

    // Fetch projects with counts
    let query = supabase
        .from('projects')
        .select(`
            *,
            tasks:tasks(count),
            user_projects:user_projects(id)
        `, { count: 'exact' })
        .is('deleted_at', null); // Hide soft deleted by default

    if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
    }

    const { data: projects, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

    const totalPages = Math.ceil((count || 0) / pageSize);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#1c1917] tracking-tight uppercase">PROJECT <span className="text-[#d97757]">REPOSITORY</span></h1>
                    <p className="text-[#1c1917]/40 font-black uppercase tracking-[0.3em] text-[10px] mt-2">Global Operations Control Layer</p>
                </div>
                <Link href="/admin/projects/new" className="btn-primary flex items-center gap-2 self-start md:self-auto py-3 px-8">
                    <PlusIcon className="w-5 h-5" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Initial Project</span>
                </Link>
            </div>

            {/* Stats and filters bar */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="relative flex-1 group">
                    <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1c1917]/30 transition-colors group-focus-within:text-[#d97757]" />
                    <input
                        type="text"
                        placeholder="Scan project headers..."
                        className="input pl-14 py-4 bg-white"
                    />
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/projects?status=active"
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${filterStatus === 'active' ? 'bg-[#d97757] border-[#d97757] text-white shadow-xl shadow-[#d97757]/20' : 'bg-white border-[#e5dec9] text-[#1c1917]/40 hover:text-[#d97757] hover:border-[#d97757]/30'}`}
                    >
                        Active
                    </Link>
                    <Link
                        href="/admin/projects?status=completed"
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${filterStatus === 'completed' ? 'bg-[#d97757] border-[#d97757] text-white shadow-xl shadow-[#d97757]/20' : 'bg-white border-[#e5dec9] text-[#1c1917]/40 hover:text-[#d97757] hover:border-[#d97757]/30'}`}
                    >
                        Finished
                    </Link>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects?.map((project) => (
                    <div key={project.id} className="card bg-white border-[#e5dec9] group hover:border-[#d97757]/50 transition-all duration-500 hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-[#f7f3ed] rounded-xl flex items-center justify-center text-[#d97757] border border-[#e5dec9] group-hover:bg-[#d97757] group-hover:text-white transition-all duration-500">
                                <FolderIcon className="w-6 h-6" />
                            </div>
                            <span className={`badge ${project.status === 'active' ? 'badge-success' :
                                project.status === 'completed' ? 'badge-info' : 'badge-warning'
                                }`}>
                                {project.status}
                            </span>
                        </div>

                        <h3 className="text-xl font-black text-[#1c1917] mb-3 tracking-tight group-hover:text-[#d97757] transition-colors uppercase">
                            {project.name}
                        </h3>
                        <p className="text-[#1c1917]/50 text-xs font-semibold leading-relaxed mb-8 h-10 line-clamp-2 italic">
                            {project.description || 'Global operational parameters pending.'}
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#1c1917]/40 gap-3">
                                <UserGroupIcon className="w-4 h-4 text-[#d97757]" />
                                <span>{project.user_projects?.length || 0} Assets Deployed</span>
                            </div>
                            <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#1c1917]/40 gap-3">
                                <PlusIcon className="w-4 h-4 text-[#d97757]" />
                                <span>{project.tasks?.[0]?.count || 0} Total Vectors</span>
                            </div>
                            <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#1c1917]/40 gap-3">
                                <CalendarIcon className="w-4 h-4 text-[#d97757]" />
                                <span>Target: {format(new Date(project.end_date), 'MMM dd, yyyy')}</span>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-3 mb-8">
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-[#1c1917]/30">
                                <span>EFFICIENCY</span>
                                <span className="text-[#d97757]">65%</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#f7f3ed] rounded-full overflow-hidden border border-[#e5dec9]">
                                <div className="h-full bg-[#d97757] rounded-full" style={{ width: '65%' }}></div>
                            </div>
                        </div>

                        <Link
                            href={`/admin/projects/${project.id}`}
                            className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#d97757] hover:text-[#c26242] w-full pt-6 border-t border-[#e5dec9] transition-all group-hover:gap-4"
                        >
                            Sync Parameters
                            <ChevronRightIcon className="w-4 h-4" />
                        </Link>
                    </div>
                ))}

                {(!projects || projects.length === 0) && (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-[#e5dec9]">
                        <div className="w-20 h-20 bg-[#f7f3ed] rounded-full flex items-center justify-center text-[#1c1917]/20 mb-6">
                            <FolderIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-[#1c1917] tracking-tight uppercase">Repository Empty</h3>
                        <p className="text-[11px] font-black text-[#1c1917]/40 uppercase tracking-[0.2em] mt-2 mb-8">Initialize first project node</p>
                        <Link href="/admin/projects/new" className="btn-primary flex items-center gap-2 px-10 py-4">
                            <PlusIcon className="w-5 h-5" />
                            <span className="text-[11px]">New Project</span>
                        </Link>
                    </div>
                )}
            </div>

            <div className="mt-12 flex justify-center">
                <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
        </div>
    );
}
