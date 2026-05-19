import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import PublicLayout from '../components/layout/PublicLayout';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import PricingPage from '../pages/public/PricingPage';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// App Pages
import Dashboard from '../pages/Dashboard';
import MyTasks from '../pages/MyTasks';
import Projects from '../pages/Projects';
import ProjectDetail from '../pages/ProjectDetail';
import TaskDetail from '../pages/TaskDetail';
import Inbox from '../pages/Inbox';
import Reporting from '../pages/Reporting';
import Portfolio from '../pages/Portfolio';
import Accounts from '../pages/Accounts';
import Goals from '../pages/Goals';
import Profile from '../pages/Profile';
import Billing from '../pages/Billing';
import Admin from '../pages/Admin';
import NotFound from '../pages/NotFound';

import TermsOfService from '../pages/legal/TermsOfService';
import PrivacyPolicy from '../pages/legal/PrivacyPolicy';
import RefundPolicy from '../pages/legal/RefundPolicy';
import CookiePolicy from '../pages/legal/CookiePolicy';


const AppRoutes = () => (
  <Routes>
    {/* Public Routes — with navbar/footer */}
    <Route element={<PublicLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
    </Route>

    {/* Auth Routes — standalone (no layout) */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />

    {/* Protected App Routes */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="my-tasks" element={<MyTasks />} />
      <Route path="projects" element={<Projects />} />
      <Route path="projects/:id" element={<ProjectDetail />} />
      <Route path="tasks/:id" element={<TaskDetail />} />
      <Route path="inbox" element={<Inbox />} />
      <Route path="reporting" element={<Reporting />} />
      <Route path="portfolio" element={<Portfolio />} />
      <Route path="accounts" element={<Accounts />} />
      <Route path="goals" element={<Goals />} />
      <Route path="profile" element={<Profile />} />
      <Route path="billing" element={<Billing />} />
      <Route element={<PublicLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/terms" element={<TermsOfService />} />        {/* NEW */}
      <Route path="/privacy" element={<PrivacyPolicy />} />       {/* NEW */}
      <Route path="/refund-policy" element={<RefundPolicy />} />  {/* NEW */}
     <Route path="/cookie-policy" element={<CookiePolicy />} />  {/* NEW */}
</Route>
      <Route
        path="admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <Admin />
          </ProtectedRoute>
        }
      />
    </Route>

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;