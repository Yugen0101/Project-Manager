'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export interface User {
    id: string;
    email: string;
    full_name: string;
    role: 'admin' | 'associate' | 'member' | 'guest';
    is_active: boolean;
    can_schedule_meetings: boolean;
}

// Get current authenticated user with role
export async function getCurrentUser(): Promise<User | null> {
    const supabase = await createClient();

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
        return null;
    }

    // Use admin client to bypass RLS
    const adminClient = await createAdminClient();

    const { data: userData, error: userError } = await adminClient
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

    if (userError || !userData) {
        return null;
    }

    return {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role,
        is_active: userData.is_active,
        can_schedule_meetings: userData.can_schedule_meetings || false,
    };
}

// Check if user has access to a project
export async function hasProjectAccess(userId: string, projectId: string): Promise<boolean> {
    const adminClient = await createAdminClient();

    // Check if user is admin
    const { data: userData } = await adminClient
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

    if (userData?.role === 'admin') {
        return true;
    }

    // Check if user is assigned to project
    const { data: assignment } = await adminClient
        .from('user_projects')
        .select('id')
        .eq('user_id', userId)
        .eq('project_id', projectId)
        .single();

    return !!assignment;
}

// Check if user has access to a task
export async function hasTaskAccess(userId: string, taskId: string): Promise<boolean> {
    const adminClient = await createAdminClient();

    // Check if user is admin
    const { data: userData } = await adminClient
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

    if (userData?.role === 'admin') {
        return true;
    }

    // Get task details
    const { data: task } = await adminClient
        .from('tasks')
        .select('project_id, assigned_to')
        .eq('id', taskId)
        .single();

    if (!task) {
        return false;
    }

    // Check if task is assigned to user
    if (task.assigned_to === userId) {
        return true;
    }

    // Check if user has access to the project
    return hasProjectAccess(userId, task.project_id);
}
