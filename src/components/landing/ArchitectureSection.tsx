import { Database, Cpu, Globe, Server, Cloud, Lock, Layers, Zap } from 'lucide-react';

const techStack = [
  {
    icon: Server,
    name: 'Apache Kafka',
    role: 'Event Streaming',
    description: 'High-throughput, fault-tolerant event bus handling 2M+ events/sec from satellite downlinks.',
  },
  {
    icon: Cpu,
    name: 'PyTorch',
    role: 'ML Inference',
    description: 'Custom ResNet-variant thermal anomaly classifier with ONNX-optimized edge inference.',
  },
  {
    icon: Database,
    name: 'PostGIS',
    role: 'Geospatial DB',
    description: 'Spatially-indexed fire perimeters, weather overlays, and infrastructure proximity queries.',
  },
  {
    icon: Globe,
    name: 'AWS Ground Station',
    role: 'Satellite Downlink',
    description: 'Managed ground station network for real-time LEO satellite contact windows.',
  },
  {
    icon: Cloud,
    name: 'Kubernetes / EKS',
    role: 'Orchestration',
    description: 'Auto-scaling inference pods across multi-AZ clusters with GPU node pools.',
  },
  {
    icon: Lock,
    name: 'FedRAMP / SOC-2',
    role: 'Compliance',
    description: 'End-to-end encrypted pipelines meeting federal and enterprise compliance standards.',
  },
  {
    icon: Layers,
    name: 'MapTiler / Mapbox',
    role: 'Visualization',
    description: 'High-resolution basemaps with real-time fire perimeter overlays and wind vectors.',
  },
  {
    icon: Zap,
    name: 'Redis Streams',
    role: 'Real-Time Cache',
    description: 'Sub-millisecond caching layer for active incident state and alert deduplication.',
  },
];

export default function ArchitectureSection() {
  return (
    <section className="relative py-20 md:py-32 bg-slate-950">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3 block">
            Infrastructure
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Under the Hood
          </h2>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg">
            Battle-tested infrastructure built for mission-critical uptime and
            global-scale fire detection.
          </p>
        </div>

        {/* Tech grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="group p-5 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-amber-500/30 hover:bg-slate-800/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-amber-500/10 transition-colors">
                  <tech.icon className="h-5 w-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{tech.name}</h4>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                    {tech.role}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
