'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

export async function getNotifications() {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { success: true, data };
}

export async function markAsRead(notificationId: string) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const supabase = await createClient();
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id); // Ensure ownership

    if (error) return { error: error.message };

    // Path-based revalidation (usually global header)
    revalidatePath('/', 'layout');
    return { success: true };
}

export async function clearAllNotifications() {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const supabase = await createClient();
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id);

    if (error) return { error: error.message };

    revalidatePath('/', 'layout');
    return { success: true };
}

/**
 * Utility to parse @mentions in a comment and create notifications
 * Logic: Extract @[id] or @email or similar. For simplicity here, 
 * we will assume @Full Name format or similar if possible, 
 * but usually this is handled by a sophisticated editor.
 * 
 * For this phase, we will look for "@[UserID]" which is stable.
 */
export async function processMentions(content: string, taskId: string, taskTitle: string) {
    const user = await getCurrentUser();
    if (!user) return;

    const supabase = await createClient();
    const mentionRegex = /@\[([0-9a-fA-F-]+)\]/g;
    let match;
    const notifiedIds = new Set<string>();

    while ((match = mentionRegex.exec(content)) !== null) {
        const mentionedUserId = match[1];
        if (mentionedUserId && mentionedUserId !== user.id) {
            notifiedIds.add(mentionedUserId);
        }
    }

    if (notifiedIds.size > 0) {
        const notifications = Array.from(notifiedIds).map(userId => ({
            user_id: userId,
            title: 'You were mentioned',
            content: `${user.full_name} mentioned you in task: ${taskTitle}`,
            type: 'mention',
            link: `/member/tasks/${taskId}`
        }));

        await supabase.from('notifications').insert(notifications);
    }
}
