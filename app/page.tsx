import Image from 'next/image';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#fdfcf9] flex flex-col relative overflow-hidden font-sans selection:bg-primary-500 selection:text-white">
            {/* Geometric Decorative Elements */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-[#f7f3ed] -rotate-12 rounded-3xl -z-10"></div>
            <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[40%] bg-[#f1ede4] rotate-6 rounded-3xl -z-10 opacity-60"></div>
            <div className="absolute top-[40%] left-[10%] w-12 h-12 bg-[#d97757]/10 rounded-lg -z-10"></div>
            <div className="absolute bottom-[10%] right-[15%] w-24 h-24 bg-[#0f172a]/5 rounded-full -z-10"></div>

            {/* Navigation / Header */}
            <header className="relative z-50 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                        <Image src="/logo.png" alt="TaskForge Logo" fill className="object-contain" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-[#1c1917]">Task<span className="text-[#d97757]">Forge</span></span>
                </div>
                <nav className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-[#1c1917]/60">
                    <a href="#" className="hover:text-[#d97757] transition-colors">Platform</a>
                    <a href="#" className="hover:text-[#d97757] transition-colors">Team</a>
                    <a href="#" className="hover:text-[#d97757] transition-colors">Roadmap</a>
                    <a href="#" className="hover:text-[#d97757] transition-colors">Pricing</a>
                </nav>
                <div className="flex items-center gap-4">
                    <a href="/login" className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1c1917] hover:text-[#d97757] transition-colors">Sign In</a>
                    <a href="/login" className="btn-primary py-2.5 px-6 text-[10px]">Get Started</a>
                </div>
            </header>

            <main className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center px-8 py-12 max-w-7xl mx-auto w-full gap-16">
                {/* Left: Content */}
                <div className="flex-1 space-y-8 text-center md:text-left">
                    <div className="space-y-4">
                        <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#d97757]">Enterprise Orchestration</h2>
                        <h1 className="text-6xl md:text-8xl font-black text-[#1c1917] tracking-tight leading-[0.9]">
                            PROJECT<br />
                            <span className="text-[#d97757]/90">MANAGEMENT.</span>
                        </h1>
                    </div>

                    <p className="text-lg md:text-xl text-[#1c1917]/60 font-medium leading-relaxed max-w-lg italic font-serif">
                        Align your team’s frequency. Streamline critical operations with an organic, high-performance workspace designed for elite coordination.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <a href="/login" className="btn-primary px-10 py-5 text-sm">
                            Initialize Node
                        </a>
                        <a href="/login" className="btn-secondary px-10 py-5 text-sm">
                            Read More...
                        </a>
                    </div>
                </div>

                {/* Right: Illustration */}
                <div className="flex-1 w-full max-w-xl animate-in fade-in slide-in-from-right-10 duration-1000">
                    <div className="relative aspect-square w-full">
                        <Image
                            src="/hero_illustration.png"
                            alt="Project Management Illustration"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>
            </main>

            {/* Bottom Section (Featured Areas) */}
            <section className="relative z-10 px-8 py-24 bg-[#f7f3ed]/50 w-full border-t border-[#e5dec9]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-6 group">
                        <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-white border border-[#e5dec9] shadow-inner mb-6 transition-transform duration-500 group-hover:-translate-y-2">
                            <Image src="/gears.png" alt="Efficiency" fill className="object-cover opacity-90 scale-110" />
                        </div>
                        <h3 className="text-xl font-black text-[#1c1917] tracking-tight">OPERATIONAL SPEED</h3>
                        <p className="text-sm text-[#1c1917]/50 leading-relaxed font-semibold">Deploy strategies with high-velocity precision. Our agile engine is refined for synchronous execution.</p>
                        <button className="text-[10px] font-black uppercase tracking-widest text-[#d97757] hover:gap-3 flex items-center gap-2 transition-all">Details <span className="text-lg">→</span></button>
                    </div>

                    <div className="space-y-6 group">
                        <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-white border border-[#e5dec9] shadow-inner mb-6 transition-transform duration-500 group-hover:-translate-y-2">
                            <Image src="/collaboration.png" alt="Collaborate" fill className="object-cover opacity-90 scale-110" />
                        </div>
                        <h3 className="text-xl font-black text-[#1c1917] tracking-tight">STRATEGIC SYNERGY</h3>
                        <p className="text-sm text-[#1c1917]/50 leading-relaxed font-semibold">Unified command centers for elite teams. achieve resonance through seamless data transparency.</p>
                        <button className="text-[10px] font-black uppercase tracking-widest text-[#d97757] hover:gap-3 flex items-center gap-2 transition-all">Details <span className="text-lg">→</span></button>
                    </div>

                    <div className="space-y-6 group">
                        <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-white border border-[#e5dec9] shadow-inner mb-6 transition-transform duration-500 group-hover:-translate-y-2">
                            <div className="absolute inset-0 flex items-center justify-center bg-white">
                                <span className="text-6xl grayscale opacity-20">📊</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-[#1c1917] tracking-tight">DEEP ANALYTICS</h3>
                        <p className="text-sm text-[#1c1917]/50 leading-relaxed font-semibold">Real-time performance harmonics. monitor every operational layer with precision telemetry.</p>
                        <button className="text-[10px] font-black uppercase tracking-widest text-[#d97757] hover:gap-3 flex items-center gap-2 transition-all">Details <span className="text-lg">→</span></button>
                    </div>
                </div>
            </section>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
        </div>
    );
}
