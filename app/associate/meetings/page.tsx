import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { notFound } from 'next/navigation';
import { 
    VideoCameraIcon
} from '@heroicons/react/24/outline';
import MeetingList from '@/components/meetings/MeetingList';
import { getAllUserMeetings } from '@/app/actions/meetings';

export default async function AssociateMeetingsPage() {
    const user = await getCurrentUser();
    if (!user || user.role !== 'associate') {
        return notFound();
    }

    const result = await getAllUserMeetings();
    const meetings = (result.success ? result.data : []) as any;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest">Project Syncs</h2>
                    <h1 className="text-4xl font-black text-slate-900">Meetings</h1>
                    <p className="text-slate-500 text-lg font-medium">Manage and lead your team synchronizations from one place.</p>
                </div>
            </div>

            <div className="card p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                        <VideoCameraIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Your Scheduled Meetings</h3>
                        <p className="text-sm text-slate-400 font-medium">Direct control over active project syncs</p>
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
