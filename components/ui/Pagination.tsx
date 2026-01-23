'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Pagination({
    currentPage,
    totalPages,
}: {
    currentPage: number;
    totalPages: number;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between px-8 py-5 border border-[#e5dec9] bg-white/50 backdrop-blur-xl rounded-[1.5rem] shadow-xl shadow-[#d9cfb0]/10 mt-10">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => router.push(createPageURL(currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="relative inline-flex items-center rounded-xl border border-[#e5dec9] bg-white px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#1c1917]/40 hover:text-[#d97757] disabled:opacity-30 transition-all"
                >
                    Prev
                </button>
                <button
                    onClick={() => router.push(createPageURL(currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className="relative ml-3 inline-flex items-center rounded-xl border border-[#e5dec9] bg-white px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#1c1917]/40 hover:text-[#d97757] disabled:opacity-30 transition-all"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.3em] italic font-serif">
                        REGISTRY INDEX <span className="text-[#1c1917] ml-2">{currentPage}</span> <span className="mx-2 text-[#e5dec9]">/</span> <span className="text-[#1c1917]/60">{totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex rounded-xl shadow-inner overflow-hidden border border-[#e5dec9] bg-white" aria-label="Pagination">
                        <button
                            onClick={() => router.push(createPageURL(currentPage - 1))}
                            disabled={currentPage <= 1}
                            className="relative inline-flex items-center px-5 py-3 text-[#1c1917]/30 hover:text-[#d97757] hover:bg-[#f7f3ed] disabled:opacity-30 transition-all border-r border-[#e5dec9]"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" strokeWidth={3} />
                        </button>
                        <button
                            onClick={() => router.push(createPageURL(currentPage + 1))}
                            disabled={currentPage >= totalPages}
                            className="relative inline-flex items-center px-5 py-3 text-[#1c1917]/30 hover:text-[#d97757] hover:bg-[#f7f3ed] disabled:opacity-30 transition-all"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-4 w-4" aria-hidden="true" strokeWidth={3} />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
