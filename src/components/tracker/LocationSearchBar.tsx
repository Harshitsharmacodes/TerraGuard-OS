import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Crosshair, X, Loader2, Compass, AlertCircle } from 'lucide-react';
import { PRESET_LOCATIONS, PresetLocation, formatCoordinates } from '../../utils/geo';
import { useIncidents } from '../../context/IncidentContext';

interface GeocodeResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export default function LocationSearchBar() {
  const { panToLocation, userPosition, gpsLoading, refreshGps, viewport, setSelectedIncident, incidents } = useIncidents();
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [onlineResults, setOnlineResults] = useState<GeocodeResult[]>([]);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter preset locations
  const filteredPresets = PRESET_LOCATIONS.filter(
    (item) =>
      item.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      item.region.toLowerCase().includes(inputValue.toLowerCase()) ||
      item.tag.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Parse coordinate input format (e.g. "22.75, 77.73" or "36.7783 -119.4179")
  const parseCoordinates = (str: string): [number, number] | null => {
    const clean = str.trim().replace(/;/g, ',');
    const parts = clean.split(/[,\s]+/).map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      const [lat, lng] = parts;
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return [lat, lng];
      }
    }
    return null;
  };

  // Debounced geocoding search for global addresses
  useEffect(() => {
    const coords = parseCoordinates(inputValue);
    if (coords) {
      setOnlineResults([]);
      return;
    }

    if (inputValue.trim().length < 3) {
      setOnlineResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      setIsGeocoding(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            inputValue
          )}&limit=4&addressdetails=1`
        );
        if (response.ok) {
          const data: GeocodeResult[] = await response.json();
          setOnlineResults(data);
        }
      } catch (err) {
        // Fallback gracefully without error
        setOnlineResults([]);
      } finally {
        setIsGeocoding(false);
      }
    }, 450);

    return () => clearTimeout(handler);
  }, [inputValue]);

  const handleSelectPreset = (preset: PresetLocation) => {
    panToLocation(preset.coordinates[0], preset.coordinates[1], preset.zoom);
    setInputValue(preset.name);
    setIsFocused(false);
    setSearchFeedback(`Repositioned to ${preset.name}`);
    setTimeout(() => setSearchFeedback(null), 4000);

    if (preset.highlightFireId) {
      const targetFire = incidents.find((f) => f.id === preset.highlightFireId);
      if (targetFire) setSelectedIncident(targetFire);
    }
  };

  const handleSelectOnline = (result: GeocodeResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    panToLocation(lat, lon, 11);
    setInputValue(result.display_name.split(',')[0]);
    setIsFocused(false);
    setSearchFeedback(`Target locked: ${result.display_name.split(',').slice(0, 2).join(',')}`);
    setTimeout(() => setSearchFeedback(null), 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const coords = parseCoordinates(inputValue);
    if (coords) {
      panToLocation(coords[0], coords[1], 12);
      setIsFocused(false);
      setSearchFeedback(`Coordinates plotted: ${formatCoordinates(coords[0], coords[1])}`);
      setTimeout(() => setSearchFeedback(null), 4000);
      return;
    }

    if (filteredPresets.length > 0) {
      handleSelectPreset(filteredPresets[0]);
    } else if (onlineResults.length > 0) {
      handleSelectOnline(onlineResults[0]);
    }
  };

  const handleGpsCenter = () => {
    if (userPosition) {
      panToLocation(userPosition.latitude, userPosition.longitude, 12);
      setInputValue('Live GPS Location');
      setSearchFeedback(`Map centered on GPS (${formatCoordinates(userPosition.latitude, userPosition.longitude)})`);
      setTimeout(() => setSearchFeedback(null), 4000);
    } else {
      refreshGps();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 flex items-center pointer-events-none">
          {isGeocoding ? (
            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
          ) : (
            <Search className="h-4 w-4 text-slate-400" />
          )}
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search location (e.g. Narmadapuram, MP, Sierra, or Lat/Lng)..."
          className="w-full pl-10 pr-24 py-2.5 bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md border border-slate-700/80 hover:border-slate-600 focus:border-red-500/80 focus:ring-2 focus:ring-red-500/20 rounded-xl text-sm text-white placeholder-slate-400 shadow-xl transition-all focus:outline-none"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue('');
                setOnlineResults([]);
              }}
              className="p-1 text-slate-500 hover:text-slate-300 rounded"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleGpsCenter}
            disabled={gpsLoading}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 transition shadow-sm hover:text-red-400"
            title="Recenter on current GPS"
          >
            {gpsLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-red-400" />
            ) : (
              <Crosshair className="h-3.5 w-3.5 text-red-400" />
            )}
            <span className="hidden sm:inline">GPS</span>
          </button>
        </div>
      </form>

      {/* Floating Status Notification */}
      {searchFeedback && (
        <div className="absolute top-full left-0 mt-2 z-40 px-3 py-1.5 bg-slate-900/95 border border-amber-500/40 rounded-lg shadow-lg text-xs text-amber-300 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
          <Compass className="h-3.5 w-3.5 text-amber-400 animate-spin" />
          <span>{searchFeedback}</span>
        </div>
      )}

      {/* Autocomplete / Preset Dropdown */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-900/98 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl shadow-black/80 overflow-hidden divide-y divide-slate-800/80 animate-in fade-in slide-in-from-top-2">
          {/* Quick Preset Hotspots */}
          <div className="p-2">
            <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Verified Wildfire Hotspots</span>
              <span className="text-[10px] text-red-400 font-mono">1-Click Teleport</span>
            </div>

            <div className="space-y-1">
              {filteredPresets.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelectPreset(loc)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-slate-800/90 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-red-500/10 text-red-400 group-hover:bg-red-500/20 transition">
                      <MapPin className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-100 group-hover:text-white flex items-center gap-2">
                        {loc.name}
                        {loc.id === 'narmadapuram' && (
                          <span className="px-1.5 py-0.2 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-[9px] font-mono font-bold">
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{loc.region}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300">
                    {loc.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Global Geocoding Results */}
          {onlineResults.length > 0 && (
            <div className="p-2 bg-slate-950/40">
              <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                OpenStreetMap Geocoded Places
              </div>
              <div className="space-y-1 mt-1">
                {onlineResults.map((item) => (
                  <button
                    key={item.place_id}
                    type="button"
                    onClick={() => handleSelectOnline(item)}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left hover:bg-slate-800 text-xs text-slate-300 hover:text-white"
                  >
                    <Navigation className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.display_name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Coordinate Direct Input Helper */}
          <div className="px-3 py-2 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 font-mono">
              <Compass className="h-3 w-3 text-slate-400" />
              Direct GPS: lat, lng (e.g. 22.75, 77.73)
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              Current Map: {viewport.center[0].toFixed(2)}°, {viewport.center[1].toFixed(2)}°
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
