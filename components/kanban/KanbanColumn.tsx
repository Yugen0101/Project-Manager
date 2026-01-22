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
        <div className={`flex-shrink-0 w-80 rounded-2xl flex flex-col max-h-full border transition-colors ${isWipExceeded ? 'bg-red-50 border-red-200' :
            isWipWarning ? 'bg-orange-50 border-orange-200' :
                'bg-slate-50/50 border-slate-100'
            }`}>
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className={`font-bold ${isWipExceeded ? 'text-red-700' : 'text-slate-700'}`}>{title}</h3>
                    <div className="flex items-center gap-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${isWipExceeded ? 'bg-red-100 border-red-300 text-red-700' :
                            isWipWarning ? 'bg-orange-100 border-orange-300 text-orange-700' :
                                'bg-white border-slate-200 text-slate-400'
                            }`}>
                            {tasks.length}{wipLimit ? ` / ${wipLimit}` : ''}
                        </span>
                        {isWipExceeded && (
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter animate-pulse">
                                OVER CAPACITY
                            </span>
                        )}
                    </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                    </svg>
                </button>
            </div>

            <div
                ref={setNodeRef}
                className="flex-1 p-3 overflow-y-auto min-h-[200px] space-y-3"
            >
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <KanbanTask key={task.id} task={task} role={role} isReadOnly={isReadOnly} />
                    ))}
                </SortableContext>

                {tasks.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No tasks</p>
                    </div>
                )}
            </div>
        </div>
    );
}
