import type { LeadStatus } from '@leadfinder/shared/types/leads';
import type { UserRole } from '@leadfinder/shared/types/user';
import { ROLES } from '@leadfinder/shared/types/user';
import { LEAD_STATUSES } from '@leadfinder/shared/types/leads';
import { STATUS_CONFIG } from './StatusBadge';

interface StateChangeButtonsProps {
  current: LeadStatus;
  onChange: (status: LeadStatus) => void;
  userRole: UserRole | undefined;
}

const ORDER: LeadStatus[] = [
  LEAD_STATUSES.lead,
  LEAD_STATUSES.contacto,
  LEAD_STATUSES.prospecto,
  LEAD_STATUSES.cliente,
];

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
const canChangeTo = (
  target: LeadStatus,
  current: LeadStatus,
  role: UserRole | undefined
): boolean => {
  if (role !== ROLES.representante) return false;
  if (target === current) return false;
  if (current === LEAD_STATUSES.cliente) return false;

  return true;
};

export const StateChangeButtons = ({ current, onChange, userRole }: StateChangeButtonsProps) => {
  return (
    <div style={{
      background: 'var(--color-card)',
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      padding: '18px 20px',
    }}>
      <div style={{
        fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
        textTransform: 'uppercase', color: 'var(--color-text-label)',
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
            if (userRole === ROLES.director || userRole === ROLES.supervisor) {
              title = 'Solo un representante puede cambiar el estado del lead';
            } else if (userRole === ROLES.representante) {
              title = current === LEAD_STATUSES.cliente
                ? 'El lead ya fue convertido a Cliente'
                : 'Este cambio de estado no está permitido desde el estado actual';
            }
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
                  border: `1px solid ${isActive ? cfg.dot : 'var(--color-border-strong)'}`,
                  background: isActive ? cfg.bg : 'transparent',
                  color: isActive ? cfg.text : 'var(--color-text-sec)',
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
                <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>→</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
