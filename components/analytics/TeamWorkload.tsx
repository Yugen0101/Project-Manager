'use client';

import { useEffect, useState } from 'react';
import { getTeamWorkload } from '@/app/actions/analytics';
import { UserGroupIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

export default function TeamWorkload({ projectId }: { projectId: string }) {
    const [teamData, setTeamData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const res = await getTeamWorkload(projectId);
            if (res.success) setTeamData(res.data);
            setLoading(false);
        }
        loadData();
    }, [projectId]);

    if (loading) return <div className="h-32 flex items-center justify-center text-slate-400 font-bold animate-pulse">Calculating Team Load...</div>;

    const statusColors = {
        'Optimal': 'bg-emerald-500',
        'High Load': 'bg-orange-500',
        'Overloaded': 'bg-red-500'
    };

    const statusTextColors = {
        'Optimal': 'text-emerald-600',
        'High Load': 'text-orange-600',
        'Overloaded': 'text-red-600'
    };

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <UserGroupIcon className="w-5 h-5 text-primary-600" />
                    Team Workload
                </h4>
                <span className="text-[10px] font-black uppercase text-slate-400">Current Distribution</span>
            </div>

            <div className="space-y-6">
                {teamData.map((member) => (
                    <div key={member.user_id} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-700">{member.full_name}</span>
                                {member.workload_status !== 'Optimal' && (
                                    <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter ${statusTextColors[member.workload_status as keyof typeof statusTextColors]}`}>
                                        <ShieldExclamationIcon className="w-3 h-3" />
                                        {member.workload_status}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs font-black text-slate-500 uppercase">{member.active_tasks} Active</span>
                        </div>

                        <div className="flex items-center gap-1.5 h-2 w-full">
                            {/* Bar divided into segments for active vs completed for that user overall (simplified) */}
                            <div className="flex-1 h-full bg-slate-100 rounded-full overflow-hidden flex">
                                <div
                                    className={`h-full ${statusColors[member.workload_status as keyof typeof statusColors]} transition-all duration-700`}
                                    style={{ width: `${Math.min((member.active_tasks / 10) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                            <span>{member.overdue_tasks} OVERDUE</span>
                            <span>{member.completed_tasks} COMPLETED</span>
                        </div>
                    </div>
                ))}

                {teamData.length === 0 && (
                    <p className="text-center text-slate-400 text-sm italic">No data available for team members.</p>
                )}
            </div>
        </div>
    );
}
