'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';
import { logAudit } from '@/lib/audit';
import { handleActionError, successResponse } from '@/lib/errors';

export async function createProject(projectData: { name: string; description?: string; end_date: string; priority?: string }) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const { name, description, end_date, priority = 'medium' } = projectData;

    if (!name || !end_date) {
        return handleActionError({ message: 'Required fields missing', status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('projects')
        .insert({
            name,
            description,
            start_date: new Date().toISOString(),
            end_date,
            priority,
            status: 'active',
            created_by: currentUser.id,
        })
        .select()
        .single();

    if (error) return handleActionError(error);

    await logAudit({
        action_type: 'PROJECT_CREATED',
        resource_type: 'project',
        resource_id: data.id,
        details: { name: data.name }
    });

    revalidatePath('/admin/projects');
    return successResponse(data);
}

export async function updateProject(projectId: string, data: any) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from('projects')
        .update(data)
        .eq('id', projectId);

    if (error) return handleActionError(error);

    revalidatePath('/admin/projects');
    return successResponse();
}

export async function assignUserToProject(projectId: string, userId: string, role: string) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from('user_projects')
        .insert({
            project_id: projectId,
            user_id: userId,
            role,
        });

    if (error) return handleActionError(error);

    revalidatePath('/admin/projects');
    return successResponse();
}

export async function removeUserFromProject(projectId: string, userId: string) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from('user_projects')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', userId);

    if (error) return handleActionError(error);

    revalidatePath('/admin/projects');
    return successResponse();
}

export async function archiveProject(projectId: string) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from('projects')
        .update({ status: 'archived' })
        .eq('id', projectId);

    if (error) return handleActionError(error);

    await logAudit({
        action_type: 'PROJECT_ARCHIVED',
        resource_type: 'project',
        resource_id: projectId
    });

    revalidatePath('/admin/projects');
    revalidatePath(`/admin/projects/${projectId}`);
    return successResponse();
}

export async function restoreProject(projectId: string) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from('projects')
        .update({
            status: 'active',
            deleted_at: null
        })
        .eq('id', projectId);

    if (error) return handleActionError(error);

    await logAudit({
        action_type: 'PROJECT_RESTORED',
        resource_type: 'project',
        resource_id: projectId
    });

    revalidatePath('/admin/projects');
    revalidatePath(`/admin/projects/${projectId}`);
    return successResponse();
}

export async function deleteProjectSoft(projectId: string) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from('projects')
        .update({
            deleted_at: new Date().toISOString()
        })
        .eq('id', projectId);

    if (error) return handleActionError(error);

    await logAudit({
        action_type: 'PROJECT_DELETED_SOFT',
        resource_type: 'project',
        resource_id: projectId
    });

    revalidatePath('/admin/projects');
    return successResponse();
}

export async function exportProjectData(projectId: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabase = await createClient();
    const { data: project } = await supabase
        .from('projects')
        .select(`*, tasks(*), sprints(*)`)
        .eq('id', projectId)
        .single();

    if (!project) return handleActionError({ message: 'Project not found', status: 404 });

    await logAudit({
        action_type: 'PROJECT_DATA_EXPORTED',
        resource_type: 'project',
        resource_id: projectId
    });

    // Simple CSV conversion
    const headers = ['Type', 'Title/Name', 'Status', 'Priority', 'Start Date', 'End Date'];
    const rows = [
        ['PROJECT', project.name, project.status, project.priority, project.start_date, project.end_date]
    ];

    project.sprints?.forEach((s: any) => {
        rows.push(['SPRINT', s.name, s.status, '', s.start_date, s.end_date]);
    });

    project.tasks?.forEach((t: any) => {
        rows.push(['TASK', t.title, t.status, t.priority, '', t.deadline || '']);
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    return successResponse({
        csv: csvContent,
        fileName: `${project.name.replace(/\s+/g, '_')}_export.csv`
    });
}
