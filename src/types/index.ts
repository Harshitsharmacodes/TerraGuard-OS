export type Severity = 'Low' | 'Moderate' | 'Critical';

export interface WildfireIncident {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  severity: Severity;
  radiusKm: number;
  windSpeed: number;
  windDirection: number;
  temperature: number;
  humidity: number;
  containment: number;
  startDate: string;
  lastUpdated: string;
  description: string;
  frpMw?: number;
  nearestTown?: string;
}

export interface UserReport {
  id: string;
  latitude: number;
  longitude: number;
  description: string;
  smokeDensity: 'Light' | 'Moderate' | 'Heavy' | 'Extreme';
  fireBehavior?: 'Surface Fire' | 'Crown Fire' | 'Ground Smolder' | 'Rapid Spread';
  photoUrl?: string;
  timestamp: string;
  status: 'Pending' | 'Verified' | 'Dismissed';
  reportedLocationName?: string;
}

export interface FireStation {
  id: string;
  name: string;
  phone: string;
  latitude: number;
  longitude: number;
  district: string;
  state: string;
  dispatchVhf?: string;
  distanceKm?: number;
}

export interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface MapViewport {
  center: [number, number];
  zoom: number;
}

