'use client';

import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import KanbanTask from '@/components/kanban/KanbanTask';

export default function KanbanColumn({
    id,
    title,
    tasks,
    wipLimit,
    role,
    isReadOnly = false
}: {
    id: string,
    title: string,
    tasks: any[],
    wipLimit?: number | null,
    role?: string,
    isReadOnly?: boolean
}) {
    const isWipExceeded = wipLimit ? tasks.length >= wipLimit : false;
    const isWipWarning = wipLimit ? tasks.length === wipLimit : false;

    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div className={`flex-shrink-0 w-80 rounded-[2rem] flex flex-col max-h-full border transition-all duration-500 ${isWipExceeded ? 'bg-red-50 border-red-200' :
            isWipWarning ? 'bg-orange-50 border-orange-200' :
                'bg-[#f7f3ed]/50 border-[#e5dec9]'
            }`}>
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h3 className={`font-black text-[11px] uppercase tracking-[0.2em] ${isWipExceeded ? 'text-red-700' : 'text-[#1c1917]'}`}>{title}</h3>
                    <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full border tracking-widest ${isWipExceeded ? 'bg-red-100 border-red-300 text-red-700 shadow-sm shadow-red-500/10' :
                            isWipWarning ? 'bg-orange-100 border-orange-300 text-orange-700 shadow-sm shadow-orange-500/10' :
                                'bg-white border-[#e5dec9] text-[#1c1917]/30'
                            }`}>
                            {tasks.length}{wipLimit ? ` / ${wipLimit}` : ''}
                        </span>
                        {isWipExceeded && (
                            <span className="text-[8px] font-black text-red-500 uppercase tracking-tighter animate-pulse italic">
                                SATURATION REACHED
                            </span>
                        )}
                    </div>
                </div>
                {!isReadOnly && (
                    <button className="text-[#1c1917]/20 hover:text-[#d97757] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                        </svg>
                    </button>
                )}
            </div>

            <div
                ref={setNodeRef}
                className="flex-1 p-4 overflow-y-auto min-h-[200px] space-y-4 custom-scrollbar"
            >
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <KanbanTask key={task.id} task={task} role={role} isReadOnly={isReadOnly} />
                    ))}
                </SortableContext>

                {tasks.length === 0 && (
                    <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-[#e5dec9]/60 rounded-[1.5rem] bg-white/30">
                        <p className="text-[10px] font-black text-[#1c1917]/20 uppercase tracking-[0.2em] italic">Stream Inactive</p>
                    </div>
                )}
            </div>
        </div>
    );
}
