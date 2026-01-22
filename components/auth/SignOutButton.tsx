'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function SignOutButton() {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Sign Out"
        >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="hidden lg:inline">Sign Out</span>
        </button>
    );
}
