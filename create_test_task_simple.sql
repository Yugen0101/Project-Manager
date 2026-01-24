-- Single query to create a task for Thomas
-- This uses a WITH clause to get the IDs and insert in one go

WITH ids AS (
    SELECT 
        u.id as thomas_id,
        p.id as project_id,
        kc.id as column_id
    FROM users u
    CROSS JOIN projects p
    CROSS JOIN kanban_columns kc
    WHERE u.full_name = 'Thomas'
      AND p.name = 'TaskForge MVP Development'
      AND kc.project_id = p.id
    ORDER BY kc.order_index
    LIMIT 1
)
INSERT INTO tasks (
    project_id,
    title,
    description,
    assigned_to,
    status,
    kanban_column_id,
    priority,
    created_by
)
SELECT 
    ids.project_id,
    'Test Task for Thomas',
    'This is a test task to verify the member workspace is working',
    ids.thomas_id,
    'in_progress',
    ids.column_id,
    'high',
    ids.thomas_id
FROM ids
RETURNING id, title, status;
