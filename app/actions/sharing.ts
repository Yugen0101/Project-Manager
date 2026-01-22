'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { logAudit } from '@/lib/audit';
import { handleActionError, successResponse } from '@/lib/errors';
import { getCurrentUser } from '@/lib/auth/session';

export async function generateShareLink(projectId: string) {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
        return handleActionError({ message: 'Only admins can share projects', status: 401 });
    }

    const supabase = await createClient();

    // 1. Generate a secure token
    const token = crypto.randomUUID();

    // 2. Update project
    const { error } = await supabase
        .from('projects')
        .update({
            is_public: true,
            share_token: token
        })
        .eq('id', projectId);

    if (error) return handleActionError(error);

    await logAudit({
        action_type: 'PROJECT_SHARE_ENABLED',
        resource_type: 'project',
        resource_id: projectId,
        details: { token }
    });

    revalidatePath(`/admin/projects/${projectId}`);
    return successResponse({ token });
}

export async function revokeShareLink(projectId: string) {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
        return handleActionError({ message: 'Only admins can revoke share links', status: 401 });
    }

    const supabase = await createClient();

    // 1. Update project
    const { error } = await supabase
        .from('projects')
        .update({
            is_public: false,
            share_token: null
        })
        .eq('id', projectId);

    if (error) return handleActionError(error);

    await logAudit({
        action_type: 'PROJECT_SHARE_DISABLED',
        resource_type: 'project',
        resource_id: projectId
    });

    revalidatePath(`/admin/projects/${projectId}`);
    return successResponse();
}
