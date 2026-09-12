/**
 * Geospatial utility functions for TerraGuard OS
 */

// Calculate great-circle distance between two points using the Haversine formula
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Format coordinates to standard aviation/dispatch degrees minutes format
export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
}

// Approximate compass bearing to cardinal direction
export function getCompassHeading(degrees: number): string {
  const cardinals = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round((degrees % 360) / 45) % 8;
  return cardinals[index];
}

// Preset locations for quick searching and region hopping
export interface PresetLocation {
  id: string;
  name: string;
  region: string;
  coordinates: [number, number];
  zoom: number;
  highlightFireId?: string;
  tag: string;
}

export const PRESET_LOCATIONS: PresetLocation[] = [
  {
    id: 'narmadapuram',
    name: 'Narmadapuram, MP',
    region: 'Satpura Tiger Reserve / Narmada Valley, India',
    coordinates: [22.75, 77.73],
    zoom: 11,
    highlightFireId: 'wf-003',
    tag: 'Critical Active Fire',
  },
  {
    id: 'pench',
    name: 'Pench Tiger Reserve, MP',
    region: 'Madhya Pradesh / Maharashtra Border, India',
    coordinates: [21.7, 79.3],
    zoom: 10,
    highlightFireId: 'wf-006',
    tag: 'Buffer Zone Watch',
  },
  {
    id: 'fresno',
    name: 'Sierra Ridge / Fresno, CA',
    region: 'Sierra Nevada Foothills, California, USA',
    coordinates: [36.7783, -119.4179],
    zoom: 10,
    highlightFireId: 'wf-001',
    tag: 'Critical Evacuation',
  },
  {
    id: 'yosemite',
    name: 'Yosemite Rim, CA',
    region: 'Yosemite National Park, California, USA',
    coordinates: [37.85, -119.85],
    zoom: 10,
    highlightFireId: 'wf-007',
    tag: 'Type 1 Incident',
  },
  {
    id: 'malibu',
    name: 'Malibu Coast, CA',
    region: 'Pacific Coast Highway / Los Angeles, USA',
    coordinates: [34.0259, -118.7798],
    zoom: 11,
    highlightFireId: 'wf-005',
    tag: 'Low Severity Watch',
  },
  {
    id: 'bend',
    name: 'Cascade Creek / Bend, OR',
    region: 'Deschutes National Forest, Oregon, USA',
    coordinates: [44.0582, -121.3153],
    zoom: 10,
    highlightFireId: 'wf-002',
    tag: 'Ground Crew Deployed',
  },
  {
    id: 'katoomba',
    name: 'Blue Mountains / Katoomba, NSW',
    region: 'Blue Mountains National Park, Australia',
    coordinates: [-33.7, 150.3],
    zoom: 10,
    highlightFireId: 'wf-004',
    tag: 'Bushfire Spread',
  },
  {
    id: 'algarve',
    name: 'Algarve Coast, Portugal',
    region: 'Faro District / Monchique Ridge, Portugal',
    coordinates: [37.2, -8.0],
    zoom: 10,
    highlightFireId: 'wf-008',
    tag: 'Air Support Requested',
  },
];
