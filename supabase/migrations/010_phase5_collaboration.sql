-- Phase 5: Collaboration & UX Polish
-- This migration introduces the notification system and enhances activity logging.

-- 1. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('task_assigned', 'status_changed', 'mention', 'sprint_event', 'project_update')),
  link TEXT, -- Optional link to the relevant object (e.g., /admin/tasks/uuid)
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. AUTOMATED NOTIFICATION TRIGGERS

-- Trigger for Task Assignment
CREATE OR REPLACE FUNCTION public.notify_task_assignment()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.assigned_to IS NOT NULL AND (TG_OP = 'INSERT' OR OLD.assigned_to IS DISTINCT FROM NEW.assigned_to)) THEN
    -- Don't notify if the user is assigning it to themselves
    IF NEW.assigned_to != NEW.created_by THEN
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
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_task_assignment ON public.tasks;
CREATE TRIGGER trg_notify_task_assignment
AFTER INSERT OR UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.notify_task_assignment();

-- Trigger for Task Status Changes (Notify Creator or Assignee)
CREATE OR REPLACE FUNCTION public.notify_task_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Notify the creator if the assignee changed it, or notify the assignee if someone else changed it
    -- For simplicity, we'll notify both if they are different from the current user
    
    -- Notify Assignee
    IF (NEW.assigned_to IS NOT NULL) THEN
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
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_task_status_change ON public.tasks;
CREATE TRIGGER trg_notify_task_status_change
AFTER UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.notify_task_status_change();

-- 3. SECURITY (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- 4. ACTIVITY LOG ENHANCEMENT
-- We already have activity_logs, let's add an index for faster feed loading
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
