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
    if (!user) return handleActionError({ message: 'Unauthorized', status: 401 });

    const supabase = await createClient();

    // 1. Dependency Check
    const { data: blockers, error: blockerError } = await supabase
        .from('task_dependencies')
        .select('blocked_by_id')
        .eq('task_id', taskId);

    if (blockerError) return handleActionError(blockerError);
    if (blockers && blockers.length > 0) {
        return handleActionError({ message: 'Task is blocked by another task and cannot be moved.', code: 'BLOCKED' });
    }

    // 2. Fetch Column Details (always needed for mapping status)
    const { data: column, error: colError } = await supabase
        .from('kanban_columns')
        .select('name, wip_limit')
        .eq('id', newColumnId)
        .single();

    if (colError) return handleActionError(colError);

    // 3. WIP Limit Check (unless isForce is true for Admins)
    if (!isForce && column.wip_limit) {
        const { count, error: countError } = await supabase
            .from('tasks')
            .select('*', { count: 'exact', head: true })
            .eq('kanban_column_id', newColumnId);

        if (countError) return handleActionError(countError);
        if (count && count >= column.wip_limit) {
            return handleActionError({ message: `WIP Limit exceeded for column "${column.name}".`, code: 'WIP_LIMIT_EXCEEDED' });
        }
    }

    // 4. Map Column Name to Status
    const columnName = column.name.toLowerCase();
    let newStatus = 'in_progress'; // default

    if (columnName.includes('done') || columnName.includes('completed') || columnName.includes('resolved')) {
        newStatus = 'completed';
    } else if (columnName.includes('todo') || columnName.includes('backlog')) {
        newStatus = 'not_started';
    } else if (columnName.includes('blocked')) {
        newStatus = 'blocked';
    } else if (columnName.includes('progress') || columnName.includes('review') || columnName.includes('test')) {
        newStatus = 'in_progress';
    }

    // 5. Update task with both Column ID and mapped Status
    const { error } = await supabase
        .from('tasks')
        .update({
            kanban_column_id: newColumnId,
            status: newStatus,
            updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

    if (error) return handleActionError(error);

    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath(`/associate/projects/${projectId}`);
    revalidatePath(`/member/dashboard`);
    revalidatePath(`/member/tasks`);

    return successResponse();
}

export async function addTaskDependency(taskId: string, blockedById: string, projectId: string) {
    const user = await getCurrentUser();
    if (!user) return handleActionError({ message: 'Unauthorized', status: 401 });

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
    if (!user) return handleActionError({ message: 'Unauthorized', status: 401 });

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
    if (!user) return handleActionError({ message: 'Unauthorized', status: 401 });

    const supabase = await createClient();

    // Validate required fields
    if (!data.project_id || !data.title) {
        return handleActionError({ message: 'Project ID and title are required', status: 400 });
    }

    // Get the first kanban column for this project
    let columnId = data.kanban_column_id;
    if (!columnId) {
        const { data: columns, error: colError } = await supabase
            .from('kanban_columns')
            .select('id')
            .eq('project_id', data.project_id)
            .order('order_index', { ascending: true })
            .limit(1);

        if (colError) return handleActionError(colError);
        if (!columns || columns.length === 0) {
            return handleActionError({ message: 'No kanban columns found for this project', status: 400 });
        }
        columnId = columns[0].id;
    }

    // Prepare task data with proper defaults
    const taskData = {
        project_id: data.project_id,
        title: data.title,
        description: data.description || null,
        assigned_to: data.assigned_to || null,
        priority: data.priority || 'medium',
        status: 'not_started', // Always start as not_started
        kanban_column_id: columnId,
        sprint_id: data.sprint_id || null,
        due_date: data.due_date || null,
        created_by: user.id,
        order_index: data.order_index || 0
    };

    const { error } = await supabase
        .from('tasks')
        .insert(taskData);

    if (error) return handleActionError(error);

    revalidatePath(`/admin/projects/${data.project_id}`);
    revalidatePath(`/associate/projects/${data.project_id}`);
    revalidatePath(`/member/dashboard`);
    revalidatePath(`/member/tasks`);

    return successResponse();
}


export async function assignTask(taskId: string, userId: string) {
    const user = await getCurrentUser();
    if (!user) return handleActionError({ message: 'Unauthorized', status: 401 });

    const supabase = await createClient();

    const { error } = await supabase
        .from('tasks')
        .update({
            assigned_to: userId || null,
            updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

    if (error) return handleActionError(error);

    await logAudit({
        action_type: 'TASK_REASSIGNED',
        resource_type: 'task',
        resource_id: taskId,
        details: { new_assignee_id: userId }
    });

    revalidatePath(`/admin/tasks/${taskId}`);
    revalidatePath(`/member/dashboard`);
    revalidatePath(`/member/tasks`);
    return successResponse();
}
export async function deleteTask(taskId: string, projectId: string) {
    const user = await getCurrentUser();
    if (!user) return handleActionError({ message: 'Unauthorized', status: 401 });

    const supabase = await createClient();
    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

    if (error) return handleActionError(error);

    revalidatePath(`/admin/projects/${projectId}`);
    return successResponse();
}
