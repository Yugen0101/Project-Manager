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
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const { email, full_name, role, password } = userData;

    if (!email || !full_name || !role || !password) {
        return handleActionError({ message: 'All fields are required', status: 400 });
    }

    // Use Admin Client for auth management
    const supabaseAdmin = await createAdminClient();

    // Create auth user with role and status in metadata for performance
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            full_name,
            role,
            is_active: true
        }
    });

    if (authError) return handleActionError(authError);

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
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabaseAdmin = await createAdminClient();

    // 1. Update public profile
    const { error } = await supabaseAdmin
        .from('users')
        .update({ is_active: isActive })
        .eq('id', userId);

    if (error) return handleActionError(error);

    // 2. Sync with Auth Metadata for performance (Middleware speed)
    await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { is_active: isActive }
    });

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
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabaseAdmin = await createAdminClient();

    // Generate a reset password link (or set a temp password)
    const tempPassword = Math.random().toString(36).slice(-10);

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: tempPassword
    });

    if (error) return handleActionError(error);

    return successResponse({ tempPassword });
}

export async function deleteUser(userId: string) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabaseAdmin = await createAdminClient();

    // 1. Manually delete related data that might block deletion
    // A. Clear user assignments
    await supabaseAdmin.from('user_projects').delete().eq('user_id', userId);

    // B. Clear task-related data (assignments & ownership)
    await supabaseAdmin.from('tasks').delete().or(`assigned_to.eq.${userId},created_by.eq.${userId}`);

    // C. Clear interaction data (comments & notifications)
    await supabaseAdmin.from('comments').delete().eq('user_id', userId);
    await supabaseAdmin.from('notifications').delete().eq('user_id', userId);

    // D. Clear operational nodes (meetings & owned projects)
    await supabaseAdmin.from('meetings').delete().eq('created_by', userId);
    await supabaseAdmin.from('projects').delete().eq('created_by', userId);

    // 2. HARD DELETE: Deleting the auth user should now proceed without FK blocks
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
        console.error('Hard delete error:', error);
        return handleActionError({ message: 'Database error deleting user' });
    }

    await logAudit({
        action_type: 'USER_DELETED_TOTAL',
        resource_type: 'user',
        resource_id: userId
    });

    revalidatePath('/admin/users');
    return successResponse();
}

export async function restoreUser(userId: string) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabaseAdmin = await createAdminClient();

    const { error } = await supabaseAdmin
        .from('users')
        .update({
            is_active: true
        })
        .eq('id', userId);

    if (error) return handleActionError(error);

    // Sync with Auth Metadata
    await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { is_active: true }
    });

    await logAudit({
        action_type: 'USER_RESTORED',
        resource_type: 'user',
        resource_id: userId
    });

    revalidatePath('/admin/users');
    return successResponse();
}

export async function toggleMeetingPermission(userId: string, canSchedule: boolean) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabaseAdmin = await createAdminClient();

    const { error } = await supabaseAdmin
        .from('users')
        .update({ can_schedule_meetings: canSchedule })
        .eq('id', userId);

    if (error) return handleActionError(error);

    await logAudit({
        action_type: canSchedule ? 'PERMISSION_GRANTED' : 'PERMISSION_REVOKED',
        resource_type: 'user',
        resource_id: userId,
        details: { permission: 'can_schedule_meetings' }
    });

    revalidatePath('/admin/users');
    return successResponse();
}

export async function getUsersForMentions() {
    const currentUser = await getCurrentUser();
    if (!currentUser) return handleActionError({ message: 'Unauthorized', status: 401 });

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email')
        .eq('is_active', true);

    if (error) return handleActionError(error);
    return successResponse(data);
}

export async function updateUser(userId: string, data: { full_name?: string; role?: string }) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        return handleActionError({ message: 'Unauthorized', status: 401 });
    }

    const supabaseAdmin = await createAdminClient();

    // 1. Update public profile
    const { error: profileError } = await supabaseAdmin
        .from('users')
        .update(data)
        .eq('id', userId);

    if (profileError) return handleActionError(profileError);

    // 2. Synchronize with auth metadata if provided
    if (data.full_name || data.role) {
        const metadata: any = {};
        if (data.full_name) metadata.full_name = data.full_name;
        if (data.role) metadata.role = data.role;

        await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: metadata
        });
    }

    await logAudit({
        action_type: 'USER_UPDATED',
        resource_type: 'user',
        resource_id: userId,
        details: data
    });

    revalidatePath('/admin/users');
    return successResponse();
}
