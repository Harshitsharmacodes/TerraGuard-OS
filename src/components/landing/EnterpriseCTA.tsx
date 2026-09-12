import { useState } from 'react';
import { Shield, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';

export default function EnterpriseCTA() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', org: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="enterprise" className="relative py-20 md:py-32 bg-slate-950">
      {/* Background accent */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — CTA copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
              <Building2 className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                Enterprise &amp; Government
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Protect Your Forests.{' '}
              <span className="bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
                Secure Your Communities.
              </span>{' '}
              Outpace the Flame.
            </h2>

            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              Whether you manage national forests, protect critical
              infrastructure, or coordinate multi-agency fire response —
              TerraGuard OS gives you the earliest possible warning with
              actionable intelligence.
            </p>

            <div className="space-y-3">
              {[
                'Sub-minute detection across any terrain or biome',
                'Direct CAD integration with your existing dispatch systems',
                'FedRAMP High & SOC-2 Type II certified',
                'Dedicated onboarding & 24/7 NOC support',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Demo form */}
          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-6 md:p-8 shadow-xl">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-16 w-16 text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Demo Requested
                </h3>
                <p className="text-slate-400 text-sm max-w-sm">
                  Our operations team will reach out within 24 hours to schedule
                  your personalized TerraGuard OS walkthrough.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-white mb-1">
                  Schedule an Operational Demo
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  See TerraGuard OS in action with your region's live data.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition"
                      placeholder="jane@agency.gov"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Organization
                    </label>
                    <input
                      type="text"
                      required
                      value={form.org}
                      onChange={(e) => setForm({ ...form, org: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition"
                      placeholder="US Forest Service"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Message (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition resize-none"
                      placeholder="Tell us about your coverage area..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40"
                  >
                    Request Demo
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
