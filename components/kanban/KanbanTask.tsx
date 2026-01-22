'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ClockIcon, ChatBubbleLeftIcon, PaperClipIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import Link from 'next/link';

export default function KanbanTask({
    task,
    isOverlay = false,
    role = 'member',
    isReadOnly = false
}: {
    task: any,
    isOverlay?: boolean,
    role?: string,
    isReadOnly?: boolean
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id, disabled: isReadOnly });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    const isBlocked = task.dependencies && task.dependencies.length > 0;
    const isSprintLocked = task.sprint?.status === 'completed';

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`card p-4 transition-all group ${isOverlay ? 'shadow-2xl ring-2 ring-primary-500 border-primary-500 scale-105' :
                isBlocked ? 'bg-slate-50 border-dashed border-red-200 opacity-80 border-2' :
                    'hover:border-primary-300'
                } ${isSprintLocked || isReadOnly ? 'cursor-not-allowed grayscale-[0.2]' : 'cursor-grab active:cursor-grabbing'}`}
        >
            <div className="space-y-3">
                {/* Agile Badges */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${task.priority === 'critical' ? 'bg-red-600 text-white shadow-sm' :
                            task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                task.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                                    'bg-blue-100 text-blue-700'
                            }`}>
                            {task.priority || 'medium'}
                        </span>

                        {isBlocked && (
                            <span className="flex items-center gap-1 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-red-200">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                                Blocked
                            </span>
                        )}

                        {isSprintLocked && (
                            <span className="flex items-center gap-1 bg-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                                Locked
                            </span>
                        )}
                    </div>
                    <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {task.assigned_user?.full_name?.charAt(0) || '?'}
                        </div>
                    </div>
                </div>

                <div className="flex items-start justify-between gap-4">
                    <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-primary-600 transition-colors">
                        {task.title}
                    </h4>
                    {!isReadOnly && (
                        <Link
                            href={`/${role}/tasks/${task.id}`}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        >
                            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        </Link>
                    )}
                </div>

                {/* Footer info */}
                <div className="pt-3 flex items-center justify-between text-slate-400 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                        {task.due_date && (
                            <div className={`flex items-center gap-1 text-[10px] font-bold ${new Date(task.due_date) < new Date() ? 'text-red-500' : 'text-slate-400'
                                }`}>
                                <ClockIcon className="w-3.5 h-3.5" />
                                {format(new Date(task.due_date), 'MMM d')}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-[10px] font-bold">
                            <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                            0
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
