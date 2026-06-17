import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { StatusSlice } from '../types';
import { STATUS_CONFIG } from '../../leads/components/StatusBadge';

interface StatusDistributionDonutProps {
  data: StatusSlice[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: StatusSlice }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  const slice = payload[0].payload;
  const total = payload[0].value;
  return (
    <div style={{
      background: '#172840',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '12px',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ color: '#f0f4f8', fontWeight: 600 }}>{slice.label}</div>
      <div style={{ color: '#7a9bbf', marginTop: '2px' }}>
        {total.toLocaleString('es-AR')} leads
      </div>
    </div>
  );
};

export const StatusDistributionDonut = ({ data }: StatusDistributionDonutProps) => {
  const total = data.reduce((acc, s) => acc + s.count, 0);

  return (
    <div style={{
      background: '#172840',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '14px',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      <div style={{ marginBottom: '12px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#f0f4f8', margin: 0 }}>
          Estado actual de los leads
        </h2>
        <p style={{ fontSize: '11px', color: '#7a9bbf', margin: '4px 0 0 0' }}>
          Cuántos leads hay en cada etapa
        </p>
      </div>

      <div style={{ flex: 1, position: 'relative', minHeight: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="85%"
              paddingAngle={2}
              stroke="none"
            >
              {data.map((slice) => (
                <Cell key={slice.status} fill={STATUS_CONFIG[slice.status].dot} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Total en el centro del donut */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{ fontSize: '11px', color: '#7a9bbf', fontWeight: 500 }}>Total</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#f0f4f8', fontVariantNumeric: 'tabular-nums' }}>
            {total.toLocaleString('es-AR')}
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '14px' }}>
        {data.map((slice) => {
          const cfg = STATUS_CONFIG[slice.status];
          const pct = total === 0 ? 0 : (slice.count / total) * 100;
          return (
            <div key={slice.status} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cfg.dot }} />
              <span style={{ color: '#f0f4f8' }}>{slice.label}</span>
              <span style={{ color: '#7a9bbf', fontVariantNumeric: 'tabular-nums' }}>
                {pct.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
