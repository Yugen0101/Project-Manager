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
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Project Management</h1>
                    <p className="text-slate-500 mt-1">Manage and monitor all organizational projects.</p>
                </div>
                <Link href="/admin/projects/new" className="btn-primary flex items-center gap-2 self-start md:self-auto">
                    <PlusIcon className="w-5 h-5" />
                    New Project
                </Link>
            </div>

            {/* Stats and filters bar */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search projects by name or owner..."
                        className="input pl-10 w-full"
                    />
                </div>
                <div className="flex gap-2">
                    <Link
                        href="/admin/projects?status=active"
                        className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${filterStatus === 'active' ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        Active
                    </Link>
                    <Link
                        href="/admin/projects?status=completed"
                        className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${filterStatus === 'completed' ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        Completed
                    </Link>
                    <Link
                        href="/admin/projects?status=archived"
                        className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${filterStatus === 'archived' ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        Archived
                    </Link>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects?.map((project) => (
                    <div key={project.id} className="card group hover:border-primary-200 transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
                                <FolderIcon className="w-6 h-6 text-primary-600" />
                            </div>
                            <span className={`badge ${project.status === 'active' ? 'badge-success' :
                                project.status === 'completed' ? 'badge-info' : 'badge-slate'
                                }`}>
                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mb-2 truncate group-hover:text-primary-600 transition-colors">
                            {project.name}
                        </h3>
                        <p className="text-slate-600 text-sm line-clamp-2 mb-6 h-10">
                            {project.description || 'No description provided.'}
                        </p>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center text-sm text-slate-500 gap-2">
                                <UserGroupIcon className="w-4 h-4" />
                                <span>{project.user_projects?.length || 0} Members assigned</span>
                            </div>
                            <div className="flex items-center text-sm text-slate-500 gap-2">
                                <PlusIcon className="w-4 h-4" />
                                <span>{project.tasks?.[0]?.count || 0} Total tasks</span>
                            </div>
                            <div className="flex items-center text-sm text-slate-500 gap-2">
                                <CalendarIcon className="w-4 h-4" />
                                <span>Due {format(new Date(project.end_date), 'MMM d, yyyy')}</span>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-xs font-semibold text-slate-600">
                                <span>Progress</span>
                                <span>65%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary-500" style={{ width: '65%' }}></div>
                            </div>
                        </div>

                        <Link
                            href={`/admin/projects/${project.id}`}
                            className="flex items-center justify-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 w-full pt-4 border-t border-slate-100"
                        >
                            View Details
                            <ChevronRightIcon className="w-4 h-4 text-primary-500" />
                        </Link>
                    </div>
                ))}

                {(!projects || projects.length === 0) && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-slate-200">
                        <FolderIcon className="w-12 h-12 text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">No projects found</h3>
                        <p className="text-slate-500 mb-6">Start by creating your first organizational project.</p>
                        <Link href="/admin/projects/new" className="btn-primary flex items-center gap-2">
                            <PlusIcon className="w-5 h-5" />
                            Create Project
                        </Link>
                    </div>
                )}
            </div>

            <div className="mt-8">
                <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
        </div>
    );
}
