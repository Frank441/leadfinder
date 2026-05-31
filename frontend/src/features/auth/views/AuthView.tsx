import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { LoginForm } from '../components/LoginForm';
import type { LoginDTO } from '@leadfinder/shared/types/auth';
import { login as loginService } from '../services/authService';

export const AuthView = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginDTO) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, token } = await loginService(credentials);
      login(user, token);
      navigate(user.role === 'director' ? '/dashboard' : '/leads', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0b1929',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Círculos decorativos */}
      <div style={{ position: 'absolute', top: '-120px', right: '-120px', width: '420px', height: '420px', borderRadius: '50%', background: 'rgba(26,170,110,0.07)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '360px', height: '360px', borderRadius: '50%', background: 'rgba(26,170,110,0.05)', pointerEvents: 'none' }} />

      {/* Card */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '400px',
        margin: '0 16px',
        background: '#172840',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.07)',
        padding: '36px 40px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <div style={{
            width: '36px', height: '36px',
            background: '#1aaa6e',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontSize: '13px', fontWeight: 700, letterSpacing: '-0.5px' }}>LF</span>
          </div>
          <span style={{ color: '#f0f4f8', fontSize: '15px', fontWeight: 600 }}>Lead Finder</span>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f0f4f8', margin: '0 0 6px 0' }}>
          Bienvenido
        </h1>
        <p style={{ fontSize: '13px', color: '#7a9bbf', margin: '0 0 28px 0' }}>
          Ingresá con tu cuenta de Colombo &amp; Magliano
        </p>

        <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />

        <p style={{ textAlign: 'center', fontSize: '11px', color: '#3d5a73', marginTop: '20px', marginBottom: 0 }}>
          ¿Problemas para ingresar? Contactá a tu administrador
        </p>
      </div>
    </div>
  );
};
