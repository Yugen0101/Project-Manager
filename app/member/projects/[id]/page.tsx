import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { notFound, redirect } from 'next/navigation';
import {
    CalendarIcon,
    UserGroupIcon,
    ArrowPathIcon,
    ListBulletIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import Link from 'next/link';
import SprintManager from '@/components/sprint/SprintManager';
import ProjectInsights from '@/components/analytics/ProjectInsights';
import TeamWorkload from '@/components/analytics/TeamWorkload';
import { getCurrentUser } from '@/lib/auth/session';

export default async function MemberProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const user = await getCurrentUser();

    if (!user) redirect('/login');

    // Fetch project with tasks, sprints, and assigned users
    // Use admin client to ensure visibility if RLS is tight, but we'll check membership
    const supabaseAdmin = await createAdminClient();

    const { data: project, error: projectError } = await supabaseAdmin
        .from('projects')
        .select(`
            *,
            tasks:tasks(*),
            sprints:sprints(*),
            user_projects:user_projects(*, users(*))
        `)
        .eq('id', id)
        .single();

    if (projectError || !project) {
        return notFound();
    }

    // Verify membership
    const isMember = project.user_projects?.some((up: any) => up.user_id === user.id);
    if (!isMember && user.role !== 'admin') {
        return notFound();
    }

    const tasks = project.tasks || [];
    const sprints = project.sprints || [];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Project Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Link href="/member/projects" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d97757] hover:underline">Projects</Link>
                        <span className="text-[#e5dec9]">/</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1c1917]/40 italic">{project.name}</span>
                    </div>
                    <h1 className="text-4xl font-black text-[#1c1917] tracking-tighter uppercase">{project.name}</h1>
                    <p className="text-[#1c1917]/60 max-w-2xl font-medium leading-relaxed">{project.description || 'Mission parameters pending.'}</p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <Link href={`/member/projects/${id}/kanban`} className="btn-primary flex items-center gap-2 py-4 px-8 rounded-2xl shadow-xl shadow-[#d97757]/20">
                        <ArrowPathIcon className="w-5 h-5" />
                        Execution Board
                    </Link>
                </div>
            </div>

            {/* Dynamic Project Insights */}
            <ProjectInsights projectId={id} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
                {/* Main Content: Sprint & Backlog Management */}
                <div className="lg:col-span-2 space-y-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-px bg-[#d97757]"></span>
                            <h3 className="text-xl font-black text-[#1c1917] tracking-tight uppercase">Operational Streams</h3>
                        </div>
                        <SprintManager
                            projectId={id}
                            sprints={sprints}
                            tasks={tasks}
                            members={project.user_projects || []}
                        />
                    </div>
                </div>

                {/* Sidebar: Metadata & Team */}
                <div className="space-y-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-px bg-[#d97757]"></span>
                            <h3 className="text-xl font-black text-[#1c1917] tracking-tight uppercase">Resource Allocation</h3>
                        </div>
                        <TeamWorkload projectId={id} />

                        <div className="card bg-white border-[#e5dec9] p-8 rounded-[2rem] shadow-sm space-y-6">
                            <div className="space-y-1 text-center">
                                <p className="text-[9px] font-black text-[#1c1917]/20 uppercase tracking-[0.4em]">Project Personnel</p>
                                <div className="flex flex-wrap justify-center gap-3 pt-4">
                                    {project.user_projects?.map((up: any) => (
                                        <div key={up.user_id} className="group relative">
                                            <div className="w-10 h-10 rounded-xl bg-[#f7f3ed] border border-[#e5dec9] flex items-center justify-center text-xs font-black text-[#d97757] hover:bg-[#d97757] hover:text-white transition-all transform hover:-rotate-6 cursor-help">
                                                {up.users?.full_name?.charAt(0) || 'U'}
                                            </div>
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-[#1c1917] text-white text-[9px] font-black uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                {up.users?.full_name || 'Unknown'}
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
