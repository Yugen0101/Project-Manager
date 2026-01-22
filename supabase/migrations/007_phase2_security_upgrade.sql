-- Phase 2: Security & RBAC Upgrade
-- This migration implements strict RLS based on the Phase 2 PRD.

-- =====================================================
-- 1. SECURITY HELPER FUNCTIONS
-- =====================================================

-- Updated is_admin to be more efficient
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper to check project membership
CREATE OR REPLACE FUNCTION public.is_project_member(p_project_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_projects
    WHERE user_id = auth.uid() AND project_id = p_project_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper to check if user is an Associate on a project
CREATE OR REPLACE FUNCTION public.is_project_associate(p_project_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_projects
    WHERE user_id = auth.uid() 
      AND project_id = p_project_id 
      AND role = 'associate'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 2. RESET POLICIES
-- =====================================================
DO $$ 
DECLARE 
  t text;
BEGIN
  FOR t IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE 'ALTER TABLE public.' || quote_ident(t) || ' ENABLE ROW LEVEL SECURITY;';
  END LOOP;
END $$;

-- =====================================================
-- 3. USERS TABLE POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Admin can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Admin can insert users" ON public.users;
DROP POLICY IF EXISTS "Admin can update users" ON public.users;
DROP POLICY IF EXISTS "Service role can do anything" ON public.users;

CREATE POLICY "Admin full access" ON public.users
  FOR ALL USING (is_admin());

CREATE POLICY "Users read self" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- =====================================================
-- 4. PROJECTS TABLE POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Admin can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Associates and Members can view assigned projects" ON public.projects;
DROP POLICY IF EXISTS "Admin can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Admin can update projects" ON public.projects;

CREATE POLICY "Admin full access" ON public.projects
  FOR ALL USING (is_admin());

CREATE POLICY "Project members read" ON public.projects
  FOR SELECT USING (is_project_member(id));

-- =====================================================
-- 5. USER_PROJECTS TABLE POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Admin can manage user_projects" ON public.user_projects;
DROP POLICY IF EXISTS "Users can view their own assignments" ON public.user_projects;

CREATE POLICY "Admin full access" ON public.user_projects
  FOR ALL USING (is_admin());

CREATE POLICY "Users view own assignments" ON public.user_projects
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Project members view team" ON public.user_projects
  FOR SELECT USING (is_project_member(project_id));

-- =====================================================
-- 6. TASKS TABLE POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Admin can view all tasks" ON public.tasks;
DROP POLICY IF EXISTS "Associates can view tasks in assigned projects" ON public.tasks;
DROP POLICY IF EXISTS "Members can view their assigned tasks" ON public.tasks;
DROP POLICY IF EXISTS "Associates can manage tasks in assigned projects" ON public.tasks;
DROP POLICY IF EXISTS "Members can update their assigned tasks" ON public.tasks;

CREATE POLICY "Admin full access" ON public.tasks
  FOR ALL USING (is_admin());

CREATE POLICY "Associates manage project tasks" ON public.tasks
  FOR ALL USING (is_project_associate(project_id));

CREATE POLICY "Members view project tasks" ON public.tasks
  FOR SELECT USING (is_project_member(project_id));

CREATE POLICY "Members update assigned tasks" ON public.tasks
  FOR UPDATE USING (assigned_to = auth.uid())
  WITH CHECK (assigned_to = auth.uid());

-- =====================================================
-- 7. ACTIVITY_LOGS TABLE POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Users can view activity logs on accessible tasks" ON public.activity_logs;

CREATE POLICY "Admin full access" ON public.activity_logs
  FOR ALL USING (is_admin());

CREATE POLICY "Users view project activity" ON public.activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE tasks.id = activity_logs.task_id 
      AND is_project_member(tasks.project_id)
    )
  );

-- =====================================================
-- 8. SPRINTS, SUBTASKS, COMMENTS
-- =====================================================
-- Simple catch-all for related entities: follow project/task permission
-- Sprints (Admin or Project Associate)
CREATE POLICY "Sprints project access" ON public.sprints
  FOR ALL USING (is_admin() OR is_project_associate(project_id));

CREATE POLICY "Sprints project view" ON public.sprints
  FOR SELECT USING (is_project_member(project_id));

-- Comments (Follow task access)
CREATE POLICY "Comments task access" ON public.comments
  FOR ALL USING (
    is_admin() OR 
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE tasks.id = comments.task_id 
      AND is_project_associate(tasks.project_id)
    )
  );

CREATE POLICY "Comments task view" ON public.comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE tasks.id = comments.task_id 
      AND is_project_member(tasks.project_id)
    )
  );

-- Subtasks (Follow task access)
CREATE POLICY "Subtasks task access" ON public.subtasks
  FOR ALL USING (
    is_admin() OR 
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE tasks.id = subtasks.task_id 
      AND is_project_associate(tasks.project_id)
    )
  );

CREATE POLICY "Subtasks task view" ON public.subtasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE tasks.id = subtasks.task_id 
      AND is_project_member(tasks.project_id)
    )
  );
