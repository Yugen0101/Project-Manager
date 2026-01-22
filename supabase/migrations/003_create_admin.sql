-- Create Admin Account
-- Run this in Supabase SQL Editor to create your first admin user

-- First, create the auth user (replace with your desired email and password)
-- You'll need to do this via Supabase Dashboard > Authentication > Add User
-- OR use this SQL if you have the service role key:

-- After creating the auth user in Supabase Dashboard, get the user ID and run:
-- INSERT INTO public.users (id, email, full_name, role, is_active)
-- VALUES (
--   'YOUR_AUTH_USER_ID_HERE',
--   'admin@projectmanager.com',
--   'Admin User',
--   'admin',
--   true
-- );

-- EASIER METHOD: Create via Supabase Dashboard
-- 1. Go to Authentication > Users
-- 2. Click "Add User"
-- 3. Email: admin@projectmanager.com
-- 4. Password: (your choice)
-- 5. Auto Confirm User: YES
-- 6. Copy the User ID
-- 7. Run this SQL with the copied ID:

INSERT INTO public.users (id, email, full_name, role, is_active)
VALUES (
  'PASTE_USER_ID_HERE',  -- Replace with actual UUID from step 6
  'admin@projectmanager.com',
  'System Administrator',
  'admin',
  true
);
