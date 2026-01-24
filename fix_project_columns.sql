-- Quick fix for the CURRENT project
-- This will add the missing kanban columns to "TaskForge MVP Development"

DO $$
DECLARE
  p_id UUID;
BEGIN
  -- Get the project ID
  SELECT id INTO p_id FROM projects WHERE name = 'TaskForge MVP Development' LIMIT 1;
  
  IF p_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM kanban_columns WHERE project_id = p_id) THEN
    -- Create standard columns
    INSERT INTO kanban_columns (project_id, name, order_index) VALUES 
      (p_id, 'Backlog', 0),
      (p_id, 'To Do', 1),
      (p_id, 'In Progress', 2),
      (p_id, 'Review', 3),
      (p_id, 'Done', 4);
    
    RAISE NOTICE 'Standard Kanban workflow established for project: %', p_id;
  ELSE
    RAISE NOTICE 'Project already has columns or was not found.';
  END IF;
END $$;
