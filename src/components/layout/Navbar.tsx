import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, Menu, X, Shield, Map, AlertTriangle, Radio } from 'lucide-react';
import { useIncidents } from '../../context/IncidentContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { incidents } = useIncidents();

  const links = [
    { to: '/', label: 'SaaS Platform', icon: Shield },
    { to: '/tracker', label: 'Live Wildfire Tracker', icon: Map, badge: `${incidents.length} Fires` },
    { to: '/emergency', label: 'Emergency SOS', icon: AlertTriangle, alert: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center">
              <Flame className="h-7 w-7 text-red-500 group-hover:text-red-400 transition-colors" />
              <div className="absolute inset-0 bg-red-500/20 blur-md rounded-full group-hover:bg-red-500/40 transition" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">
                  TerraGuard <span className="text-red-500">OS</span>
                </span>
                <span className="hidden lg:inline px-1.5 py-0.2 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-mono font-bold">
                  v2.4 ORBIT
                </span>
              </div>
              <span className="hidden sm:block text-[9px] text-slate-500 -mt-1 tracking-widest uppercase font-mono">
                Satellite Wildfire Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-2">
            {links.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-red-600/15 text-red-400 border border-red-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <link.icon className={`h-4 w-4 ${link.alert ? 'text-amber-400' : ''}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 bg-red-500/20 text-red-300 text-[10px] font-mono rounded-full font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Quick Launch Tracker CTA */}
            <Link
              to="/tracker"
              className="ml-2 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-600/25 hover:shadow-red-600/40 hover:scale-[1.02]"
            >
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              <span>Launch Tracker</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900/98 backdrop-blur-2xl border-t border-slate-800 px-4 py-4 space-y-2 animate-in fade-in slide-in-from-top-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
                isActive(link.to)
                  ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className="px-2 py-0.5 bg-red-500/20 text-red-300 text-xs font-mono rounded-full font-bold">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          <Link
            to="/tracker"
            onClick={() => setMobileOpen(false)}
            className="block text-center py-3 bg-red-600 text-white font-bold text-sm rounded-xl mt-2 shadow-lg shadow-red-600/30"
          >
            Launch Live Radar Tracker
          </Link>
        </div>
      )}
    </nav>
  );
}
