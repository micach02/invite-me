import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import { PageLoader } from './components/ui/misc';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

// Heavier / authenticated screens are code-split.
const Templates = lazy(() => import('./pages/Templates'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const InvitationAnalytics = lazy(() => import('./pages/InvitationAnalytics'));
const Profile = lazy(() => import('./pages/Profile'));
const Editor = lazy(() => import('./pages/Editor'));
const PublicInvitation = lazy(() => import('./pages/PublicInvitation'));

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // Wait a tick so the target section has mounted.
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 60);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
    return undefined;
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/invitation/:slug" element={<PublicInvitation />} />
          <Route path="/preview/:id" element={<ProtectedRoute><PublicInvitation preview /></ProtectedRoute>} />
          <Route path="/editor/:id" element={<ProtectedRoute><Editor /></ProtectedRoute>} />

          <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/analytics" element={<Analytics />} />
            <Route path="/dashboard/invitations/:id/analytics" element={<InvitationAnalytics />} />
            <Route path="/dashboard/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
