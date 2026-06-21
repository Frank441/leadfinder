import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { LoginForm } from '../components/LoginForm';
import type { LoginDTO } from '@leadfinder/shared/types/auth';
import { ROLES } from "@leadfinder/shared/types/user";
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
      navigate(user.role === ROLES.director ? '/dashboard' : '/leads', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
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
        background: 'var(--color-card)',
        borderRadius: '16px',
        border: '1px solid var(--color-border)',
        padding: '36px 40px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '28px' }}>
          <img src="/logo.png" alt="Lead Finder" style={{ width: '44px', height: '44px', objectFit: 'contain', flexShrink: 0, display: 'block' }} />
          <span style={{ color: 'var(--color-text)', fontSize: '24px', fontWeight: 700 }}>Lead Finder</span>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 6px 0' }}>
          Bienvenido
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-sec)', margin: '0 0 28px 0' }}>
          Ingresá con tu cuenta de Colombo &amp; Magliano
        </p>

        <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />

        <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '20px', marginBottom: 0 }}>
          ¿Problemas para ingresar? Contactá a tu administrador
        </p>
      </div>
    </div>
  );
};
