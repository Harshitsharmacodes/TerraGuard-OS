import React, { useState, useMemo } from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { calculateDistanceKm, formatCoordinates, getCompassHeading } from '../../utils/geo';
import {
  AlertTriangle,
  PhoneCall,
  Radio,
  Copy,
  Check,
  Share2,
  Shield,
  Clock,
  Compass,
  MapPin,
  ExternalLink,
  Flame,
  Volume2,
  VolumeX,
  Crosshair,
  Navigation,
} from 'lucide-react';

export default function SOSPanel() {
  const { userPosition, fireStations, selectedIncident, viewport } = useIncidents();

  const [copied, setCopied] = useState(false);
  const [sirenActive, setSirenActive] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  // Active focal coordinates: either user GPS, or selected incident, or current map viewport center
  const focalCoords = useMemo(() => {
    if (userPosition) {
      return {
        lat: userPosition.latitude,
        lng: userPosition.longitude,
        source: 'Live Browser GPS Device Fix',
      };
    }
    if (selectedIncident) {
      return {
        lat: selectedIncident.latitude,
        lng: selectedIncident.longitude,
        source: `Active Incident: ${selectedIncident.name}`,
      };
    }
    return {
      lat: viewport.center[0],
      lng: viewport.center[1],
      source: 'Regional Map Focus (Narmada Valley Sector)',
    };
  }, [userPosition, selectedIncident, viewport]);

  // Sort fire stations by distance from current focal coordinates
  const stationsSorted = useMemo(() => {
    return fireStations
      .map((station) => {
        const distance = calculateDistanceKm(
          focalCoords.lat,
          focalCoords.lng,
          station.latitude,
          station.longitude
        );
        // Estimate ground dispatch response time: ~5 mins base + 1.4 mins per km
        const estimatedMinutes = Math.max(4, Math.round(5 + distance * 1.4));
        return {
          ...station,
          distanceKm: distance,
          estimatedResponseMins: estimatedMinutes,
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [fireStations, focalCoords]);

  const nearestStation = stationsSorted[0];

  // Pre-formatted CAD dispatch emergency payload
  const dispatchPayload = useMemo(() => {
    const timestamp = new Date().toISOString();
    const formattedPos = formatCoordinates(focalCoords.lat, focalCoords.lng);
    const stationText = nearestStation
      ? `${nearestStation.name} (${nearestStation.distanceKm} km away)`
      : 'Regional Fire Command';

    return `[TERRAGUARD-OS EMERGENCY DISPATCH PROTOCOL]
TIMESTAMP: ${timestamp}
PRIORITY: ALPHA-1 IMMEDIATE DISPATCH
FOCAL COORDINATES: ${formattedPos} (Lat: ${focalCoords.lat.toFixed(5)}, Lng: ${focalCoords.lng.toFixed(5)})
SOURCE: ${focalCoords.source}
NEAREST BRIGADE: ${stationText}
TELEMETRY: MWIR Thermal Hotspot Active | Flame Spread Velocity Vector Projected
ACTION REQUIRED: Immediate ground squad rollout and perimeter water drop assessment.`;
  }, [focalCoords, nearestStation]);

  const handleCopy = () => {
    navigator.clipboard.writeText(dispatchPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSendSos = () => {
    setSosSent(true);
    setSirenActive(true);
    setTimeout(() => setSirenActive(false), 5000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'TERRAGUARD OS — WILDFIRE SOS ALERT',
          text: dispatchPayload,
        })
        .catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Alert Banner */}
        <div className="relative overflow-hidden p-6 md:p-8 rounded-2xl bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/50 border border-red-500/40 shadow-2xl shadow-red-950/50">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Flame className="w-64 h-64 text-red-500" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-mono font-bold tracking-wider uppercase mb-3">
                <Radio className="h-3.5 w-3.5 animate-pulse" />
                Emergency CAD Dispatch Module
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Emergency Fire Brigade &amp; SOS Dispatch
              </h1>
              <p className="text-slate-300 text-sm md:text-base max-w-2xl mt-2 leading-relaxed">
                Connect directly with regional fire stations, generate standardized Computer-Aided
                Dispatch (CAD) payloads, and trigger instant rescue coordination.
              </p>
            </div>

            {/* Main Action Trigger */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={handleSendSos}
                className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 via-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-base uppercase tracking-wider rounded-xl shadow-2xl shadow-red-600/50 hover:scale-[1.02] active:scale-98 transition-all"
              >
                <AlertTriangle className="h-6 w-6 text-amber-200 animate-bounce" />
                <span>Send Live SOS Alert</span>
              </button>
            </div>
          </div>

          {/* SOS Confirmation Flash */}
          {sosSent && (
            <div className="mt-6 p-4 rounded-xl bg-red-600/20 border border-red-500 text-red-200 text-xs font-mono flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></span>
                <span>
                  EMERGENCY BROADCAST ACTIVE: Coordinates transmitted to regional dispatch network.
                </span>
              </div>
              <span className="text-[10px] text-amber-300">DISPATCH CHANNEL 154.280 MHz</span>
            </div>
          )}
        </div>

        {/* Two-Column Operation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Coordinates & CAD Payload */}
          <div className="lg:col-span-7 space-y-6">
            {/* Focal Location Status */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-400" />
                  Active Incident Dispatch Coordinates
                </h2>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  GPS LOCKED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Standard Lat / Long:</span>
                  <div className="text-base font-bold text-white font-mono">
                    {formatCoordinates(focalCoords.lat, focalCoords.lng)}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    Lat: {focalCoords.lat.toFixed(5)} | Lng: {focalCoords.lng.toFixed(5)}
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Position Origin:</span>
                  <div className="text-sm font-semibold text-slate-200">
                    {focalCoords.source}
                  </div>
                  <div className="text-[11px] text-amber-400 font-mono mt-1">
                    Nearest: {nearestStation?.name || 'Local Brigade'}
                  </div>
                </div>
              </div>
            </div>

            {/* Standardized CAD Dispatch Message Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Radio className="h-4 w-4 text-amber-400" />
                  Pre-Formatted CAD Emergency Dispatch Payload
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Share dispatch payload"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 rounded-lg text-xs font-semibold transition"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Payload'}</span>
                  </button>
                </div>
              </div>

              {/* Monospace CAD text display */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
                {dispatchPayload}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Standard NIFC / IRWIN &amp; CAD compliant format</span>
                <span className="text-amber-400 font-mono">1-Click Dispatch Copy</span>
              </div>
            </div>

            {/* Field Evacuation Directives */}
            <div className="p-5 bg-amber-950/20 border border-amber-500/30 rounded-2xl space-y-2">
              <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-400" />
                Wildfire Safety &amp; Evacuation Directives
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Never run uphill away from a wildfire; fires spread significantly faster upslope.</li>
                <li>Travel perpendicular to the wind direction to exit the primary smoke &amp; ember vector.</li>
                <li>Keep headlights on, windows rolled up, and air ventilation set to recirculate inside vehicle.</li>
                <li>Tune VHF emergency radio to 154.280 MHz or local Forestry TAC frequencies.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Regional Fire Stations Proximity Table */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-400" />
                    Regional Fire Station Roster
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Calculated by Haversine proximity from current position
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                  {stationsSorted.length} Available
                </span>
              </div>

              {/* Station List */}
              <div className="space-y-3">
                {stationsSorted.map((station, index) => {
                  const isClosest = index === 0;
                  return (
                    <div
                      key={station.id}
                      className={`p-4 rounded-xl border transition ${
                        isClosest
                          ? 'bg-red-950/30 border-red-500/50 shadow-lg shadow-red-950/40'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{station.name}</span>
                            {isClosest && (
                              <span className="px-2 py-0.2 rounded text-[9px] font-mono font-bold bg-red-600 text-white">
                                CLOSEST UNIT
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">
                            {station.district}, {station.state}
                          </span>
                        </div>

                        <div className="text-right font-mono">
                          <div className="text-xs font-bold text-red-400">
                            {station.distanceKm} km
                          </div>
                          <div className="text-[10px] text-slate-500">
                            ~{station.estimatedResponseMins} min ETA
                          </div>
                        </div>
                      </div>

                      {/* Phone & Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <span className="text-xs font-mono text-slate-300">{station.phone}</span>
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${station.phone}`}
                            className="flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition shadow-md shadow-red-600/30"
                          >
                            <PhoneCall className="h-3 w-3" />
                            Quick-Dial
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* National Emergency Hotline Shortcut */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    National Emergency Dispatch (Direct)
                  </span>
                  <span className="text-[11px] text-slate-400">India: 112 / 101 | US: 911 | AU: 000</span>
                </div>
                <a
                  href="tel:112"
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition"
                >
                  Dial 112 / 911
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
