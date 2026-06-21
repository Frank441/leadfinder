import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import type { ZoneStat } from '../types';

interface ZoneBarChartProps {
  data: ZoneStat[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ZoneStat }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  const z = payload[0].payload;
  return (
    <div style={{
      background: 'var(--color-card)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '12px',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ color: 'var(--color-text)', fontWeight: 600 }}>{z.zona}</div>
      <div style={{ color: 'var(--color-text-sec)', marginTop: '2px' }}>
        {z.leads.toLocaleString('es-AR')} leads · {z.pct.toFixed(1)}%
      </div>
    </div>
  );
};

// Paleta degradado verde -> verde claro para que la primera zona (la mas grande) destaque
const COLORS = ['var(--color-green)', 'var(--color-green-light)', '#74b4ff', '#3d8fe0', '#ffba55', '#e09a30'];

export const ZoneBarChart = ({ data }: ZoneBarChartProps) => {
  return (
    <div style={{
      background: 'var(--color-card)',
      border: '1px solid var(--color-border)',
      borderRadius: '14px',
      padding: '20px 24px',
    }}>
      <div style={{ marginBottom: '12px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
          Leads por zona del país
        </h2>
        <p style={{ fontSize: '11px', color: 'var(--color-text-sec)', margin: '4px 0 0 0' }}>
          Dónde está distribuido el negocio
        </p>
      </div>

      <div style={{ width: '100%', height: '240px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 24, bottom: 0, left: 8 }}
          >
            <CartesianGrid horizontal={false} stroke="var(--color-input-bg)" />
            <XAxis
              type="number"
              tick={{ fill: 'var(--color-text-sec)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="zona"
              tick={{ fill: 'var(--color-text)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-card-hover)' }} />
            <Bar dataKey="leads" radius={[0, 6, 6, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
