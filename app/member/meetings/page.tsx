import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { notFound } from 'next/navigation';
import { 
    VideoCameraIcon
} from '@heroicons/react/24/outline';
import MeetingList from '@/components/meetings/MeetingList';
import { getAllUserMeetings } from '@/app/actions/meetings';

export default async function MemberMeetingsPage() {
    const user = await getCurrentUser();
    if (!user || user.role !== 'member') {
        return notFound();
    }

    const result = await getAllUserMeetings();
    const meetings = (result.success ? result.data : []) as any;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-sm font-bold text-purple-600 uppercase tracking-widest">Connect</h2>
                    <h1 className="text-4xl font-black text-slate-900">Upcoming Syncs</h1>
                    <p className="text-slate-500 text-lg font-medium">View and join all scheduled meetings for your assigned projects.</p>
                </div>
            </div>

            <div className="card p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                        <VideoCameraIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Meeting Schedule</h3>
                        <p className="text-sm text-slate-400 font-medium">Join your team project sessions</p>
                    </div>
                </div>

                <MeetingList 
                    meetings={meetings}
                    projectId="" 
                    currentUser={user}
                />
            </div>
        </div>
    );
}
