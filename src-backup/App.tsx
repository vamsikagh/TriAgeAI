import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import TriagePage from './pages/TriagePage';
import PatientsPage from './pages/PatientsPage';
import ResourcesPage from './pages/ResourcesPage';
import AmbulancePage from './pages/AmbulancePage';
import MapPage from './pages/MapPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="triage" element={<TriagePage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="ambulance" element={<AmbulancePage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
