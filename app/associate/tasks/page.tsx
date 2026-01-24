import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function AssociateTasksPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== 'associate') {
        redirect('/login');
    }

    const supabase = await createClient();

    // Fetch tasks managed by or assigned to the associate
    const { data: tasks } = await supabase
        .from('tasks')
        .select(`
            *,
            project:projects(name),
            assigned_user:users!tasks_assigned_to_fkey(full_name)
        `)
        .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-[#1c1917] tracking-tight">Managed Tasks</h1>
                <p className="text-[#1c1917]/60 mt-2 font-medium">Tasks you've created or are assigned to</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {tasks && tasks.length > 0 ? (
                    tasks.map((task: any) => (
                        <div key={task.id} className="card p-6 hover:border-beige-300 transition-all">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-[#1c1917] mb-2">{task.title}</h3>
                                    <p className="text-sm text-[#1c1917]/60 mb-4">{task.description}</p>
                                    <div className="flex items-center gap-4 text-xs font-bold text-[#1c1917]/40">
                                        <span>Project: {task.project?.name || 'N/A'}</span>
                                        <span>•</span>
                                        <span>Assigned to: {task.assigned_user?.full_name || 'Unassigned'}</span>
                                    </div>
                                </div>
                                <span className={`badge ${task.status === 'completed' ? 'badge-success' :
                                        task.status === 'in_progress' ? 'badge-warning' :
                                            'badge-info'
                                    }`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 border-2 border-dashed border-beige-200 rounded-[2rem] text-center text-[#1c1917]/30 font-bold uppercase text-sm tracking-widest">
                        No tasks found
                    </div>
                )}
            </div>
        </div>
    );
}
