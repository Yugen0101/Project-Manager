-- 1. TRACKING ENHANCEMENTS & SCHEMA FIX
-- Rename deadline to due_date to match application logic
ALTER TABLE public.tasks RENAME COLUMN deadline TO due_date;

-- Add column_changed_at to track how long a task stays in a Kanban column (staleness)
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS column_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update column_changed_at when kanban_column_id changes
CREATE OR REPLACE FUNCTION public.update_task_column_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.kanban_column_id IS DISTINCT FROM NEW.kanban_column_id) THEN
    NEW.column_changed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_task_column_timestamp ON public.tasks;
CREATE TRIGGER trg_update_task_column_timestamp
BEFORE UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.update_task_column_timestamp();

-- 2. PROJECT HEALTH VIEW
-- Rule-based logic for health status
-- On Track: <10% overdue
-- At Risk: 10-30% overdue
-- Delayed: >30% overdue
CREATE OR REPLACE VIEW public.project_health_metrics AS
WITH task_counts AS (
  SELECT 
    project_id,
    COUNT(*) as total_tasks,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_tasks,
    COUNT(*) FILTER (WHERE due_date < NOW() AND status != 'completed') as overdue_tasks,
    COUNT(*) FILTER (WHERE status = 'blocked' OR id IN (SELECT task_id FROM public.task_dependencies)) as blocked_tasks
  FROM public.tasks
  GROUP BY project_id
),
sprint_stats AS (
    SELECT 
        project_id,
        COUNT(*) as total_sprints,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_sprints
    FROM public.sprints
    GROUP BY project_id
)
SELECT 
  p.id as project_id,
  p.name,
  COALESCE(tc.total_tasks, 0) as total_tasks,
  COALESCE(tc.completed_tasks, 0) as completed_tasks,
  COALESCE(tc.overdue_tasks, 0) as overdue_tasks,
  COALESCE(tc.blocked_tasks, 0) as blocked_tasks,
  COALESCE(ss.total_sprints, 0) as total_sprints,
  COALESCE(ss.completed_sprints, 0) as completed_sprints,
  CASE 
    WHEN COALESCE(tc.total_tasks, 0) = 0 THEN 'On Track'
    WHEN (tc.overdue_tasks::float / tc.total_tasks) > 0.3 THEN 'Delayed'
    WHEN (tc.overdue_tasks::float / tc.total_tasks) > 0.1 THEN 'At Risk'
    ELSE 'On Track'
  END as health_status,
  CASE 
    WHEN COALESCE(tc.total_tasks, 0) = 0 THEN 0
    ELSE ROUND((tc.completed_tasks::float / tc.total_tasks) * 100)
  END as progress_percentage
FROM public.projects p
LEFT JOIN task_counts tc ON p.id = tc.project_id
LEFT JOIN sprint_stats ss ON p.id = ss.project_id;

-- 3. TEAM WORKLOAD VIEW
CREATE OR REPLACE VIEW public.team_workload_metrics AS
SELECT 
  u.id as user_id,
  u.full_name,
  COUNT(t.id) as active_tasks,
  COUNT(t.id) FILTER (WHERE t.status = 'completed') as completed_tasks,
  COUNT(t.id) FILTER (WHERE t.due_date < NOW() AND t.status != 'completed') as overdue_tasks,
  CASE 
    WHEN COUNT(t.id) FILTER (WHERE t.status != 'completed') > 5 THEN 'Overloaded'
    WHEN COUNT(t.id) FILTER (WHERE t.status != 'completed') > 3 THEN 'High Load'
    ELSE 'Optimal'
  END as workload_status
FROM public.users u
LEFT JOIN public.tasks t ON u.id = t.assigned_to
GROUP BY u.id, u.full_name;

-- 4. SECURITY (RLS for Views)
-- Security for analytics views will be handled at the application layer via server actions, 
-- but ensuring the underlying tables are protected.
-- (Underlying tables tasks/projects/sprints already have RLS)
