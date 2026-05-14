import { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import type { LoginCredentials, RegisterCredentials } from '@leadfinder/shared/test';

type AuthMode = 'login' | 'register';

export const AuthView = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  const handleLogin = (credentials: LoginCredentials) => {
    console.log('Enviando a API de login:', credentials);
    // Aquí invocarías el servicio: authService.login(credentials)
  };

  const handleRegister = (credentials: RegisterCredentials) => {
    console.log('Enviando a API de registro:', credentials);
    // Aquí invocarías el servicio: authService.register(credentials)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            {mode === 'login' ? 'Bienvenido a LeadFinder' : 'Registro de Administrador'}
          </h1>
        </div>

        {/* Renderizado condicional de componentes */}
        {mode === 'login' ? (
          <LoginForm onSubmit={handleLogin} />
        ) : (
          <RegisterForm onSubmit={handleRegister} />
        )}

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-sm text-blue-600 hover:underline"
          >
            {mode === 'login' 
              ? '¿No tienes cuenta? Regístrate aquí' 
              : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>

      </div>
    </div>
  );
};