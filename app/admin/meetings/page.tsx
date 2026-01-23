import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { notFound } from 'next/navigation';
import { 
    VideoCameraIcon,
    CalendarIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import MeetingList from '@/components/meetings/MeetingList';
import { getAllUserMeetings } from '@/app/actions/meetings';

export default async function AdminMeetingsPage() {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
        return notFound();
    }

    const result = await getAllUserMeetings();
    const meetings = (result.success ? result.data : []) as any;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-sm font-bold text-primary-600 uppercase tracking-widest">Global Sync</h2>
                    <h1 className="text-4xl font-black text-slate-900">Zoom Meetings</h1>
                    <p className="text-slate-500 text-lg font-medium">Manage all active and upcoming synchronizations across the organization.</p>
                </div>
            </div>

            <div className="card p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary-100 text-primary-600 rounded-2xl">
                            <VideoCameraIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">All Scheduled Sessions</h3>
                            <p className="text-sm text-slate-400 font-medium">Sync with teams in real-time</p>
                        </div>
                    </div>
                </div>

                <MeetingList 
                    meetings={meetings}
                    projectId="" // Global view handles its own join logic
                    currentUser={user}
                />
            </div>
        </div>
    );
}
