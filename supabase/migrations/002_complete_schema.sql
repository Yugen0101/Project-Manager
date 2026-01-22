-- =====================================================
-- IMPORTANT: This schema update adds missing features
-- Run this AFTER your initial schema
-- =====================================================

-- Add missing columns to users table (if using Supabase Auth)
-- Note: Your current schema creates users independently
-- We need to link to Supabase auth.users

-- Drop existing users table and recreate with auth integration
DROP TABLE IF EXISTS task_activity CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS task_status CASCADE;
DROP TYPE IF EXISTS task_priority CASCADE;

-- =====================================================
-- USERS TABLE (extends Supabase auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'associate', 'member')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- USER_PROJECTS TABLE (Many-to-Many)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('associate', 'member')),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- =====================================================
-- SPRINTS TABLE (NEW - for Scrum support)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.sprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  goal TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TASKS TABLE (Enhanced)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'blocked', 'completed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  kanban_column TEXT NOT NULL DEFAULT 'backlog' CHECK (kanban_column IN ('backlog', 'todo', 'in_progress', 'review', 'done')),
  deadline DATE,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- SUBTASKS TABLE (NEW)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.subtasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- COMMENTS TABLE (NEW)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ACTIVITY_LOGS TABLE (Enhanced)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('created', 'assigned', 'status_changed', 'completed', 'updated')),
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON public.users(is_active);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON public.projects(created_by);
CREATE INDEX IF NOT EXISTS idx_user_projects_user_id ON public.user_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_project_id ON public.user_projects(project_id);
CREATE INDEX IF NOT EXISTS idx_sprints_project_id ON public.sprints(project_id);
CREATE INDEX IF NOT EXISTS idx_sprints_status ON public.sprints(status);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_sprint_id ON public.tasks(sprint_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_kanban_column ON public.tasks(kanban_column);
CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON public.subtasks(task_id);
CREATE INDEX IF NOT EXISTS idx_comments_task_id ON public.comments(task_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_task_id ON public.activity_logs(task_id);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sprints_updated_at BEFORE UPDATE ON public.sprints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGER FOR ACTIVITY LOGGING
-- =====================================================
CREATE OR REPLACE FUNCTION log_task_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Log status changes
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO public.activity_logs (task_id, user_id, action_type, old_value, new_value)
    VALUES (NEW.id, NEW.assigned_to, 'status_changed', OLD.status, NEW.status);
  END IF;

  -- Log assignment changes
  IF (TG_OP = 'UPDATE' AND OLD.assigned_to IS DISTINCT FROM NEW.assigned_to) THEN
    INSERT INTO public.activity_logs (task_id, user_id, action_type, old_value, new_value)
    VALUES (NEW.id, NEW.assigned_to, 'assigned', OLD.assigned_to::TEXT, NEW.assigned_to::TEXT);
  END IF;

  -- Log completion
  IF (TG_OP = 'UPDATE' AND OLD.status != 'completed' AND NEW.status = 'completed') THEN
    INSERT INTO public.activity_logs (task_id, user_id, action_type, new_value)
    VALUES (NEW.id, NEW.assigned_to, 'completed', NEW.status);
  END IF;

  -- Log creation
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.activity_logs (task_id, user_id, action_type, new_value)
    VALUES (NEW.id, NEW.created_by, 'created', 'Task created');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER task_activity_logger
AFTER INSERT OR UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION log_task_activity();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- USERS TABLE POLICIES
CREATE POLICY "Admin can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Admin can insert users" ON public.users
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can update users" ON public.users
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- PROJECTS TABLE POLICIES
CREATE POLICY "Admin can view all projects" ON public.projects
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Associates and Members can view assigned projects" ON public.projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_projects 
      WHERE user_id = auth.uid() AND project_id = projects.id
    )
  );

CREATE POLICY "Admin can insert projects" ON public.projects
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can update projects" ON public.projects
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- USER_PROJECTS TABLE POLICIES
CREATE POLICY "Admin can manage user_projects" ON public.user_projects
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can view their own assignments" ON public.user_projects
  FOR SELECT USING (user_id = auth.uid());

-- TASKS TABLE POLICIES
CREATE POLICY "Admin can view all tasks" ON public.tasks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Associates can view tasks in assigned projects" ON public.tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_projects 
      WHERE user_id = auth.uid() AND project_id = tasks.project_id AND role = 'associate'
    )
  );

CREATE POLICY "Members can view their assigned tasks" ON public.tasks
  FOR SELECT USING (assigned_to = auth.uid());

CREATE POLICY "Associates can manage tasks in assigned projects" ON public.tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_projects 
      WHERE user_id = auth.uid() AND project_id = tasks.project_id AND role = 'associate'
    )
  );

CREATE POLICY "Members can update their assigned tasks" ON public.tasks
  FOR UPDATE USING (assigned_to = auth.uid());

-- SPRINTS TABLE POLICIES
CREATE POLICY "Associates can manage sprints in assigned projects" ON public.sprints
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_projects 
      WHERE user_id = auth.uid() AND project_id = sprints.project_id AND role = 'associate'
    )
  );

-- COMMENTS TABLE POLICIES
CREATE POLICY "Users can view comments on accessible tasks" ON public.comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE id = comments.task_id AND (
        assigned_to = auth.uid() OR
        EXISTS (SELECT 1 FROM public.user_projects WHERE user_id = auth.uid() AND project_id = tasks.project_id)
      )
    )
  );

CREATE POLICY "Users can insert comments on accessible tasks" ON public.comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE id = task_id AND (
        assigned_to = auth.uid() OR
        EXISTS (SELECT 1 FROM public.user_projects WHERE user_id = auth.uid() AND project_id = tasks.project_id)
      )
    )
  );

-- ACTIVITY_LOGS TABLE POLICIES
CREATE POLICY "Users can view activity logs on accessible tasks" ON public.activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE id = activity_logs.task_id AND (
        assigned_to = auth.uid() OR
        EXISTS (SELECT 1 FROM public.user_projects WHERE user_id = auth.uid() AND project_id = tasks.project_id)
      )
    )
  );

-- SUBTASKS TABLE POLICIES
CREATE POLICY "Users can manage subtasks on accessible tasks" ON public.subtasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE id = subtasks.task_id AND (
        assigned_to = auth.uid() OR
        EXISTS (SELECT 1 FROM public.user_projects WHERE user_id = auth.uid() AND project_id = tasks.project_id)
      )
    )
  );
