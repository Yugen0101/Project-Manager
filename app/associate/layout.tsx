import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import {
    BellIcon,
} from '@heroicons/react/24/outline';
import SignOutButton from '@/components/auth/SignOutButton';
import AssociateNav from '@/components/navigation/AssociateNav';

import AssociateMobileMenu from '@/components/navigation/AssociateMobileMenu';

export default async function AssociateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    return (
        <div className="min-h-screen bg-beige-50 text-[#1c1917] flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white/50 backdrop-blur-md border-r border-[#e5dec9] hidden lg:flex flex-col fixed inset-y-0 z-50">
                <div className="p-8">
                    <div className="flex items-center gap-4">
                        <div className="relative w-32 h-32 -ml-4">
                            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#1c1917]">
                            Task<span className="text-accent-600">Forge</span>
                            <span className="block text-xs text-accent-600 uppercase tracking-wider font-bold">Project Lead</span>
                        </h1>
                    </div>
                </div>

                <AssociateNav />

                <div className="p-6 mt-auto border-t border-beige-200">
                    <div className="flex items-center gap-3 px-4 py-3 bg-beige-50 rounded-xl border border-beige-200">
                        <div className="w-9 h-9 rounded-lg bg-beige-100 flex items-center justify-center text-xs font-bold text-accent-600 border border-beige-200">
                            {user?.full_name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#1c1917] truncate">{user?.full_name}</p>
                            <p className="text-[10px] text-accent-600 uppercase font-bold tracking-wider truncate">Project Lead</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 min-h-screen">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-beige-200 sticky top-0 z-40 px-6 sm:px-10 flex items-center justify-between">
                    <div className="flex items-center gap-4 lg:hidden">
                        <AssociateMobileMenu />
                        <div className="relative w-10 h-10">
                            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <h1 className="text-xl font-bold text-[#1c1917]">Task<span className="text-accent-600">Forge</span></h1>
                    </div>
                    <div className="hidden lg:block relative w-96">
                        <input type="text" placeholder="Global search..." className="input bg-white/50" />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-[#1c1917]/40 hover:text-accent-600 transition-all">
                            <BellIcon className="w-6 h-6" />
                        </button>
                        <SignOutButton />
                    </div>
                </header>

                <div className="p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
