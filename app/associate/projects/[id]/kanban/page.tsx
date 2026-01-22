import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import {
    PlusIcon,
    FunnelIcon,
    Squares2X2Icon,
    ListBulletIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default async function AssociateProjectKanbanPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
            },
        }
    );

    // Fetch project, its tasks, and columns
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .select(`
            *,
            tasks:tasks(*, assigned_user:users(*)),
            columns:kanban_columns(*)
        `)
        .eq('id', id)
        .single();

    if (projectError || !project) {
        return notFound();
    }

    const tasks = project.tasks || [];
    const columns = project.columns?.sort((a: any, b: any) => a.order_index - b.order_index) || [];

    return (
        <div className="h-[calc(100vh-160px)] flex flex-col space-y-6">
            {/* ... (keep header as is) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        <Link href="/associate/projects" className="hover:text-primary-600 transition-colors">Projects</Link>
                        <span>/</span>
                        <Link href={`/associate/projects/${id}`} className="hover:text-primary-600 transition-colors uppercase">{project.name}</Link>
                        <span>/</span>
                        <span className="text-slate-900">Kanban Board</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Squares2X2Icon className="w-7 h-7 text-primary-600" />
                        Project Board
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-slate-200 rounded-xl p-1 flex gap-1 shadow-sm">
                        <Link
                            href={`/associate/projects/${id}/kanban`}
                            className="p-2 bg-primary-50 text-primary-600 rounded-lg"
                        >
                            <Squares2X2Icon className="w-5 h-5" />
                        </Link>
                        <Link
                            href={`/associate/projects/${id}/tasks`}
                            className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            <ListBulletIcon className="w-5 h-5" />
                        </Link>
                    </div>
                    <button className="btn-primary flex items-center gap-2">
                        <PlusIcon className="w-5 h-5" />
                        New Task
                    </button>
                    <button className="btn-secondary p-2.5">
                        <FunnelIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Board Container */}
            <div className="flex-1 overflow-hidden">
                <KanbanBoard
                    initialTasks={tasks}
                    initialColumns={columns}
                    projectId={id}
                    role="associate"
                />
            </div>
        </div>
    );
}
