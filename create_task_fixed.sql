-- First, let's see what projects actually exist
SELECT id, name FROM projects ORDER BY created_at DESC;

-- Then, let's see what kanban columns exist for the project
SELECT kc.id, kc.name, kc.order_index, p.name as project_name
FROM kanban_columns kc
JOIN projects p ON kc.project_id = p.id
ORDER BY p.name, kc.order_index;

-- Now let's create a task using the ACTUAL IDs we know exist
-- Replace these with the actual values from the queries above
INSERT INTO tasks (
    project_id,
    title,
    description,
    assigned_to,
    status,
    kanban_column_id,
    priority,
    created_by
) VALUES (
    (SELECT id FROM projects WHERE name LIKE '%TaskForge%' LIMIT 1),
    'Implement User Authentication',
    'Add login and signup functionality with email verification',
    '13a091d6-73f7-48d6-85fa-028ec873ccd5',  -- Thomas's ID from earlier query
    'in_progress',
    (SELECT id FROM kanban_columns WHERE project_id = (SELECT id FROM projects WHERE name LIKE '%TaskForge%' LIMIT 1) ORDER BY order_index LIMIT 1),
    'high',
    '13a091d6-73f7-48d6-85fa-028ec873ccd5'   -- Thomas's ID
)
RETURNING id, title, status;
