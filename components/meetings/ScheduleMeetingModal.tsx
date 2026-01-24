'use client';

import { useState } from 'react';
import {
    XMarkIcon,
    VideoCameraIcon,
    CalendarIcon,
    ClockIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import { scheduleMeeting } from '@/app/actions/meetings';
import { toast } from 'sonner';

export default function ScheduleMeetingModal({
    projectId,
    members,
    onClose,
    onSuccess
}: {
    projectId: string;
    members: any[];
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('30');
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const scheduledAt = new Date(`${date}T${time}`).toISOString();

            const result = await scheduleMeeting({
                projectId,
                title,
                description,
                scheduledAt,
                duration: parseInt(duration),
                participantIds: selectedParticipants,
            }) as any;

            if (result.success) {
                toast.success('Meeting scheduled and synced with Zoom');
                onSuccess();
                onClose();
            } else {
                toast.error(result.error || 'Tactical failure during meeting allocation');
            }
        } catch (err: any) {
            console.error('Schedule meeting error:', err);
            toast.error('Connection severed: Failed to reach command node');
        } finally {
            setLoading(false);
        }
    };

    const toggleParticipant = (id: string) => {
        setSelectedParticipants((prev: string[]) =>
            prev.includes(id) ? prev.filter((p: string) => p !== id) : [...prev, id]
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                            <VideoCameraIcon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-900">Schedule Zoom Meeting</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-all">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meeting Title</label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={(e: any) => setTitle(e.target.value)}
                            placeholder="e.g., Weekly Sync"
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e: any) => setDescription(e.target.value)}
                            placeholder="Agenda or notes..."
                            className="input min-h-[80px]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                <span className="flex items-center gap-1">
                                    <CalendarIcon className="w-3.5 h-3.5" />
                                    Date
                                </span>
                            </label>
                            <input
                                required
                                type="date"
                                value={date}
                                onChange={(e: any) => setDate(e.target.value)}
                                className="input"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                <span className="flex items-center gap-1">
                                    <ClockIcon className="w-3.5 h-3.5" />
                                    Time
                                </span>
                            </label>
                            <input
                                required
                                type="time"
                                value={time}
                                onChange={(e: any) => setTime(e.target.value)}
                                className="input"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Duration (minutes)</label>
                        <select
                            value={duration}
                            onChange={(e: any) => setDuration(e.target.value)}
                            className="input"
                        >
                            <option value="15">15 Minutes</option>
                            <option value="30">30 Minutes</option>
                            <option value="45">45 Minutes</option>
                            <option value="60">1 Hour</option>
                            <option value="90">1.5 Hours</option>
                            <option value="120">2 Hours</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            <span className="flex items-center gap-1">
                                <UserGroupIcon className="w-3.5 h-3.5" />
                                Invite Participants
                            </span>
                        </label>
                        <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1 custom-scrollbar bg-slate-50/30">
                            {members.map((member: any) => (
                                <label key={member.users.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-md cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                                    <input
                                        type="checkbox"
                                        checked={selectedParticipants.includes(member.users.id)}
                                        onChange={() => toggleParticipant(member.users.id)}
                                        className="w-4 h-4 rounded text-primary-600 border-slate-300 focus:ring-primary-500"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-700">{member.users.full_name}</span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase">{member.role}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !title || !date || !time}
                            className="flex-1 btn-primary disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Syncing Zoom...
                                </span>
                            ) : 'Schedule Meeting'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
