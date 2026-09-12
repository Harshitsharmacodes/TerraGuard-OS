import { Flame, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-6 w-6 text-red-500" />
              <span className="text-lg font-bold">
                TerraGuard <span className="text-red-500">OS</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Sub-minute wildfire detection powered by satellite intelligence and AI.
              Protecting communities worldwide.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-slate-300 transition">Live Tracker</a></li>
              <li><a href="#" className="hover:text-slate-300 transition">API Access</a></li>
              <li><a href="#" className="hover:text-slate-300 transition">CAD Integration</a></li>
              <li><a href="#" className="hover:text-slate-300 transition">Mobile App</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-slate-300 transition">Documentation</a></li>
              <li><a href="#" className="hover:text-slate-300 transition">Case Studies</a></li>
              <li><a href="#" className="hover:text-slate-300 transition">Research Papers</a></li>
              <li><a href="#" className="hover:text-slate-300 transition">Status Page</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Connect
            </h4>
            <div className="flex gap-3 mb-4">
              <a href="#" className="p-2 bg-slate-800 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition">
                <Mail className="h-4 w-4" />
              </a>
            </div>
            <p className="text-xs text-slate-600">ops@terraguard.io</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © 2026 TerraGuard OS. All rights reserved. SOC-2 Type II Certified.
          </p>
          <div className="flex gap-4 text-xs text-slate-600">
            <a href="#" className="hover:text-slate-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
