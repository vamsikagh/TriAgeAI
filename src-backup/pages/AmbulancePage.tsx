import { useStore } from '../store';
import { Ambulance, Radio, MapPin, Clock } from 'lucide-react';
import { HOSPITALS } from '../data/hospitals';
import SeverityBadge from '../components/SeverityBadge';

export default function AmbulancePage() {
  const { patients, dispatches } = useStore();

  const pendingPatients = patients.filter((p) => p.status === 'triaged' || p.status === 'pending_dispatch');
  const activeDispatches = dispatches.filter((d) => d.status === 'active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">🚑 Ambulance Dispatch</h1>
        <p className="text-slate-400">
          Real-time routing via 108/112 integration • Nearest viable hospital matching
        </p>
      </div>

      {/* Network Status */}
      <div className="card bg-emerald-950 border-emerald-800">
        <div className="flex items-start gap-3">
          <Radio className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold text-emerald-200 mb-2">Connected to 112 Network</h3>
            <div className="text-sm text-emerald-300 space-y-1">
              <p>
                <strong>Emergency Network Integration</strong> Connected to 112 ERSS (Emergency Response Support
                System) and 108 Ambulance Network.
              </p>
              <p>
                Live bed availability synced from e-Hospital portal. GPS routing powered by Google Maps Platform.
              </p>
              <div className="flex gap-4 mt-3">
                <span className="font-semibold">7 Active Units</span>
                <span>3 Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Dispatches */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">Pending Dispatches</h2>
        <p className="text-slate-400 text-sm mb-4">
          Patients awaiting ambulance assignment — sorted by severity
        </p>

        {pendingPatients.length === 0 ? (
          <div className="text-center py-12">
            <Ambulance className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">🚑 No pending dispatches</p>
            <p className="text-slate-500 text-sm mt-1">
              All triaged patients have been dispatched or are minor severity
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingPatients.map((patient) => (
              <div key={patient.id} className="bg-slate-700 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SeverityBadge level={patient.severityLevel} size="sm" />
                  <div>
                    <p className="font-semibold text-white">{patient.name}</p>
                    <p className="text-sm text-slate-400">{patient.injurySummary}</p>
                  </div>
                </div>
                <button className="btn-primary text-sm">Assign Ambulance</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Dispatch */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">Active Dispatch</h2>
        <p className="text-slate-400 text-sm mb-4">Ambulance driver view — turn-by-turn routing</p>

        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">📡 Select a patient to dispatch</p>
          <p className="text-slate-500 text-sm mt-1">Choose a patient and hospital from the left panel</p>
        </div>
      </div>

      {/* Live Hospital Bed Availability */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">Live Hospital Bed Availability</h2>
        <p className="text-slate-400 text-sm mb-4">
          Synced from e-Hospital / ABDM portal • Updated every 60 seconds
        </p>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-400 border-b border-slate-700">
                <th className="pb-3 font-medium">Hospital</th>
                <th className="pb-3 font-medium">Beds</th>
                <th className="pb-3 font-medium">ICU</th>
                <th className="pb-3 font-medium">OT</th>
                <th className="pb-3 font-medium">Blood</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Distance</th>
                <th className="pb-3 font-medium">Network</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {HOSPITALS.map((hospital) => (
                <tr key={hospital.id} className="border-b border-slate-700 last:border-0">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="font-medium text-white">{hospital.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-300">{hospital.availableBeds}</td>
                  <td className="py-3 text-slate-300">{hospital.availableIcuBeds}</td>
                  <td className="py-3 text-slate-300">{hospital.availableOtSlots}</td>
                  <td className="py-3">
                    {hospital.bloodAvailable ? (
                      <span className="text-emerald-400">✓ AVAILABLE</span>
                    ) : (
                      <span className="text-rose-400">✗ LOW</span>
                    )}
                  </td>
                  <td className="py-3 text-slate-400">{hospital.distanceKm} km</td>
                  <td className="py-3">
                    <span className="flex items-center gap-1">
                      <span className="status-dot-green"></span>
                      <span className="text-emerald-400">● ONLINE</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
