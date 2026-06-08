import type { Period } from '../data/mockDashboard';
import { PERIOD_LABEL } from '../data/mockDashboard';

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
}

const PERIODS: Period[] = ['mes', 'trimestre', 'anio'];

export const PeriodSelector = ({ value, onChange }: PeriodSelectorProps) => {
  return (
    <div style={{
      display: 'inline-flex',
      background: '#172840',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '9px',
      padding: '3px',
      gap: '2px',
    }}>
      {PERIODS.map((p) => {
        const isActive = p === value;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            style={{
              padding: '6px 14px',
              borderRadius: '7px',
              border: 'none',
              background: isActive ? '#1aaa6e' : 'transparent',
              color: isActive ? '#fff' : '#7a9bbf',
              fontSize: '12px',
              fontWeight: isActive ? 600 : 500,
              cursor: 'pointer',
              fontFamily: "'Inter', system-ui, sans-serif",
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {PERIOD_LABEL[p]}
          </button>
        );
      })}
    </div>
  );
};
