'use client';

import {
    BookOpenIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    RocketLaunchIcon,
    AcademicCapIcon,
    LightBulbIcon,
    CommandLineIcon,
    Square3Stack3DIcon,
    PresentationChartLineIcon,
    IdentificationIcon,
    BriefcaseIcon,
    SparklesIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

interface SectionProps {
    title: string;
    icon: any;
    children: React.ReactNode;
    subtitle?: string;
}

function GuideSection({ title, icon: Icon, children, subtitle }: SectionProps) {
    return (
        <div className="bg-white rounded-[2.5rem] border border-[#e5dec9] p-10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-accent-500 group-hover:bg-accent-500 group-hover:text-white transition-colors duration-500">
                        <Icon className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold uppercase tracking-widest text-[#1c1917]">{title}</h3>
                        {subtitle && <p className="text-[10px] font-medium text-accent-500/60 uppercase tracking-widest mt-1">{subtitle}</p>}
                    </div>
                </div>
            </div>
            <div className="space-y-6 text-[13px] font-medium text-[#1c1917]/70 leading-relaxed">
                {children}
            </div>
        </div>
    );
}

export default function OperationalManual({ role }: { role: string }) {
    return (
        <div className="max-w-6xl mx-auto space-y-16 py-10 px-6">
            {/* Hero Header */}
            <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-500/10 text-accent-600 rounded-full text-[10px] font-semibold uppercase tracking-[0.3em] shadow-sm">
                    <BookOpenIcon className="w-4 h-4" />
                    Executive Onboarding v2.0
                </div>
                <h1 className="text-6xl font-semibold text-[#1c1917] tracking-tighter uppercase leading-none">
                    Suite <span className="text-accent-500 font-outline">Governance</span>
                </h1>
                <p className="text-[#1c1917]/40 text-xs font-semibold uppercase tracking-[0.4em] max-w-2xl mx-auto">
                    A comprehensive guide to leveraging TaskForge's executive capabilities for peak organizational performance.
                </p>
                <div className="h-1 w-20 bg-accent-500/20 mx-auto rounded-full"></div>
            </div>

            {/* Modular Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Dashboard / Executive Hub */}
                <GuideSection
                    title="Dashboard"
                    subtitle="Strategic Oversight"
                    icon={PresentationChartLineIcon}
                >
                    <p>The <span className="text-[#1c1917] font-medium">Dashboard</span> is your high-altitude dashboard for real-time organizational health.</p>
                    <ul className="space-y-4">
                        <li className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-1.5 shrink-0"></div>
                            <span><span className="font-medium text-[#1c1917]">KPI Integration:</span> Track total project counts, active identities, and task completion velocity at a glance.</span>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-1.5 shrink-0"></div>
                            <span><span className="font-medium text-[#1c1917]">Risk Matrix:</span> Identify projects in "Critical" or "Delayed" status before they impact milestones.</span>
                        </li>
                    </ul>
                    <div className="mt-8 p-5 bg-[#f7f3ed] rounded-2xl border border-[#e5dec9]/60">
                        <p className="text-[11px] font-semibold uppercase text-accent-600 mb-2 flex items-center gap-2">
                            <SparklesIcon className="w-3.5 h-3.5" /> Elite Strategy
                        </p>
                        <p className="italic text-xs font-medium text-[#1c1917]/60">Check the Activity Stream daily to understand the "Pulse" of your management team without manual status reports.</p>
                    </div>
                </GuideSection>

                {/* Project Portfolio */}
                <GuideSection
                    title="Projects"
                    subtitle="Lifecycle Management"
                    icon={BriefcaseIcon}
                >
                    <p>Manage complex mandates using the <span className="text-[#1c1917] font-medium">Projects</span> module.</p>
                    <ul className="space-y-4">
                        <li className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-1.5 shrink-0"></div>
                            <span><span className="font-medium text-[#1c1917]">Agile Sprints:</span> Initialize time-boxed sprints to focus team efforts on high-impact deliverables.</span>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-1.5 shrink-0"></div>
                            <span><span className="font-medium text-[#1c1917]">Unified Board:</span> View task progression across the Execution Board for visual workflow management.</span>
                        </li>
                    </ul>
                    <div className="mt-8 p-5 bg-accent-50 rounded-2xl border border-accent-100">
                        <p className="text-[11px] font-semibold uppercase text-accent-600 mb-2 flex items-center gap-2">
                            <SparklesIcon className="w-3.5 h-3.5" /> Elite Strategy
                        </p>
                        <p className="italic text-xs font-medium text-[#1c1917]/60">Use the "Advanced Analytics" tab within a project to identify bottlenecked team members who may need resourcing support.</p>
                    </div>
                </GuideSection>

                {/* Identity & Credentials */}
                <GuideSection
                    title="Team & ID Cards"
                    subtitle="Security & Access"
                    icon={IdentificationIcon}
                >
                    <p>Our premium <span className="text-[#1c1917] font-medium">ID Card System</span> ensures every team member has high-fidelity identity verification.</p>
                    <ul className="space-y-4">
                        <li className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-1.5 shrink-0"></div>
                            <span><span className="font-medium text-[#1c1917]">Identity Cards:</span> Generate stunning, printable ID cards with unique QR verification and professional branding.</span>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-1.5 shrink-0"></div>
                            <span><span className="font-medium text-[#1c1917]">Access Levels:</span> Admin → Associate → Member. Each tier has precisely tuned data visibility policies.</span>
                        </li>
                    </ul>
                    <div className="mt-8 p-5 bg-blue-50 rounded-2xl border border-blue-100">
                        <p className="text-[11px] font-semibold uppercase text-blue-600 mb-2 flex items-center gap-2">
                            <SparklesIcon className="w-3.5 h-3.5" /> Elite Strategy
                        </p>
                        <p className="italic text-xs font-medium text-[#1c1917]/60">Deactivate "Inactive" members via the Directory to instantly restrict their access while preserving their historical task data for audit.</p>
                    </div>
                </GuideSection>

                {/* Central Registry */}
                <GuideSection
                    title="Tasks"
                    subtitle="Execution Excellence"
                    icon={CommandLineIcon}
                >
                    <p>The <span className="text-[#1c1917] font-medium">Task Manager</span> is the granular engine of your organization.</p>
                    <ul className="space-y-4">
                        <li className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-1.5 shrink-0"></div>
                            <span><span className="font-medium text-[#1c1917]">Task Inheritance:</span> Tasks are parented to Projects and Sprints to ensure clear accountability.</span>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-1.5 shrink-0"></div>
                            <span><span className="font-medium text-[#1c1917]">Prioritization:</span> Assign Critical, High, or Low priority levels to manage team focus effectively.</span>
                        </li>
                    </ul>
                    <div className="mt-8 p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <p className="text-[11px] font-semibold uppercase text-emerald-600 mb-2 flex items-center gap-2">
                            <SparklesIcon className="w-3.5 h-3.5" /> Elite Strategy
                        </p>
                        <p className="italic text-xs font-medium text-[#1c1917]/60">Encourage team members to use Subtasks for complex deliveries; it increases visibility on progress without clustering the main board.</p>
                    </div>
                </GuideSection>
            </div>

            {/* Collaborations Section */}
            <div className="bg-[#1c1917] rounded-[3.5rem] p-16 text-white relative overflow-hidden group shadow-3xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:bg-accent-500/30 transition-all duration-1000"></div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10">
                        <div className="w-20 h-20 bg-accent-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-accent-500/50">
                            <UserGroupIcon className="w-10 h-10" />
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-4xl font-semibold uppercase tracking-tighter">Team <span className="text-accent-500">Meetings</span></h2>
                            <p className="text-white/60 text-base font-medium leading-relaxed">
                                Our integrated meeting framework allows you to synchronize your units globally.
                            </p>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-accent-500/10 border border-accent-500/30 flex items-center justify-center font-semibold text-[10px] text-accent-500">01</div>
                                    <span className="text-sm font-medium uppercase tracking-widest text-white/90">Instant Meeting Generation</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-accent-500/10 border border-accent-500/30 flex items-center justify-center font-semibold text-[10px] text-accent-500">02</div>
                                    <span className="text-sm font-medium uppercase tracking-widest text-white/90">Automated Calendar Linking</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] space-y-6 group-hover:border-white/20 transition-all">
                        <h4 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-500">Resource Support</h4>
                        <p className="text-sm font-medium text-white/80 leading-relaxed italic">
                            "The key to executive success isn't tracking time—it's tracking alignment. Ensure your team is synchronized using the Meetings suite at every milestone."
                        </p>
                        <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center font-semibold text-xs text-white">TF</div>
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-widest">Management System</p>
                                <p className="text-[9px] font-medium text-white/40 uppercase tracking-[0.2em] mt-0.5">Automated Guidance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Support Footer */}
            <div className="text-center pb-20">
                <p className="text-[#1c1917]/30 text-[10px] font-semibold uppercase tracking-[0.5em]">TaskForge Executive Platform / Operational Intelligence</p>
            </div>
        </div>
    );
}
