import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import TriagePage from './pages/TriagePage';
import PatientsPage from './pages/PatientsPage';
import ResourcesPage from './pages/ResourcesPage';
import MapPage from './pages/MapPage';
import AmbulancePage from './pages/AmbulancePage';
import { Activity, Users, Stethoscope, LayoutDashboard, Map, Package, Menu, X, Siren } from 'lucide-react';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/triage', icon: Stethoscope, label: 'New Triage' },
    { path: '/patients', icon: Users, label: 'Patients' },
    { path: '/resources', icon: Package, label: 'Resources' },
    { path: '/ambulance', icon: Siren, label: 'Ambulance' },
    { path: '/map', icon: Map, label: 'Hospital Map' },
  ];

  return (
    <div className="app-layout">
      {/* Mobile menu button */}
      <button 
        className="btn btn-ghost btn-icon"
        style={{ position: 'fixed', top: 16, left: 16, zIndex: 200, display: 'none' }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        id="mobile-menu-btn"
      >
        {sidebarOpen ? <X size={20}/> : <Menu size={20}/>}
      </button>

      {/* Sidebar */}
      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="main-nav">
        <div className="logo">
          <div className="logo-icon">🏥</div>
          <div>
            <div className="logo-text">TriageAI</div>
            <div className="logo-sub">Emergency Response</div>
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-label">Command Center</div>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
              id={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
            >
              <item.icon size={18} className="nav-icon" />
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Active event indicator */}
        <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className="live-dot"></span>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--severity-green)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Live Event
            </span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
            Metro Line Collapse
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Noida Sector 18 • Active
          </div>
        </div>

        {/* Powered by badge */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
          <span>Powered by</span>
          <span style={{ fontWeight: 700, background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Google Gemini
          </span>
        </div>
      </nav>

      {/* Main content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/triage" element={<TriagePage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/ambulance" element={<AmbulancePage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </main>
    </div>
  );
}
