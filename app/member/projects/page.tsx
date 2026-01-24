import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import {
    BriefcaseIcon,
    CalendarIcon,
    ChevronRightIcon,
    FolderIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function MemberProjectsPage() {
    const user = await getCurrentUser();
    if (!user) redirect('/login');

    const supabase = await createClient();

    // Fetch projects where the user is a member
    const { data: userProjects, error } = await supabase
        .from('user_projects')
        .select(`
            role,
            project:projects (
                id,
                name,
                description,
                status,
                priority,
                end_date
            )
        `)
        .eq('user_id', user.id);

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-500 border border-slate-100 shadow-lg shadow-primary-500/5">
                        <FolderIcon className="w-7 h-7" />
                    </div>
                    Projects
                </h1>
                <p className="text-slate-400 mt-2 font-semibold text-sm">
                    You are currently collaborating on {userProjects?.length || 0} active projects.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userProjects?.map(({ project, role }: any) => (
                    <div key={project.id} className="group card bg-white border-slate-50 p-8 hover:shadow-xl hover:shadow-secondary-500/5 hover:border-primary-100/50 transition-all duration-500 rounded-[2rem] shadow-sm">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className={`badge ${project.status === 'active' ? 'badge-success' : 'badge-info'}`}>
                                    {project.status}
                                </span>
                                <span className="text-[10px] font-bold text-primary-500 uppercase tracking-tight bg-primary-50 px-2 py-1 rounded-lg border border-primary-100">
                                    {role === 'associate' ? 'Operations Lead' : 'Collaborator'}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-500 transition-colors leading-snug mb-2">
                                    {project.name}
                                </h3>
                                <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
                                    {project.description || 'Project details are being finalized by the lead.'}
                                </p>
                            </div>

                            <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">DEADLINE</p>
                                    <p className="text-xs font-bold text-slate-600 flex items-center gap-2">
                                        <CalendarIcon className="w-3.5 h-3.5 text-slate-300" />
                                        {format(new Date(project.end_date), 'MMM dd, yyyy')}
                                    </p>
                                </div>
                                <Link
                                    href={`/member/projects/${project.id}`}
                                    className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-primary-500 group-hover:text-white transition-all border border-slate-100 shadow-sm"
                                >
                                    <ChevronRightIcon className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {(!userProjects || userProjects.length === 0) && (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                            <BriefcaseIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">No projects assigned</h3>
                        <p className="text-slate-400 font-medium mt-2 text-center max-w-sm">You haven't been assigned to any projects yet. Contact your manager to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
