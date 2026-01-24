import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import {
    CalendarIcon,
    UserGroupIcon,
    ListBulletIcon,
    ArrowPathIcon,
    CheckBadgeIcon,
    ClockIcon,
    ExclamationCircleIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import Link from 'next/link';
import SprintManager from '@/components/sprint/SprintManager';
import ProjectInsights from '@/components/analytics/ProjectInsights';
import TeamWorkload from '@/components/analytics/TeamWorkload';
import SprintPerformance from '@/components/analytics/SprintPerformance';
import ActivityFeed from '@/components/activity/ActivityFeed';
import ProjectActions from '@/components/admin/ProjectActions';
import ProjectMeetings from '@/components/meetings/ProjectMeetings';
import TeamManager from '@/components/admin/TeamManager';
import { getCurrentUser } from '@/lib/auth/session';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const user = await getCurrentUser();
    if (!user) return notFound();

    // Fetch project with tasks, sprints, and assigned users
    // If admin, use admin client to ensure visibility regardless of RLS
    const fetchClient = user.role === 'admin' ? await createAdminClient() : supabase;

    const { data: project, error: projectError } = await fetchClient
        .from('projects')
        .select(`
            *,
            tasks:tasks(*, users!assigned_to(*)),
            sprints:sprints(*),
            user_projects:user_projects(*, users(*))
        `)
        .eq('id', id)
        .single();

    if (projectError || !project) {
        console.error('Project fetch error:', projectError);
        return notFound();
    }

    const tasks = project.tasks || [];
    const sprints = project.sprints || [];
    const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
    const inProgressTasks = tasks.filter((t: any) => t.status === 'in_progress').length;
    const overdueTasks = tasks.filter((t: any) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed').length;
    const progressPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    return (
        <div className="space-y-8">
            {/* Project Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/projects" className="text-sm font-bold text-primary-600 hover:text-primary-700">Projects</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-sm text-slate-500 font-medium">{project.name}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
                    <p className="text-slate-600 max-w-2xl">{project.description}</p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <ProjectActions
                        projectId={id}
                        status={project.status}
                        isPublic={project.is_public}
                        shareToken={project.share_token}
                        userRole={user.role}
                    />
                    <Link href={`/admin/projects/${id}/kanban`} className="btn-primary flex items-center gap-2">
                        <ArrowPathIcon className="w-5 h-5" />
                        Execution Board
                    </Link>
                </div>
            </div>

            {/* Dynamic Project Insights */}
            <ProjectInsights projectId={id} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Sprint & Backlog Management */}
                <div className="lg:col-span-2 space-y-6">
                    <SprintManager
                        projectId={id}
                        sprints={sprints}
                        tasks={tasks}
                        members={project.user_projects || []}
                    />

                    {/* Zoom Meetings Integration */}
                    <div className="card p-6">
                        <ProjectMeetings
                            projectId={id}
                            members={project.user_projects || []}
                            currentUser={user}
                        />
                    </div>
                </div>

                {/* Sidebar: Project Details */}
                <div className="space-y-6">
                    {/* Progress Card */}
                    <div className="card p-6 bg-primary-600 text-white border-0 shadow-lg shadow-primary-900/10">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <ArrowPathIcon className="w-5 h-5 text-primary-200" />
                            Project Health
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-4xl font-black">{progressPercentage}%</span>
                                <span className="text-primary-100 text-sm font-medium">Progress</span>
                            </div>
                            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full shadow-sm" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                            <p className="text-xs text-primary-100 leading-relaxed font-medium">
                                {tasks.length} total tasks. {completedTasks} are complete.
                                {overdueTasks > 0 ? ` Note: ${overdueTasks} tasks are overdue.` : ' All tasks are on schedule.'}
                            </p>
                        </div>
                    </div>

                    {/* Meta Data */}
                    <div className="card p-6 space-y-6">
                        <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-4">Overview</h3>
                        {/* ... Overview items ... */}
                    </div>

                    {/* Team Workload */}
                    <TeamWorkload projectId={id} />

                    {/* Sprint Performance */}
                    <SprintPerformance projectId={id} />

                    {/* Recent Activity */}
                    <div className="card p-6 space-y-4">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <ClockIcon className="w-5 h-5 text-purple-500" />
                            Recent Activity
                        </h3>
                        <ActivityFeed projectId={id} />
                    </div>

                    {/* Team Management */}
                    <TeamManager
                        projectId={id}
                        initialMembers={project.user_projects || []}
                    />
                </div>
            </div>
        </div>
    );
}
