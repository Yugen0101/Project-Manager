import { createAdminClient } from '@/lib/supabase/admin';
import {
    PlusIcon,
    UserIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    EnvelopeIcon,
} from '@heroicons/react/24/outline';
import UserManagementClient from '@/components/admin/UserManagementClient';
import UserActionMenu from '../../../components/admin/UserActionMenu';
import Pagination from '@/components/ui/Pagination';
import { createClient } from '@/lib/supabase/server';

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const { page } = await searchParams;
    const currentPage = parseInt(page || '1');
    const pageSize = 10;
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;

    const supabase = await createAdminClient();

    // Fetch users with pagination and total count
    const [{ data: users }, { count: totalCount }, { count: adminCount }, { count: associateCount }, { count: memberCount }] = await Promise.all([
        supabase.from('users').select('*').order('created_at', { ascending: false }).range(from, to),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'associate'),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'member'),
    ]);

    const totalPages = Math.ceil((totalCount || 0) / pageSize);

    return (
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-500 mt-1">Add and manage Associates and Team Members.</p>
                </div>
                <UserManagementClient initialUsers={users || []} />
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card p-4 flex items-center gap-4">
                    <div className="p-3 bg-primary-50 rounded-xl">
                        <UserGroupIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Total Users</p>
                        <p className="text-xl font-bold text-slate-900">{totalCount || 0}</p>
                    </div>
                </div>
                <div className="card p-4 flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-xl">
                        <ShieldCheckIcon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Admins</p>
                        <p className="text-xl font-bold text-slate-900">{adminCount || 0}</p>
                    </div>
                </div>
                <div className="card p-4 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                        <UserIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Associates</p>
                        <p className="text-xl font-bold text-slate-900">{associateCount || 0}</p>
                    </div>
                </div>
                <div className="card p-4 flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-xl">
                        <UserGroupIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Members</p>
                        <p className="text-xl font-bold text-slate-900">{memberCount || 0}</p>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="card overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">All Registered Users</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {users?.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200">
                                                {user.full_name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{user.full_name}</p>
                                                <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                                                    <EnvelopeIcon className="w-3 h-3" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold
                                            ${user.role === 'admin' ? 'bg-emerald-50 text-emerald-700' :
                                                user.role === 'associate' ? 'bg-blue-50 text-blue-700' :
                                                    'bg-purple-50 text-purple-700'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full 
                                                ${user.role === 'admin' ? 'bg-emerald-500' :
                                                    user.role === 'associate' ? 'bg-blue-500' :
                                                        'bg-purple-500'}`} />
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.is_active ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-100'}`}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <UserActionMenu user={user} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Footer */}
                <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
        </div>
    );
}
