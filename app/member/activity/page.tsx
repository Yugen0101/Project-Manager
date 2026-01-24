import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ActivityFeed from '@/components/activity/ActivityFeed';
import { ClockIcon } from '@heroicons/react/24/outline';

export default async function MemberActivityPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-bold text-primary-500 uppercase tracking-widest">Global Updates</h2>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Recent Activity</h1>
                </div>
                <div className="p-3 bg-white rounded-2xl text-primary-500 shadow-lg shadow-primary-500/10 border border-slate-50">
                    <ClockIcon className="w-8 h-8" />
                </div>
            </div>

            <div className="card p-8 border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="space-y-8">
                    <p className="text-slate-500 font-medium">
                        Stay up to date with the latest changes across all your projects.
                        Activity includes task status updates, assignments, and discussions.
                    </p>
                    <ActivityFeed />
                </div>
            </div>
        </div>
    );
}
