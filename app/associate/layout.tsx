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
<<<<<<< HEAD
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
                    <SignOutButton />
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:ml-72">
                {/* Top Header */}
                <header className="bg-white/80 border-b border-[#e5dec9] sticky top-0 z-40 backdrop-blur-xl">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <AssociateMobileMenu />
                            <h2 className="text-xl font-bold text-[#1c1917]">Project Lead Portal</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 hover:bg-beige-50 rounded-lg transition-colors">
                                <BellIcon className="w-5 h-5 text-[#1c1917]" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
