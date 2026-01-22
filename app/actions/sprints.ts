'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

export async function createSprint(projectId: string, data: any) {
    const user = await getCurrentUser();
    if (!user || user.role === 'member') return { error: 'Unauthorized' };

    const supabase = await createClient();

    const { error } = await supabase
        .from('sprints')
        .insert({
            ...data,
            project_id: projectId,
            status: 'planned'
        });

    if (error) {
        if (error.message.includes('Only one active sprint')) {
            return { error: 'There is already an active sprint for this project.' };
        }
        return { error: error.message };
    }

    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath(`/associate/projects/${projectId}`);

    return { success: true };
}

export async function updateSprintStatus(sprintId: string, status: string, projectId: string) {
    const user = await getCurrentUser();
    if (!user || user.role === 'member') return { error: 'Unauthorized' };

    const supabase = await createClient();

    const { error } = await supabase
        .from('sprints')
        .update({ status })
        .eq('id', sprintId);

    if (error) {
        if (error.message.includes('Only one active sprint')) {
            return { error: 'There is already an active sprint for this project.' };
        }
        return { error: error.message };
    }

    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath(`/associate/projects/${projectId}`);

    return { success: true };
}

export async function addTasksToSprint(sprintId: string | null, taskIds: string[], projectId: string) {
    const user = await getCurrentUser();
    if (!user || user.role === 'member') return { error: 'Unauthorized' };

    const supabase = await createClient();
    const { error } = await supabase
        .from('tasks')
        .update({ sprint_id: sprintId })
        .in('id', taskIds);

    if (error) return { error: error.message };

    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath(`/associate/projects/${projectId}`);
    return { success: true };
}
