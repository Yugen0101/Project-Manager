-- Migration to fix RLS violation on notifications table
-- This migration updates the notification triggers to run as SECURITY DEFINER
-- and adds missing RLS policies for insertion.

-- 1. Update notify_task_assignment to be SECURITY DEFINER
-- This ensures the trigger can insert notification records regardless of the initiating user's person-to-person RLS constraints.
CREATE OR REPLACE FUNCTION public.notify_task_assignment()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.assigned_to IS NOT NULL AND (TG_OP = 'INSERT' OR OLD.assigned_to IS DISTINCT FROM NEW.assigned_to)) THEN
    -- Don't notify if the user is assigning it to themselves
    IF NEW.assigned_to != auth.uid() THEN
      INSERT INTO public.notifications (user_id, title, content, type, link)
      VALUES (
        NEW.assigned_to,
        'New Task Assigned',
        'You have been assigned to: ' || NEW.title,
        'task_assigned',
        '/member/tasks/' || NEW.id
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update notify_task_status_change to be SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.notify_task_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Notify the assignee if they are not the one who changed it
    IF (NEW.assigned_to IS NOT NULL AND NEW.assigned_to != auth.uid()) THEN
        INSERT INTO public.notifications (user_id, title, content, type, link)
        VALUES (
            NEW.assigned_to,
            'Task Update',
            'Task "' || NEW.title || '" moved to ' || NEW.status,
            'status_changed',
            '/member/tasks/' || NEW.id
        );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Add MISSING INSERT policy for notifications
-- This allows automated triggers and admins to create notifications.
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "System can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (true); 

-- Note: We allow INSERT for all authenticated users to enable triggers to work.
-- The SECURITY DEFINER on functions already handles most cases, 
-- but a general INSERT policy ensures the database doesn't block the trigger action.
