-- Verify the task was created successfully
SELECT 
    t.id,
    t.title,
    t.status,
    t.priority,
    u.full_name as assigned_to,
    p.name as project_name,
    kc.name as kanban_column
FROM tasks t
JOIN users u ON t.assigned_to = u.id
JOIN projects p ON t.project_id = p.id
JOIN kanban_columns kc ON t.kanban_column_id = kc.id
WHERE u.full_name = 'Thomas'
ORDER BY t.created_at DESC;
