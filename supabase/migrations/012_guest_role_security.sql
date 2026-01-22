-- Phase 6/7: Refine Security & Guest Role

-- 1. Update User Role Constraint
-- Since we can't easily change the CHECK constraint without knowing its name (if it's anonymous),
-- we usually drop and recreate it, or just add a new one if it's a domain/type.
-- In migration 002 it was: role TEXT NOT NULL CHECK (role IN ('admin', 'associate', 'member'))

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'associate', 'member', 'guest'));

-- 2. Refine RLS for 'guest' role
-- Guests should only have SELECT access to projects they are assigned to, and related tasks/sprints.

-- 2a. Projects Select (Guests can see assigned projects)
-- (Existing policy "Users can view projects they are members of" covers guests if they are in user_projects)

-- 2b. Tasks Select (Guests can see tasks of assigned projects)
-- (Existing policies cover this)

-- 2c. PREVENT GUESTS FROM UPDATING/INSERTING
-- We add explicit "DENY" via RLS or by ensuring existing policies don't match 'guest' role.

-- Let's check existing Update policies and restrict them to NOT be 'guest'.
-- Actually, the existing policies check for specific membership roles or assignments.
-- A guest should NEVER match a policy that allows FOR UPDATE or FOR INSERT.

-- 3. Ensure guests cannot update tasks even if assigned
-- We might need to modify "Members can update their assigned tasks" to exclude guests.

DROP POLICY IF EXISTS "Members can update their assigned tasks" ON public.tasks;
CREATE POLICY "Members can update their assigned tasks" ON public.tasks
  FOR UPDATE USING (
    assigned_to = auth.uid() AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role != 'guest')
  );

-- 4. Ensure guests cannot insert comments
DROP POLICY IF EXISTS "Users can insert comments on accessible tasks" ON public.comments;
CREATE POLICY "Users can insert comments on accessible tasks" ON public.comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE id = task_id AND (
        assigned_to = auth.uid() OR
        EXISTS (SELECT 1 FROM public.user_projects WHERE user_id = auth.uid() AND project_id = tasks.project_id)
      )
    ) AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role != 'guest')
  );

-- 5. Ensure guests cannot manage sprints
-- (Existing sprint policy already checks for 'associate' role, so guests are blocked)

-- 6. Ensure guests cannot manage subtasks
DROP POLICY IF EXISTS "Users can manage subtasks on accessible tasks" ON public.subtasks;
CREATE POLICY "Users can manage subtasks on accessible tasks" ON public.subtasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE id = subtasks.task_id AND (
        assigned_to = auth.uid() OR
        EXISTS (SELECT 1 FROM public.user_projects WHERE user_id = auth.uid() AND project_id = tasks.project_id)
      )
    ) AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role != 'guest')
  );
