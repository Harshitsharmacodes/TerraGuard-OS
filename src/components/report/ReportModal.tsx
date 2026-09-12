import React, { useState, useEffect, useRef } from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { formatCoordinates } from '../../utils/geo';
import {
  Flame,
  Camera,
  MapPin,
  Crosshair,
  AlertTriangle,
  Upload,
  CheckCircle2,
  X,
  Loader2,
  Shield,
  Radio,
  FileImage,
} from 'lucide-react';

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
}

// Preset photo proofs for rapid field testing
const PRESET_PROOFS = [
  {
    title: 'Crown Fire',
    url: 'https://images.unsplash.com/photo-1602980085566-4c4078519630?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Smoke Plume',
    url: 'https://images.unsplash.com/photo-1542382257-80dedb725088?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Brush Flame',
    url: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=600&q=80',
  },
];

export default function ReportModal({ open, onClose }: ReportModalProps) {
  const { userPosition, addUserReport, panToLocation } = useIncidents();

  const [lat, setLat] = useState<string>('22.7500');
  const [lng, setLng] = useState<string>('77.7300');
  const [locationName, setLocationName] = useState<string>('Narmada Valley / Hoshangabad Sector');
  const [description, setDescription] = useState<string>('');
  const [smokeDensity, setSmokeDensity] = useState<'Light' | 'Moderate' | 'Heavy' | 'Extreme'>('Heavy');
  const [fireBehavior, setFireBehavior] = useState<'Surface Fire' | 'Crown Fire' | 'Ground Smolder' | 'Rapid Spread'>('Rapid Spread');
  const [photoUrl, setPhotoUrl] = useState<string>(PRESET_PROOFS[0].url);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize coordinates from userPosition if available
  useEffect(() => {
    if (userPosition) {
      setLat(userPosition.latitude.toFixed(4));
      setLng(userPosition.longitude.toFixed(4));
      setLocationName('Precise GPS Position');
    }
  }, [userPosition]);

  if (!open) return null;

  const handleAcquireGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(4));
        setLng(pos.coords.longitude.toFixed(4));
        setLocationName('Live Browser GPS Fix');
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        alert(`Could not acquire GPS: ${err.message}. Using default coordinates.`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickTag = (tag: string) => {
    setDescription((prev) => (prev ? `${prev} • ${tag}` : tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      alert('Please enter valid numeric latitude and longitude.');
      return;
    }

    addUserReport({
      latitude: parsedLat,
      longitude: parsedLng,
      description: description || 'Active wildfire sighting reported by field scout.',
      smokeDensity,
      fireBehavior,
      photoUrl,
      reportedLocationName: locationName,
    });

    setIsSubmitted(true);
  };

  const handleDone = () => {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      panToLocation(parsedLat, parsedLng, 12);
    }
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-red-950/40 text-slate-100 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900/98 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-600/20 text-red-500 border border-red-500/30">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                Report Wildfire / Incident SOS
              </h2>
              <p className="text-xs text-slate-400">
                Ground-truth citizen telemetry automatically routed to CAD dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="h-10 w-10 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-white">Incident Report Dispatched</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Your report has been logged to the TerraGuard OS live database and queued for
                cross-referencing with the next LEO satellite pass. Nearby emergency services have
                been alerted.
              </p>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 max-w-md mx-auto text-xs font-mono text-slate-400 space-y-1">
                <div>COORDINATES: {lat}°, {lng}°</div>
                <div>SMOKE DENSITY: {smokeDensity.toUpperCase()}</div>
                <div>STATUS: PENDING CAD DISPATCH CONFIRMATION</div>
              </div>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={handleDone}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-red-600/30"
                >
                  View on Live Tracker
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* GPS Coordinates Section */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    Incident Location Coordinates
                  </span>
                  <button
                    type="button"
                    onClick={handleAcquireGps}
                    disabled={isLocating}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 rounded-lg text-xs font-medium transition"
                  >
                    {isLocating ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Crosshair className="h-3 w-3" />
                    )}
                    <span>Acquire Live GPS</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Latitude</label>
                    <input
                      type="text"
                      required
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                      placeholder="e.g. 22.7500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Longitude</label>
                    <input
                      type="text"
                      required
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                      placeholder="e.g. 77.7300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Location Label</label>
                    <input
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:border-red-500 focus:outline-none"
                      placeholder="e.g. Narmadapuram, MP"
                    />
                  </div>
                </div>
              </div>

              {/* Smoke Density and Fire Behavior */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Smoke Density */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Smoke Density &amp; Intensity
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Light', 'Moderate', 'Heavy', 'Extreme'] as const).map((density) => (
                      <button
                        key={density}
                        type="button"
                        onClick={() => setSmokeDensity(density)}
                        className={`p-2.5 rounded-lg border text-xs font-semibold text-left transition ${
                          smokeDensity === density
                            ? density === 'Extreme'
                              ? 'bg-red-600/30 border-red-500 text-red-200'
                              : density === 'Heavy'
                              ? 'bg-amber-600/30 border-amber-500 text-amber-200'
                              : 'bg-yellow-600/30 border-yellow-500 text-yellow-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div>{density}</div>
                        <div className="text-[10px] opacity-70 font-normal">
                          {density === 'Extreme'
                            ? 'Zero visibility / ash'
                            : density === 'Heavy'
                            ? 'Plumes visible >5km'
                            : density === 'Moderate'
                            ? 'Smell & haze'
                            : 'Faint smoke drift'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fire Behavior */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Fire Spread Behavior
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Rapid Spread', 'Crown Fire', 'Surface Fire', 'Ground Smolder'] as const).map(
                      (behavior) => (
                        <button
                          key={behavior}
                          type="button"
                          onClick={() => setFireBehavior(behavior)}
                          className={`p-2.5 rounded-lg border text-xs font-semibold text-left transition ${
                            fireBehavior === behavior
                              ? 'bg-red-600/30 border-red-500 text-red-200'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div>{behavior}</div>
                          <div className="text-[10px] opacity-70 font-normal">
                            {behavior === 'Rapid Spread'
                              ? 'Wind driven'
                              : behavior === 'Crown Fire'
                              ? 'Tree canopy engulfed'
                              : behavior === 'Surface Fire'
                              ? 'Grass & underbrush'
                              : 'Sub-surface peat'}
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Photo Upload & Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Photo / Video Proof</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Satellite AI verification requirement
                  </span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  {/* Preview Thumbnail */}
                  <div className="h-28 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 relative group">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt="Incident Proof"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs">
                        <FileImage className="h-6 w-6 mb-1" />
                        <span>No image</span>
                      </div>
                    )}
                    <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-[9px] font-mono text-emerald-400">
                      GEO-TAGGED
                    </div>
                  </div>

                  {/* Upload Actions & Presets */}
                  <div className="sm:col-span-2 space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition"
                    >
                      <Upload className="h-3.5 w-3.5 text-amber-400" />
                      Upload File from Device
                    </button>

                    <div className="pt-1">
                      <span className="text-[10px] text-slate-400 block mb-1">
                        Or select quick demo proof:
                      </span>
                      <div className="flex gap-2">
                        {PRESET_PROOFS.map((preset) => (
                          <button
                            key={preset.title}
                            type="button"
                            onClick={() => setPhotoUrl(preset.url)}
                            className={`px-2 py-1 rounded text-[10px] font-medium border transition ${
                              photoUrl === preset.url
                                ? 'bg-red-500/20 border-red-500 text-red-300'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                            }`}
                          >
                            {preset.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description & Tactical Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Ground Incident Description &amp; Directives
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe landmarks, wind direction, visible flames, threatened structures, or evacuation status..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none resize-none"
                />

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    'Approaching structures',
                    'Heavy ember showers',
                    'Road blocked by fire',
                    'Civilian evacuation needed',
                    'Water drop requested',
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleQuickTag(tag)}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[10px] text-slate-300 transition"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-red-600/30 flex items-center gap-2"
                >
                  <Flame className="h-4 w-4" />
                  Transmit Live Wildfire Report
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
