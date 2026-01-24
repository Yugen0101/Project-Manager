import { createAdminClient } from '@/lib/supabase/admin';
import { notFound, redirect } from 'next/navigation';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import {
    Squares2X2Icon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';

export default async function MemberProjectKanbanPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) redirect('/login');

    const supabase = await createAdminClient();

    // Fetch project, its tasks, and columns
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .select(`
            *,
            tasks:tasks(*),
            columns:kanban_columns(*),
            user_projects:user_projects(*, users(*))
        `)
        .eq('id', id)
        .single();

    if (projectError || !project) {
        return notFound();
    }

    // Verify membership
    const isMember = project.user_projects.some((up: any) => up.user_id === user.id);
    if (!isMember && user.role !== 'admin') {
        return notFound();
    }

    const tasks = project.tasks || [];
    const columns = project.columns?.sort((a: any, b: any) => a.order_index - b.order_index) || [];

    return (
        <div className="h-[calc(100vh-160px)] flex flex-col space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#1c1917]/30 mb-2">
                        <Link href="/member/projects" className="hover:text-[#d97757] transition-colors">Projects</Link>
                        <span>/</span>
                        <Link href={`/member/projects/${id}`} className="hover:text-[#d97757] transition-colors italic">{project.name}</Link>
                        <span>/</span>
                        <span className="text-[#1c1917] font-serif">Board Execution</span>
                    </div>
                    <h1 className="text-3xl font-black text-[#1c1917] tracking-tighter uppercase flex items-center gap-3">
                        <Squares2X2Icon className="w-8 h-8 text-[#d97757]" />
                        Operational Matrix
                    </h1>
                </div>
                <Link href={`/member/projects/${id}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#1c1917]/40 hover:text-[#d97757] transition-all group">
                    <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Overview
                </Link>
            </div>

            {/* Board Container */}
            <div className="flex-1 overflow-hidden">
                <KanbanBoard
                    initialTasks={tasks}
                    initialColumns={columns}
                    projectId={id}
                    members={project.user_projects || []}
                    role="member"
                />
            </div>
        </div>
    );
}
