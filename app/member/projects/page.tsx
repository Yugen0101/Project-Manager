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
                <h1 className="text-4xl font-black text-[#1c1917] tracking-tighter uppercase flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#d97757] border border-[#e5dec9]">
                        <FolderIcon className="w-7 h-7" />
                    </div>
                    ASSIGNED PROJECTS
                </h1>
                <p className="text-[#1c1917]/40 mt-3 font-black uppercase tracking-[0.2em] text-[11px]">
                    Operational Clusters: {userProjects?.length || 0} Entities
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userProjects?.map(({ project, role }: any) => (
                    <div key={project.id} className="group card bg-white border-[#e5dec9] p-8 hover:shadow-2xl hover:shadow-[#d9cfb0]/20 hover:border-[#d97757]/30 transition-all duration-500 rounded-[2.5rem]">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${project.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                                    }`}>
                                    {project.status}
                                </span>
                                <span className="text-[10px] font-black text-[#d97757] uppercase tracking-[0.2em] italic font-serif">
                                    {role === 'associate' ? 'Operations Lead' : 'Tactical Member'}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-xl font-black text-[#1c1917] group-hover:text-[#d97757] transition-colors uppercase leading-tight mb-2">
                                    {project.name}
                                </h3>
                                <p className="text-[#1c1917]/40 text-xs font-semibold line-clamp-2 italic leading-relaxed">
                                    {project.description || 'Global mission parameters pending.'}
                                </p>
                            </div>

                            <div className="pt-4 flex items-center justify-between border-t border-[#f7f3ed]">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-[#1c1917]/20 uppercase tracking-[0.2em]">Target Chronos</p>
                                    <p className="text-[10px] font-black text-[#1c1917]/60 uppercase tracking-widest flex items-center gap-2">
                                        <CalendarIcon className="w-3.5 h-3.5" />
                                        {format(new Date(project.end_date), 'MMM dd, yyyy')}
                                    </p>
                                </div>
                                <Link
                                    href={`/member/projects/${project.id}`}
                                    className="w-10 h-10 bg-[#f7f3ed] rounded-xl flex items-center justify-center text-[#1c1917]/20 group-hover:bg-[#d97757] group-hover:text-white transition-all border border-[#e5dec9]"
                                >
                                    <ChevronRightIcon className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {(!userProjects || userProjects.length === 0) && (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border-2 border-dashed border-[#e5dec9]">
                        <div className="w-20 h-20 bg-[#f7f3ed] rounded-full flex items-center justify-center text-[#1c1917]/20 mb-6">
                            <BriefcaseIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-[#1c1917] tracking-tight uppercase">Cluster Void</h3>
                        <p className="text-[11px] font-black text-[#1c1917]/40 uppercase tracking-[0.2em] mt-2 italic text-center">No assigned project clusters detected in your sector.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
