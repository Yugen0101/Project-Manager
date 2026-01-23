'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
    VideoCameraIcon, 
    PlusIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import MeetingList from './MeetingList';
import ScheduleMeetingModal from './ScheduleMeetingModal';
import { getProjectMeetings } from '@/app/actions/meetings';

export default function ProjectMeetings({ 
    projectId, 
    members, 
    currentUser 
}: { 
    projectId: string;
    members: any[];
    currentUser: any;
}) {
    const [meetings, setMeetings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Permission check for scheduling
    const canSchedule = currentUser.role === 'admin' || 
                        (currentUser.role === 'associate' && currentUser.can_schedule_meetings);

    const loadMeetings = useCallback(async () => {
        setLoading(true);
        const result = await getProjectMeetings(projectId);
        if (result.success) {
            setMeetings((result as any).data || []);
        }
        setLoading(false);
    }, [projectId]);

    useEffect(() => {
        loadMeetings();
    }, [loadMeetings]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <VideoCameraIcon className="w-6 h-6 text-primary-600" />
                    <h3 className="text-xl font-bold text-slate-900">Project Meetings</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={loadMeetings}
                        disabled={loading}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        title="Refresh meetings"
                    >
                        <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    {canSchedule && (
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary py-2 px-4 text-xs flex items-center gap-2"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Schedule Meeting
                        </button>
                    )}
                </div>
            </div>

            {loading && meetings.length === 0 ? (
                <div className="h-48 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <MeetingList 
                    meetings={meetings} 
                    projectId={projectId}
                    currentUser={currentUser}
                />
            )}

            {isModalOpen && (
                <ScheduleMeetingModal 
                    projectId={projectId}
                    members={members}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={loadMeetings}
                />
            )}
        </div>
    );
}
