import { Satellite, Brain, Bell, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Satellite,
    title: 'Ingest',
    subtitle: 'LEO / MWIR Satellite Feeds',
    description:
      'Continuous ingestion from 14 low-Earth-orbit satellites equipped with mid-wave infrared sensors. Raw thermal anomaly data streams through AWS Ground Station into our Kafka pipeline at sub-second latency.',
    tags: ['AWS Ground Station', 'MWIR Band', 'Kafka Streams'],
    color: 'amber',
  },
  {
    step: '02',
    icon: Brain,
    title: 'Detect',
    subtitle: 'PyTorch Anomaly Filtering',
    description:
      'Our proprietary deep-learning model — trained on 12M+ historical fire events — filters thermal anomalies in real time. False-positive rate below 0.3% across all biomes, from boreal forests to Mediterranean scrublands.',
    tags: ['PyTorch', 'ONNX Runtime', 'Edge GPU Inference'],
    color: 'red',
  },
  {
    step: '03',
    icon: Bell,
    title: 'Alert',
    subtitle: 'Automated CAD Integration',
    description:
      'Verified fire events are instantly dispatched via CAD (Computer-Aided Dispatch) integrations to regional fire agencies, NIFC, and community alert networks — with precise GPS, weather vectors, and risk scoring.',
    tags: ['CAD Integration', 'NIFC/IRWIN', 'SMS/Push Alerts'],
    color: 'emerald',
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  amber: {
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/10',
  },
  red: {
    border: 'border-red-500/30',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    glow: 'shadow-red-500/10',
  },
  emerald: {
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/10',
  },
};

export default function PipelineSection() {
  return (
    <section className="relative py-20 md:py-32 bg-slate-900">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3 block">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            The 3-Step Detection Pipeline
          </h2>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg">
            From photon capture in orbit to boots-on-ground dispatch — in under
            47 seconds.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-4">
          {steps.map((s, i) => {
            const c = colorMap[s.color];
            return (
              <div key={s.step} className="relative flex">
                {/* Connector arrow (desktop only) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-slate-600" />
                  </div>
                )}

                <div
                  className={`flex-1 p-6 md:p-8 rounded-2xl border ${c.border} bg-slate-800/40 shadow-xl ${c.glow} hover:shadow-2xl transition-shadow`}
                >
                  {/* Step badge */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`p-3 rounded-xl ${c.bg}`}>
                      <s.icon className={`h-6 w-6 ${c.text}`} />
                    </div>
                    <span className={`text-xs font-mono font-bold ${c.text} tracking-wider`}>
                      STEP {s.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{s.title}</h3>
                  <p className={`text-sm font-medium ${c.text} mb-4`}>{s.subtitle}</p>
                  <p className="text-sm text-slate-400 leading-relaxed mb-5">
                    {s.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {s.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-[11px] font-medium bg-slate-700/60 text-slate-300 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
