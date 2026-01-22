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

        if (result.error) {
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
        if (result.error) alert(result.error);
        else window.location.reload();
    };

    const handleResetPassword = async (userId: string) => {
        const result = await resetUserPassword(userId);
        if (result.error) alert(result.error);
        else alert(`Password reset! Temporary password: ${result.tempPassword}`);
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('PERMANENTLY delete this user? This cannot be undone.')) return;

        const result = await deleteUser(userId);
        if (result.error) alert(result.error);
        else window.location.reload();
    };

    return (
        <>
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add New User
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Add New System User</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-center gap-2">
                                    <ExclamationTriangleIcon className="w-5 h-5" />
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input w-full"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="input w-full"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                <select
                                    className="input w-full"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="member">Member</option>
                                    <option value="associate">Associate</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Initial Password</label>
                                <input
                                    type="password"
                                    required
                                    className="input w-full"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary flex-1 disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Action Cell rendering logic would go here if we were completely refactoring the table, 
                but for now we'll hook into the parent table via shared state or simplified reload */}
        </>
    );
}
