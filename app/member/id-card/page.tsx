import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getUserIdCard } from '@/app/actions/id-cards';
import MyIdCard from '@/components/member/MyIdCard';

export const metadata = {
    title: 'My ID Card | TaskForge',
    description: 'View your digital ID card'
};

export default async function MemberIdCardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    const result = await getUserIdCard(user.id);

    if (!result.success || !result.data) {
        return (
            <div className="min-h-screen bg-[#f7f3ed] p-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl p-12 border border-[#e5dec9] text-center">
                        <div className="w-20 h-20 bg-[#f7f3ed] rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">🆔</span>
                        </div>
                        <h2 className="text-2xl font-semibold uppercase mb-4">No ID Card Found</h2>
                        <p className="text-[#78716c] mb-6">
                            You don't have an ID card yet. Please contact your administrator to request one.
                        </p>
                        <a
                            href={user.role === 'member' ? '/member/tasks' : '/associate'}
                            className="inline-block px-6 py-3 bg-[#d97757] hover:bg-[#c26242] text-white rounded-xl font-semibold transition-all shadow-lg shadow-[#d97757]/20"
                        >
                            Back to Dashboard
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return <MyIdCard card={result.data} />;
}
