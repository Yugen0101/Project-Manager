'use client';

import { useState } from 'react';
import { updateTaskStatus } from '@/app/actions/tasks';
import {
    CheckBadgeIcon,
    PlayCircleIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface TaskStatusManagerProps {
    task: any;
    columns: any[];
    projectId: string;
}

export default function TaskStatusManager({ task, columns, projectId }: TaskStatusManagerProps) {
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (columnName: string) => {
        setLoading(true);
        try {
            // Find the column ID based on name
            const targetColumn = columns.find(c =>
                c.name.toLowerCase().includes(columnName.toLowerCase())
            );

            if (!targetColumn) {
                toast.error(`Column "${columnName}" not found in project workflow.`);
                setLoading(false);
                return;
            }

            const result = await updateTaskStatus(task.id, targetColumn.id, projectId);

            if (result.success) {
                toast.success(`Task unit synchronized: ${columnName}`);
            } else {
                toast.error(result.error || 'Failed to update task status.');
            }
        } catch (err) {
            console.error('Status update error:', err);
            toast.error('An unexpected error occurred during status transition.');
        } finally {
            setLoading(false);
        }
    };

    // Determine available actions based on current status
    const isNotStarted = task.status === 'not_started';
    const isInProgress = task.status === 'in_progress';
    const isCompleted = task.status === 'completed';

    if (isCompleted) {
        return (
            <div className="flex items-center justify-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest gap-2">
                <CheckBadgeIcon className="w-5 h-5" />
                Objective Finalized
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {isNotStarted && (
                <button
                    onClick={() => handleUpdate('In Progress')}
                    disabled={loading}
                    className="w-full btn-primary py-4 flex items-center justify-center gap-3 shadow-xl shadow-[#d97757]/20 disabled:opacity-50"
                >
                    {loading ? (
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    ) : (
                        <PlayCircleIcon className="w-5 h-5" />
                    )}
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">Start Progress</span>
                </button>
            )}

            {isInProgress && (
                <button
                    onClick={() => handleUpdate('Done')}
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 rounded-2xl transition-all disabled:opacity-50"
                >
                    {loading ? (
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    ) : (
                        <CheckBadgeIcon className="w-5 h-5" />
                    )}
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">Mark as Complete</span>
                </button>
            )}
        </div>
    );
}
