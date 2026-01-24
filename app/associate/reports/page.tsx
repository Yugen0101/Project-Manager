import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function AssociateReportsPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== 'associate') {
        redirect('/login');
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-[#1c1917] tracking-tight">Analytics & Reports</h1>
                <p className="text-[#1c1917]/60 mt-2 font-medium">View performance metrics and project insights</p>
            </div>

            <div className="card p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                    <div className="w-20 h-20 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">📊</span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#1c1917]">Analytics Dashboard Coming Soon</h3>
                    <p className="text-[#1c1917]/60">
                        Advanced analytics and reporting features are in development. You'll be able to view detailed project metrics and performance data here.
                    </p>
                </div>
            </div>
        </div>
    );
}
