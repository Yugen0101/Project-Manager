'use client';

import { useState, useEffect } from 'react';
import {
    UserGroupIcon,
    PlusIcon,
    XMarkIcon,
    TrashIcon,
    EnvelopeIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { assignUserToProject, removeUserFromProject } from '@/app/actions/projects';
import { getUsersForMentions } from '@/app/actions/users';
import { toast } from 'sonner';

interface Member {
    users: {
        id: string;
        full_name: string;
        email: string;
    };
    role: string;
}

interface User {
    id: string;
    full_name: string;
    email: string;
}

export default function TeamManager({
    projectId,
    initialMembers
}: {
    projectId: string;
    initialMembers: Member[];
}) {
    const [members, setMembers] = useState<Member[]>(initialMembers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedRole, setSelectedRole] = useState('member');

    useEffect(() => {
        if (isModalOpen) {
            fetchUsers();
            // Lock scroll
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isModalOpen]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const result = await getUsersForMentions();
            if (result.success) {
                // Filter out users who are already members
                const currentMemberIds = members.map(m => m.users.id);
                const filteredUsers = (result.data as User[]).filter(u => !currentMemberIds.includes(u.id));
                setAllUsers(filteredUsers);
            } else {
                toast.error(result.error || 'Failed to fetch personnel');
            }
        } catch (err: any) {
            console.error('Fetch users error:', err);
            toast.error('Connection failure during personnel sync');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId) return;

        setLoading(true);
        const result = await assignUserToProject(projectId, selectedUserId, selectedRole);

        if (result.success) {
            toast.success('Personnel assigned to project');
            setIsModalOpen(false);
            setSelectedUserId('');
            // In a real app, we'd probably router.refresh() or fetch updated members
            // For now, let's just refresh the page to ensure sync
            window.location.reload();
        } else {
            toast.error(result.error);
        }
        setLoading(false);
    };

    const handleRemoveMember = async (userId: string) => {
        if (!confirm('Remove this person from the project?')) return;

        const result = await removeUserFromProject(projectId, userId);
        if (result.success) {
            toast.success('Personnel removed');
            window.location.reload();
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="card bg-white border-[#e5dec9] overflow-hidden rounded-[2.5rem] shadow-xl shadow-[#d9cfb0]/10">
            <div className="p-8 border-b border-[#f7f3ed] bg-[#f7f3ed]/30 flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <span className="w-6 h-px bg-[#d97757]"></span>
                        <h3 className="text-[11px] font-black text-[#1c1917] uppercase tracking-[0.4em]">Project Personnel</h3>
                    </div>
                    <p className="text-[8px] font-black text-[#1c1917]/30 uppercase tracking-[0.2em] ml-9 underline decoration-[#d97757]/20 underline-offset-4">Assigned Active Units</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-12 h-12 bg-white border border-[#e5dec9] rounded-2xl flex items-center justify-center text-[#d97757] hover:bg-[#d97757] hover:text-white transition-all shadow-sm group active:scale-95"
                >
                    <PlusIcon className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                </button>
            </div>

            <div className="p-6 space-y-4">
                {members.length === 0 ? (
                    <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No personnel assigned</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {members.map((member) => (
                            <div key={member.users.id} className="flex items-center justify-between p-5 bg-[#fdfcf9] border border-[#e5dec9] rounded-[2rem] group hover:border-[#d97757] transition-all duration-500">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#e5dec9] flex items-center justify-center font-black text-[#d97757] shadow-sm group-hover:bg-[#d97757] group-hover:text-white transition-all transform group-hover:-rotate-3">
                                        {member.users.full_name?.charAt(0)}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[14px] font-black text-[#1c1917] tracking-tight uppercase group-hover:text-[#d97757] transition-colors">{member.users.full_name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${member.role === 'associate' ? 'bg-[#f7f3ed] border-[#e5dec9] text-[#d97757]' : 'bg-white border-[#e5dec9] text-[#1c1917]/30 font-serif italic'
                                                }`}>
                                                {member.role === 'associate' ? 'Operations Lead' : 'Tactical Member'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveMember(member.users.id)}
                                    className="opacity-0 group-hover:opacity-100 w-10 h-10 flex items-center justify-center text-[#1c1917]/10 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Member Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1c1917]/20 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#fdfcf9] rounded-[2rem] shadow-2xl shadow-[#d9cfb0]/40 w-full max-w-md overflow-hidden border border-[#e5dec9] animate-in zoom-in-95 duration-500 scale-100">
                        <div className="px-8 py-6 border-b border-[#e5dec9] flex items-center justify-between bg-white/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#f7f3ed] flex items-center justify-center text-[#d97757] border border-[#d9cfb0]/50">
                                    <UserGroupIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-[#1c1917] tracking-tight uppercase">DEPLOY PERSONNEL</h2>
                                    <p className="text-[9px] font-bold text-[#1c1917]/40 uppercase tracking-[0.2em] mt-0.5">Assign asset to operational matrix</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-[#e5dec9] flex items-center justify-center text-[#1c1917]/30 hover:text-[#d97757] hover:border-[#d97757] transition-all">
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleAddMember} className="p-8 space-y-6">
                            <div className="space-y-2 group">
                                <label className="flex items-center justify-between text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.2em] ml-1 group-focus-within:text-[#d97757] transition-colors">
                                    <span>Select Asset</span>
                                    <span className="text-[8px] opacity-50">REQUIRED</span>
                                </label>
                                <div className="relative">
                                    <select
                                        required
                                        className="w-full px-5 py-4 bg-white border border-[#e5dec9] rounded-xl text-sm font-bold text-[#1c1917] appearance-none focus:outline-none focus:border-[#d97757] focus:ring-4 focus:ring-[#d97757]/10 transition-all shadow-sm"
                                        value={selectedUserId}
                                        onChange={e => setSelectedUserId(e.target.value)}
                                    >
                                        <option value="">Choose personnel...</option>
                                        {allUsers.map(user => (
                                            <option key={user.id} value={user.id}>{user.full_name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#1c1917]/30">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="flex items-center justify-between text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.2em] ml-1 group-focus-within:text-[#d97757] transition-colors">
                                    <span>Designated Role</span>
                                    <span className="text-[8px] opacity-50">OPERATIONAL CLEARANCE</span>
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRole('member')}
                                        className={`px-4 py-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedRole === 'member'
                                            ? 'bg-[#d97757] border-[#d97757] text-white shadow-lg shadow-[#d97757]/20'
                                            : 'bg-white border-[#e5dec9] text-[#1c1917]/40 hover:border-[#d97757]/50'
                                            }`}
                                    >
                                        <ShieldCheckIcon className="w-5 h-5" />
                                        <span className="text-[9px] font-black uppercase tracking-wider">Tactical</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRole('associate')}
                                        className={`px-4 py-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedRole === 'associate'
                                            ? 'bg-[#d97757] border-[#d97757] text-white shadow-lg shadow-[#d97757]/20'
                                            : 'bg-white border-[#e5dec9] text-[#1c1917]/40 hover:border-[#d97757]/50'
                                            }`}
                                    >
                                        <UserGroupIcon className="w-5 h-5" />
                                        <span className="text-[9px] font-black uppercase tracking-wider">Lead</span>
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[#1c1917]/40 border border-transparent hover:bg-[#f7f3ed] transition-all"
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !selectedUserId}
                                    className="flex-1 px-6 py-4 rounded-xl bg-[#d97757] text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#d97757]/20 hover:bg-[#c26242] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'INITIALIZING...' : 'CONFIRM DEPLOYMENT'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
