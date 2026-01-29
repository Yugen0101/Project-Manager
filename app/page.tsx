import Image from 'next/image';
import Link from 'next/link';
import {
    RectangleGroupIcon,
    ChartBarIcon,
    ArrowRightIcon,
    ShieldCheckIcon,
    BoltIcon,
    UserGroupIcon,
    DevicePhoneMobileIcon,
    CheckCircleIcon,
    Squares2X2Icon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline';
import TaskForgeLogo from '@/components/ui/TaskForgeLogo';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-beige-50 flex flex-col relative overflow-hidden font-sans selection:bg-accent-500 selection:text-white">
            {/* Warm Beige Decorative Background Elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-beige-100/50 blur-[120px] rounded-full -z-10 animate-pulse duration-[10s]"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[50%] bg-accent-100/30 blur-[100px] rounded-full -z-10"></div>

            {/* Navigation / Header */}
            <header className="relative z-50 px-8 py-8 flex items-center justify-between max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-6">
                    <TaskForgeLogo size="lg" />
                    <span className="text-4xl font-black tracking-tight text-[#1c1917] uppercase">Task<span className="text-accent-500">Forge</span></span>
                </div>
                <div className="flex items-center gap-6">
                    <a href="/login" className="text-sm font-semibold text-[#1c1917]/60 hover:text-accent-600 transition-colors">Sign In</a>
                    <a href="/login" className="btn-primary !px-6 !py-3 !text-sm !rounded-xl">Get Started</a>
                </div>
            </header>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12 w-full">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 w-full max-w-6xl mx-auto bg-[#f3efe7] rounded-[3rem] overflow-hidden border border-[#e5dec9] shadow-2xl shadow-[#d9cfb0]/30 min-h-[550px]">
                    {/* Left: Content */}
                    <div className="p-12 lg:p-16 flex flex-col justify-center space-y-6 relative overflow-hidden">
                        {/* Decorative squares - refined placement */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#e5dec9]/30 rounded-bl-[4rem] -z-0"></div>
                        <div className="absolute bottom-10 left-10 w-16 h-16 bg-[#d9cfb0]/20 rounded-full -z-0"></div>

                        <div className="relative z-10">
                            <h2 className="text-sm font-semibold tracking-[0.3em] uppercase text-[#d97757] mb-2">Operations Hub</h2>
                            <h1 className="text-4xl lg:text-6xl font-semibold text-[#1c1917] tracking-tighter uppercase leading-[0.95]">
                                Project<br />Management
                            </h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-600 mt-4 mb-2">
                                Forge your workflow
                            </p>
                            <p className="text-[#1c1917]/70 font-medium text-base max-w-md mt-6 leading-relaxed">
                                Streamline your workflow with an intuitive, high-performance workspace designed for modern teams.
                            </p>
                            <div className="pt-8">
                                <a href="/login" className="bg-[#d9cfb0] hover:bg-[#c9bea0] text-[#1c1917] px-8 py-4 rounded-xl font-semibold text-xs tracking-[0.2em] uppercase transition-all inline-block shadow-lg hover:shadow-xl hover:-translate-y-1">
                                    Read More
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right: Illustration */}
                    <div className="bg-[#eaddcf]/30 p-0 lg:p-8 flex items-center justify-center relative">
                        {/* Inner white frame for emphasis OR blend */}
                        <div className="relative w-full h-full flex items-center justify-center p-8">
                            <div className="relative aspect-square w-full max-w-md shadow-2xl rounded-3xl overflow-hidden border-4 border-white/50 group cursor-pointer">
                                <Image
                                    src="/hero_beige.png"
                                    alt="Project Management Illustration"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Premium Features Section */}
            <section className="relative z-10 px-8 py-32 w-full bg-beige-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24 space-y-4">
                        <h2 className="text-sm font-semibold tracking-[0.4em] uppercase text-accent-500">Core Capabilities</h2>
                        <h3 className="text-4xl md:text-5xl font-semibold text-[#1c1917] tracking-tighter uppercase leading-none">
                            Engineered for <br className="md:hidden" /><span className="text-accent-600/20 italic font-serif">Peak</span> Performance
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                        {/* Feedback Card */}
                        <div className="group relative flex flex-col cursor-pointer">
                            {/* Background Numbering */}
                            <span className="absolute -top-12 -left-4 text-8xl font-semibold text-[#1c1917]/[0.03] select-none group-hover:text-accent-500/10 transition-colors duration-500">01</span>

                            <div className="relative z-10 bg-white rounded-[3rem] p-4 flex flex-col h-full shadow-2xl shadow-beige-200/50 border border-beige-100 transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-[0_40px_80px_-15px_rgba(217,119,87,0.15)]">
                                <div className="aspect-[4/5] bg-[#fdfcf9] rounded-[2.5rem] relative overflow-hidden flex items-center justify-center mb-8 border border-beige-50">
                                    <div className="absolute inset-0 bg-gradient-to-t from-beige-100/30 to-transparent"></div>
                                    <Image
                                        src="/feature_feedback.png"
                                        alt="Feedback"
                                        fill
                                        className="object-contain p-12 transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-3"
                                    />
                                </div>
                                <div className="px-8 pb-10 space-y-5">
                                    <h3 className="text-2xl font-semibold uppercase tracking-tighter text-[#1c1917]">Feedback</h3>
                                    <div className="h-px w-12 bg-accent-500/30 group-hover:w-full transition-all duration-700"></div>
                                    <p className="text-[#1c1917]/60 text-xs font-medium leading-relaxed tracking-wide">
                                        Facilitate open channels for rapid iteration cycles. Transparent communication builds stronger, more resilient products.
                                    </p>
                                    <div className="pt-4 flex items-center gap-3 text-accent-600 font-bold text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-500">
                                        Explore Details
                                        <ArrowRightIcon className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Conflict Resolution Card */}
                        <div className="group relative flex flex-col cursor-pointer">
                            <span className="absolute -top-12 -left-4 text-8xl font-semibold text-[#1c1917]/[0.03] select-none group-hover:text-accent-500/10 transition-colors duration-500">02</span>

                            <div className="relative z-10 bg-white rounded-[3rem] p-4 flex flex-col h-full shadow-2xl shadow-beige-200/50 border border-beige-100 transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-[0_40px_80px_-15px_rgba(217,119,87,0.15)]">
                                <div className="aspect-[4/5] bg-[#fdfcf9] rounded-[2.5rem] relative overflow-hidden flex items-center justify-center mb-8 border border-beige-50">
                                    <div className="absolute inset-0 bg-gradient-to-t from-beige-100/30 to-transparent"></div>
                                    <Image
                                        src="/feature_conflict.png"
                                        alt="Conflict Resolution"
                                        fill
                                        className="object-contain p-12 transition-all duration-700 ease-out group-hover:scale-110 group-hover:-rotate-3"
                                    />
                                </div>
                                <div className="px-8 pb-10 space-y-5">
                                    <h3 className="text-2xl font-semibold uppercase tracking-tighter text-[#1c1917]">Conflicts</h3>
                                    <div className="h-px w-12 bg-accent-500/30 group-hover:w-full transition-all duration-700"></div>
                                    <p className="text-[#1c1917]/60 text-xs font-medium leading-relaxed tracking-wide">
                                        Strategies for team cohesion. Resolve conflicts with automated, data-driven insights.
                                    </p>
                                    <div className="pt-4 flex items-center gap-3 text-accent-600 font-bold text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-500">
                                        Explore Details
                                        <ArrowRightIcon className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Deal Making Card */}
                        <div className="group relative flex flex-col cursor-pointer">
                            <span className="absolute -top-12 -left-4 text-8xl font-semibold text-[#1c1917]/[0.03] select-none group-hover:text-accent-500/10 transition-colors duration-500">03</span>

                            <div className="relative z-10 bg-white rounded-[3rem] p-4 flex flex-col h-full shadow-2xl shadow-beige-200/50 border border-beige-100 transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-[0_40px_80px_-15px_rgba(217,119,87,0.15)]">
                                <div className="aspect-[4/5] bg-[#fdfcf9] rounded-[2.5rem] relative overflow-hidden flex items-center justify-center mb-8 border border-beige-50">
                                    <div className="absolute inset-0 bg-gradient-to-t from-beige-100/30 to-transparent"></div>
                                    <Image
                                        src="/feature_deal.png"
                                        alt="Deal Making"
                                        fill
                                        className="object-contain p-12 transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-3"
                                    />
                                </div>
                                <div className="px-8 pb-10 space-y-5">
                                    <h3 className="text-2xl font-semibold uppercase tracking-tighter text-[#1c1917]">Contracts</h3>
                                    <div className="h-px w-12 bg-accent-500/30 group-hover:w-full transition-all duration-700"></div>
                                    <p className="text-[#1c1917]/60 text-xs font-medium leading-relaxed tracking-wide">
                                        Seal partnerships with surgical precision. Secure protocols and automated workflows for high-value management.
                                    </p>
                                    <div className="pt-4 flex items-center gap-3 text-accent-600 font-bold text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-500">
                                        Explore Details
                                        <ArrowRightIcon className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium Dark Footer */}
            <footer className="relative z-10 bg-[#0a0f18] text-white pt-24 pb-12 px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-20 border-b border-white/10">
                        {/* About Section */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-semibold uppercase tracking-[0.2em]">About</h4>
                            <ul className="space-y-4 text-[13px] text-white/50 font-medium">
                                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Corporate Information</a></li>
                            </ul>
                        </div>

                        {/* Services Section */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-semibold uppercase tracking-[0.2em]">Services</h4>
                            <ul className="space-y-4 text-[13px] text-white/50 font-medium">
                                <li><a href="#" className="hover:text-white transition-colors">YouTube Scripts</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Instagram Content</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">LinkedIn Posts</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Twitter Threads</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Content Calendar</a></li>
                            </ul>
                        </div>

                        {/* Support Section */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-semibold uppercase tracking-[0.2em]">Support</h4>
                            <ul className="space-y-4 text-[13px] text-white/50 font-medium">
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                            </ul>
                        </div>

                        {/* Contact Us Section */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-semibold uppercase tracking-[0.2em]">Contact Us</h4>
                            <div className="space-y-6 text-[13px] text-white/50 font-medium leading-relaxed">
                                <div>
                                    <p className="text-white mb-1">Mail Us:</p>
                                    <a href="mailto:contact@taskforge.com" className="hover:text-white transition-colors">contact@taskforge.com</a>
                                </div>
                                <div>
                                    <p className="text-white mb-1">Registered Office Address:</p>
                                    <p>TaskForge Private Limited,<br />
                                        No. 42, Anna Nagar East,<br />
                                        Thiruvottriyur,<br />
                                        Chennai - 600019,<br />
                                        Tamil Nadu, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <span className="text-[11px] font-semibold uppercase tracking-widest text-white/30">Follow Us:</span>
                            <div className="flex items-center gap-5">
                                <a href="#" className="text-white/40 hover:text-white transition-all hover:scale-110">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" /></svg>
                                </a>
                                <a href="#" className="text-white/40 hover:text-white transition-all hover:scale-110">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                </a>
                                <a href="#" className="text-white/40 hover:text-white transition-all hover:scale-110">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                                </a>
                                <a href="#" className="text-white/40 hover:text-white transition-all hover:scale-110">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                </a>
                            </div>
                        </div>
                        <p className="text-[11px] font-medium text-white/20">© 2026 TaskForge. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
        </div>
    );
}
