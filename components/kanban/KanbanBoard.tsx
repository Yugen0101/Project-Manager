'use client';

import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import KanbanColumn from '@/components/kanban/KanbanColumn';
import KanbanTask from '@/components/kanban/KanbanTask';
import { updateTaskStatus } from '@/app/actions/tasks';

export default function KanbanBoard({
    initialTasks,
    initialColumns,
    projectId,
    role = 'member',
    isReadOnly: initialIsReadOnly = false
}: {
    initialTasks: any[],
    initialColumns: any[],
    projectId: string,
    role?: 'admin' | 'member' | 'associate' | 'guest',
    isReadOnly?: boolean
}) {
    const isReadOnly = initialIsReadOnly || role === 'guest';
    const [tasks, setTasks] = useState(initialTasks);
    const [columns, setColumns] = useState(initialColumns);
    const [activeTask, setActiveTask] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragStart(event: DragStartEvent) {
        if (isReadOnly) return;
        const { active } = event;
        const task = tasks.find((t) => t.id === active.id);
        setActiveTask(task);
        setError(null);
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeTask = tasks.find((t) => t.id === activeId);
        if (!activeTask) return;

        // Find the column dropped into
        const overColumn = columns.find((c) => c.id === overId);
        const overTask = tasks.find((t) => t.id === overId);

        let newColumnId = activeTask.kanban_column_id;

        if (overColumn) {
            newColumnId = overColumn.id;
        } else if (overTask) {
            newColumnId = overTask.kanban_column_id;
        }

        if (newColumnId !== activeTask.kanban_column_id) {
            // Optimistic update
            const oldTasks = [...tasks];
            setTasks((prev) =>
                prev.map((t) =>
                    t.id === activeId ? { ...t, kanban_column_id: newColumnId } : t
                )
            );

            // Server update
            const result = await updateTaskStatus(activeId as string, newColumnId, projectId);

            if (result?.error) {
                // Rollback on error
                setTasks(oldTasks);
                setError(result.error);

                // Show floating alert for 3 seconds
                setTimeout(() => setError(null), 3000);
            }
        }
    }

    return (
        <div className="flex flex-col h-full gap-4 relative">
            {/* Agile Error Alert */}
            {error && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-3 animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    {error}
                </div>
            )}

            <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    {columns.map((column) => (
                        <KanbanColumn
                            key={column.id}
                            id={column.id}
                            title={column.name}
                            wipLimit={column.wip_limit}
                            tasks={tasks.filter((t) => t.kanban_column_id === column.id)}
                            role={role}
                            isReadOnly={isReadOnly}
                        />
                    ))}

                    <DragOverlay>
                        {activeTask ? (
                            <KanbanTask task={activeTask} isOverlay role={role} />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
}
