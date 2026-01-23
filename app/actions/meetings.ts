'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { createZoomMeeting, cancelZoomMeeting } from '@/lib/zoom';
import { revalidatePath } from 'next/cache';
import { handleActionError, successResponse } from '@/lib/errors';
import { logAudit } from '@/lib/audit';

export async function scheduleMeeting(data: {
  projectId: string;
  title: string;
  description?: string;
  scheduledAt: string;
  duration: number;
  participantIds: string[];
}) {
  const user = await getCurrentUser();
  const supabase = await createClient();

  if (!user) return handleActionError({ message: 'Unauthorized', status: 401 });

  if (user.role === 'associate') {
    const { data: dbUser } = await supabase
      .from('users')
      .select('can_schedule_meetings')
      .eq('id', user.id)
      .single();

    if (!dbUser?.can_schedule_meetings) {
      return handleActionError({ message: 'Meeting scheduling is not enabled for your account. Please contact an Admin.', status: 403 });
    }
  } else if (user.role !== 'admin') {
    return handleActionError({ message: 'Unauthorized', status: 401 });
  }

  try {
    // 1. Create meeting in Zoom
    const zoomMeeting = await createZoomMeeting({
      topic: data.title,
      agenda: data.description,
      start_time: data.scheduledAt,
      duration: data.duration,
    });

    // 2. Save to database
    const { data: meeting, error: dbError } = await supabase
      .from('meetings')
      .insert({
        project_id: data.projectId,
        created_by: user.id,
        title: data.title,
        description: data.description,
        zoom_meeting_id: zoomMeeting.id.toString(),
        join_url: zoomMeeting.join_url,
        start_url: zoomMeeting.start_url, // Only readable by authorized roles via backend
        scheduled_at: data.scheduledAt,
        duration: data.duration,
        status: 'scheduled'
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // 3. Create notifications for participants
    if (data.participantIds.length > 0) {
      const notifications = data.participantIds.map((participantId: string) => ({
        user_id: participantId,
        title: 'New Meeting Scheduled',
        content: `You've been invited to: ${data.title} on ${new Date(data.scheduledAt).toLocaleString()}`,
        type: 'project_update',
        link: `/member/projects/${data.projectId}` // Link to project dashboard where meetings are listed
      }));

      await supabase.from('notifications').insert(notifications);
    }

    if (!meeting) throw new Error('Failed to create meeting record.');

    // 4. Log Audit
    await logAudit({
      action_type: 'MEETING_CREATED',
      resource_type: 'meeting',
      resource_id: meeting.id,
      details: { project_id: data.projectId, zoom_id: zoomMeeting.id }
    });

    revalidatePath(`/admin/projects/${data.projectId}`);
    revalidatePath(`/associate/projects/${data.projectId}`);
    revalidatePath(`/member/projects/${data.projectId}`);

    return successResponse(meeting);
  } catch (error: any) {
    console.error('Schedule Meeting Error:', error);
    return handleActionError({ message: error.message || 'Failed to schedule meeting' });
  }
}

export async function cancelMeeting(meetingId: string, projectId: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'admin' && user.role !== 'associate')) {
    return handleActionError({ message: 'Unauthorized', status: 401 });
  }

  const supabase = await createClient();

  try {
    // 1. Get meeting details
    const { data: meeting, error: fetchError } = await supabase
      .from('meetings')
      .select('zoom_meeting_id, title')
      .eq('id', meetingId)
      .single();

    if (fetchError || !meeting) throw new Error('Meeting not found.');

    // 2. Cancel in Zoom
    await cancelZoomMeeting(meeting.zoom_meeting_id);

    // 3. Update database
    const { error: updateError } = await supabase
      .from('meetings')
      .update({ status: 'cancelled' })
      .eq('id', meetingId);

    if (updateError) throw updateError;

    // 4. Notify participants (Optional: fetch members of project)
    const { data: members } = await supabase
      .from('user_projects')
      .select('user_id')
      .eq('project_id', projectId);

    if (members && members.length > 0) {
      const notifications = members.map((m: any) => ({
        user_id: m.user_id,
        title: 'Meeting Cancelled',
        content: `The meeting "${meeting.title}" has been cancelled.`,
        type: 'project_update',
        link: `/member/projects/${projectId}`
      }));
      await supabase.from('notifications').insert(notifications);
    }

    // 5. Audit Log
    await logAudit({
      action_type: 'MEETING_CANCELLED',
      resource_type: 'meeting',
      resource_id: meetingId,
      details: { project_id: projectId }
    });

    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath(`/associate/projects/${projectId}`);
    revalidatePath(`/member/projects/${projectId}`);

    return successResponse();
  } catch (error: any) {
    return handleActionError({ message: error.message || 'Failed to cancel meeting' });
  }
}

export async function getProjectMeetings(projectId: string) {
  const user = await getCurrentUser();
  if (!user) return handleActionError({ message: 'Unauthorized', status: 401 });

  const supabase = await createClient();

  // Select columns explicitly to exclude start_url unless the user is Admin or Creator
  // and is authorized to see it. Actually RLS handles visibility, but we can be extra careful.
  const query = supabase
    .from('meetings')
    .select(`
            id,
            title,
            description,
            scheduled_at,
            duration,
            status,
            join_url,
            created_by,
            project_id,
            created_at,
            creator:users(full_name)
        `)
    .eq('project_id', projectId)
    .order('scheduled_at', { ascending: true });

  const { data, error } = await query;

  if (error) return handleActionError(error);
  return successResponse(data);
}

/**
 * Specifically for the host/admin to get the start URL securely
 */
export async function getMeetingStartUrl(meetingId: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'admin' && user.role !== 'associate')) {
    return handleActionError({ message: 'Access denied', status: 403 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('meetings')
    .select('start_url, created_by')
    .eq('id', meetingId)
    .single();

  if (error || !data) return handleActionError({ message: 'Meeting not found' });

  // Extra check: only creators or admins
  if (user.role !== 'admin' && data.created_by !== user.id) {
    return handleActionError({ message: 'Only the meeting host can access the start link.', status: 403 });
  }

  return successResponse(data.start_url);
}

export async function getAllUserMeetings() {
  const user = await getCurrentUser();
  if (!user) return handleActionError({ message: 'Unauthorized', status: 401 });

  const supabase = await createClient();

  let query = supabase
    .from('meetings')
    .select(`
            id,
            title,
            description,
            scheduled_at,
            duration,
            status,
            join_url,
            created_by,
            project_id,
            created_at,
            project:projects(name),
            creator:users(full_name)
        `);

  if (user.role !== 'admin') {
    // For non-admins, get project IDs they belong to
    const { data: userProjects } = await supabase
      .from('user_projects')
      .select('project_id')
      .eq('user_id', user.id);

    const projectIds = userProjects?.map(up => up.project_id) || [];
    query = query.in('project_id', projectIds);
  }

  const { data, error } = await query.order('scheduled_at', { ascending: true });

  if (error) return handleActionError(error);
  return successResponse(data);
}
