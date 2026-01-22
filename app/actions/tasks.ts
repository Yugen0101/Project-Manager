'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';
import { logAudit } from '@/lib/audit';
import { handleActionError, successResponse } from '@/lib/errors';

export async function updateTaskStatus(
    taskId: string,
    newColumnId: string,
    projectId: string,
    isForce: boolean = false
) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const supabase = await createClient();

    // 1. Dependency Check: Is this task blocked?
    const { data: blockers, error: blockerError } = await supabase
        .from('task_dependencies')
        .select('blocked_by_id')
        .eq('task_id', taskId);

    if (blockerError) return handleActionError(blockerError);
    if (blockers && blockers.length > 0) {
        return { error: 'Task is blocked by another task and cannot be moved.' };
    }

    // 2. WIP Limit Check (unless isForce is true for Admins)
    if (!isForce) {
        const { data: column, error: colError } = await supabase
            .from('kanban_columns')
            .select('wip_limit, name')
            .eq('id', newColumnId)
            .single();

        if (colError) return handleActionError(colError);

        if (column.wip_limit) {
            const { count, error: countError } = await supabase
                .from('tasks')
                .select('*', { count: 'exact', head: true })
                .eq('kanban_column_id', newColumnId);

            if (countError) return handleActionError(countError);
            if (count && count >= column.wip_limit) {
                return { error: `WIP Limit exceeded for column "${column.name}".` };
            }
        }
    }

    // 3. Update task
    const { error } = await supabase
        .from('tasks')
        .update({
            kanban_column_id: newColumnId,
            // Keep old column string for backward compatibility trigger/logic if any
            updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

    if (error) return handleActionError(error);

    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath(`/associate/projects/${projectId}`);
    revalidatePath(`/member/dashboard`);

    return successResponse();
}

export async function addTaskDependency(taskId: string, blockedById: string, projectId: string) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const supabase = await createClient();
    const { error } = await supabase
        .from('task_dependencies')
        .insert({ task_id: taskId, blocked_by_id: blockedById });

    if (error) return handleActionError(error);

    revalidatePath(`/admin/projects/${projectId}`);
    return successResponse();
}

export async function removeTaskDependency(taskId: string, blockedById: string, projectId: string) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const supabase = await createClient();
    const { error } = await supabase
        .from('task_dependencies')
        .delete()
        .match({ task_id: taskId, blocked_by_id: blockedById });

    if (error) return handleActionError(error);

    revalidatePath(`/admin/projects/${projectId}`);
    return successResponse();
}

export async function createTask(data: any) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const supabase = await createClient();

    // If no column ID provided, use common 'Backlog' or 'To Do'
    let columnId = data.kanban_column_id;
    if (!columnId) {
        const { data: columns } = await supabase
            .from('kanban_columns')
            .select('id')
            .eq('project_id', data.project_id)
            .order('order_index', { ascending: true })
            .limit(1);

        columnId = columns?.[0]?.id;
    }

    const { error } = await supabase
        .from('tasks')
        .insert({
            ...data,
            kanban_column_id: columnId,
            created_by: user.id,
            status: 'not_started'
        });

    if (error) return handleActionError(error);

    revalidatePath(`/admin/projects/${data.project_id}`);
    revalidatePath(`/associate/projects/${data.project_id}`);

    return successResponse();
}

export async function deleteTaskSoft(taskId: string, projectId: string) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const supabase = await createClient();

    const { error } = await supabase
        .from('tasks')
        .update({
            deleted_at: new Date().toISOString()
        })
        .eq('id', taskId);

    if (error) return handleActionError(error);

    await logAudit({
        action_type: 'TASK_DELETED_SOFT',
        resource_type: 'task',
        resource_id: taskId,
        details: { project_id: projectId }
    });

    revalidatePath(`/admin/projects/${projectId}`);
    return successResponse();
}

export async function restoreTask(taskId: string, projectId: string) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const supabase = await createClient();

    const { error } = await supabase
        .from('tasks')
        .update({
            deleted_at: null
        })
        .eq('id', taskId);

    if (error) return handleActionError(error);

    await logAudit({
        action_type: 'TASK_RESTORED',
        resource_type: 'task',
        resource_id: taskId,
        details: { project_id: projectId }
    });

    revalidatePath(`/admin/projects/${projectId}`);
    return successResponse();
}
