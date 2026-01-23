import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import Image from 'next/image';

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
        <div className="min-h-screen bg-[#fdfcf9] text-[#1c1917]">
            {/* Minimal Public Header */}
            <header className="bg-white/80 border-b border-[#e5dec9] px-10 py-5 sticky top-0 z-50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10">
                            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-[#1c1917] tracking-tight uppercase leading-tight">
                                {project.name}
                            </h1>
                            <p className="text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.2em] mt-1 italic">
                                External Operations Board • Synchronous Access
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-5 py-2 bg-[#f7f3ed] text-[#d97757] text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-[#e5dec9] shadow-inner">
                            Live Telemetry
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-10 h-[calc(100vh-81px)]">
                <KanbanBoard
                    initialTasks={tasks || []}
                    initialColumns={columns || []}
                    projectId={project.id}
                    role="member"
                    isReadOnly={true}
                />
            </main>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
        </div>
    );
}
