import Image from 'next/image';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-beige-50 flex flex-col relative overflow-hidden font-sans selection:bg-accent-500 selection:text-white">
            {/* Warm Beige Decorative Background Elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-beige-100/50 blur-[120px] rounded-full -z-10 animate-pulse duration-[10s]"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[50%] bg-accent-100/30 blur-[100px] rounded-full -z-10"></div>

            {/* Navigation / Header */}
            <header className="relative z-50 px-8 py-8 flex items-center justify-between max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <Image src="/logo.png" alt="TaskForge Logo" width={64} height={64} className="object-contain" />
                    </div>
                    <span className="text-3xl font-bold tracking-tight text-[#1c1917]">Task<span className="text-accent-600">Forge</span></span>
                </div>
                <nav className="hidden md:flex items-center gap-10 text-sm font-semibold text-[#1c1917]/60">
                    <a href="#" className="hover:text-accent-600 transition-colors">Platform</a>
                    <a href="#" className="hover:text-accent-600 transition-colors">Solutions</a>
                    <a href="#" className="hover:text-accent-600 transition-colors">Resources</a>
                    <a href="#" className="hover:text-accent-600 transition-colors">Pricing</a>
                </nav>
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
                            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-[#d97757] mb-2">Operations Hub</h2>
                            <h1 className="text-4xl lg:text-6xl font-black text-[#1c1917] tracking-tighter uppercase leading-[0.95]">
                                Project<br />Management
                            </h1>
                            <p className="text-[#1c1917]/70 font-medium text-base max-w-md mt-6 leading-relaxed">
                                Streamline your workflow with an intuitive, high-performance workspace designed for modern teams.
                            </p>
                            <div className="pt-8">
                                <a href="/login" className="bg-[#d9cfb0] hover:bg-[#c9bea0] text-[#1c1917] px-8 py-4 rounded-xl font-black text-xs tracking-[0.2em] uppercase transition-all inline-block shadow-lg hover:shadow-xl hover:-translate-y-1">
                                    Read More
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right: Illustration */}
                    <div className="bg-[#eaddcf]/30 p-0 lg:p-8 flex items-center justify-center relative">
                        {/* Inner white frame for emphasis OR blend */}
                        <div className="relative w-full h-full flex items-center justify-center p-8">
                            <div className="relative aspect-square w-full max-w-md shadow-2xl rounded-3xl overflow-hidden border-4 border-white/50">
                                <Image
                                    src="/hero_beige.png"
                                    alt="Project Management Illustration"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section className="relative z-10 px-8 py-20 w-full bg-[#eaddcf]/30">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {/* Feedback Card */}
                        <div className="group flex flex-col">
                            <div className="bg-white p-8 aspect-square flex items-center justify-center relative z-10 shadow-sm transition-transform duration-500 group-hover:-translate-y-2">
                                <div className="relative w-full h-full">
                                    <Image src="/feature_feedback.png" alt="Feedback" fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                            </div>
                            <div className="bg-[#d9cfb0] p-8 pb-12 text-center text-[#1c1917] flex-1 flex flex-col items-center space-y-4">
                                <h3 className="text-xl font-black uppercase tracking-widest text-white drop-shadow-sm">Feedback</h3>
                                <p className="text-[#1c1917]/70 text-[11px] leading-relaxed line-clamp-4">
                                    Facilitate open channels for rapid iteration cycles. Transparent communication builds stronger products.
                                </p>
                                <button className="mt-auto bg-white text-[#1c1917] text-[10px] font-bold uppercase tracking-widest px-6 py-2 shadow-sm hover:shadow-md transition-all">Details...</button>
                            </div>
                        </div>

                        {/* Conflict Resolution Card */}
                        <div className="group flex flex-col mt-12 md:mt-0">
                            <div className="bg-white p-8 aspect-square flex items-center justify-center relative z-10 shadow-sm transition-transform duration-500 group-hover:-translate-y-2">
                                <div className="relative w-full h-full">
                                    <Image src="/feature_conflict.png" alt="Conflict Resolution" fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                            </div>
                            <div className="bg-[#d9cfb0] p-8 pb-12 text-center text-[#1c1917] flex-1 flex flex-col items-center space-y-4">
                                <h3 className="text-xl font-black uppercase tracking-widest text-white drop-shadow-sm">Conflict<br />Resolution</h3>
                                <p className="text-[#1c1917]/70 text-[11px] leading-relaxed line-clamp-4">
                                    Median aligned strategies for team cohesion. Resolve vectors of disagreement with data-driven insights.
                                </p>
                                <button className="mt-auto bg-white text-[#1c1917] text-[10px] font-bold uppercase tracking-widest px-6 py-2 shadow-sm hover:shadow-md transition-all">Details...</button>
                            </div>
                        </div>

                        {/* Deal Making Card */}
                        <div className="group flex flex-col">
                            <div className="bg-white p-8 aspect-square flex items-center justify-center relative z-10 shadow-sm transition-transform duration-500 group-hover:-translate-y-2">
                                <div className="relative w-full h-full">
                                    <Image src="/feature_deal.png" alt="Deal Making" fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                            </div>
                            <div className="bg-[#d9cfb0] p-8 pb-12 text-center text-[#1c1917] flex-1 flex flex-col items-center space-y-4">
                                <h3 className="text-xl font-black uppercase tracking-widest text-white drop-shadow-sm">Deal Making</h3>
                                <p className="text-[#1c1917]/70 text-[11px] leading-relaxed line-clamp-4">
                                    Seal partnerships with confidence. Secure protocols for high-value contract management.
                                </p>
                                <button className="mt-auto bg-white text-[#1c1917] text-[10px] font-bold uppercase tracking-widest px-6 py-2 shadow-sm hover:shadow-md transition-all">Details...</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
        </div >
    );
}
