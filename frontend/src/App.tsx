import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthView } from './features/auth/views/AuthView';
import { PrivateRoute } from './router/PrivateRoute';
import { LeadsView } from './features/leads/views/LeadsView';
import { FichaCUITView } from './features/leads/views/FichaCUITView';
import { DashboardView } from './features/dashboard/views/DashboardView';
import { MapView } from './features/map/views/MapView';
import { ROLES } from "@leadfinder/shared/types/user";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<AuthView />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={[ROLES.director, ROLES.supervisor]}>
                <DashboardView />
              </PrivateRoute>
            }
          />

          <Route
            path="/leads"
            element={
              <PrivateRoute allowedRoles={[ROLES.director, ROLES.supervisor, ROLES.representante]}>
                <LeadsView />
              </PrivateRoute>
            }
          />

          <Route
            path="/leads/:id"
            element={
              <PrivateRoute allowedRoles={[ROLES.director, ROLES.supervisor, ROLES.representante]}>
                <FichaCUITView />
              </PrivateRoute>
            }
          />

          <Route
            path="/mapa"
            element={
              <PrivateRoute allowedRoles={[ROLES.director, ROLES.supervisor, ROLES.representante]}>
                <MapView />
              </PrivateRoute>
            }
          />

          <Route
            path="*"
            element={
              <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)', fontFamily: "'Inter', system-ui, sans-serif" }}>
                  404 — Página no encontrada
                </h1>
              </div>
            }
          />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
