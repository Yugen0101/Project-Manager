-- Diagnostic Query to Check App State
-- Run this in your Supabase SQL Editor to see what data exists

-- 1. Check all users
SELECT id, email, full_name, role, is_active 
FROM public.users 
ORDER BY created_at DESC;

-- 2. Check all projects
SELECT id, name, status, created_by 
FROM public.projects 
ORDER BY created_at DESC;

-- 3. Check user-project assignments
SELECT 
    up.id,
    u.full_name as user_name,
    u.role as user_role,
    p.name as project_name,
    up.role as project_role
FROM public.user_projects up
JOIN public.users u ON up.user_id = u.id
JOIN public.projects p ON up.project_id = p.id
ORDER BY up.assigned_at DESC;

-- 4. Check all tasks
SELECT 
    t.id,
    t.title,
    t.status,
    t.assigned_to,
    p.name as project_name,
    u.full_name as assigned_to_name,
    t.kanban_column_id
FROM public.tasks t
JOIN public.projects p ON t.project_id = p.id
LEFT JOIN public.users u ON t.assigned_to = u.id
ORDER BY t.created_at DESC;

-- 5. Check kanban columns
SELECT 
    kc.id,
    kc.name,
    kc.order_index,
    p.name as project_name
FROM public.kanban_columns kc
JOIN public.projects p ON kc.project_id = p.id
ORDER BY p.name, kc.order_index;
