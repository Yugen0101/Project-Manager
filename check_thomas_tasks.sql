-- Check tasks assigned to Thomas
SELECT 
    t.id,
    t.title,
    t.status,
    p.name as project_name
FROM tasks t
JOIN projects p ON t.project_id = p.id
JOIN users u ON t.assigned_to = u.id
WHERE u.full_name = 'Thomas';
