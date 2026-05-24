import type { KPI } from '../data/mockDashboard';

const VALUE_COLOR: Record<KPI['color'], string> = {
  green:  '#2ecc8f',
  blue:   '#74b4ff',
  orange: '#ffba55',
};

export const KPICard = ({ kpi }: { kpi: KPI }) => {
  return (
    <div style={{
      background: '#172840',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '12px',
      padding: '18px 20px',
    }}>
      <div style={{
        fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em',
        color: '#3d5a73', textTransform: 'uppercase',
      }}>
        {kpi.label}
      </div>
      <div style={{
        fontSize: '28px', fontWeight: 700,
        color: VALUE_COLOR[kpi.color],
        margin: '8px 0 4px 0',
        lineHeight: 1.1,
      }}>
        {kpi.value}
      </div>
      {kpi.delta && (
        <div style={{ fontSize: '11px', color: '#7a9bbf' }}>
          {kpi.delta}
        </div>
      )}
    </div>
  );
};
