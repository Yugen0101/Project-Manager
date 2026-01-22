'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { logAudit } from '@/lib/audit';

export async function generateShareLink(projectId: string) {
    const supabase = await createClient();

    // 1. Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') return { error: 'Only admins can share projects' };

    // 2. Generate a secure token
    const token = crypto.randomUUID();

    // 3. Update project
    const { error } = await supabase
        .from('projects')
        .update({
            is_public: true,
            share_token: token
        })
        .eq('id', projectId);

    if (error) return { error: error.message };

    await logAudit({
        action_type: 'PROJECT_SHARE_ENABLED',
        resource_type: 'project',
        resource_id: projectId,
        details: { token }
    });

    revalidatePath(`/admin/projects/${projectId}`);
    return { success: true, token };
}

export async function revokeShareLink(projectId: string) {
    const supabase = await createClient();

    // 1. Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') return { error: 'Only admins can revoke share links' };

    // 2. Update project
    const { error } = await supabase
        .from('projects')
        .update({
            is_public: false,
            share_token: null
        })
        .eq('id', projectId);

    if (error) return { error: error.message };

    await logAudit({
        action_type: 'PROJECT_SHARE_DISABLED',
        resource_type: 'project',
        resource_id: projectId
    });

    revalidatePath(`/admin/projects/${projectId}`);
    return { success: true };
}
