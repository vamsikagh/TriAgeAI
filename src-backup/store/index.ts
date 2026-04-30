import { create } from 'zustand';
import type { Patient, ResourceStatus, Incident, Dispatch, TriageInput } from '../types';
import { SEED_INCIDENT, INITIAL_RESOURCES } from '../data/seedData';

interface AppState {
  // Current triage session
  currentInput: TriageInput;
  isAnalyzing: boolean;
  analysisError: string | null;
  
  // Patients
  patients: Patient[];
  
  // Resources
  resources: ResourceStatus;
  
  // Incident
  incident: Incident;
  
  // Dispatches
  dispatches: Dispatch[];
  
  // Actions
  setCurrentInput: (input: Partial<TriageInput>) => void;
  setAnalyzing: (analyzing: boolean) => void;
  setAnalysisError: (error: string | null) => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  addDispatch: (dispatch: Dispatch) => void;
  updateDispatch: (id: string, updates: Partial<Dispatch>) => void;
  resetCurrentInput: () => void;
}

const initialInput: TriageInput = {
  patientDetails: {
    name: '',
    age: '',
    gender: '',
  },
  description: '',
  imageBase64: null,
  imageMimeType: null,
  imagePreviewUrl: null,
};

export const useStore = create<AppState>((set) => ({
  currentInput: initialInput,
  isAnalyzing: false,
  analysisError: null,
  patients: [],
  resources: INITIAL_RESOURCES,
  incident: SEED_INCIDENT,
  dispatches: [],

  setCurrentInput: (input) =>
    set((state) => ({
      currentInput: { ...state.currentInput, ...input },
    })),

  setAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),

  setAnalysisError: (error) => set({ analysisError: error }),

  addPatient: (patient) =>
    set((state) => ({
      patients: [patient, ...state.patients],
    })),

  updatePatient: (id, updates) =>
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  addDispatch: (dispatch) =>
    set((state) => ({
      dispatches: [dispatch, ...state.dispatches],
    })),

  updateDispatch: (id, updates) =>
    set((state) => ({
      dispatches: state.dispatches.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    })),

  resetCurrentInput: () => set({ currentInput: initialInput }),
}));
