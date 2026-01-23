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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c1917]/40 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-[#fdfcf9] border border-[#e5dec9] rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-500">
                {/* Header */}
                <div className="p-8 border-b border-[#f7f3ed] flex items-center justify-between bg-[#f7f3ed]/30">
                    <div className="flex items-center gap-4">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusColors[status] || 'bg-white text-[#1c1917]/40 border-[#e5dec9]'}`}>
                            {status.replace('_', ' ')}
                        </span>
                        <div className="h-6 w-px bg-[#e5dec9]"></div>
                        <span className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.2em]">
                            {task.project?.name || 'Operational Vector'}
                        </span>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-[#e5dec9] flex items-center justify-center text-[#1c1917]/40 hover:text-[#d97757] transition-all">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
                    {/* Left: Content */}
                    <div className="flex-1 p-10 space-y-12 border-b lg:border-b-0 lg:border-r border-[#f7f3ed]">
                        <div className="space-y-6">
                            <h1 className="text-4xl font-black text-[#1c1917] tracking-tight leading-tight uppercase">{task.title}</h1>
                            <div className="flex flex-wrap items-center gap-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#f7f3ed] border border-[#e5dec9] flex items-center justify-center text-sm font-black text-[#1c1917]">
                                        {task.assigned_user?.full_name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-[#1c1917]/30 uppercase tracking-[0.2em]">Assigned Asset</p>
                                        <p className="text-base font-black text-[#1c1917] uppercase tracking-tight">{task.assigned_user?.full_name || 'Unallocated'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white border border-[#e5dec9] rounded-xl flex items-center justify-center text-[#d97757]">
                                        <CalendarIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-[#1c1917]/30 uppercase tracking-[0.2em]">Deadline Vector</p>
                                        <p className="text-base font-black text-[#1c1917] uppercase tracking-tight">
                                            {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'No Limit Set'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <h3 className="text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.3em] flex items-center gap-3">
                                <Bars3CenterLeftIcon className="w-4 h-4 text-[#d97757]" />
                                Operational Parameters
                            </h3>
                            <div className="text-lg text-[#1c1917]/60 leading-relaxed bg-[#f7f3ed]/50 p-8 rounded-[2rem] border border-[#e5dec9] italic font-serif">
                                {task.description || 'No additional mission intelligence provided for this unit.'}
                            </div>
                        </div>

                        {/* Checklist Section */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.3em] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircleIcon className="w-4 h-4 text-[#d97757]" />
                                    Sub-Routine Status
                                </div>
                                <span className="text-[#d97757]">Inert</span>
                            </h3>
                            <div className="py-12 bg-white rounded-[2rem] border-2 border-dashed border-[#e5dec9] text-center">
                                <p className="text-[10px] font-black text-[#1c1917]/20 uppercase tracking-[0.3em] italic">No active sub-structures detected</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Sidebar / Interaction */}
                    <div className="w-full lg:w-96 bg-[#f7f3ed]/20 flex flex-col">
                        <div className="p-10 flex-1 space-y-10">
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.4em]">COMMS CHANNEL</h3>
                                <div className="space-y-6">
                                    {/* Comment entry */}
                                    <div className="space-y-3">
                                        <textarea
                                            placeholder="Broadcast mission updates..."
                                            className="w-full bg-white border border-[#e5dec9] rounded-[1.5rem] p-5 text-sm focus:ring-4 ring-[#d97757]/5 min-h-[150px] shadow-sm italic font-serif text-[#1c1917]/60 placeholder-[#1c1917]/20 outline-none resize-none"
                                        ></textarea>
                                        <button className="w-full btn-primary py-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#d97757]/10">
                                            Transmit Update
                                        </button>
                                    </div>

                                    {/* Comment feed placeholder */}
                                    <div className="flex flex-col items-center justify-center py-12 text-[#1c1917]/20">
                                        <ChatBubbleLeftRightIcon className="w-12 h-12 mb-4 opacity-10" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Channel Silent</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-[#f7f3ed]/50 border-t border-[#e5dec9] flex flex-col gap-4">
                            <button className="btn-secondary w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] bg-white">
                                Adjust Priority
                            </button>
                            <button className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#1c1917]/30 hover:text-[#d97757] transition-all">
                                Archival History
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
