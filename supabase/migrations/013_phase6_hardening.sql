-- Phase 6: Production Hardening - Data Integrity & Soft Deletes

-- 1. Add deleted_at columns
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- 2. Update Projects RLS Policies
-- We need to ensure non-admins don't see softly deleted projects.

-- Drop existing Select policies for projects
DROP POLICY IF EXISTS "Users can view projects they are members of" ON public.projects;
DROP POLICY IF EXISTS "Anyone can view public project" ON public.projects;

-- Recreate with soft delete check
CREATE POLICY "Users can view projects they are members of" ON public.projects
    FOR SELECT USING (
        deleted_at IS NULL AND (
            EXISTS (SELECT 1 FROM public.user_projects WHERE user_id = auth.uid() AND project_id = id)
        )
    );

CREATE POLICY "Anyone can view public project" ON public.projects
    FOR SELECT USING (deleted_at IS NULL AND is_public = true);

-- Admins can still see everything (including deleted) for restoration
-- Existing "Admins can manage all projects" covers this.

-- 3. Update Tasks RLS Policies
DROP POLICY IF EXISTS "Users can view tasks of assigned projects" ON public.tasks;
DROP POLICY IF EXISTS "Anyone can view tasks of public project" ON public.tasks;

CREATE POLICY "Users can view tasks of assigned projects" ON public.tasks
    FOR SELECT USING (
        deleted_at IS NULL AND (
            EXISTS (SELECT 1 FROM public.user_projects WHERE user_id = auth.uid() AND project_id = tasks.project_id)
        )
    );

CREATE POLICY "Anyone can view tasks of public project" ON public.tasks
    FOR SELECT USING (
        deleted_at IS NULL AND (
            EXISTS (
                SELECT 1 FROM public.projects 
                WHERE projects.id = tasks.project_id 
                AND projects.is_public = true
                AND projects.deleted_at IS NULL
            )
        )
    );

-- 4. Prevent non-admins from updating deleted items
DROP POLICY IF EXISTS "Members can update their assigned tasks" ON public.tasks;
CREATE POLICY "Members can update their assigned tasks" ON public.tasks
  FOR UPDATE USING (
    deleted_at IS NULL AND
    assigned_to = auth.uid() AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role != 'guest')
  );

-- 5. Users Table: Ensure non-admins only see active users
DROP POLICY IF EXISTS "Users can view all active users" ON public.users;
CREATE POLICY "Users can view all active users" ON public.users
    FOR SELECT USING (deleted_at IS NULL);

-- 6. Add Audit Logging for soft delete actions (handled in app layer, but we ensure columns exist)
-- (IP Address was already in audit_logs from 011)

-- 7. Audit Log Security: Ensure logs are immutable (Only SELECT allowed for admins)
DROP POLICY IF EXISTS "No one can update audit logs" ON public.audit_logs;
CREATE POLICY "No one can update audit logs" ON public.audit_logs
    FOR UPDATE USING (false);

DROP POLICY IF EXISTS "No one can delete audit logs" ON public.audit_logs;
CREATE POLICY "No one can delete audit logs" ON public.audit_logs
    FOR DELETE USING (false);

-- 8. Performance Indexes for Production
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);

CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON public.projects(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_deleted_at ON public.tasks(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON public.users(deleted_at) WHERE deleted_at IS NULL;
