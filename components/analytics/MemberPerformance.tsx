'use client';

import { useEffect, useState } from 'react';
import { getMyPerformance } from '@/app/actions/analytics';
import {
    CheckBadgeIcon,
    ClockIcon,
    BoltIcon
} from '@heroicons/react/24/outline';

export default function MemberPerformance() {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const res = await getMyPerformance();
            if (res.success) setMetrics(res.data);
            setLoading(false);
        }
        loadData();
    }, []);

    if (loading) return <div className="h-24 animate-pulse bg-slate-900/40 rounded-xl border border-slate-800/50" />;
    if (!metrics) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card p-6 bg-white border-slate-50 group hover:border-emerald-100 transition-all shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-500 border border-emerald-100 shadow-sm shadow-emerald-500/5">
                        <CheckBadgeIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Resolved</p>
                        <p className="text-2xl font-bold text-slate-900 tracking-tight">{metrics.completed_tasks}</p>
                    </div>
                </div>
            </div>

            <div className="card p-6 bg-white border-slate-50 group hover:border-rose-100 transition-all shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500 border border-rose-100 shadow-sm shadow-rose-500/5">
                        <ClockIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Overdue</p>
                        <p className="text-2xl font-bold text-rose-500 tracking-tight">{metrics.overdue_tasks}</p>
                    </div>
                </div>
            </div>

            <div className="card p-6 bg-white border-slate-50 group hover:border-primary-100 transition-all shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-primary-50 rounded-xl text-primary-500 border border-primary-100 shadow-sm shadow-primary-500/5">
                        <BoltIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Efficiency</p>
                        <p className="text-2xl font-bold text-slate-900 tracking-tight">
                            {metrics.completed_tasks + metrics.active_tasks > 0
                                ? Math.round((metrics.completed_tasks / (metrics.completed_tasks + metrics.active_tasks)) * 100)
                                : 0}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
