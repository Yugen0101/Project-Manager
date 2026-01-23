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
        opacity: isDragging ? 0.3 : 1,
    };

    const isBlocked = task.dependencies && task.dependencies.length > 0;
    const isSprintLocked = task.sprint?.status === 'completed';

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-white border border-[#e5dec9] rounded-2xl p-5 transition-all duration-500 group shadow-sm ${isOverlay ? 'shadow-2xl shadow-[#d97757]/20 ring-2 ring-[#d97757] border-[#d97757] scale-105 z-50' :
                isBlocked ? 'bg-[#fdfcf9] border-dashed border-red-200 opacity-80 border-2' :
                    'hover:border-[#d97757]/40 hover:shadow-xl hover:shadow-[#d9cfb0]/20'
                } ${isSprintLocked || isReadOnly ? 'cursor-not-allowed grayscale-[0.2]' : 'cursor-grab active:cursor-grabbing'}`}
        >
            <div className="space-y-4">
                {/* Agile Badges */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-[0.1em] px-2.5 py-0.5 rounded-full border ${task.priority === 'critical' ? 'bg-red-800 text-white border-red-900 shadow-sm' :
                            task.priority === 'high' ? 'bg-red-50 text-red-700 border-red-100' :
                                task.priority === 'medium' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                    'bg-blue-50 text-blue-700 border-blue-100'
                            }`}>
                            {task.priority || 'medium'}
                        </span>

                        {isBlocked && (
                            <span className="flex items-center gap-1 bg-red-50 text-red-700 text-[9px] font-black uppercase tracking-[0.1em] px-2.5 py-0.5 rounded-full border border-red-100 italic">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2.5 h-2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                                BLOCKED
                            </span>
                        )}
                    </div>
                    <div className="flex -space-x-2">
                        <div className="w-7 h-7 rounded-full bg-[#f7f3ed] border-2 border-white flex items-center justify-center text-[10px] font-black text-[#d97757] shadow-sm">
                            {task.assigned_user?.full_name?.charAt(0) || '?'}
                        </div>
                    </div>
                </div>

                <div className="flex items-start justify-between gap-4">
                    <h4 className="text-[13px] font-black text-[#1c1917] leading-relaxed uppercase tracking-tight group-hover:text-[#d97757] transition-colors">
                        {task.title}
                    </h4>
                    {!isReadOnly && (
                        <Link
                            href={`/${role}/tasks/${task.id}`}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="opacity-0 group-hover:opacity-100 p-2 text-[#1c1917]/20 hover:text-[#d97757] hover:bg-[#f7f3ed] rounded-xl transition-all"
                        >
                            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        </Link>
                    )}
                </div>

                {/* Footer info */}
                <div className="pt-4 flex items-center justify-between text-[#1c1917]/30 border-t border-[#f7f3ed]">
                    <div className="flex items-center gap-4">
                        {task.due_date && (
                            <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${new Date(task.due_date) < new Date() ? 'text-red-700' : 'text-[#1c1917]/30'
                                }`}>
                                <ClockIcon className="w-3 h-3" />
                                {format(new Date(task.due_date), 'MMM dd')}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest">
                            <ChatBubbleLeftIcon className="w-3 h-3" />
                            0
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
