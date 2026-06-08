import type { LeadStatus } from '@leadfinder/shared/types/leads';
import type { UserRole } from '@leadfinder/shared/types/user';
import { STATUS_CONFIG } from './StatusBadge';

interface StateChangeButtonsProps {
  current: LeadStatus;
  onChange: (status: LeadStatus) => void;
  userRole: UserRole | undefined;
}

const ORDER: LeadStatus[] = ['lead', 'contacto', 'prospecto', 'cliente'];

/**
 * Reglas de negocio del cambio de estado (US11 + US14):
 *
 * - Representante (US11): puede mover Lead -> Contacto -> Prospecto. NO puede pasar a Cliente.
 *   Si el lead YA es Cliente, queda en solo lectura para el representante.
 *
 * - Supervisor (US14): tiene la conversion final a Cliente (perfil administrativo).
 *   Puede tocar cualquier estado.
 *
 * - Director: solo lectura (no es un rol operativo de cambio de estado).
 */
const canChangeTo = (target: LeadStatus, current: LeadStatus, role: UserRole | undefined): boolean => {
  if (!role) return false;
  if (target === current) return false; // ya esta en ese estado

  if (role === 'director') return false;

  if (role === 'representante') {
    // No puede cambiar leads ya convertidos
    if (current === 'cliente') return false;
    // No puede convertir a cliente
    if (target === 'cliente') return false;
    return true;
  }

  // supervisor: puede mover libremente
  return true;
};

export const StateChangeButtons = ({ current, onChange, userRole }: StateChangeButtonsProps) => {
  return (
    <div style={{
      background: '#172840',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '12px',
      padding: '18px 20px',
    }}>
      <div style={{
        fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em',
        textTransform: 'uppercase', color: '#3d5a73',
        marginBottom: '14px',
      }}>
        Cambio de estado
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        {ORDER.map((status, idx) => {
          const cfg = STATUS_CONFIG[status];
          const isActive = current === status;
          const enabled = canChangeTo(status, current, userRole);

          // Tooltip explicativo segun por que no esta habilitado
          let title: string | undefined;
          if (!enabled && !isActive) {
            if (userRole === 'director') title = 'El director no puede cambiar el estado';
            else if (userRole === 'representante' && status === 'cliente') title = 'Solo el supervisor puede convertir a Cliente';
            else if (userRole === 'representante' && current === 'cliente') title = 'El lead ya fue convertido a Cliente';
          }

          return (
            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                disabled={!enabled}
                onClick={() => onChange(status)}
                title={title}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: `1px solid ${isActive ? cfg.dot : 'rgba(255,255,255,0.08)'}`,
                  background: isActive ? cfg.bg : 'transparent',
                  color: isActive ? cfg.text : '#7a9bbf',
                  fontSize: '12px',
                  fontWeight: isActive ? 600 : 500,
                  cursor: enabled ? 'pointer' : 'not-allowed',
                  opacity: !enabled && !isActive ? 0.45 : 1,
                  fontFamily: "'Inter', system-ui, sans-serif",
                  transition: 'all 0.15s',
                }}
              >
                {cfg.label}
              </button>
              {idx < ORDER.length - 1 && (
                <span style={{ color: '#3d5a73', fontSize: '14px' }}>→</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
