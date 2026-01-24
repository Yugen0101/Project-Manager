-- Step 1: Get all the IDs we need
-- Run this first to get the actual values
SELECT 
    'Thomas ID: ' || u.id as thomas_info,
    'Project ID: ' || p.id as project_info,
    'Column ID: ' || kc.id as column_info
FROM users u
CROSS JOIN projects p
CROSS JOIN kanban_columns kc
WHERE u.full_name = 'Thomas'
  AND p.name = 'TaskForge MVP Development'
  AND kc.project_id = p.id
ORDER BY kc.order_index
LIMIT 1;

-- Step 2: After you get the IDs from Step 1, replace them below and run this:
-- (Copy the actual UUID values from the results above)

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
    '658a8fe9-3a53-4148-bc83-db5ade6afb57',  -- Replace with actual project_id from Step 1
    'Test Task for Thomas',
    'This is a test task to verify the member workspace is working',
    '658a8fe9-3a53-4148-bc83-db5ade6afb57',  -- Replace with actual thomas_id from Step 1
    'in_progress',
    '658a8fe9-3a53-4148-bc83-db5ade6afb57',  -- Replace with actual column_id from Step 1
    'high',
    '658a8fe9-3a53-4148-bc83-db5ade6afb57'   -- Replace with actual thomas_id from Step 1
);

-- Step 3: Verify the task was created
SELECT 
    t.id,
    t.title,
    t.status,
    u.full_name as assigned_to,
    p.name as project_name
FROM tasks t
JOIN users u ON t.assigned_to = u.id
JOIN projects p ON t.project_id = p.id
WHERE u.full_name = 'Thomas'
ORDER BY t.created_at DESC;
