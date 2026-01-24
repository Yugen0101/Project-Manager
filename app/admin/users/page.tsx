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

    // Fetch users with counts of assigned projects and tasks
    const [{ data: users }, { count: totalCount }, { count: adminCount }, { count: associateCount }, { count: memberCount }] = await Promise.all([
        supabase.from('users').select('*, projects_count:user_projects(count), tasks_count:tasks!assigned_to(count)').order('created_at', { ascending: false }).range(from, to),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'associate'),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'member'),
    ]);

    const totalPages = Math.ceil((totalCount || 0) / pageSize);

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header section with Editorial Style */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="w-12 h-px bg-[#d97757]"></span>
                        <h2 className="text-[11px] font-black text-[#d97757] uppercase tracking-[0.5em]">Operational Dossier</h2>
                    </div>
                    <h1 className="text-7xl font-black text-[#1c1917] tracking-tighter uppercase leading-[0.8] mb-2">
                        Personnel <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d97757] via-[#1c1917] to-[#1c1917]">Registry</span>
                    </h1>
                    <p className="text-[#1c1917]/50 text-xl font-black italic font-serif">
                        Monitoring {totalCount || 0} active nodes in the task management matrix.
                    </p>
                </div>
                <div className="pb-2">
                    <UserManagementClient initialUsers={(users as any) || []} />
                </div>
            </div>

            {/* Intelligence Dossiers (Stats) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Aggregate', value: totalCount || 0, icon: UserGroupIcon, color: '#d97757' },
                    { label: 'Executives', value: adminCount || 0, icon: ShieldCheckIcon, color: '#ef4444' },
                    { label: 'Associates', value: associateCount || 0, icon: UserIcon, color: '#3b82f6' },
                    { label: 'Tactical', value: memberCount || 0, icon: UserGroupIcon, color: '#10b981' }
                ].map((stat, i) => (
                    <div key={i} className="card bg-white border-[#e5dec9] p-8 flex flex-col gap-6 group hover:border-[#d97757] transition-all duration-500 shadow-xl shadow-[#d9cfb0]/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[#d97757]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex justify-between items-start">
                            <div className={`w-14 h-14 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#d97757] border border-[#e5dec9] group-hover:bg-[#d97757] group-hover:text-white transition-all duration-500 shadow-inner`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <div className="text-[8px] font-black text-[#1c1917]/20 uppercase tracking-[0.4em] italic font-serif">Verified</div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.3em] font-serif italic mb-1">{stat.label}</p>
                            <p className="text-4xl font-black text-[#1c1917] tracking-tighter">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Users Table */}
            <div className="card bg-white border-[#e5dec9] overflow-hidden shadow-2xl shadow-[#d9cfb0]/20 rounded-[2.5rem]">
                <div className="p-8 border-b border-[#f7f3ed] bg-[#f7f3ed]/30 flex items-center justify-between">
                    <h3 className="text-[11px] font-black text-[#1c1917] uppercase tracking-[0.3em] font-serif italic">Global Personnel Registry</h3>
                    <div className="w-2 h-2 bg-[#d97757] rounded-full animate-pulse"></div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f7f3ed]/50 border-b border-[#e5dec9]">
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-[#1c1917]/30 tracking-[0.2em] italic font-serif">Asset Entity</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-[#1c1917]/30 tracking-[0.2em] italic font-serif">Clearance</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-[#1c1917]/30 tracking-[0.2em] italic font-serif">Active Assignments</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-[#1c1917]/30 tracking-[0.2em] italic font-serif text-center">Task Queue</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-[#1c1917]/30 tracking-[0.2em] italic font-serif">Operational Matrix</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-[#1c1917]/30 tracking-[0.2em] italic font-serif text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f7f3ed]">
                            {users?.map((user: any) => (
                                <tr key={user.id} className="hover:bg-[#fdfcf9] transition-all duration-300 group">
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="relative group/avatar">
                                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center font-black text-xl text-[#d97757] border border-[#e5dec9] shadow-sm group-hover:bg-[#d97757] group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                                                    {user.full_name?.charAt(0) || 'U'}
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${user.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-[#1c1917] tracking-tight uppercase group-hover:text-[#d97757] transition-all">{user.full_name}</p>
                                                <div className="flex items-center gap-2 text-[10px] font-black text-[#1c1917]/30 uppercase tracking-tighter italic mt-1">
                                                    <EnvelopeIcon className="w-3.5 h-3.5 text-[#d97757]" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col gap-1">
                                            <span className={`badge inline-flex w-fit ${user.role === 'admin' ? 'badge-danger' :
                                                user.role === 'associate' ? 'badge-info' :
                                                    'badge-success'}`}>
                                                {user.role}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-2">
                                                {[...Array(Math.min(user.projects_count?.[0]?.count || 0, 3))].map((_, i) => (
                                                    <div key={i} className="w-6 h-6 rounded-lg bg-[#f7f3ed] border border-[#e5dec9] flex items-center justify-center shadow-sm">
                                                        <div className="w-2 h-2 rounded-full bg-[#d97757]/40"></div>
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-[11px] font-black text-[#1c1917] tracking-tight">
                                                {user.projects_count?.[0]?.count || 0} Project{user.projects_count?.[0]?.count === 1 ? '' : 's'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-center">
                                        <div className="inline-flex flex-col items-center justify-center w-12 h-12 bg-[#f7f3ed]/50 rounded-2xl border border-[#e5dec9] group-hover:border-[#d97757]/30 transition-all">
                                            <span className="text-lg font-black text-[#d97757] leading-none">{user.tasks_count?.[0]?.count || 0}</span>
                                            <span className="text-[7px] font-black text-[#1c1917]/30 uppercase tracking-[0.1em] mt-1">Units</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${user.is_active ? 'text-[#d97757] bg-[#f7f3ed] border-[#e5dec9] shadow-inner' : 'text-[#1c1917]/20 bg-white border-[#e5dec9] italic'}`}>
                                            {user.is_active ? 'ACTIVE' : 'DORMANT'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <UserActionMenu user={user} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Footer */}
                <div className="p-8 bg-[#f7f3ed]/30 border-t border-[#e5dec9] flex justify-center">
                    <Pagination currentPage={currentPage} totalPages={totalPages} />
                </div>
            </div>
        </div>
    );
}
