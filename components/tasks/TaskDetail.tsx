'use client';

import { useState } from 'react';
import {
    XMarkIcon,
    CalendarIcon,
    UserIcon,
    TagIcon,
    ChatBubbleLeftRightIcon,
    Bars3CenterLeftIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function TaskDetail({ task, onClose }: { task: any, onClose: () => void }) {
    const [status, setStatus] = useState(task.kanban_column);

    const statusColors: any = {
        backlog: 'bg-slate-100 text-slate-700',
        todo: 'bg-blue-100 text-blue-700',
        in_progress: 'bg-orange-100 text-orange-700',
        review: 'bg-purple-100 text-purple-700',
        done: 'bg-emerald-100 text-emerald-700'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[status]}`}>
                            {status.replace('_', ' ')}
                        </span>
                        <div className="h-4 w-px bg-slate-200"></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                            {task.project?.name || 'Project Task'}
                        </span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
                    {/* Left: Content */}
                    <div className="flex-1 p-8 space-y-8 border-b lg:border-b-0 lg:border-r border-slate-100">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-black text-slate-900 leading-tight">{task.title}</h1>
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-600">
                                        {task.assigned_user?.full_name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Assigned to</p>
                                        <p className="text-sm font-bold text-slate-700">{task.assigned_user?.full_name || 'Unassigned'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                                        <CalendarIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Due Date</p>
                                        <p className="text-sm font-bold text-slate-700">
                                            {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No deadline'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Bars3CenterLeftIcon className="w-5 h-5 text-slate-400" />
                                Description
                            </h3>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                                {task.description || 'No description provided for this task.'}
                            </div>
                        </div>

                        {/* Checklist Section Placeholder */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircleIcon className="w-5 h-5 text-slate-400" />
                                    Checklist
                                </div>
                                <span className="text-xs font-bold text-slate-400">0% Complete</span>
                            </h3>
                            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                                <p className="text-sm text-slate-400 font-medium italic">No checklist items added yet.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Sidebar / Interaction */}
                    <div className="w-full lg:w-80 bg-slate-50/50 flex flex-col">
                        <div className="p-6 flex-1 space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Discussion</h3>
                                <div className="space-y-4">
                                    {/* Comment entry */}
                                    <div className="relative">
                                        <textarea
                                            placeholder="Write a comment..."
                                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-4 ring-primary-50 min-h-[100px] shadow-sm italic"
                                        ></textarea>
                                        <button className="absolute bottom-2 right-2 btn-primary py-1 px-4 text-xs font-bold ring-2 ring-white">
                                            Post
                                        </button>
                                    </div>

                                    {/* Comment feed placeholder */}
                                    <div className="space-y-4 pt-4">
                                        <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                                            <ChatBubbleLeftRightIcon className="w-12 h-12 mb-2 opacity-20" />
                                            <p className="text-xs font-bold italic uppercase tracking-tighter">No comments yet</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white border-t border-slate-100 flex flex-col gap-3">
                            <button className="btn-secondary w-full flex items-center justify-center gap-2">
                                <TagIcon className="w-5 h-5" />
                                Edit Priority
                            </button>
                            <button className="btn-primary w-full bg-slate-900 hover:bg-black">
                                Task History
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
