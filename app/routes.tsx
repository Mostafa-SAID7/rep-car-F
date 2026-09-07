import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Diagnostics from '../pages/Diagnostics';
import MaintenanceSchedule from '../pages/MaintenanceSchedule';
import DIYGuides from '../pages/DIYGuides';
import FindParts from '../pages/FindParts';
import FindShops from '../pages/FindShops';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/diagnostics" element={<Diagnostics />} />
    <Route path="/schedule" element={<MaintenanceSchedule />} />
    <Route path="/guides" element={<DIYGuides />} />
    <Route path="/parts" element={<FindParts />} />
    <Route path="/shops" element={<FindShops />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;