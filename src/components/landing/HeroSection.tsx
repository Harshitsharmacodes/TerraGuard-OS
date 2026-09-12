import { Link } from 'react-router-dom';
import { Satellite, Play, ArrowRight, Radio, ShieldCheck, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full mb-8">
          <Radio className="h-3.5 w-3.5 text-red-400 animate-pulse" />
          <span className="text-xs font-medium text-red-400 uppercase tracking-wider">
            Live Monitoring Active — 8 Incidents Tracked
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
          <span className="text-white">From Orbit to Incident Response:</span>
          <br />
          <span className="bg-gradient-to-r from-red-400 via-amber-400 to-red-500 bg-clip-text text-transparent">
            The Sub-Minute Wildfire
          </span>
          <br />
          <span className="text-white">Intelligence Platform</span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed mb-10">
          TerraGuard OS fuses LEO satellite imagery, edge-deployed AI, and
          automated emergency dispatch to detect wildfires{' '}
          <span className="text-amber-400 font-semibold">47× faster</span> than
          legacy watch-tower systems.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#enterprise"
            className="group flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-600/25 hover:shadow-red-600/40 hover:scale-[1.02]"
          >
            <Play className="h-5 w-5" />
            Request Demo
            <ArrowRight className="h-4 w-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
          </a>
          <Link
            to="/tracker"
            className="group flex items-center gap-2 px-8 py-4 border border-slate-600 hover:border-red-500/50 text-slate-300 hover:text-white font-semibold rounded-xl transition-all hover:bg-slate-800/50"
          >
            <Satellite className="h-5 w-5" />
            Launch Live Tracker
          </Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
          {[
            { value: '<47s', label: 'Avg Detection', icon: Zap },
            { value: '99.7%', label: 'Accuracy Rate', icon: ShieldCheck },
            { value: '14', label: 'LEO Satellites', icon: Satellite },
            { value: '2,400+', label: 'Fires Detected', icon: Radio },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center p-4 bg-slate-800/30 border border-slate-700/40 rounded-xl"
            >
              <stat.icon className="h-5 w-5 text-red-400 mb-2" />
              <span className="text-2xl md:text-3xl font-bold text-white">
                {stat.value}
              </span>
              <span className="text-xs text-slate-500 mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
