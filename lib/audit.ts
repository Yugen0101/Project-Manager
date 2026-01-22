import { createClient } from '@/lib/supabase/server';

export async function logAudit({
    action_type,
    resource_type,
    resource_id,
    details = {},
}: {
    action_type: string;
    resource_type: string;
    resource_id: string;
    details?: any;
}) {
    const supabase = await createClient();

    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 2. Insert log
    await supabase.from('audit_logs').insert({
        user_id: user.id,
        action_type,
        resource_type,
        resource_id,
        details,
        // IP address can be added if available from headers, but for now we omit
    });
}
