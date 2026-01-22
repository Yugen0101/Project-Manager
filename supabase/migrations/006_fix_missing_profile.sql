-- CRITICAL FIX: Create missing admin profile
-- The auth user exists but the profile in public.users is missing

-- Step 1: Get the auth user ID
SELECT id, email FROM auth.users WHERE email = 'admin@projectmanager.com';

-- Step 2: Check if profile exists
SELECT * FROM public.users WHERE email = 'admin@projectmanager.com';

-- Step 3: If profile doesn't exist, create it
-- REPLACE 'YOUR_AUTH_USER_ID' with the ID from Step 1
INSERT INTO public.users (id, email, full_name, role, is_active)
VALUES (
  'YOUR_AUTH_USER_ID_FROM_STEP_1',  -- Replace this!
  'admin@projectmanager.com',
  'System Administrator',
  'admin',
  true
)
ON CONFLICT (id) DO UPDATE SET
  is_active = true,
  role = 'admin',
  full_name = 'System Administrator';

-- Step 4: Verify the fix
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.role,
    u.is_active,
    au.email_confirmed_at
FROM public.users u
JOIN auth.users au ON u.id = au.id
WHERE u.email = 'admin@projectmanager.com';
