import { useStore } from '../store';
import { TrendingUp, Ambulance, Bed, Users, Droplet, Wind, Building2 } from 'lucide-react';

export default function ResourcesPage() {
  const { resources, patients } = useStore();

  const criticalCount = patients.filter((p) => p.severityLevel === 'RED').length;
  const delayedCount = patients.filter((p) => p.severityLevel === 'YELLOW').length;

  const getStatusColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio > 0.5) return 'text-emerald-400';
    if (ratio > 0.25) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getProgressColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio > 0.5) return 'bg-emerald-500';
    if (ratio > 0.25) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const ResourceCard = ({
    icon: Icon,
    emoji,
    title,
    description,
    available,
    total,
  }: {
    icon: any;
    emoji: string;
    title: string;
    description: string;
    available: number;
    total: number;
  }) => {
    const percentage = (available / total) * 100;

    return (
      <div className="card">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{emoji}</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-400 mb-4">{description}</p>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                {available} Available
              </span>
              <span className="text-sm text-gray-400">
                {total} Total Capacity
              </span>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-3 mb-3">
              <div
                className={`h-3 rounded-full transition-all ${getProgressColor(available, total)}`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Available {available}</span>
              <span className={`text-2xl font-bold ${getStatusColor(available, total)}`}>
                {available}
              </span>
              <span className="text-xs text-slate-500">Total {total}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Resource Management</h1>
        <p className="text-gray-400">Track and manage available emergency resources in real-time</p>
      </div>

      {/* AI Forecast */}
      <div className="card bg-blue-950 border-blue-800">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-blue-200 mb-2">AI Resource Forecast</h3>
            <p className="text-blue-300 text-sm">
              Based on {patients.length} triaged patients ({criticalCount} critical, {delayedCount} delayed),
              estimated resource demand: {criticalCount * 2} bed-hours, {criticalCount} surgical interventions,{' '}
              {patients.length} ambulance dispatches.
            </p>
          </div>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResourceCard
          icon={Ambulance}
          emoji="🚑"
          title="Ambulances"
          description="Emergency medical transport vehicles"
          available={resources.ambulances.available}
          total={resources.ambulances.total}
        />

        <ResourceCard
          icon={Bed}
          emoji="🛏️"
          title="Hospital Beds"
          description="Available beds across all nearby hospitals"
          available={resources.beds.available}
          total={resources.beds.total}
        />

        <ResourceCard
          icon={Users}
          emoji="👨‍⚕️"
          title="Surgeons on Duty"
          description="Trauma and emergency surgeons available"
          available={resources.surgeons.available}
          total={resources.surgeons.total}
        />

        <ResourceCard
          icon={Droplet}
          emoji="🩸"
          title="Blood Units"
          description="Available blood units in blood bank"
          available={resources.bloodUnits.available}
          total={resources.bloodUnits.total}
        />

        <ResourceCard
          icon={Wind}
          emoji="💨"
          title="Ventilators"
          description="Mechanical ventilation support units"
          available={resources.ventilators.available}
          total={resources.ventilators.total}
        />

        <ResourceCard
          icon={Building2}
          emoji="🏥"
          title="Operating Rooms"
          description="Available surgical operating theaters"
          available={resources.operatingRooms.available}
          total={resources.operatingRooms.total}
        />
      </div>
    </div>
  );
}
