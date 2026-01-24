-- Migration 016: Fix Task Data Integrity
-- This migration ensures all existing tasks have proper defaults

-- 1. Fix tasks with NULL status
UPDATE public.tasks
SET status = 'not_started'
WHERE status IS NULL;

-- 2. Fix tasks with NULL kanban_column_id
-- Assign them to the first column of their project
UPDATE public.tasks t
SET kanban_column_id = (
  SELECT id FROM public.kanban_columns c
  WHERE c.project_id = t.project_id
  ORDER BY c.order_index ASC
  LIMIT 1
)
WHERE kanban_column_id IS NULL;

-- 3. Ensure all tasks have a created_by value
-- If NULL, set to the project creator
UPDATE public.tasks t
SET created_by = (
  SELECT created_by FROM public.projects p
  WHERE p.id = t.project_id
)
WHERE created_by IS NULL;

-- 4. Add index for better query performance on member workspace
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to_status ON public.tasks(assigned_to, status) WHERE assigned_to IS NOT NULL;

-- 5. Add index for project-based queries
CREATE INDEX IF NOT EXISTS idx_tasks_project_status ON public.tasks(project_id, status);
