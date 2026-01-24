-- Check if Thomas is assigned to any projects
SELECT 
    up.id as assignment_id,
    up.role as assignment_role,
    p.id as project_id,
    p.name as project_name,
    u.id as user_id,
    u.full_name
FROM user_projects up
JOIN projects p ON up.project_id = p.id
JOIN users u ON up.user_id = u.id
WHERE u.full_name = 'Thomas';
