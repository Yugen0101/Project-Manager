'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentUser } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';
import { logAudit } from '@/lib/audit';
import { handleActionError, successResponse } from '@/lib/errors';

export async function createUser(userData: any) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return { error: 'Unauthorized' };
    }

    const { email, full_name, role, password } = userData;

    if (!email || !full_name || !role || !password) {
        return { error: 'All fields are required' };
    }

    // Use Admin Client for auth management
    const supabaseAdmin = await createAdminClient();

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name }
    });

    if (authError) {
        return { error: authError.message };
    }

    // Create user profile
    const { error: profileError } = await supabaseAdmin
        .from('users')
        .insert({
            id: authData.user.id,
            email,
            full_name: full_name,
            role,
            is_active: true,
        });

    if (profileError) {
        // Cleanup auth user if profile creation fails
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        return handleActionError(profileError);
    }

    revalidatePath('/admin/users');
    return successResponse();
}

export async function toggleUserStatus(userId: string, isActive: boolean) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return { error: 'Unauthorized' };
    }

    const supabaseAdmin = await createAdminClient();

    const { error } = await supabaseAdmin
        .from('users')
        .update({ is_active: isActive })
        .eq('id', userId);

    if (error) return handleActionError(error);

    await logAudit({
        action_type: isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
        resource_type: 'user',
        resource_id: userId
    });

    revalidatePath('/admin/users');
    return successResponse();
}

export async function resetUserPassword(userId: string) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return { error: 'Unauthorized' };
    }

    const supabaseAdmin = await createAdminClient();

    // Generate a reset password link (or set a temp password)
    // For now, we'll just demonstrate the capability by setting a random password
    const tempPassword = Math.random().toString(36).slice(-10);

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: tempPassword
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true, tempPassword };
}

export async function deleteUser(userId: string) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return { error: 'Unauthorized' };
    }

    const supabaseAdmin = await createAdminClient();

    // SOFT DELETE: Update DB only
    const { error } = await supabaseAdmin
        .from('users')
        .update({
            deleted_at: new Date().toISOString(),
            is_active: false
        })
        .eq('id', userId);

    if (error) {
        return { error: error.message };
    }

    await logAudit({
        action_type: 'USER_DELETED_SOFT',
        resource_type: 'user',
        resource_id: userId
    });

    revalidatePath('/admin/users');
    return { success: true };
}

export async function restoreUser(userId: string) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return { error: 'Unauthorized' };
    }

    const supabaseAdmin = await createAdminClient();

    const { error } = await supabaseAdmin
        .from('users')
        .update({
            deleted_at: null,
            is_active: true
        })
        .eq('id', userId);

    if (error) {
        return { error: error.message };
    }

    await logAudit({
        action_type: 'USER_RESTORED',
        resource_type: 'user',
        resource_id: userId
    });

    revalidatePath('/admin/users');
    return { success: true };
}
