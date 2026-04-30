export type SeverityLevel = 'RED' | 'YELLOW' | 'GREEN' | 'BLACK';

export interface PatientDetails {
  name: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other' | '';
}

export interface TriageInput {
  patientDetails: PatientDetails;
  description: string;
  imageBase64: string | null;
  imageMimeType: 'image/jpeg' | 'image/png' | 'image/webp' | null;
  imagePreviewUrl: string | null;
}

export interface TriageResult {
  severityLevel: SeverityLevel;
  confidenceScore: number;
  injurySummary: string;
  recommendedActions: string[];
  requiresSurgery: boolean;
  requiresBlood: boolean;
  assessedAt: string;
}

export interface Patient {
  id: string;
  name: string;
  age: string;
  gender: string;
  description: string;
  location: string;
  severityLevel: SeverityLevel;
  confidenceScore: number;
  injurySummary: string;
  recommendedActions: string[];
  requiresSurgery: boolean;
  requiresBlood: boolean;
  assessedAt: string;
  imagePreviewUrl: string | null;
  dispatchedTo: string | null;
  eta: number | null;
  status: 'triaged' | 'pending_dispatch' | 'dispatched';
}

export interface Hospital {
  id: string;
  name: string;
  specialty: string;
  address: string;
  coordinates: { lat: number; lng: number };
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  availableIcuBeds: number;
  otSlots: number;
  availableOtSlots: number;
  distanceKm: number;
  etaMinutes: number;
  availabilityStatus: 'available' | 'limited' | 'full';
  isRecommended?: boolean;
  bloodAvailable: boolean;
  onlineStatus: 'online' | 'offline';
}

export interface ResourceStatus {
  ambulances: { available: number; total: number };
  beds: { available: number; total: number };
  surgeons: { available: number; total: number };
  bloodUnits: { available: number; total: number };
  ventilators: { available: number; total: number };
  operatingRooms: { available: number; total: number };
}

export interface Incident {
  id: string;
  title: string;
  location: string;
  description: string;
  startedAt: string;
  estimatedCasualties: number;
  activeSince: string;
}

export interface Dispatch {
  id: string;
  patientId: string;
  patientName: string;
  severityLevel: SeverityLevel;
  hospitalId: string;
  hospitalName: string;
  eta: number;
  status: 'pending' | 'active' | 'completed';
  dispatchedAt: string;
  ambulanceUnit: string;
}
