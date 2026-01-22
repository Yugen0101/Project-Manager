'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';

export async function getProjectHealth(projectId: string) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const supabase = await createClient();

    // Check access: Admin or Associate assigned to project
    if (user.role !== 'admin') {
        const { data: assignment } = await supabase
            .from('user_projects')
            .select('role')
            .match({ user_id: user.id, project_id: projectId })
            .single();

        if (!assignment || assignment.role !== 'associate') {
            return { error: 'Access denied. Analytics only available to Admins and Associates.' };
        }
    }

    const { data: metrics, error } = await supabase
        .from('project_health_metrics')
        .select('*')
        .eq('project_id', projectId)
        .single();

    if (error) return { error: error.message };
    return { success: true, data: metrics };
}

export async function getTeamWorkload(projectId: string) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const supabase = await createClient();

    // Access check same as health
    if (user.role !== 'admin') {
        const { data: assignment } = await supabase
            .from('user_projects')
            .select('role')
            .match({ user_id: user.id, project_id: projectId })
            .single();

        if (!assignment || assignment.role !== 'associate') {
            return { error: 'Access denied.' };
        }
    }

    // Filter workload to members only in this project
    const { data: members, error: membersError } = await supabase
        .from('user_projects')
        .select('user_id')
        .eq('project_id', projectId);

    if (membersError) return { error: membersError.message };

    const memberIds = members.map(m => m.user_id);

    const { data: workload, error } = await supabase
        .from('team_workload_metrics')
        .select('*')
        .in('user_id', memberIds);

    if (error) return { error: error.message };
    return { success: true, data: workload };
}

export async function getSprintAnalytics(projectId: string) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const supabase = await createClient();

    // Fetch all sprints for project
    const { data: sprints, error: sprintError } = await supabase
        .from('sprints')
        .select(`
            *,
            tasks:tasks(id, status, points)
        `)
        .eq('project_id', projectId)
        .order('end_date', { ascending: false });

    if (sprintError) return { error: sprintError.message };

    const analytics = sprints.map(sprint => {
        const total = sprint.tasks.length;
        const completed = sprint.tasks.filter((t: any) => t.status === 'completed').length;
        return {
            id: sprint.id,
            name: sprint.name,
            status: sprint.status,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
            plannedTasks: total,
            completedTasks: completed,
            remainingTasks: total - completed
        };
    });

    return { success: true, data: analytics };
}

export async function getRiskIndicators(projectId: string) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const supabase = await createClient();

    // 1. Stuck Tasks (In same column for > 3 days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const { data: stuckTasks, error: stuckError } = await supabase
        .from('tasks')
        .select('id, title, kanban_column_id, column_changed_at')
        .eq('project_id', projectId)
        .neq('status', 'completed')
        .lt('column_changed_at', threeDaysAgo.toISOString());

    // 2. High Priority Overdue
    const { data: overdueCritical, error: overdueError } = await supabase
        .from('tasks')
        .select('id, title, priority, due_date')
        .eq('project_id', projectId)
        .neq('status', 'completed')
        .lt('due_date', new Date().toISOString())
        .in('priority', ['high', 'critical']);

    return {
        success: true,
        data: {
            stuckTasks: stuckTasks || [],
            overdueRisks: overdueCritical || []
        }
    };
}

export async function getMyPerformance() {
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const supabase = await createClient();

    const { data: metrics, error } = await supabase
        .from('team_workload_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (error) return { error: error.message };
    return { success: true, data: metrics };
}
