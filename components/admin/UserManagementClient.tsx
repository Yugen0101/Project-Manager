'use client';

import { useState } from 'react';
import {
    PlusIcon,
    XMarkIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { createUser, toggleUserStatus, resetUserPassword, deleteUser } from '@/app/actions/users';

interface User {
    id: string;
    email: string;
    full_name: string;
    role: string;
    is_active: boolean;
    created_at: string;
}

export default function UserManagementClient({ initialUsers }: { initialUsers: User[] }) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        full_name: '',
        role: 'member',
        password: ''
    });

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await createUser(formData);

        if (!result.success) {
            setError(result.error);
        } else {
            setSuccess('User created successfully');
            setIsModalOpen(false);
            setFormData({ email: '', full_name: '', role: 'member', password: '' });
            // Refresh would happen via revalidatePath, but we can optimistically update or rely on router.refresh()
            window.location.reload();
        }
        setLoading(false);
    };

    const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) return;

        const result = await toggleUserStatus(userId, !currentStatus);
        if (!result.success) alert(result.error);
        else window.location.reload();
    };

    const handleResetPassword = async (userId: string) => {
        const result = await resetUserPassword(userId);
        if (!result.success) alert(result.error);
        else alert(`Password reset! Temporary password: ${result.data?.tempPassword}`);
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('PERMANENTLY delete this user? This cannot be undone.')) return;

        const result = await deleteUser(userId);
        if (!result.success) alert(result.error);
        else window.location.reload();
    };

    return (
        <>
            <div className="flex justify-end">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="group relative px-10 py-5 bg-[#1c1917] text-[#f7f3ed] rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#1c1917]/20 active:scale-95"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#d97757]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-3 relative z-10">
                        <PlusIcon className="w-5 h-5 text-[#d97757]" />
                        <span className="text-[12px] font-black uppercase tracking-[0.3em]">Deploy Personnel</span>
                    </div>
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1c1917]/40 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-[#e5dec9] animate-in zoom-in-95 duration-500">
                        <div className="px-10 py-8 border-b border-[#f7f3ed] flex items-center justify-between bg-[#f7f3ed]/30">
                            <div>
                                <h2 className="text-2xl font-black text-[#1c1917] tracking-tight uppercase">PERSONNEL ENROLMENT</h2>
                                <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.2em] mt-1">Initialise system access node</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white border border-[#e5dec9] flex items-center justify-center text-[#1c1917]/40 hover:text-[#d97757] transition-all">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="p-10 space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 text-red-800 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-pulse">
                                    <ExclamationTriangleIcon className="w-5 h-5" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.3em] font-serif italic ml-1">Entity Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-5 py-4 bg-[#fdfcf9] border border-[#e5dec9] rounded-2xl text-[13px] font-black text-[#1c1917] focus:ring-1 focus:ring-[#d97757] focus:border-[#d97757] outline-none transition-all placeholder:text-[#1c1917]/10"
                                    placeholder="Enter full name"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.3em] font-serif italic ml-1">Email Allocation</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-5 py-4 bg-[#fdfcf9] border border-[#e5dec9] rounded-2xl text-[13px] font-black text-[#1c1917] focus:ring-1 focus:ring-[#d97757] focus:border-[#d97757] outline-none transition-all placeholder:text-[#1c1917]/10"
                                    placeholder="example@taskforge.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.3em] font-serif italic ml-1">Clearance Tier</label>
                                <div className="relative">
                                    <select
                                        className="w-full px-5 py-4 bg-[#fdfcf9] border border-[#e5dec9] rounded-2xl text-[13px] font-black text-[#1c1917] focus:ring-1 focus:ring-[#d97757] focus:border-[#d97757] outline-none transition-all appearance-none uppercase"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="member">TACTICAL MEMBER</option>
                                        <option value="associate">OPERATIONS LEAD</option>
                                        <option value="admin">EXECUTIVE ADMIN</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#1c1917]/20 italic text-[11px] font-black">Tier</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.2em] ml-1">Initial Sequence</label>
                                <input
                                    type="password"
                                    required
                                    className="input py-4 bg-[#fdfcf9]"
                                    placeholder="Set temporary password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <div className="pt-8 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn-secondary flex-1 py-4 border-[#e5dec9]"
                                >
                                    ABORT
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary flex-1 py-4 disabled:opacity-50"
                                >
                                    {loading ? 'SYNCING...' : 'ENROL ASSET'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
