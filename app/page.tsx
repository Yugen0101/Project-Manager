export default function HomePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-slate-100">
            <div className="text-center space-y-6 p-8">
                <h1 className="text-5xl font-bold text-slate-900">
                    Project Manager
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl">
                    Professional Project Management SaaS
                </p>
                <div className="flex gap-4 justify-center mt-8">
                    <a href="/login" className="btn-primary">
                        Sign In
                    </a>
                    <a href="/admin/dashboard" className="btn-secondary">
                        Admin Dashboard
                    </a>
                </div>
                <div className="mt-12 text-sm text-slate-500">
                    <p>✓ Agile Methodology (Kanban + Scrum)</p>
                    <p>✓ Role-Based Access Control</p>
                    <p>✓ Real-time Collaboration</p>
                </div>
            </div>
        </div>
    );
}
