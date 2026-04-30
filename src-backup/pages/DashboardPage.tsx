import { useStore } from '../store';
import { AlertCircle, Users, TrendingUp, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import SeverityBadge from '../components/SeverityBadge';
import { HOSPITALS } from '../data/hospitals';

export default function DashboardPage() {
  const { patients, resources, incident } = useStore();

  const severityCounts = {
    RED: patients.filter((p) => p.severityLevel === 'RED').length,
    YELLOW: patients.filter((p) => p.severityLevel === 'YELLOW').length,
    GREEN: patients.filter((p) => p.severityLevel === 'GREEN').length,
    BLACK: patients.filter((p) => p.severityLevel === 'BLACK').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Command Dashboard</h1>
          <p className="text-gray-400">Real-time mass casualty event overview</p>
        </div>
        <Link to="/triage" className="btn-primary">
          New Triage
        </Link>
      </div>

      {/* Active Crisis Banner */}
      <div className="card bg-rose-950 border-rose-800">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-8 h-8 text-rose-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold text-white">ACTIVE CRISIS</h2>
              <span className="status-dot-red"></span>
            </div>
            <h3 className="text-2xl font-bold text-rose-400 mb-2">{incident.title}</h3>
            <p className="text-slate-200 mb-3">{incident.location} • {incident.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-slate-200">{incident.activeSince} Elapsed</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-slate-200">~{incident.estimatedCasualties} Est. Casualties</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <span className="text-rose-400 font-semibold">{severityCounts.RED} Immediate (Red)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-semibold">{severityCounts.YELLOW} Delayed (Yellow)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-semibold">{severityCounts.GREEN} Minor (Green)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-semibold">{patients.length} Total Triaged</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Patients */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recent Patients</h2>
          <Link to="/patients" className="text-rose-400 hover:text-rose-300 text-sm font-medium">
            View All →
          </Link>
        </div>

        {patients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-4">🏥 No patients triaged yet</p>
            <p className="text-slate-500 text-sm">Start a new triage to add patients</p>
          </div>
        ) : (
          <div className="space-y-3">
            {patients.slice(0, 5).map((patient) => (
              <div key={patient.id} className="bg-slate-700 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SeverityBadge level={patient.severityLevel} size="sm" />
                  <div>
                    <p className="font-semibold text-white">{patient.name}</p>
                    <p className="text-sm text-slate-400">{patient.injurySummary}</p>
                  </div>
                </div>
                <div className="text-right text-sm text-slate-400">
                  {new Date(patient.assessedAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resource Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Resource Status</h2>
          <Link to="/resources" className="text-rose-400 hover:text-rose-300 text-sm font-medium">
            Manage →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-slate-700 rounded-lg p-3">
            <div className="text-2xl mb-1">🚑</div>
            <div className="text-sm text-slate-400 mb-1">Ambulances</div>
            <div className="text-xl font-bold text-white">
              {resources.ambulances.available}/{resources.ambulances.total}
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-3">
            <div className="text-2xl mb-1">🛏️</div>
            <div className="text-sm text-slate-400 mb-1">Hospital Beds</div>
            <div className="text-xl font-bold text-white">
              {resources.beds.available}/{resources.beds.total}
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-3">
            <div className="text-2xl mb-1">👨‍⚕️</div>
            <div className="text-sm text-slate-400 mb-1">Surgeons</div>
            <div className="text-xl font-bold text-white">
              {resources.surgeons.available}/{resources.surgeons.total}
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-3">
            <div className="text-2xl mb-1">🩸</div>
            <div className="text-sm text-slate-400 mb-1">Blood Units</div>
            <div className="text-xl font-bold text-white">
              {resources.bloodUnits.available}/{resources.bloodUnits.total}
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-3">
            <div className="text-2xl mb-1">💨</div>
            <div className="text-sm text-slate-400 mb-1">Ventilators</div>
            <div className="text-xl font-bold text-white">
              {resources.ventilators.available}/{resources.ventilators.total}
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-3">
            <div className="text-2xl mb-1">🏥</div>
            <div className="text-sm text-slate-400 mb-1">Operating Rooms</div>
            <div className="text-xl font-bold text-white">
              {resources.operatingRooms.available}/{resources.operatingRooms.total}
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Hospitals */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Nearby Hospitals</h2>
          <Link to="/map" className="text-rose-400 hover:text-rose-300 text-sm font-medium">
            View Map →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-400 border-b border-slate-700">
                <th className="pb-3 font-medium">Hospital</th>
                <th className="pb-3 font-medium">Specialty</th>
                <th className="pb-3 font-medium">Beds</th>
                <th className="pb-3 font-medium">Distance</th>
                <th className="pb-3 font-medium">ETA</th>
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
                  <td className="py-3 text-slate-400">{hospital.specialty}</td>
                  <td className="py-3 text-slate-300">{hospital.availableBeds}</td>
                  <td className="py-3 text-slate-400">{hospital.distanceKm} km</td>
                  <td className="py-3">
                    <span className="text-emerald-400 font-semibold">{hospital.etaMinutes} MIN</span>
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
