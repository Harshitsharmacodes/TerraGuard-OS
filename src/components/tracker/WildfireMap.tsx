import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { WildfireIncident, UserReport } from '../../types';
import { useIncidents } from '../../context/IncidentContext';
import { getCompassHeading, formatCoordinates } from '../../utils/geo';
import { Flame, Wind, Thermometer, Droplets, ShieldAlert, Eye, Camera, Clock } from 'lucide-react';

// Component to handle dynamic map viewport repositioning
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5,
      easeLinearity: 0.25,
    });
  }, [center, zoom, map]);

  return null;
}

// Create custom pulsing Leaflet divIcon for wildfire incidents
function createWildfireIcon(incident: WildfireIncident, isSelected: boolean) {
  const severityColors = {
    Critical: {
      core: '#ef4444',
      ring: 'rgba(239, 68, 68, 0.45)',
      pulseClass: 'animate-ping',
      border: '#b91c1c',
    },
    Moderate: {
      core: '#f59e0b',
      ring: 'rgba(245, 158, 11, 0.45)',
      pulseClass: 'animate-pulse',
      border: '#b45309',
    },
    Low: {
      core: '#eab308',
      ring: 'rgba(234, 179, 8, 0.35)',
      pulseClass: '',
      border: '#a16207',
    },
  }[incident.severity];

  const selectedRing = isSelected ? 'border-2 border-white scale-125' : '';

  const html = `
    <div class="relative flex items-center justify-center w-10 h-10 -ml-2 -mt-2 group">
      <!-- Outer pulsing shockwave -->
      <span class="absolute inline-flex h-10 w-10 rounded-full ${severityColors.pulseClass}" style="background-color: ${severityColors.ring};"></span>
      <!-- Middle glowing halo -->
      <span class="absolute inline-flex h-7 w-7 rounded-full shadow-lg" style="background-color: ${severityColors.ring}; box-shadow: 0 0 15px ${severityColors.core};"></span>
      <!-- Core icon badge with wind arrow indicator -->
      <div class="relative z-10 flex items-center justify-center w-6 h-6 rounded-full text-white shadow-xl transition-transform ${selectedRing}" style="background-color: ${severityColors.core}; border: 2px solid ${severityColors.border};">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
        </svg>
      </div>
      <!-- Wind Vector Indicator Arrow on perimeter -->
      <div class="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none" style="transform: rotate(${incident.windDirection}deg); transform-origin: center 20px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="${severityColors.core}">
          <path d="M12 2L4 18h16z" />
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'wildfire-custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22],
  });
}

// Custom icon for Citizen crowdsourced reports
function createCitizenReportIcon(report: UserReport) {
  const densityColors = {
    Extreme: '#dc2626',
    Heavy: '#ea580c',
    Moderate: '#d97706',
    Light: '#65a30d',
  }[report.smokeDensity];

  const html = `
    <div class="relative flex items-center justify-center w-8 h-8 -ml-1 -mt-1">
      <span class="absolute inline-flex h-7 w-7 rounded-full opacity-75 animate-ping" style="background-color: ${densityColors};"></span>
      <div class="relative z-10 flex items-center justify-center w-5 h-5 rounded-full text-white shadow-md" style="background-color: ${densityColors}; border: 1.5px solid #ffffff;">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'citizen-custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

// User current GPS marker
function createUserGpsIcon() {
  const html = `
    <div class="relative flex items-center justify-center w-6 h-6 -ml-1 -mt-1">
      <span class="absolute inline-flex h-6 w-6 rounded-full bg-cyan-400 opacity-75 animate-ping"></span>
      <div class="relative z-10 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-white shadow-md"></div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'user-gps-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

interface WildfireMapProps {
  showSmokeOverlay?: boolean;
  showWindOverlay?: boolean;
  onSelectIncident?: (incident: WildfireIncident) => void;
}

export default function WildfireMap({
  showSmokeOverlay = true,
  showWindOverlay = true,
  onSelectIncident,
}: WildfireMapProps) {
  const {
    incidents,
    userReports,
    selectedIncident,
    setSelectedIncident,
    viewport,
    severityFilter,
    userPosition,
  } = useIncidents();

  // Filter incidents based on active filter
  const filteredIncidents = incidents.filter((incident) => {
    if (severityFilter === 'All') return true;
    return incident.severity === severityFilter;
  });

  const getCircleColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return '#ef4444';
      case 'Moderate':
        return '#f59e0b';
      default:
        return '#eab308';
    }
  };

  return (
    <div className="relative w-full h-full min-h-[550px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      <MapContainer
        center={viewport.center}
        zoom={viewport.zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ minHeight: '550px', background: '#020617' }}
      >
        <MapController center={viewport.center} zoom={viewport.zoom} />

        {/* CartoDB Dark Matter Basemap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* User GPS Location Marker */}
        {userPosition && (
          <Marker
            position={[userPosition.latitude, userPosition.longitude]}
            icon={createUserGpsIcon()}
          >
            <Popup>
              <div className="p-3 bg-slate-900 border border-slate-700 text-slate-100 rounded-xl text-xs space-y-1">
                <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  Your GPS Location
                </div>
                <div className="font-mono text-slate-300">
                  {formatCoordinates(userPosition.latitude, userPosition.longitude)}
                </div>
                {userPosition.accuracy && (
                  <div className="text-[10px] text-slate-400">
                    Accuracy: ±{Math.round(userPosition.accuracy)}m
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Wildfire Danger Zone Radiuses */}
        {filteredIncidents.map((incident) => {
          const isSelected = selectedIncident?.id === incident.id;
          const color = getCircleColor(incident.severity);

          return (
            <React.Fragment key={`zone-${incident.id}`}>
              <Circle
                center={[incident.latitude, incident.longitude]}
                radius={incident.radiusKm * 1000} // Radius in meters
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: isSelected ? 0.22 : 0.12,
                  weight: isSelected ? 2.5 : 1.2,
                  dashArray: isSelected ? '6, 6' : undefined,
                }}
              />

              {/* Marker with pulsing icon */}
              <Marker
                position={[incident.latitude, incident.longitude]}
                icon={createWildfireIcon(incident, isSelected)}
                eventHandlers={{
                  click: () => {
                    setSelectedIncident(incident);
                    if (onSelectIncident) onSelectIncident(incident);
                  },
                }}
              >
                <Popup className="custom-dark-popup">
                  <div className="p-3.5 bg-slate-900/98 backdrop-blur-md border border-slate-700/80 rounded-xl text-slate-100 shadow-2xl min-w-[240px] space-y-2.5">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                        <Flame className="h-4 w-4 text-red-500" />
                        <span>{incident.name}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                          incident.severity === 'Critical'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : incident.severity === 'Moderate'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}
                      >
                        {incident.severity}
                      </span>
                    </div>

                    {/* Coordinates & Radius */}
                    <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                      <span>{formatCoordinates(incident.latitude, incident.longitude)}</span>
                      <span className="text-red-400 font-semibold">{incident.radiusKm} km radius</span>
                    </div>

                    {/* Telemetry quick strip */}
                    <div className="grid grid-cols-3 gap-1.5 py-1 text-center bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <div>
                        <div className="text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
                          <Thermometer className="h-3 w-3 text-red-400" /> Temp
                        </div>
                        <div className="font-bold text-xs text-slate-200">{incident.temperature}°C</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
                          <Wind className="h-3 w-3 text-cyan-400" /> Wind
                        </div>
                        <div className="font-bold text-xs text-slate-200">{incident.windSpeed} km/h</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
                          <Droplets className="h-3 w-3 text-blue-400" /> Humid
                        </div>
                        <div className="font-bold text-xs text-slate-200">{incident.humidity}%</div>
                      </div>
                    </div>

                    {/* Containment progress */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Containment:</span>
                        <span className="font-semibold text-white">{incident.containment}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${incident.containment}%` }}
                        />
                      </div>
                    </div>

                    {/* Wind Vector Vector Direction */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Wind className="h-3 w-3 text-slate-400" />
                        Vector Heading:
                      </span>
                      <span className="font-mono text-cyan-400 font-semibold">
                        {incident.windDirection}° ({getCompassHeading(incident.windDirection)})
                      </span>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIncident(incident);
                        if (onSelectIncident) onSelectIncident(incident);
                      }}
                      className="w-full mt-1 py-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Inspect Full Telemetry
                    </button>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        {/* Citizen Field Reports Markers */}
        {userReports.map((report) => (
          <Marker
            key={`report-${report.id}`}
            position={[report.latitude, report.longitude]}
            icon={createCitizenReportIcon(report)}
          >
            <Popup>
              <div className="p-3 bg-slate-900/95 border border-slate-700 text-slate-100 rounded-xl text-xs space-y-2 max-w-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <div className="font-bold text-amber-400 flex items-center gap-1">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Citizen Report</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                    {report.status}
                  </span>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed">
                  "{report.description}"
                </p>

                {report.photoUrl && (
                  <div className="rounded-lg overflow-hidden border border-slate-700 max-h-24">
                    <img
                      src={report.photoUrl}
                      alt="Fire verification proof"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>Smoke: {report.smokeDensity}</span>
                  <span className="flex items-center gap-0.5">
                    <Clock className="h-3 w-3" />
                    {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* High-Tech HUD Overlays */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[11px] font-mono text-slate-300">
            RADAR: <span className="text-emerald-400 font-bold">ONLINE</span> | MWIR LEO-14
          </span>
        </div>
      </div>

      {/* Compass / Scale Reticle */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2 rounded-lg shadow-lg text-[10px] font-mono text-slate-400 space-y-1">
          <div className="flex items-center justify-between gap-3">
            <span>ZOOM: {viewport.zoom}x</span>
            <span className="text-red-400">{filteredIncidents.length} ACTIVE HOTSPOTS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
