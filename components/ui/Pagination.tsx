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
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => router.push(createPageURL(currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                    Previous
                </button>
                <button
                    onClick={() => router.push(createPageURL(currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-slate-500 font-medium">
                        Page <span className="font-black text-slate-900">{currentPage}</span> of{' '}
                        <span className="font-black text-slate-900">{totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-xl shadow-sm overflow-hidden border border-slate-200" aria-label="Pagination">
                        <button
                            onClick={() => router.push(createPageURL(currentPage - 1))}
                            disabled={currentPage <= 1}
                            className="relative inline-flex items-center px-3 py-2 text-slate-400 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors border-r border-slate-200"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                            onClick={() => router.push(createPageURL(currentPage + 1))}
                            disabled={currentPage >= totalPages}
                            className="relative inline-flex items-center px-3 py-2 text-slate-400 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
