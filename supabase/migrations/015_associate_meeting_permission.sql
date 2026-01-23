-- Add permission flag to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS can_schedule_meetings BOOLEAN DEFAULT false;

-- Update RLS for meetings to check this new permission for associates
DROP POLICY IF EXISTS "Associates can manage project meetings" ON public.meetings;

CREATE POLICY "Associates can manage project meetings" ON public.meetings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.user_projects up ON u.id = up.user_id
            WHERE u.id = auth.uid() 
            AND up.project_id = meetings.project_id 
            AND u.role = 'associate'
            AND u.can_schedule_meetings = true
        )
    );

-- Log this change in audit logs if needed
INSERT INTO public.audit_logs (action_type, resource_type, resource_id, details)
VALUES ('SCHEMA_UPGRADED', 'system', '00000000-0000-0000-0000-000000000000', '{"info": "Added can_schedule_meetings permission for Associates"}');
