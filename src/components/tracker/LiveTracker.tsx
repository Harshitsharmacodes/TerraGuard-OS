import React, { useState } from 'react';
import { useIncidents } from '../../context/IncidentContext';
import LocationSearchBar from './LocationSearchBar';
import WildfireMap from './WildfireMap';
import TelemetryDrawer from './TelemetryDrawer';
import CommunityFeed from './CommunityFeed';
import {
  Flame,
  Radio,
  Satellite,
  Shield,
  Layers,
  Filter,
  Users,
  Compass,
  ChevronDown,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import { Severity, WildfireIncident } from '../../types';

export default function LiveTracker() {
  const {
    incidents,
    selectedIncident,
    setSelectedIncident,
    severityFilter,
    setSeverityFilter,
    lastSatelliteSync,
    satelliteOrbitCount,
    panToLocation,
  } = useIncidents();

  const [activeTab, setActiveTab] = useState<'map' | 'reports'>('map');
  const [showDrawer, setShowDrawer] = useState(true);

  // Count incidents by severity
  const criticalCount = incidents.filter((i) => i.severity === 'Critical').length;
  const moderateCount = incidents.filter((i) => i.severity === 'Moderate').length;
  const lowCount = incidents.filter((i) => i.severity === 'Low').length;

  return (
    <div className="pt-20 pb-16 min-h-screen bg-slate-950 text-slate-100">
      {/* Top Operations Telemetry Header */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Title & Orbit Status */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                <Flame className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black tracking-tight text-white">
                    Live Wildfire Incident Radar
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    SUB-MINUTE SATELLITE LINK
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                  <span className="flex items-center gap-1">
                    <Satellite className="h-3.5 w-3.5 text-slate-400" />
                    LEO Constellation: {satelliteOrbitCount} Sats
                  </span>
                  <span>•</span>
                  <span>Sync: {lastSatelliteSync}</span>
                  <span>•</span>
                  <span className="text-red-400 font-bold">{incidents.length} Active Hotspots</span>
                </div>
              </div>
            </div>

            {/* Prominent Location Setter / Search Bar */}
            <div className="w-full lg:w-auto lg:min-w-[420px]">
              <LocationSearchBar />
            </div>
          </div>
        </div>
      </div>

      {/* Control Strip / Filters */}
      <div className="border-b border-slate-800/60 bg-slate-950/80 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Severity Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Filter:
            </span>
            {(['All', 'Critical', 'Moderate', 'Low'] as const).map((sev) => {
              const isActive = severityFilter === sev;
              const count =
                sev === 'All'
                  ? incidents.length
                  : sev === 'Critical'
                  ? criticalCount
                  : sev === 'Moderate'
                  ? moderateCount
                  : lowCount;

              return (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? sev === 'Critical'
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                        : sev === 'Moderate'
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                        : sev === 'Low'
                        ? 'bg-yellow-600 text-white shadow-md shadow-yellow-600/30'
                        : 'bg-slate-700 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span>{sev}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/30">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mode Tabs (Map View vs Crowdsourced Feed) */}
          <div className="flex items-center gap-2">
            <div className="p-1 bg-slate-900 border border-slate-800 rounded-xl flex items-center">
              <button
                onClick={() => setActiveTab('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  activeTab === 'map'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                Live Map Radar
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  activeTab === 'reports'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                Citizen Field Feed
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Field Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {activeTab === 'map' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Map Column */}
            <div className={`${selectedIncident && showDrawer ? 'lg:col-span-8' : 'lg:col-span-12'} transition-all`}>
              <div className="h-[620px] rounded-2xl overflow-hidden shadow-2xl relative">
                <WildfireMap
                  onSelectIncident={(incident) => {
                    setSelectedIncident(incident);
                    setShowDrawer(true);
                  }}
                />
              </div>

              {/* Hotspot Quick-Teleport Bar */}
              <div className="mt-4 p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-3 overflow-x-auto">
                <span className="text-xs font-mono font-semibold uppercase text-slate-400 shrink-0 flex items-center gap-1">
                  <Compass className="h-3.5 w-3.5 text-red-400" /> Hotspot Jump:
                </span>
                <div className="flex items-center gap-2">
                  {incidents.map((incident) => {
                    const isSelected = selectedIncident?.id === incident.id;
                    return (
                      <button
                        key={incident.id}
                        onClick={() => {
                          setSelectedIncident(incident);
                          setShowDrawer(true);
                          panToLocation(incident.latitude, incident.longitude, 10);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-red-600 text-white shadow-md'
                            : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            incident.severity === 'Critical'
                              ? 'bg-red-500 animate-ping'
                              : incident.severity === 'Moderate'
                              ? 'bg-amber-500'
                              : 'bg-yellow-500'
                          }`}
                        />
                        <span>{incident.name}</span>
                        {incident.id === 'wf-003' && (
                          <span className="text-[10px] text-amber-300 font-mono">(MP, India)</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Telemetry Drawer Column */}
            {selectedIncident && showDrawer && (
              <div className="lg:col-span-4">
                <TelemetryDrawer
                  incident={selectedIncident}
                  onClose={() => setShowDrawer(false)}
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <CommunityFeed />
          </div>
        )}
      </div>
    </div>
  );
}
