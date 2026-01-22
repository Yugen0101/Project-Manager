'use client';

import { useEffect, useState } from 'react';
import {
    getProjectHealth,
    getRiskIndicators
} from '@/app/actions/analytics';
import {
    ExclamationTriangleIcon,
    ClockIcon,
    CheckCircleIcon,
    ArrowTrendingUpIcon,
    ShieldExclamationIcon
} from '@heroicons/react/24/outline';

export default function ProjectInsights({ projectId }: { projectId: string }) {
    const [health, setHealth] = useState<any>(null);
    const [risks, setRisks] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const [hRes, rRes] = await Promise.all([
                getProjectHealth(projectId),
                getRiskIndicators(projectId)
            ]);

            if (hRes.success) setHealth(hRes.data);
            if (rRes.success) setRisks(rRes.data);
            setLoading(false);
        }
        loadData();
    }, [projectId]);

    if (loading) return <div className="h-48 flex items-center justify-center text-slate-400 font-bold animate-pulse">Analyzing Project Data...</div>;
    if (!health) return null;

    const statusColors = {
        'On Track': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'At Risk': 'bg-orange-50 text-orange-700 border-orange-100',
        'Delayed': 'bg-red-50 text-red-700 border-red-100'
    };

    const statusIcons = {
        'On Track': <CheckCircleIcon className="w-5 h-5" />,
        'At Risk': <ExclamationTriangleIcon className="w-5 h-5" />,
        'Delayed': <ShieldExclamationIcon className="w-5 h-5" />
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Health Status Card */}
                <div className={`card p-6 border-2 ${statusColors[health.health_status as keyof typeof statusColors]}`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Project Health</span>
                        {statusIcons[health.health_status as keyof typeof statusIcons]}
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h4 className="text-2xl font-black">{health.health_status}</h4>
                    </div>
                    <p className="text-xs mt-2 opacity-80 font-medium">Based on {health.overdue_tasks} overdue tasks out of {health.total_tasks}.</p>
                </div>

                {/* Progress Card */}
                <div className="card p-6 border-primary-100 bg-primary-50/20">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary-600">Completion</span>
                        <ArrowTrendingUpIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h4 className="text-4xl font-black text-slate-900">{health.progress_percentage}%</h4>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full mt-3 overflow-hidden">
                        <div
                            className="h-full bg-primary-600 rounded-full transition-all duration-1000"
                            style={{ width: `${health.progress_percentage}%` }}
                        />
                    </div>
                </div>

                {/* Stuck Tasks Count */}
                <div className="card p-6 bg-slate-900 text-white border-0 shadow-lg">
                    <div className="flex items-center justify-between mb-2 text-primary-400">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Workflow Risks</span>
                        <ClockIcon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-3">
                        <h4 className="text-4xl font-black">{(risks?.stuckTasks?.length || 0) + (risks?.overdueRisks?.length || 0)}</h4>
                        <div className="text-xs font-bold leading-tight text-slate-400">
                            Stuck or High-Priority<br />Overdue Tasks
                        </div>
                    </div>
                </div>
            </div>

            {/* Risk Indicators List */}
            {((risks?.stuckTasks?.length || 0) > 0 || (risks?.overdueRisks?.length || 0) > 0) && (
                <div className="card p-4 border-slate-100 bg-slate-50/50">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                        <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />
                        Specific Delivery Risks
                    </h5>
                    <div className="flex flex-wrap gap-2">
                        {risks.overdueRisks.map((task: any) => (
                            <div key={task.id} className="bg-white px-3 py-1.5 rounded-lg border border-red-200 flex items-center gap-2 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-xs font-bold text-slate-700">CRITICAL OVERDUE: {task.title}</span>
                            </div>
                        ))}
                        {risks.stuckTasks.map((task: any) => (
                            <div key={task.id} className="bg-white px-3 py-1.5 rounded-lg border border-orange-200 flex items-center gap-2 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                <span className="text-xs font-bold text-slate-700">STUCK: {task.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
