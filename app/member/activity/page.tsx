import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ActivityFeed from '@/components/activity/ActivityFeed';
import { ClockIcon } from '@heroicons/react/24/outline';

export default async function MemberActivityPage() {
    return (
        <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-accent-500 mb-2">
                        <ClockIcon className="w-5 h-5 shadow-sm" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Activity Feed</span>
                    </div>
                    <h1 className="text-5xl font-black text-[#1c1917] tracking-tighter uppercase leading-none">
                        Activity <span className="text-accent-500">Stream</span>
                    </h1>
                    <p className="text-[#1c1917]/50 font-medium text-lg italic font-serif">Real-time updates from across your team.</p>
                </div>
            </div>

            <div className="card bg-white border-[#e5dec9] p-10 shadow-lg shadow-[#d9cfb0]/20 rounded-[3rem]">
                <div className="space-y-12">
                    <ActivityFeed />
                </div>
            </div>
        </div>
    );
}
