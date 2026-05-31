import type { LeadStatus } from '@leadfinder/shared/types/leads';
import { STATUS_CONFIG } from './StatusBadge';

interface StateChangeButtonsProps {
  current: LeadStatus;
  onChange: (status: LeadStatus) => void;
  disabled?: boolean;
}

const ORDER: LeadStatus[] = ['lead', 'contacto', 'prospecto', 'cliente'];

export const StateChangeButtons = ({ current, onChange, disabled = false }: StateChangeButtonsProps) => {
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
          return (
            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(status)}
                title={disabled ? 'Solo el representante puede cambiar el estado' : undefined}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: `1px solid ${isActive ? cfg.dot : 'rgba(255,255,255,0.08)'}`,
                  background: isActive ? cfg.bg : 'transparent',
                  color: isActive ? cfg.text : '#7a9bbf',
                  fontSize: '12px',
                  fontWeight: isActive ? 600 : 500,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled && !isActive ? 0.5 : 1,
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
