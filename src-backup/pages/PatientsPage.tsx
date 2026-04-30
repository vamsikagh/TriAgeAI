import { useStore } from '../store';
import { Users, Download, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import SeverityBadge from '../components/SeverityBadge';

export default function PatientsPage() {
  const { patients } = useStore();

  const handleExport = () => {
    const csv = [
      ['Name', 'Age', 'Gender', 'Severity', 'Confidence', 'Injury Summary', 'Assessed At'].join(','),
      ...patients.map((p) =>
        [
          p.name,
          p.age,
          p.gender,
          p.severityLevel,
          p.confidenceScore,
          `"${p.injurySummary}"`,
          new Date(p.assessedAt).toLocaleString(),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `triageai-patients-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Patient Registry</h1>
          <p className="text-gray-400">
            {patients.length} patients triaged • Sorted by severity
          </p>
        </div>
        <div className="flex gap-3">
          {patients.length > 0 && (
            <button onClick={handleExport} className="btn-secondary">
              <Download className="w-4 h-4 inline mr-2" />
              Export CSV
            </button>
          )}
          <Link to="/triage" className="btn-primary">
            New Triage
          </Link>
        </div>
      </div>

      {/* Patient List */}
      {patients.length === 0 ? (
        <div className="card text-center py-16">
          <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">📋 No patients in registry</h3>
          <p className="text-slate-400 mb-6">Start triaging patients to build the registry</p>
          <Link to="/triage" className="btn-primary inline-flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            Begin Triage
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {patients.map((patient) => (
            <div key={patient.id} className="card hover:border-slate-600 transition-colors">
              <div className="flex items-start gap-4">
                {patient.imagePreviewUrl && (
                  <img
                    src={patient.imagePreviewUrl}
                    alt={patient.name}
                    className="w-20 h-20 rounded-lg object-cover border border-slate-600"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">{patient.name}</h3>
                      <p className="text-sm text-slate-400">
                        {patient.age} years • {patient.gender}
                      </p>
                    </div>
                    <SeverityBadge level={patient.severityLevel} />
                  </div>

                  <p className="text-slate-200 mb-3">{patient.injurySummary}</p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Confidence:</span>{' '}
                      <span className="text-white font-semibold">{patient.confidenceScore}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Surgery:</span>{' '}
                      <span className={patient.requiresSurgery ? 'text-rose-400' : 'text-slate-500'}>
                        {patient.requiresSurgery ? 'Required' : 'Not Required'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Blood:</span>{' '}
                      <span className={patient.requiresBlood ? 'text-rose-400' : 'text-slate-500'}>
                        {patient.requiresBlood ? 'Required' : 'Not Required'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Assessed:</span>{' '}
                      <span className="text-white">
                        {new Date(patient.assessedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {patient.dispatchedTo && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-sm text-emerald-400">
                        ✓ Dispatched to {patient.dispatchedTo} • ETA: {patient.eta} min
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
