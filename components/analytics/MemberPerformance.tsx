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

    if (loading) return <div className="h-24 animate-pulse bg-slate-100 rounded-xl" />;
    if (!metrics) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-4 bg-white border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <CheckBadgeIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Lifetime</p>
                        <p className="text-xl font-black text-slate-900">{metrics.completed_tasks}</p>
                    </div>
                </div>
            </div>

            <div className="card p-4 bg-white border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                        <ClockIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Overdue</p>
                        <p className="text-xl font-black text-slate-900">{metrics.overdue_tasks}</p>
                    </div>
                </div>
            </div>

            <div className="card p-4 bg-white border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                        <BoltIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Efficiency</p>
                        <p className="text-xl font-black text-slate-900">
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
