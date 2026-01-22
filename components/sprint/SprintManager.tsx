'use client';

import { useState } from 'react';
import {
    PlusIcon,
    PlayIcon,
    CheckBadgeIcon,
    CalendarIcon,
    Bars2Icon,
    ChevronDownIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { createSprint, updateSprintStatus, addTasksToSprint } from '@/app/actions/sprints';

interface Sprint {
    id: string;
    name: string;
    goal: string;
    status: 'planned' | 'active' | 'completed';
    start_date: string;
    end_date: string;
}

export default function SprintManager({
    projectId,
    sprints,
    tasks
}: {
    projectId: string;
    sprints: Sprint[];
    tasks: any[];
}) {
    const [isCreating, setIsCreating] = useState(false);
    const [expandedSprints, setExpandedSprints] = useState<Record<string, boolean>>({
        'backlog': true
    });

    // Group tasks
    const activeSprint = sprints.find(s => s.status === 'active');
    const plannedSprints = sprints.filter(s => s.status === 'planned');
    const backlogTasks = tasks.filter(t => !t.sprint_id);

    const toggleExpand = (id: string) => {
        setExpandedSprints(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCreateSprint = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            goal: formData.get('goal') as string,
            start_date: formData.get('start_date') as string,
            end_date: formData.get('end_date') as string,
        };

        const result = await createSprint(projectId, data);
        if (result.success) {
            setIsCreating(false);
        } else {
            alert(result.error);
        }
    };

    const handleUpdateStatus = async (sprintId: string, status: string) => {
        const result = await updateSprintStatus(sprintId, status, projectId);
        if (!result.success) alert(result.error);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Bars2Icon className="w-5 h-5 text-primary-600" />
                    Sprint Backlog
                </h3>
                <button
                    onClick={() => setIsCreating(true)}
                    className="btn-primary-sm flex items-center gap-2"
                >
                    <PlusIcon className="w-4 h-4" />
                    Create Sprint
                </button>
            </div>

            {/* Create Sprint Modal/Form Overlay (Simplified for now) */}
            {isCreating && (
                <div className="card p-4 border-2 border-primary-100 bg-primary-50/30 mb-6 animate-in slide-in-from-top-4">
                    <form onSubmit={handleCreateSprint} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="name" placeholder="Sprint Name (e.g. Iteration 1)" required className="input" />
                            <input name="goal" placeholder="Sprint Goal" className="input" />
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Start Date</label>
                                <input name="start_date" type="date" required className="input" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">End Date</label>
                                <input name="end_date" type="date" required className="input" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setIsCreating(false)} className="btn-secondary-sm">Cancel</button>
                            <button type="submit" className="btn-primary-sm">Create</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Active Sprint Section */}
            {activeSprint && (
                <div className="card border-primary-200 overflow-hidden mb-6">
                    <div className="p-4 bg-primary-50 flex items-center justify-between border-b border-primary-100">
                        <div className="flex items-center gap-3">
                            <button onClick={() => toggleExpand(activeSprint.id)}>
                                {expandedSprints[activeSprint.id] ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
                            </button>
                            <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded animate-pulse uppercase">Active</span>
                            <h4 className="font-bold text-primary-900">{activeSprint.name}</h4>
                            <span className="text-xs text-primary-600 font-medium">{format(new Date(activeSprint.start_date), 'MMM d')} - {format(new Date(activeSprint.end_date), 'MMM d')}</span>
                        </div>
                        <button
                            onClick={() => handleUpdateStatus(activeSprint.id, 'completed')}
                            className="btn-primary-sm bg-emerald-600 hover:bg-emerald-700 border-none flex items-center gap-2"
                        >
                            <CheckBadgeIcon className="w-4 h-4" />
                            Complete Sprint
                        </button>
                    </div>
                    {expandedSprints[activeSprint.id] && (
                        <div className="p-2 divide-y divide-slate-100">
                            {tasks.filter(t => t.sprint_id === activeSprint.id).map(task => (
                                <TaskRow key={task.id} task={task} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Planned Sprints */}
            {plannedSprints.map(sprint => (
                <div key={sprint.id} className="card overflow-hidden">
                    <div className="p-4 bg-slate-50 flex items-center justify-between border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <button onClick={() => toggleExpand(sprint.id)}>
                                {expandedSprints[sprint.id] ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
                            </button>
                            <h4 className="font-bold text-slate-700">{sprint.name}</h4>
                            <span className="text-xs text-slate-400 font-medium">{format(new Date(sprint.start_date), 'MMM d')} - {format(new Date(sprint.end_date), 'MMM d')}</span>
                        </div>
                        <button
                            onClick={() => handleUpdateStatus(sprint.id, 'active')}
                            className="btn-secondary-sm flex items-center gap-2 border-primary-200 text-primary-600 hover:bg-primary-50"
                        >
                            <PlayIcon className="w-4 h-4" />
                            Start Sprint
                        </button>
                    </div>
                    {expandedSprints[sprint.id] && (
                        <div className="p-2 space-y-1">
                            {tasks.filter(t => t.sprint_id === sprint.id).map(task => (
                                <TaskRow key={task.id} task={task} />
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {/* Backlog Section */}
            <div className="card overflow-hidden">
                <div className="p-4 bg-slate-100/50 flex items-center justify-between border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <button onClick={() => toggleExpand('backlog')}>
                            {expandedSprints['backlog'] ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
                        </button>
                        <h4 className="font-bold text-slate-900">Project Backlog</h4>
                        <span className="text-xs font-black px-2 py-0.5 bg-white border border-slate-200 text-slate-400 rounded-full">
                            {backlogTasks.length} tasks
                        </span>
                    </div>
                </div>
                {expandedSprints['backlog'] && (
                    <div className="p-2">
                        {backlogTasks.map(task => (
                            <TaskRow key={task.id} task={task} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function TaskRow({ task }: { task: any }) {
    return (
        <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg group transition-colors">
            <div className="flex items-center gap-4">
                <div className={`w-1 h-8 rounded-full ${task.priority === 'critical' ? 'bg-red-500' :
                    task.priority === 'high' ? 'bg-red-400' :
                        task.priority === 'medium' ? 'bg-orange-400' :
                            'bg-blue-400'
                    }`} />
                <div>
                    <p className="text-sm font-bold text-slate-900">{task.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-400 uppercase letter-tracking-tighter">
                        <span>{task.id.slice(0, 8)}</span>
                        <span className={`px-1.5 py-0.5 rounded border ${task.status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                            'bg-slate-50 border-slate-200 text-slate-400'
                            }`}>{task.status.replace('_', ' ')}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                {task.assigned_user && (
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border-2 border-white shadow-sm">
                        {task.assigned_user.full_name.charAt(0)}
                    </div>
                )}
            </div>
        </div>
    );
}
