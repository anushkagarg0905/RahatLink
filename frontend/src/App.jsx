import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import RoleSelection from './pages/RoleSelection';
import LocationSetup from './pages/LocationSetup';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import WarehousePanel from './pages/WarehousePanel';
import NGOPanel from './pages/NGOPanel';
import Distribution from './pages/Distribution';
import Optimization from './pages/Optimization';
import NewsPage from './pages/NewsPage';
import Analytics from './pages/Analytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/location-setup" element={<LocationSetup />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/warehouse/panel" element={<WarehousePanel />} />
          <Route path="/ngo/panel" element={<NGOPanel />} />
          <Route path="/distribution" element={<Distribution />} />
          <Route path="/optimization" element={<Optimization />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
