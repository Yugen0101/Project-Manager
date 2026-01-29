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
import { createTask, deleteTask } from '@/app/actions/tasks';
import { toast } from 'sonner';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';


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
    tasks,
    members,
    userRole = 'member',
    currentUserId
}: {
    projectId: string;
    sprints: Sprint[];
    tasks: any[];
    members: any[];
    userRole?: string;
    currentUserId?: string;
}) {
    const isMember = userRole === 'member';
    const [isCreating, setIsCreating] = useState(false);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [taskFormData, setTaskFormData] = useState({
        title: '',
        priority: 'medium',
        assigned_to: ''
    });
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
        if (!result.success) toast.error(result.error);
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await createTask({
            ...taskFormData,
            project_id: projectId
        });

        if (result.success) {
            toast.success('Task created');
            setIsAddingTask(false);
            setTaskFormData({ title: '', priority: 'medium', assigned_to: '' });
            window.location.reload();
        } else {
            toast.error(result.error);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm('Delete this task? This cannot be reversed.')) return;
        const result = await deleteTask(taskId, projectId);
        if (result.success) {
            toast.success('Task deleted');
            window.location.reload();
        } else {
            toast.error(result.error);
        }
    };


    return (
        <div className="space-y-6">
            <div className={`flex items-center ${userRole === 'admin' ? 'justify-between' : 'justify-end'} mb-8`}>
                {userRole === 'admin' && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="btn-primary !py-2.5 !px-6 !text-[10px] !rounded-xl shadow-lg shadow-accent-500/10"
                    >
                        <PlusIcon className="w-4 h-4" />
                        New Sprint
                    </button>
                )}
            </div>

            {/* Create Sprint Modal/Form Overlay */}
            {isCreating && (
                <div className="card !p-8 border-[#e5dec9] bg-white mb-8 animate-in slide-in-from-top-4 shadow-xl shadow-[#d9cfb0]/20 rounded-[2rem]">
                    <form onSubmit={handleCreateSprint} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[9px] font-semibold text-[#1c1917]/70 uppercase ml-2 tracking-widest">Sprint Name</label>
                                <input name="name" placeholder="E.g. Phase 1" required className="input" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-semibold text-[#1c1917]/70 uppercase ml-2 tracking-widest">Sprint Goal</label>
                                <input name="goal" placeholder="Primary objective..." className="input" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-semibold text-[#1c1917]/70 uppercase ml-2 tracking-widest">Start Date</label>
                                <input name="start_date" type="date" required className="input" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-semibold text-[#1c1917]/70 uppercase ml-2 tracking-widest">End Date</label>
                                <input name="end_date" type="date" required className="input" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setIsCreating(false)} className="btn-secondary !px-6 !py-2.5 !text-[10px] !rounded-xl !border-[#e5dec9]">CANCEL</button>
                            <button type="submit" className="btn-primary !px-6 !py-2.5 !text-[10px] !rounded-xl">CREATE SPRINT</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Active Sprint Section */}
            {activeSprint && (
                <div className="card !p-0 border-accent-500/30 overflow-hidden mb-8 shadow-xl shadow-accent-500/5 rounded-[2rem]">
                    <div className="p-6 bg-accent-500 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => toggleExpand(activeSprint.id)} className="text-white/40 hover:text-white transition-colors">
                                {expandedSprints[activeSprint.id] ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                            </button>
                            <div className="flex items-center gap-3">
                                <span className="bg-white/20 text-white text-[9px] font-medium px-2 py-1 rounded shadow-sm uppercase tracking-widest backdrop-blur-md">ACTIVE SPRINT</span>
                                <h4 className="font-semibold text-white uppercase tracking-tight text-lg">{activeSprint.name}</h4>
                            </div>
                            <div className="h-4 w-px bg-white/20 hidden md:block"></div>
                            <span className="text-[10px] text-white/60 font-medium uppercase tracking-widest hidden md:block">{format(new Date(activeSprint.start_date), 'MM.dd')} — {format(new Date(activeSprint.end_date), 'MM.dd')}</span>
                        </div>
                        {userRole === 'admin' && (
                            <button
                                onClick={() => handleUpdateStatus(activeSprint.id, 'completed')}
                                className="bg-white text-accent-500 px-5 py-2.5 rounded-xl font-semibold text-[10px] uppercase tracking-widest hover:bg-[#fdfcf9] transition-all shadow-lg"
                            >
                                COMPLETE SPRINT
                            </button>
                        )}
                    </div>
                    {expandedSprints[activeSprint.id] && (
                        <div className="p-4 space-y-1 bg-white">
                            {tasks.filter(t => t.sprint_id === activeSprint.id).map(task => (
                                <TaskRow key={task.id} task={task} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Planned Sprints */}
            <div className="space-y-4">
                {plannedSprints.map(sprint => (
                    <div key={sprint.id} className="card !p-0 border-[#e5dec9] overflow-hidden shadow-sm shadow-[#d9cfb0]/10 rounded-[2rem]">
                        <div className="p-5 bg-[#fdfcf9] flex items-center justify-between border-b border-[#e5dec9]">
                            <div className="flex items-center gap-4">
                                <button onClick={() => toggleExpand(sprint.id)} className="text-[#1c1917]/40 hover:text-accent-500 transition-colors">
                                    {expandedSprints[sprint.id] ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                                </button>
                                <h4 className="font-semibold text-[#1c1917] uppercase tracking-tight">{sprint.name}</h4>
                                <div className="h-4 w-px bg-[#e5dec9]"></div>
                                <span className="text-[10px] text-secondary-600 font-bold uppercase tracking-widest">{format(new Date(sprint.start_date), 'MM.dd.yyyy')}</span>
                            </div>
                            {userRole === 'admin' && (
                                <button
                                    onClick={() => handleUpdateStatus(sprint.id, 'active')}
                                    className="btn-secondary !px-5 !py-2.5 !text-[10px] !rounded-xl !border-[#e5dec9] !text-accent-500 hover:!bg-white"
                                >
                                    START SPRINT
                                </button>
                            )}
                        </div>
                        {expandedSprints[sprint.id] && (
                            <div className="p-4 space-y-1 bg-white">
                                {tasks.filter(t => t.sprint_id === sprint.id).map(task => (
                                    <TaskRow key={task.id} task={task} />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Backlog Section - Admin Only */}
            {userRole === 'admin' && (
                <div className="card !p-0 border-[#e5dec9] overflow-hidden shadow-sm shadow-[#d9cfb0]/10 rounded-[2.5rem] mt-12">
                    <div className="p-6 bg-[#f7f3ed] flex items-center justify-between border-b border-[#e5dec9]">
                        <div className="flex items-center gap-4">
                            <button onClick={() => toggleExpand('backlog')} className="text-[#1c1917]/40 hover:text-accent-500 transition-colors">
                                {expandedSprints['backlog'] ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                            </button>
                            <h4 className="font-semibold text-[#1c1917] uppercase tracking-[0.2em] text-sm">Backlog</h4>
                            <span className="text-[9px] font-bold px-3 py-1 bg-white border border-[#e5dec9] text-accent-500 rounded-xl shadow-sm uppercase tracking-widest">
                                {backlogTasks.length} Items
                            </span>
                        </div>
                        <button
                            onClick={() => setIsAddingTask(true)}
                            className="btn-primary !py-2.5 !px-5 !text-[10px] !rounded-xl shadow-lg shadow-accent-500/10"
                        >
                            <PlusIcon className="w-4 h-4" />
                            ADD NEW TASK
                        </button>
                    </div>

                    {isAddingTask && (
                        <div className="p-8 bg-white border-b border-[#e5dec9] animate-in slide-in-from-top-2">
                            <form onSubmit={handleCreateTask} className="flex flex-wrap items-end gap-6">
                                <div className="flex-1 min-w-[240px] space-y-2">
                                    <label className="text-[9px] font-semibold text-[#1c1917]/70 uppercase ml-2 tracking-widest">Task Name</label>
                                    <input
                                        required
                                        className="input !py-3 font-normal"
                                        placeholder="What needs to be done?"
                                        value={taskFormData.title}
                                        onChange={e => setTaskFormData({ ...taskFormData, title: e.target.value })}
                                    />
                                </div>
                                <div className="w-40 space-y-2">
                                    <label className="text-[9px] font-semibold text-[#1c1917]/70 uppercase ml-2 tracking-widest">Priority</label>
                                    <select
                                        className="input !py-3 appearance-none bg-white font-normal uppercase text-xs tracking-tight"
                                        value={taskFormData.priority}
                                        onChange={e => setTaskFormData({ ...taskFormData, priority: e.target.value })}
                                    >
                                        <option value="low">LOW</option>
                                        <option value="medium">MEDIUM</option>
                                        <option value="high">HIGH</option>
                                        <option value="critical">CRITICAL</option>
                                    </select>
                                </div>
                                <div className="w-56 space-y-2">
                                    <label className="text-[9px] font-semibold text-[#1c1917]/70 uppercase ml-2 tracking-widest">Assign To</label>
                                    <select
                                        className="input !py-3 appearance-none bg-white font-normal uppercase text-xs tracking-tight"
                                        value={taskFormData.assigned_to}
                                        onChange={e => setTaskFormData({ ...taskFormData, assigned_to: e.target.value })}
                                    >
                                        <option value="">UNASSIGNED</option>
                                        {members?.map((m: any) => (
                                            <option key={m.user_id} value={m.user_id}>{m.users?.full_name || m.user?.full_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setIsAddingTask(false)} className="w-11 h-11 border border-[#e5dec9] rounded-xl flex items-center justify-center text-[#1c1917]/40 hover:text-accent-500 hover:bg-[#f7f3ed] transition-all">
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                    <button type="submit" className="h-11 btn-primary !px-6 !text-[10px] !rounded-xl">CREATE</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {expandedSprints['backlog'] && (
                        <div className="p-4 space-y-1 bg-white">
                            {backlogTasks.map(task => (
                                <TaskRow key={task.id} task={task} onDelete={() => handleDeleteTask(task.id)} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function TaskRow({ task, onDelete }: { task: any, onDelete?: () => void }) {
    return (
        <div className="flex items-center justify-between p-4 hover:bg-[#f7f3ed]/50 rounded-[1.25rem] group transition-all duration-300 border border-transparent hover:border-[#e5dec9]/50">
            <div className="flex items-center gap-6">
                <div className={`w-1 h-12 rounded-full ${task.priority === 'critical' ? 'bg-[#d97757] shadow-[0_0_10px_rgba(217,119,87,0.4)]' :
                    task.priority === 'high' ? 'bg-[#d97757]/60' :
                        task.priority === 'medium' ? 'bg-[#e5dec9]' :
                            'bg-[#e5dec9]/40'
                    }`} />
                <div>
                    <p className="text-[13px] font-semibold text-[#1c1917] uppercase tracking-tight group-hover:text-accent-500 transition-colors">{task.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-[9px] font-semibold text-[#1c1917]/70 uppercase tracking-[0.2em]">
                        <span className="italic">TASK ID: {task.id.slice(0, 8)}</span>
                        <div className="h-2 w-px bg-[#e5dec9]"></div>
                        <span className={`px-2 py-0.5 rounded border ${task.status === 'completed' ? 'bg-[#7c9473]/10 border-[#7c9473]/20 text-[#7c9473]' :
                            task.status === 'in_progress' ? 'bg-accent-500/10 border-accent-500/20 text-accent-500' :
                                'bg-[#f7f3ed] border-[#e5dec9] text-[#1c1917]/75'
                            }`}>{task.status.replace('_', ' ')}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-8">
                {task.assigned_user && (
                    <div className="w-9 h-9 rounded-xl bg-[#f7f3ed] flex items-center justify-center text-[10px] font-semibold text-accent-500 border border-[#e5dec9] shadow-sm transform group-hover:scale-110 transition-transform">
                        {task.assigned_user.full_name?.charAt(0)}
                    </div>
                )}
                {onDelete && (
                    <button
                        onClick={onDelete}
                        className="opacity-0 group-hover:opacity-100 w-9 h-9 flex items-center justify-center text-[#1c1917]/40 hover:text-accent-500 hover:bg-[#f7f3ed] rounded-xl transition-all"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}

