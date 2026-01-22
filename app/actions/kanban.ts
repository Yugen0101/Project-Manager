'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

export async function getProjectColumns(projectId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('kanban_columns')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true });

    if (error) return { error: error.message };
    return { columns: data };
}

export async function updateColumnWIP(columnId: string, wipLimit: number | null, projectId: string) {
    const user = await getCurrentUser();
    if (!user || user.role === 'member') return { error: 'Unauthorized' };

    const supabase = await createClient();
    const { error } = await supabase
        .from('kanban_columns')
        .update({ wip_limit: wipLimit })
        .eq('id', columnId);

    if (error) return { error: error.message };

    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath(`/associate/projects/${projectId}`);
    return { success: true };
}

export async function createCustomColumn(projectId: string, name: string, orderIndex: number) {
    const user = await getCurrentUser();
    if (!user || user.role === 'member') return { error: 'Unauthorized' };

    const supabase = await createClient();
    const { error } = await supabase
        .from('kanban_columns')
        .insert({
            project_id: projectId,
            name,
            order_index: orderIndex
        });

    if (error) return { error: error.message };

    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath(`/associate/projects/${projectId}`);
    return { success: true };
}

export async function deleteColumn(columnId: string, projectId: string) {
    const user = await getCurrentUser();
    if (!user || user.role === 'member') return { error: 'Unauthorized' };

    const supabase = await createClient();

    // Check if column has tasks
    const { count, error: countError } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('kanban_column_id', columnId);

    if (countError) return { error: countError.message };
    if (count && count > 0) return { error: 'Cannot delete column with active tasks. Move tasks first.' };

    const { error } = await supabase
        .from('kanban_columns')
        .delete()
        .eq('id', columnId);

    if (error) return { error: error.message };

    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath(`/associate/projects/${projectId}`);
    return { success: true };
}
