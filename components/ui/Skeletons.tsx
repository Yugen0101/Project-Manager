'use client';

export function SkeletonBoard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                    <div className="h-10 bg-slate-200 rounded-lg w-1/2"></div>
                    <div className="space-y-3">
                        <div className="h-32 bg-slate-100 rounded-2xl border-2 border-slate-50"></div>
                        <div className="h-32 bg-slate-100 rounded-2xl border-2 border-slate-50"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function SkeletonInsight() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-slate-100 rounded-2xl border-2 border-slate-50"></div>
            ))}
        </div>
    );
}

export function SkeletonList() {
    return (
        <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-slate-50 rounded-xl border border-slate-100"></div>
            ))}
        </div>
    );
}
