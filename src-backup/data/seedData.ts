import type { Incident, ResourceStatus } from '../types';

export const SEED_INCIDENT: Incident = {
  id: 'inc-001',
  title: 'Metro Line Collapse — Sector 18',
  location: 'Noida Sector 18 Metro Station',
  description: 'Building Collapse',
  startedAt: new Date(Date.now() - 0).toISOString(),
  estimatedCasualties: 45,
  activeSince: '0m',
};

export const INITIAL_RESOURCES: ResourceStatus = {
  ambulances: { available: 8, total: 12 },
  beds: { available: 32, total: 50 },
  surgeons: { available: 5, total: 8 },
  bloodUnits: { available: 145, total: 200 },
  ventilators: { available: 11, total: 15 },
  operatingRooms: { available: 4, total: 6 },
};
