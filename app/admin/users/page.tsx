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
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-[#1c1917] tracking-tighter uppercase flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#d97757] border border-[#e5dec9]">
                            <UserGroupIcon className="w-7 h-7" />
                        </div>
                        PERSONNEL
                    </h1>
                    <p className="text-[#1c1917]/40 mt-3 font-black uppercase tracking-[0.2em] text-[11px]">
                        Global Asset Registry: {totalCount || 0} Registered Personnel
                    </p>
                </div>
                <UserManagementClient initialUsers={users || []} />
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="card bg-white border-[#e5dec9] p-6 flex items-center gap-6 group hover:border-[#d97757] transition-all duration-500 shadow-xl shadow-[#d9cfb0]/10">
                    <div className="w-12 h-12 bg-[#f7f3ed] rounded-xl flex items-center justify-center text-[#d97757] border border-[#e5dec9] group-hover:bg-[#d97757] group-hover:text-white transition-all">
                        <UserGroupIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.2em]">Aggregate</p>
                        <p className="text-2xl font-black text-[#1c1917] tracking-tight">{totalCount || 0}</p>
                    </div>
                </div>
                <div className="card bg-white border-[#e5dec9] p-6 flex items-center gap-6 group hover:border-[#d97757] transition-all duration-500 shadow-xl shadow-[#d9cfb0]/10">
                    <div className="w-12 h-12 bg-[#f7f3ed] rounded-xl flex items-center justify-center text-[#d97757] border border-[#e5dec9] group-hover:bg-[#d97757] group-hover:text-white transition-all">
                        <ShieldCheckIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.2em]">Executives</p>
                        <p className="text-2xl font-black text-[#1c1917] tracking-tight">{adminCount || 0}</p>
                    </div>
                </div>
                <div className="card bg-white border-[#e5dec9] p-6 flex items-center gap-6 group hover:border-[#d97757] transition-all duration-500 shadow-xl shadow-[#d9cfb0]/10">
                    <div className="w-12 h-12 bg-[#f7f3ed] rounded-xl flex items-center justify-center text-[#d97757] border border-[#e5dec9] group-hover:bg-[#d97757] group-hover:text-white transition-all">
                        <UserIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.2em]">Associates</p>
                        <p className="text-2xl font-black text-[#1c1917] tracking-tight">{associateCount || 0}</p>
                    </div>
                </div>
                <div className="card bg-white border-[#e5dec9] p-6 flex items-center gap-6 group hover:border-[#d97757] transition-all duration-500 shadow-xl shadow-[#d9cfb0]/10">
                    <div className="w-12 h-12 bg-[#f7f3ed] rounded-xl flex items-center justify-center text-[#d97757] border border-[#e5dec9] group-hover:bg-[#d97757] group-hover:text-white transition-all">
                        <UserGroupIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.2em]">Tactical</p>
                        <p className="text-2xl font-black text-[#1c1917] tracking-tight">{memberCount || 0}</p>
                    </div>
                </div>
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
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-[#1c1917]/30 tracking-[0.2em] italic font-serif">Operational Matrix</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-[#1c1917]/30 tracking-[0.2em] italic font-serif">Deployment Date</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-[#1c1917]/30 tracking-[0.2em] italic font-serif text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f7f3ed]">
                            {users?.map((user) => (
                                <tr key={user.id} className="hover:bg-[#fdfcf9] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[#f7f3ed] flex items-center justify-center font-black text-[#d97757] border border-[#e5dec9] shadow-inner group-hover:bg-[#d97757] group-hover:text-white transition-all">
                                                {user.full_name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-black text-[#1c1917] tracking-tight uppercase group-hover:text-[#d97757] transition-all">{user.full_name}</p>
                                                <div className="flex items-center gap-2 text-[9px] font-black text-[#1c1917]/30 uppercase tracking-tighter italic mt-1">
                                                    <EnvelopeIcon className="w-3 h-3 text-[#d97757]" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`badge ${user.role === 'admin' ? 'badge-danger' :
                                            user.role === 'associate' ? 'badge-info' :
                                                'badge-success'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${user.is_active ? 'text-[#d97757] bg-[#f7f3ed] border-[#e5dec9] shadow-inner' : 'text-[#1c1917]/20 bg-white border-[#e5dec9] italic'}`}>
                                            {user.is_active ? 'ACTIVE' : 'DORMANT'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#1c1917]/40 italic font-serif">
                                        {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="px-8 py-6 text-right">
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
