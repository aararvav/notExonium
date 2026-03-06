import { Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardLayout } from './layout/DashboardLayout';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { DeployProjectPage } from './pages/dashboard/DeployProjectPage';
import { BuildLogsPage } from './pages/dashboard/BuildLogsPage';
import { DeploymentSuccessPage } from './pages/dashboard/DeploymentSuccessPage';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="deploy" element={<DeployProjectPage />} />
          <Route path="logs/:projectSlug" element={<BuildLogsPage />} />
          <Route path="success/:projectSlug" element={<DeploymentSuccessPage />} />
        </Route>
      </Routes>
    </div>
  );
}


