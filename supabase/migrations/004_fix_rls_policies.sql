-- Fix RLS Policies for Login
-- Run this in Supabase SQL Editor

-- Drop existing policies for users table
DROP POLICY IF EXISTS "Admin can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Admin can insert users" ON public.users;
DROP POLICY IF EXISTS "Admin can update users" ON public.users;

-- Create new, simpler policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin can view all users" ON public.users
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admin can insert users" ON public.users
  FOR INSERT WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admin can update users" ON public.users
  FOR UPDATE USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Service role can do anything" ON public.users
  FOR ALL USING (true);
