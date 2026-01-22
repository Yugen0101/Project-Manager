import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import KanbanBoard from '@/components/kanban/KanbanBoard';

export default async function PublicProjectPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token } = await params;
    const supabase = await createClient();

    // 1. Fetch project by token
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('share_token', token)
        .eq('is_public', true)
        .single();

    if (projectError || !project) {
        return notFound();
    }

    // 2. Fetch columns
    const { data: columns } = await supabase
        .from('kanban_columns')
        .select('*')
        .eq('project_id', project.id)
        .order('order_index');

    // 3. Fetch tasks
    const { data: tasks } = await supabase
        .from('tasks')
        .select(`
            *,
            assigned_user:users!tasks_assigned_to_fkey(full_name, email),
            sprint:sprints(name, status)
        `)
        .eq('project_id', project.id);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Minimal Public Header */}
            <header className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-200">
                            P
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 leading-tight">
                                {project.name}
                            </h1>
                            <p className="text-xs font-medium text-slate-500">
                                Public Project Board • Read Only
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-primary-50 text-primary-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-100">
                            Live View
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 lg:p-8 h-[calc(100-73px)]">
                <KanbanBoard
                    initialTasks={tasks || []}
                    initialColumns={columns || []}
                    projectId={project.id}
                    role="member"
                    isReadOnly={true}
                />
            </main>
        </div>
    );
}
