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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1c1917]/40 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-[#e5dec9] animate-in zoom-in-95 duration-500">
                        <div className="px-10 py-8 border-b border-[#f7f3ed] flex items-center justify-between bg-[#f7f3ed]/30 text-beige">
                            <div>
                                <h2 className="text-xl font-black text-[#1c1917] tracking-tight uppercase">DEPLOY PERSONNEL</h2>
                                <p className="text-[9px] font-black text-[#1c1917]/30 uppercase tracking-[0.2em] mt-1">Assign asset to operational matrix</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white border border-[#e5dec9] flex items-center justify-center text-[#1c1917]/40 hover:text-[#d97757] transition-all">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleAddMember} className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.2em] ml-1">Select Asset</label>
                                <select
                                    required
                                    className="input py-4 bg-[#fdfcf9] appearance-none"
                                    value={selectedUserId}
                                    onChange={e => setSelectedUserId(e.target.value)}
                                >
                                    <option value="">Choose personnel...</option>
                                    {allUsers.map(user => (
                                        <option key={user.id} value={user.id}>{user.full_name} ({user.email})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.2em] ml-1">Designated Role</label>
                                <select
                                    className="input py-4 bg-[#fdfcf9] appearance-none"
                                    value={selectedRole}
                                    onChange={e => setSelectedRole(e.target.value)}
                                >
                                    <option value="member">Tactical Member</option>
                                    <option value="associate">Operations Lead</option>
                                </select>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn-secondary flex-1 py-4 border-[#e5dec9]"
                                >
                                    ABORT
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !selectedUserId}
                                    className="btn-primary flex-1 py-4 disabled:opacity-50"
                                >
                                    {loading ? 'SYNCING...' : 'CONFIRM DEPLOYMENT'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
