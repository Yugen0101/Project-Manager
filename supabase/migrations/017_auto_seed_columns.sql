-- Migration to automatically seed kanban columns for new projects
-- This ensures that every project starts with a standard workflow (Backlog, To Do, In Progress, Review, Done)

CREATE OR REPLACE FUNCTION public.handle_new_project_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- Create Backlog
  INSERT INTO public.kanban_columns (project_id, name, order_index) VALUES (NEW.id, 'Backlog', 0);
  -- Create To Do
  INSERT INTO public.kanban_columns (project_id, name, order_index) VALUES (NEW.id, 'To Do', 1);
  -- Create In Progress
  INSERT INTO public.kanban_columns (project_id, name, order_index) VALUES (NEW.id, 'In Progress', 2);
  -- Create Review
  INSERT INTO public.kanban_columns (project_id, name, order_index) VALUES (NEW.id, 'Review', 3);
  -- Create Done
  INSERT INTO public.kanban_columns (project_id, name, order_index) VALUES (NEW.id, 'Done', 4);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run after a new project is inserted
DROP TRIGGER IF EXISTS trg_seed_project_columns ON public.projects;
CREATE TRIGGER trg_seed_project_columns
AFTER INSERT ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_project_columns();

-- Also fix any existing projects that might be missing columns (like the user's current project)
SELECT public.seed_default_columns();
