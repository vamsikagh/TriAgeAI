import { Link, useLocation } from 'react-router-dom';
import { Activity, Stethoscope, Users, Package, Ambulance, Map } from 'lucide-react';

export default function NavBar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <Activity className="w-6 h-6 text-rose-500" />
            <span>Triage<span className="text-rose-500">AI</span></span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <Link
              to="/triage"
              className={`nav-link ${isActive('/triage') ? 'active' : ''}`}
            >
              <Stethoscope className="w-4 h-4" />
              <span className="hidden sm:inline">New Triage</span>
            </Link>

            <Link
              to="/patients"
              className={`nav-link ${isActive('/patients') ? 'active' : ''}`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Patients</span>
            </Link>

            <Link
              to="/resources"
              className={`nav-link ${isActive('/resources') ? 'active' : ''}`}
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Resources</span>
            </Link>

            <Link
              to="/ambulance"
              className={`nav-link ${isActive('/ambulance') ? 'active' : ''}`}
            >
              <Ambulance className="w-4 h-4" />
              <span className="hidden sm:inline">Ambulance</span>
            </Link>

            <Link
              to="/map"
              className={`nav-link ${isActive('/map') ? 'active' : ''}`}
            >
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Hospital Map</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
