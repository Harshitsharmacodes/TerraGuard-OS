import { Check, X } from 'lucide-react';

interface Row {
  feature: string;
  terraguard: string | boolean;
  legacy: string | boolean;
}

const rows: Row[] = [
  { feature: 'Average Detection Time', terraguard: '<47 seconds', legacy: '6–24 hours' },
  { feature: 'False Positive Rate', terraguard: '< 0.3%', legacy: '12–30%' },
  { feature: 'Satellite Coverage', terraguard: '14 LEO + 3 GEO', legacy: '1–2 GEO only' },
  { feature: 'AI-Powered Filtering', terraguard: true, legacy: false },
  { feature: 'Automated CAD Dispatch', terraguard: true, legacy: false },
  { feature: 'Real-Time Wind / Weather Overlay', terraguard: true, legacy: false },
  { feature: 'Crowdsourced Field Reports', terraguard: true, legacy: false },
  { feature: 'Night / Low-Visibility Detection', terraguard: 'MWIR + SAR', legacy: 'None' },
  { feature: 'FedRAMP / SOC-2 Compliant', terraguard: true, legacy: false },
  { feature: 'API & Webhook Integrations', terraguard: 'Full REST + gRPC', legacy: 'Limited / None' },
];

function CellValue({ value }: { value: string | boolean }) {
  if (value === true)
    return (
      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-sm">
        <Check className="h-4 w-4" /> Yes
      </span>
    );
  if (value === false)
    return (
      <span className="inline-flex items-center gap-1 text-red-400/70 font-medium text-sm">
        <X className="h-4 w-4" /> No
      </span>
    );
  return <span className="text-sm text-slate-300">{value}</span>;
}

export default function ComparisonTable() {
  return (
    <section className="relative py-20 md:py-32 bg-slate-900">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3 block">
            Competitive Edge
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            TerraGuard OS vs. Legacy Systems
          </h2>
          <p className="max-w-xl mx-auto text-slate-400">
            The difference between detection in seconds and detection in hours
            can be measured in acres — and lives.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-700/60">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/80">
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300 w-1/2">
                  Capability
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-red-400">
                  <span className="inline-flex items-center gap-1.5">
                    🔥 TerraGuard OS
                  </span>
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-slate-500">
                  Legacy / Manual
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-t border-slate-800 ${
                    i % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-900/20'
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-slate-300 font-medium">
                    {row.feature}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CellValue value={row.terraguard} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CellValue value={row.legacy} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
