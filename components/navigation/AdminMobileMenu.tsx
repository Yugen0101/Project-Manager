'use client';

import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import AdminNav from './AdminNav';
import { usePathname } from 'next/navigation';

export default function AdminMobileMenu({
    counts
}: {
    counts: { projectCount: number, userCount: number, taskCount: number }
}) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <div className="lg:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-[#1c1917] hover:text-[#d97757] transition-colors"
            >
                <Bars3Icon className="w-6 h-6" />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-[60] bg-[#1c1917]/20 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Sidebar */}
                    <div className="fixed inset-y-0 left-0 z-[70] w-72 bg-[#fdfcf9] border-r border-[#e5dec9] shadow-2xl animate-in slide-in-from-left duration-300">
                        <div className="p-6 flex items-center justify-between border-b border-[#e5dec9]">
                            <h2 className="text-lg font-black text-[#1c1917] uppercase tracking-wider">Menu</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-[#1c1917]/40 hover:text-[#d97757] transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="overflow-y-auto h-full pb-20">
                            <AdminNav counts={counts} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
