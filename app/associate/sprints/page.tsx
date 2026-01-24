import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function AssociateSprintsPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== 'associate') {
        redirect('/login');
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-[#1c1917] tracking-tight">Sprint Management</h1>
                <p className="text-[#1c1917]/60 mt-2 font-medium">Plan and track your project sprints</p>
            </div>

            <div className="card p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                    <div className="w-20 h-20 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">📅</span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#1c1917]">Sprint Planning Coming Soon</h3>
                    <p className="text-[#1c1917]/60">
                        Sprint management features are currently in development. You'll be able to create, track, and manage sprints here.
                    </p>
                </div>
            </div>
        </div>
    );
}
