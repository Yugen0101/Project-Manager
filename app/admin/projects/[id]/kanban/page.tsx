import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import {
    PlusIcon,
    FunnelIcon,
    Squares2X2Icon,
    ListBulletIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default async function AdminProjectKanbanPage({ params }: { params: Promise<{ id: string }> }) {
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
            tasks:tasks(
                *, 
                assigned_user:users(*),
                dependencies:task_dependencies(blocked_by_id)
            ),
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
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        <Link href="/admin/projects" className="hover:text-primary-600 transition-colors">Projects</Link>
                        <span>/</span>
                        <Link href={`/admin/projects/${id}`} className="hover:text-primary-600 transition-colors uppercase">{project.name}</Link>
                        <span>/</span>
                        <span className="text-slate-900">Board Oversight</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Squares2X2Icon className="w-7 h-7 text-primary-600" />
                        Admin Board View
                    </h1>
                </div>
            </div>

            {/* Board Container */}
            <div className="flex-1 overflow-hidden">
                <KanbanBoard
                    initialTasks={tasks}
                    initialColumns={columns}
                    projectId={id}
                    role="admin"
                />
            </div>
        </div>
    );
}
