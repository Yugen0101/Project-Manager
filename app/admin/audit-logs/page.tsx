import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { format } from 'date-fns';
import {
    ClockIcon,
    UserIcon,
    TagIcon,
    ArrowPathIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import Pagination from '@/components/ui/Pagination';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function AuditLogsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const { page } = await searchParams;
    const currentPage = parseInt(page || '1');
    const pageSize = 20; // More logs per page
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;

    const supabase = await createAdminClient();

    const { data: logs, count, error } = await supabase
        .from('audit_logs')
        .select(`
            *,
            user:users(full_name, email)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

    const totalPages = Math.ceil((count || 0) / pageSize);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <ShieldCheckIcon className="w-8 h-8 text-primary-600" />
                        System Audit Logs
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Review all administrative actions and security-critical changes.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-secondary flex items-center gap-2">
                        <ArrowPathIcon className="w-5 h-5" />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="card overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Time</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">User</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Action</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Resource</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs?.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                        <ClockIcon className="w-4 h-4 text-slate-300" />
                                        {format(new Date(log.created_at), 'MMM d, HH:mm:ss')}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-500">
                                            {log.user?.full_name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">{log.user?.full_name || 'System'}</p>
                                            <p className="text-[10px] text-slate-400">{log.user?.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${log.action_type.includes('ARCHIVE') ? 'bg-orange-100 text-orange-700' :
                                        log.action_type.includes('SHARE') ? 'bg-blue-100 text-blue-700' :
                                            log.action_type.includes('USER') ? 'bg-purple-100 text-purple-700' :
                                                'bg-slate-100 text-slate-700'
                                        }`}>
                                        {log.action_type.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                        <TagIcon className="w-4 h-4 text-slate-300" />
                                        {log.resource_type}: {log.resource_id.slice(0, 8)}...
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <pre className="text-[10px] font-mono text-slate-500 max-w-[200px] truncate">
                                        {JSON.stringify(log.details)}
                                    </pre>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!logs || logs.length === 0) && (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                        <ShieldCheckIcon className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-sm font-bold uppercase tracking-widest">No audit logs found</p>
                    </div>
                )}
            </div>
            {/* Pagination Footer */}
            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
}
