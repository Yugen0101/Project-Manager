-- Step 1: Check if ANY tasks exist in the database
SELECT COUNT(*) as total_tasks FROM tasks;

-- Step 2: Check if tasks exist for this specific project
SELECT COUNT(*) as project_tasks 
FROM tasks t
JOIN projects p ON t.project_id = p.id
WHERE p.name = 'TaskForge MVP Development';

-- Step 3: Check if Thomas exists and get his ID
SELECT id, full_name, email, role FROM users WHERE full_name = 'Thomas';

-- Step 4: Check all tasks with full details
SELECT 
    t.id,
    t.title,
    t.status,
    t.assigned_to,
    t.project_id,
    t.kanban_column_id,
    u.full_name as assigned_to_name,
    p.name as project_name
FROM tasks t
LEFT JOIN users u ON t.assigned_to = u.id
LEFT JOIN projects p ON t.project_id = p.id
ORDER BY t.created_at DESC
LIMIT 10;

-- Step 5: Check if the WITH query is finding the right IDs
SELECT 
    u.id as thomas_id,
    u.full_name,
    p.id as project_id,
    p.name as project_name,
    kc.id as column_id,
    kc.name as column_name
FROM users u
CROSS JOIN projects p
CROSS JOIN kanban_columns kc
WHERE u.full_name = 'Thomas'
  AND p.name = 'TaskForge MVP Development'
  AND kc.project_id = p.id
ORDER BY kc.order_index
LIMIT 1;
