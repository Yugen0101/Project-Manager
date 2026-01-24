import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FolderIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default async function AssociateProjectsPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== 'associate') {
        redirect('/login');
    }

    const supabase = await createClient();

    // Fetch projects assigned to the associate
    const { data: userProjects } = await supabase
        .from('user_projects')
        .select(`
            project:projects(
                *,
                created_by_user:users!projects_created_by_fkey(full_name)
            )
        `)
        .eq('user_id', user.id);

    const projects = userProjects?.map((up: any) => up.project) || [];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-[#1c1917] tracking-tight">My Projects</h1>
                    <p className="text-[#1c1917]/60 mt-2 font-medium">Projects you're assigned to</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects && projects.length > 0 ? (
                    projects.map((project: any) => (
                        <Link
                            key={project.id}
                            href={`/associate/projects/${project.id}`}
                            className="card p-6 group hover:border-beige-300 transition-all cursor-pointer"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-beige-100 rounded-xl flex items-center justify-center text-accent-600 border border-beige-200 group-hover:bg-accent-50 transition-all">
                                    <FolderIcon className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-[#1c1917] mb-2 group-hover:text-accent-600 transition-colors uppercase tracking-tight">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-[#1c1917]/60 line-clamp-2 mb-3">
                                        {project.description || 'No description'}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className={`badge ${project.status === 'active' ? 'badge-success' :
                                                project.status === 'completed' ? 'badge-info' :
                                                    'badge-warning'
                                            }`}>
                                            {project.status}
                                        </span>
                                        <ChevronRightIcon className="w-5 h-5 text-[#1c1917]/20 group-hover:text-accent-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full py-12 border-2 border-dashed border-beige-200 rounded-[2rem] text-center">
                        <div className="max-w-md mx-auto space-y-4">
                            <div className="w-20 h-20 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FolderIcon className="w-10 h-10 text-[#1c1917]/30" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1c1917]">No Projects Assigned</h3>
                            <p className="text-[#1c1917]/60">
                                You haven't been assigned to any projects yet. Contact your administrator to get started.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
