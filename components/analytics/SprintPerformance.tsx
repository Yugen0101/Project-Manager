'use client';

import { useEffect, useState } from 'react';
import { getSprintAnalytics } from '@/app/actions/analytics';
import {
    PresentationChartBarIcon,
    ArrowRightCircleIcon
} from '@heroicons/react/24/outline';

export default function SprintPerformance({ projectId }: { projectId: string }) {
    const [sprints, setSprints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const res = await getSprintAnalytics(projectId);
            if (res.success) setSprints(res.data);
            setLoading(false);
        }
        loadData();
    }, [projectId]);

    if (loading) return <div className="h-48 flex items-center justify-center text-slate-400 font-bold animate-pulse">Aggregating Sprint Data...</div>;

    return (
        <div className="card overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <PresentationChartBarIcon className="w-5 h-5 text-purple-600" />
                    Iteration Performance
                </h3>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sprints Comparison</span>
            </div>
            <div className="divide-y divide-slate-100">
                {sprints.slice(0, 5).map((sprint) => (
                    <div key={sprint.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h4 className="font-bold text-slate-900">{sprint.name}</h4>
                                <p className={`text-[10px] font-black uppercase tracking-widest ${sprint.status === 'completed' ? 'text-emerald-600' : 'text-purple-600'}`}>
                                    {sprint.status}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black text-slate-900">{sprint.completionRate}%</span>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Completion</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                                <div
                                    className={`h-full ${sprint.status === 'completed' ? 'bg-emerald-500' : 'bg-purple-600'} transition-all duration-1000`}
                                    style={{ width: `${sprint.completionRate}%` }}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Total</p>
                                    <p className="text-sm font-black text-slate-700">{sprint.plannedTasks}</p>
                                </div>
                                <div className="bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
                                    <p className="text-[10px] font-bold text-emerald-400 uppercase leading-none mb-1">Done</p>
                                    <p className="text-sm font-black text-emerald-700">{sprint.completedTasks}</p>
                                </div>
                                <div className="bg-orange-50 p-1.5 rounded-lg border border-orange-100">
                                    <p className="text-[10px] font-bold text-orange-400 uppercase leading-none mb-1">Carry</p>
                                    <p className="text-sm font-black text-orange-700">{sprint.remainingTasks}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {sprints.length === 0 && (
                    <div className="p-12 text-center">
                        <ArrowRightCircleIcon className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-500 text-sm font-medium">No iteration data available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
