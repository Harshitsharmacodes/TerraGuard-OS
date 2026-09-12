import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { WildfireIncident, UserReport, FireStation, GeoPosition, MapViewport, Severity } from '../types';
import { mockWildfires, mockFireStations, mockUserReports } from '../data/wildfires';
import { useGeolocation } from '../hooks/useGeolocation';

interface IncidentContextType {
  incidents: WildfireIncident[];
  userReports: UserReport[];
  fireStations: FireStation[];
  selectedIncident: WildfireIncident | null;
  setSelectedIncident: (incident: WildfireIncident | null) => void;
  viewport: MapViewport;
  setViewport: (viewport: MapViewport) => void;
  panToLocation: (lat: number, lng: number, zoom?: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  severityFilter: Severity | 'All';
  setSeverityFilter: (severity: Severity | 'All') => void;
  minContainmentFilter: number;
  setMinContainmentFilter: (val: number) => void;
  addUserReport: (report: Omit<UserReport, 'id' | 'timestamp' | 'status'>) => void;
  userPosition: GeoPosition | null;
  gpsLoading: boolean;
  gpsError: string | null;
  refreshGps: () => void;
  lastSatelliteSync: string;
  satelliteOrbitCount: number;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export function IncidentProvider({ children }: { children: ReactNode }) {
  const [incidents] = useState<WildfireIncident[]>(mockWildfires);
  const [userReports, setUserReports] = useState<UserReport[]>(mockUserReports);
  const [fireStations] = useState<FireStation[]>(mockFireStations);
  const [selectedIncident, setSelectedIncident] = useState<WildfireIncident | null>(mockWildfires[2]); // Default Narmada Valley or Sierra
  const [severityFilter, setSeverityFilter] = useState<Severity | 'All'>('All');
  const [minContainmentFilter, setMinContainmentFilter] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState('');

  // Geolocation
  const { position: userPosition, loading: gpsLoading, error: gpsError, refresh: refreshGps } = useGeolocation();

  // Default viewport: Narmadapuram, MP or fallback to California
  const [viewport, setViewport] = useState<MapViewport>({
    center: [22.75, 77.73], // Central high-risk zone
    zoom: 7,
  });

  // Simulated satellite sync heartbeat
  const [lastSatelliteSync, setLastSatelliteSync] = useState<string>('00:12s ago');
  const [satelliteOrbitCount, setSatelliteOrbitCount] = useState<number>(14);

  useEffect(() => {
    const timer = setInterval(() => {
      const seconds = Math.floor(Math.random() * 25) + 3;
      setLastSatelliteSync(`00:${seconds < 10 ? '0' + seconds : seconds}s ago`);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Update viewport when user GPS loads if user position is available
  useEffect(() => {
    if (userPosition && !searchQuery) {
      // Keep initial view or update if close to user
    }
  }, [userPosition, searchQuery]);

  const panToLocation = (lat: number, lng: number, zoom: number = 10) => {
    setViewport({ center: [lat, lng], zoom });
  };

  const addUserReport = (reportData: Omit<UserReport, 'id' | 'timestamp' | 'status'>) => {
    const newReport: UserReport = {
      ...reportData,
      id: `ur-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'Pending',
    };
    setUserReports((prev) => [newReport, ...prev]);
  };

  const value = useMemo(
    () => ({
      incidents,
      userReports,
      fireStations,
      selectedIncident,
      setSelectedIncident,
      viewport,
      setViewport,
      panToLocation,
      searchQuery,
      setSearchQuery,
      severityFilter,
      setSeverityFilter,
      minContainmentFilter,
      setMinContainmentFilter,
      addUserReport,
      userPosition,
      gpsLoading,
      gpsError,
      refreshGps,
      lastSatelliteSync,
      satelliteOrbitCount,
    }),
    [
      incidents,
      userReports,
      fireStations,
      selectedIncident,
      viewport,
      searchQuery,
      severityFilter,
      minContainmentFilter,
      userPosition,
      gpsLoading,
      gpsError,
      refreshGps,
      lastSatelliteSync,
      satelliteOrbitCount,
    ]
  );

  return <IncidentContext.Provider value={value}>{children}</IncidentContext.Provider>;
}

export function useIncidents() {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncidents must be used within an IncidentProvider');
  }
  return context;
}
