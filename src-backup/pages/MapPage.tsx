import { HOSPITALS } from '../data/hospitals';
import { MapPin, Navigation } from 'lucide-react';

export default function MapPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Hospital Network & Routing</h1>
        <p className="text-slate-400">Real-time hospital availability and patient routing via Google Maps</p>
      </div>

      {/* Map Placeholder */}
      <div className="card">
        <div className="bg-slate-700 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-50"></div>
          <div className="relative z-10 text-center">
            <MapPin className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-2">Interactive Map View</p>
            <p className="text-slate-500 text-sm">
              🏥 AIIMS Trauma &nbsp;&nbsp; 🏥 Safdarjung Hospital &nbsp;&nbsp; 🏥 Apollo Emergency
              &nbsp;&nbsp; 🏥 Max Super &nbsp;&nbsp; 🏥 GTB Hospital
            </p>
            <p className="text-slate-500 text-sm mt-2">⚠️ Incident Site &nbsp; 📍 Noida Sector 18, Delhi NCR</p>
            <p className="text-slate-600 text-xs mt-4">
              Showing 5 hospitals in 10km radius • Powered by Google Maps Platform
            </p>
          </div>
        </div>
      </div>

      {/* Hospital Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {HOSPITALS.map((hospital, index) => (
          <div key={hospital.id} className="card">
            <div className="flex items-start gap-3 mb-3">
              <div className="text-2xl">🏥</div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">{hospital.name}</h3>
                <p className="text-sm text-slate-400 mb-2">📋 {hospital.specialty}</p>
                {index === 0 && (
                  <span className="inline-block bg-emerald-900 text-emerald-300 text-xs px-2 py-1 rounded-full font-semibold">
                    RECOMMENDED
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">{hospital.totalBeds} Beds</span>
                <span className="text-white font-semibold">{hospital.availableBeds} Available</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{hospital.distanceKm} km Distance</span>
                <span className="text-emerald-400 font-semibold">{hospital.etaMinutes} min ETA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Patients Dispatched</span>
                <span className="text-white font-semibold">0 Patients</span>
              </div>
            </div>

            <button className="btn-secondary w-full mt-4 flex items-center justify-center gap-2">
              <Navigation className="w-4 h-4" />
              Get Directions
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
