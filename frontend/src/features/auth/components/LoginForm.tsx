import { useState } from 'react';
import type { LoginDTO } from '@leadfinder/shared/types/auth';

interface LoginFormProps {
  onSubmit: (credentials: LoginDTO) => void;
  isLoading?: boolean;
  error?: string | null;
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: 'var(--color-input-bg)',
  border: '1px solid var(--color-border-strong)',
  borderRadius: '9px',
  color: 'var(--color-text)',
  padding: '11px 14px',
  fontSize: '13px',
  outline: 'none',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'border-color 0.15s, background 0.15s',
};

export const LoginForm = ({ onSubmit, isLoading = false, error }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--color-green)';
    e.target.style.background = 'var(--color-input-focus-bg)';
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--color-border-strong)';
    e.target.style.background = 'var(--color-input-bg)';
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {error && (
        <div style={{
          background: 'rgba(224,82,82,0.12)',
          border: '1px solid rgba(224,82,82,0.3)',
          borderRadius: '9px',
          padding: '10px 14px',
          color: '#ff7b7b',
          fontSize: '12px',
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-label)' }}>
          Correo electrónico
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="usuario@colombo.com"
          style={INPUT_STYLE}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-label)' }}>
          Contraseña
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          style={INPUT_STYLE}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: '100%',
          background: isLoading ? '#0f7d50' : 'var(--color-green)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '9px',
          padding: '12px 16px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontFamily: "'Inter', system-ui, sans-serif",
          transition: 'background 0.15s',
          marginTop: '4px',
        }}
        onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = 'var(--color-green-light)'; }}
        onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.background = 'var(--color-green)'; }}
      >
        {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
      </button>
    </form>
  );
};
