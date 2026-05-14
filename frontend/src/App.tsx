import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthView } from './features/auth/views/AuthView';

function App() {
  return (
    <BrowserRouter>
      {/* 
        Aquí en el futuro envolverás tu aplicación con Providers:
        <AuthProvider>
          <ThemeProvider> 
      */}
      <Routes>
        {/* Redirigimos la raíz (/ o index) a la vista de autenticación por defecto */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
        
        {/* Montamos la feature de Auth */}
        <Route path="/auth" element={<AuthView />} />

        {/* 
          Futuras rutas de tu CMS:
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/users" element={<UsersView />} /> 
        */}
        
        {/* Ruta comodín para manejar errores 404 */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white">404 - Página no encontrada</h1>
            </div>
          } 
        />
      </Routes>
      {/* 
          </ThemeProvider>
        </AuthProvider> 
      */}
    </BrowserRouter>
  );
}

export default App;