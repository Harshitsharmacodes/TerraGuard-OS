import React from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { formatCoordinates } from '../../utils/geo';
import { ShieldAlert, MapPin, Clock, Camera, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';

export default function CommunityFeed() {
  const { userReports, panToLocation } = useIncidents();

  const getDensityBadge = (density: string) => {
    switch (density) {
      case 'Extreme':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Heavy':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Moderate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            Live Citizen Field Reports
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time crowdsourced sightings verified by satellite pass confirmation
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
          {userReports.length} Submitted
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
              <th className="py-2.5 px-3">Location &amp; Coordinates</th>
              <th className="py-2.5 px-3">Observations</th>
              <th className="py-2.5 px-3">Smoke Density</th>
              <th className="py-2.5 px-3">Media Proof</th>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {userReports.map((report) => (
              <tr key={report.id} className="hover:bg-slate-800/40 transition">
                {/* Coordinates */}
                <td className="py-3 px-3 font-mono text-slate-200">
                  <div className="flex items-center gap-1.5 font-bold text-slate-100">
                    <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
                    <span>{report.reportedLocationName || 'Field Scout GPS'}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {formatCoordinates(report.latitude, report.longitude)}
                  </span>
                </td>

                {/* Description */}
                <td className="py-3 px-3 text-slate-300 max-w-xs">
                  <p className="line-clamp-2">{report.description}</p>
                  {report.fireBehavior && (
                    <span className="inline-block mt-1 text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      Behavior: {report.fireBehavior}
                    </span>
                  )}
                </td>

                {/* Smoke Density */}
                <td className="py-3 px-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getDensityBadge(
                      report.smokeDensity
                    )}`}
                  >
                    {report.smokeDensity}
                  </span>
                </td>

                {/* Proof Media */}
                <td className="py-3 px-3">
                  {report.photoUrl ? (
                    <div className="w-12 h-9 rounded-lg overflow-hidden border border-slate-700 relative group cursor-pointer">
                      <img
                        src={report.photoUrl}
                        alt="Proof"
                        className="w-full h-full object-cover group-hover:scale-110 transition"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <Camera className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-500 text-[11px] italic">No file</span>
                  )}
                </td>

                {/* Timestamp */}
                <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(report.timestamp).toLocaleDateString()}
                  </span>
                </td>

                {/* Status */}
                <td className="py-3 px-3">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      report.status === 'Verified'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {report.status === 'Verified' ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                    {report.status}
                  </span>
                </td>

                {/* Action */}
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => panToLocation(report.latitude, report.longitude, 12)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-red-600 hover:text-white rounded-lg text-slate-300 transition text-[11px] font-medium"
                    title="Focus on map"
                  >
                    <Eye className="h-3 w-3" />
                    <span>View Map</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
