import React from 'react';
import { WildfireIncident } from '../../types';
import { useIncidents } from '../../context/IncidentContext';
import { formatCoordinates, getCompassHeading, calculateDistanceKm } from '../../utils/geo';
import {
  Flame,
  Wind,
  Thermometer,
  Droplets,
  Radio,
  Clock,
  Compass,
  Zap,
  MapPin,
  Shield,
  Activity,
  Layers,
  ChevronRight,
  ExternalLink,
  X,
  PhoneCall,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface TelemetryDrawerProps {
  incident: WildfireIncident;
  onClose: () => void;
}

export default function TelemetryDrawer({ incident, onClose }: TelemetryDrawerProps) {
  const { fireStations } = useIncidents();

  // Find nearest fire station
  const stationsWithDistance = fireStations.map((station) => ({
    ...station,
    distanceKm: calculateDistanceKm(
      incident.latitude,
      incident.longitude,
      station.latitude,
      station.longitude
    ),
  }));

  stationsWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);
  const nearestStation = stationsWithDistance[0];

  // Calculate approximate affected surface area in square km (pi * r^2)
  const burnedAreaSqKm = Math.round(Math.PI * Math.pow(incident.radiusKm, 2));

  // Severity color mapping
  const severityBadge = {
    Critical: 'bg-red-500/20 text-red-400 border-red-500/40',
    Moderate: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    Low: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  }[incident.severity];

  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-5 shadow-2xl space-y-5 animate-in fade-in slide-in-from-right-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono border ${severityBadge}`}
            >
              {incident.severity} SEVERITY
            </span>
            <span className="text-xs text-slate-500 font-mono">ID: {incident.id}</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <Flame className="h-5 w-5 text-red-500" />
            {incident.name}
          </h2>
          <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 font-mono">
            <MapPin className="h-3 w-3 text-red-400" />
            {formatCoordinates(incident.latitude, incident.longitude)}
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Close drawer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Primary Telemetry Metrics Grid */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-red-400" />
          Atmospheric &amp; Sensor Telemetry
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Temperature</span>
              <Thermometer className="h-3.5 w-3.5 text-red-400" />
            </div>
            <div className="text-lg font-bold text-white font-mono">{incident.temperature}°C</div>
            <div className="text-[10px] text-red-400">Extreme Heat Index</div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Wind Speed</span>
              <Wind className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-white font-mono">{incident.windSpeed} km/h</div>
            <div className="text-[10px] text-cyan-400">
              {incident.windDirection}° ({getCompassHeading(incident.windDirection)})
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Humidity</span>
              <Droplets className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <div className="text-lg font-bold text-white font-mono">{incident.humidity}%</div>
            <div className="text-[10px] text-amber-400">Critical Dry Fuel</div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Radiative Power</span>
              <Zap className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-white font-mono">
              {incident.frpMw ?? Math.round(incident.radiusKm * 18.5)} MW
            </div>
            <div className="text-[10px] text-slate-400">MWIR Satellite Ingest</div>
          </div>
        </div>
      </div>

      {/* Containment and Perimeter Geometry */}
      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium">Containment Status</span>
          <span className="font-mono font-bold text-white">{incident.containment}% Contained</span>
        </div>

        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${incident.containment}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-400">Danger Zone Radius:</span>
            <div className="font-bold text-slate-200 font-mono mt-0.5">{incident.radiusKm} km</div>
          </div>
          <div>
            <span className="text-slate-400">Est. Perimeter Area:</span>
            <div className="font-bold text-slate-200 font-mono mt-0.5">~{burnedAreaSqKm} km²</div>
          </div>
        </div>
      </div>

      {/* Nearest Fire Brigade & Dispatch Match */}
      {nearestStation && (
        <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              Nearest Regional Fire Brigade
            </span>
            <span className="text-[11px] font-mono font-bold text-amber-300">
              {nearestStation.distanceKm} km away
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">{nearestStation.name}</div>
              <div className="text-xs text-slate-400">
                {nearestStation.district}, {nearestStation.state}
              </div>
            </div>

            <a
              href={`tel:${nearestStation.phone}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition shadow-md shadow-red-600/30"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              Direct Call
            </a>
          </div>
        </div>
      )}

      {/* Description / Dispatcher Notes */}
      <div className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
        <span className="text-slate-300 font-semibold block mb-1">Incident Description &amp; Directives:</span>
        {incident.description}
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 pt-1">
        <Link
          to="/emergency"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-red-600/25"
        >
          <Radio className="h-4 w-4" />
          Dispatch SOS from this Location
        </Link>
        <button
          onClick={onClose}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
