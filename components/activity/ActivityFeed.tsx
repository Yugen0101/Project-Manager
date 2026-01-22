'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
    PlusIcon,
    UserPlusIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { createClient } from '@/lib/supabase/client';

const actionIcons = {
    'created': <PlusIcon className="w-3.5 h-3.5" />,
    'assigned': <UserPlusIcon className="w-3.5 h-3.5" />,
    'status_changed': <ArrowPathIcon className="w-3.5 h-3.5" />,
    'completed': <CheckCircleIcon className="w-3.5 h-3.5" />,
    'updated': <ArrowPathIcon className="w-3.5 h-3.5" />,
    'comment': <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
};

const actionColors = {
    'created': 'bg-emerald-100 text-emerald-600',
    'assigned': 'bg-blue-100 text-blue-600',
    'status_changed': 'bg-orange-100 text-orange-600',
    'completed': 'bg-emerald-100 text-emerald-600',
    'updated': 'bg-slate-100 text-slate-600',
    'comment': 'bg-purple-100 text-purple-600'
};

export default function ActivityFeed({
    activities: initialActivities,
    projectId,
    taskId
}: {
    activities?: any[],
    projectId?: string,
    taskId?: string
}) {
    const [activities, setActivities] = useState<any[]>(initialActivities || []);
    const [loading, setLoading] = useState(!initialActivities);

    useEffect(() => {
        if (initialActivities) return;

        async function loadActivity() {
            const supabase = createClient();
            let query = supabase
                .from('activity_logs')
                .select('*, user:users(full_name)')
                .order('created_at', { ascending: false })
                .limit(20);

            if (projectId) query = query.eq('project_id', projectId);
            if (taskId) query = query.eq('task_id', taskId);

            const { data } = await query;
            if (data) setActivities(data);
            setLoading(false);
        }

        loadActivity();
    }, [initialActivities, projectId, taskId]);

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                            <div className="h-2 bg-slate-100 rounded w-1/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!activities || activities.length === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-xs font-black uppercase text-slate-400 tracking-widest">No activity logged yet</p>
            </div>
        );
    }

    return (
        <div className="flow-root">
            <ul role="list" className="-mb-8">
                {activities.map((item, idx) => (
                    <li key={item.id}>
                        <div className="relative pb-8">
                            {idx !== activities.length - 1 && (
                                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-100" aria-hidden="true" />
                            )}
                            <div className="relative flex space-x-3">
                                <div>
                                    <span className={`h-8 w-8 rounded-lg flex items-center justify-center ring-4 ring-white ${actionColors[item.action_type as keyof typeof actionColors] || 'bg-slate-100 text-slate-500'}`}>
                                        {actionIcons[item.action_type as keyof typeof actionIcons] || <ArrowPathIcon className="w-3.5 h-3.5" />}
                                    </span>
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div>
                                        <p className="text-sm text-slate-600">
                                            <span className="font-bold text-slate-900">{item.user?.full_name || 'System'}</span>
                                            {' '}{item.action_type === 'status_changed' ? `moved task to ${item.new_value}` :
                                                item.action_type === 'assigned' ? `assigned task to user` :
                                                    item.action_type === 'created' ? `created the task` :
                                                        item.action_type === 'completed' ? `completed the task` :
                                                            'updated the task'}
                                        </p>
                                    </div>
                                    <div className="whitespace-nowrap text-right text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <time dateTime={item.created_at}>
                                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                        </time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
