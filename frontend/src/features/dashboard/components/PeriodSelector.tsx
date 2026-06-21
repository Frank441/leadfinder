import type { Period } from '../types';
import { PERIOD_LABEL } from '../types';

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
}

const PERIODS: Period[] = ['mes', 'trimestre', 'anio'];

export const PeriodSelector = ({ value, onChange }: PeriodSelectorProps) => {
  return (
    <div style={{
      display: 'inline-flex',
      background: 'var(--color-card)',
      border: '1px solid var(--color-border)',
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
              background: isActive ? 'var(--color-green)' : 'transparent',
              color: isActive ? '#fff' : 'var(--color-text-sec)',
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
