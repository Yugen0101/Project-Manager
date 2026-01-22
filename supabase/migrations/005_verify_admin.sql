-- Verify and Fix Admin Account
-- Run this to check and ensure admin account is properly set up

-- 1. Check current admin user status
SELECT 
    id, 
    email, 
    full_name, 
    role, 
    is_active,
    created_at
FROM public.users 
WHERE email = 'admin@projectmanager.com';

-- 2. If is_active is false or null, update it
UPDATE public.users 
SET is_active = true 
WHERE email = 'admin@projectmanager.com' 
  AND (is_active IS NULL OR is_active = false);

-- 3. Verify the update
SELECT 
    id, 
    email, 
    full_name, 
    role, 
    is_active,
    created_at
FROM public.users 
WHERE email = 'admin@projectmanager.com';

-- 4. Check if user exists in auth.users
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at
FROM auth.users
WHERE email = 'admin@projectmanager.com';
