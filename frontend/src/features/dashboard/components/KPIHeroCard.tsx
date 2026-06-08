import type { KPIData } from '../data/mockDashboard';

interface KPIHeroCardProps {
  label: string;
  data: KPIData;
  format?: 'number' | 'percentage';
  hero?: boolean; // resaltado, el KPI estrella
  accent?: 'green' | 'blue' | 'orange' | 'purple';
}

const ACCENT_COLOR: Record<NonNullable<KPIHeroCardProps['accent']>, string> = {
  green:  '#2ecc8f',
  blue:   '#74b4ff',
  orange: '#ffba55',
  purple: '#c084fc',
};

const formatValue = (value: number, format: KPIHeroCardProps['format']): string => {
  if (format === 'percentage') return `${value.toFixed(1)}%`;
  return value.toLocaleString('es-AR');
};

export const KPIHeroCard = ({ label, data, format = 'number', hero = false, accent = 'green' }: KPIHeroCardProps) => {
  const color = ACCENT_COLOR[accent];
  const isPositive = data.delta >= 0;
  const deltaColor = isPositive ? '#2ecc8f' : '#ff7b7b';
  const arrow = isPositive ? '▲' : '▼';

  return (
    <div style={{
      background: hero
        ? `linear-gradient(135deg, rgba(26,170,110,0.10), rgba(26,170,110,0.03))`
        : '#172840',
      border: `1px solid ${hero ? 'rgba(26,170,110,0.35)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: '14px',
      padding: hero ? '22px 24px' : '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: hero ? '130px' : '110px',
    }}>
      <div style={{
        fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em',
        color: '#a8bdd4', textTransform: 'uppercase',
      }}>
        {label}
      </div>

      <div style={{
        fontSize: hero ? '40px' : '30px',
        fontWeight: 700,
        color: hero ? color : '#f0f4f8',
        lineHeight: 1.05,
        margin: hero ? '8px 0' : '6px 0',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {formatValue(data.value, format)}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        fontSize: '11px',
      }}>
        <span style={{ color: deltaColor, fontWeight: 600 }}>
          {arrow} {isPositive ? '+' : ''}{data.delta.toFixed(1)}%
        </span>
        <span style={{ color: '#7a9bbf' }}>{data.deltaLabel}</span>
      </div>
    </div>
  );
};
