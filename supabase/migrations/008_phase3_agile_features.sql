-- Phase 3: Agile Execution Enhancements
-- This migration introduces custom Kanban columns, task dependencies, and workflow constraints.

-- =====================================================
-- 1. KANBAN COLUMNS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.kanban_columns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  wip_limit INTEGER, -- NULL means no limit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. TASK DEPENDENCIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.task_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  blocked_by_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(task_id, blocked_by_id),
  CHECK(task_id != blocked_by_id)
);

-- =====================================================
-- 3. UPDATING TASKS TABLE
-- =====================================================
-- Add new columns for Phase 3
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS kanban_column_id UUID REFERENCES public.kanban_columns(id) ON DELETE SET NULL;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS order_index INTEGER NOT NULL DEFAULT 0;

-- =====================================================
-- 4. DEFAULT COLUMNS FOR EXISTING PROJECTS
-- =====================================================
-- This function will seed default columns for any project that doesn't have them
CREATE OR REPLACE FUNCTION public.seed_default_columns()
RETURNS VOID AS $$
DECLARE
  p_id UUID;
  c_id UUID;
BEGIN
  FOR p_id IN SELECT id FROM public.projects LOOP
    IF NOT EXISTS (SELECT 1 FROM public.kanban_columns WHERE project_id = p_id) THEN
      -- Create Backlog
      INSERT INTO public.kanban_columns (project_id, name, order_index) VALUES (p_id, 'Backlog', 0);
      -- Create To Do
      INSERT INTO public.kanban_columns (project_id, name, order_index) VALUES (p_id, 'To Do', 1);
      -- Create In Progress
      INSERT INTO public.kanban_columns (project_id, name, order_index) VALUES (p_id, 'In Progress', 2);
      -- Create Review
      INSERT INTO public.kanban_columns (project_id, name, order_index) VALUES (p_id, 'Review', 3);
      -- Create Done
      INSERT INTO public.kanban_columns (project_id, name, order_index) VALUES (p_id, 'Done', 4);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run the seed function
SELECT public.seed_default_columns();

-- Migrate existing task status/column to the new kanban_column_id system
UPDATE public.tasks t
SET kanban_column_id = (
  SELECT id FROM public.kanban_columns c 
  WHERE c.project_id = t.project_id 
  AND LOWER(c.name) = LOWER(REPLACE(t.kanban_column, '_', ' '))
  LIMIT 1
)
WHERE kanban_column_id IS NULL;

-- =====================================================
-- 5. SPRINT CONSTRAINTS
-- =====================================
-- Prevent more than one 'active' sprint per project
CREATE OR REPLACE FUNCTION public.check_active_sprint()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' THEN
    IF EXISTS (
      SELECT 1 FROM public.sprints 
      WHERE project_id = NEW.project_id 
      AND status = 'active' 
      AND id != NEW.id
    ) THEN
      RAISE EXCEPTION 'Only one active sprint is allowed per project.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_limit_active_sprint ON public.sprints;
CREATE TRIGGER trg_limit_active_sprint
BEFORE INSERT OR UPDATE ON public.sprints
FOR EACH ROW EXECUTE FUNCTION public.check_active_sprint();

-- =====================================================
-- 6. INDEXES & RLS
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_kanban_columns_project_id ON public.kanban_columns(project_id);
CREATE INDEX IF NOT EXISTS idx_task_dependencies_task_id ON public.task_dependencies(task_id);
CREATE INDEX IF NOT EXISTS idx_task_dependencies_blocked_by ON public.task_dependencies(blocked_by_id);

ALTER TABLE public.kanban_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_dependencies ENABLE ROW LEVEL SECURITY;

-- Kanban Columns Policies
DROP POLICY IF EXISTS "Columns project access" ON public.kanban_columns;
CREATE POLICY "Columns project access" ON public.kanban_columns
  FOR ALL USING (is_admin() OR is_project_associate(project_id));

DROP POLICY IF EXISTS "Columns project view" ON public.kanban_columns;
CREATE POLICY "Columns project view" ON public.kanban_columns
  FOR SELECT USING (is_project_member(project_id));

-- Task Dependencies Policies
DROP POLICY IF EXISTS "Dependencies task access" ON public.task_dependencies;
CREATE POLICY "Dependencies task access" ON public.task_dependencies
  FOR ALL USING (
    is_admin() OR 
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE tasks.id = task_dependencies.task_id 
      AND is_project_associate(tasks.project_id)
    )
  );

DROP POLICY IF EXISTS "Dependencies task view" ON public.task_dependencies;
CREATE POLICY "Dependencies task view" ON public.task_dependencies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE tasks.id = task_dependencies.task_id 
      AND is_project_member(tasks.project_id)
    )
  );

-- Utility trigger for updated_at on kanban_columns
DROP TRIGGER IF EXISTS update_kanban_columns_updated_at ON public.kanban_columns;
CREATE TRIGGER update_kanban_columns_updated_at BEFORE UPDATE ON public.kanban_columns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
