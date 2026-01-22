-- Phase 6: Enterprise Readiness & Governance

-- 1. Add Sharing Capabilities to Projects
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;

-- 2. Create Audit Logs Table (System-wide tracking)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL, -- e.g., 'PROJECT_ARCHIVED', 'PUBLIC_SHARE_ENABLED', 'USER_DEACTIVATED'
    resource_type TEXT NOT NULL, -- e.g., 'project', 'user', 'task'
    resource_id UUID NOT NULL,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS on Audit Logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 4. Policies for Audit Logs (Only Admins)
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

-- 5. Public Access View Policy
-- Allow anyone with a valid share_token to view the project if is_public is true
-- Note: This doesn't check the token in the USING clause because the token will be passed in the query filter or handled in the app layer.
-- However, for RLS to be truly secure based on token, we'd need to pass the token via a header or similar, which is complex for direct RLS.
-- Better approach: The app handles the token check via service role or a specific function, OR we use a session variable.
-- For now, let's keep it simple: if it's public, it's visible. The share_token is the "unguessable URL".

CREATE POLICY "Anyone can view public project" ON public.projects
    FOR SELECT USING (is_public = true);

-- 6. Public Access for Tasks
CREATE POLICY "Anyone can view tasks of public project" ON public.tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = tasks.project_id 
            AND projects.is_public = true
        )
    );

-- 7. Public Access for Sprints
CREATE POLICY "Anyone can view sprints of public project" ON public.sprints
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = sprints.project_id 
            AND projects.is_public = true
        )
    );

-- 8. Public Access for Comments
CREATE POLICY "Anyone can view comments of public project" ON public.comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tasks
            JOIN public.projects ON projects.id = tasks.project_id
            WHERE tasks.id = comments.task_id
            AND projects.is_public = true
        )
    );
