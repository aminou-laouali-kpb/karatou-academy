import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { LearningProvider } from './context/LearningContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DemoBadge } from './components/DemoBadge';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { LessonPlayer } from './pages/LessonPlayer';
import { Certificates } from './pages/Certificates';
import { Verify } from './pages/Verify';
import { RedeemScholarship } from './pages/RedeemScholarship';
import { EnterpriseDashboard } from './pages/EnterpriseDashboard';
import { EnterpriseMembers } from './pages/EnterpriseMembers';
import { AdminContent } from './pages/AdminContent';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <LanguageProvider>
        <AuthProvider>
          <LearningProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/redeem" element={<RedeemScholarship />} />
              <Route path="/redeem/:code" element={<RedeemScholarship />} />
              <Route
                path="/dashboard"
                element={(
                  <ProtectedRoute role="learner">
                    <Dashboard />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/learn"
                element={(
                  <ProtectedRoute role="learner">
                    <LessonPlayer />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/learn/:moduleSlug"
                element={(
                  <ProtectedRoute role="learner">
                    <LessonPlayer />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/learn/:moduleSlug/:courseId"
                element={(
                  <ProtectedRoute role="learner">
                    <LessonPlayer />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/certificates"
                element={(
                  <ProtectedRoute role="learner">
                    <Certificates />
                  </ProtectedRoute>
                )}
              />
              <Route path="/verify/:uid" element={<Verify />} />
              <Route
                path="/enterprise"
                element={(
                  <ProtectedRoute role="enterprise_admin">
                    <EnterpriseDashboard />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/enterprise/members"
                element={(
                  <ProtectedRoute role="enterprise_admin">
                    <EnterpriseMembers />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/admin"
                element={(
                  <ProtectedRoute role="platform_admin">
                    <AdminContent />
                  </ProtectedRoute>
                )}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <DemoBadge />
          </LearningProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
