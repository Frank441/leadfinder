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
      background: '#172840',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '12px',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ color: '#f0f4f8', fontWeight: 600 }}>{z.zona}</div>
      <div style={{ color: '#7a9bbf', marginTop: '2px' }}>
        {z.leads.toLocaleString('es-AR')} leads · {z.pct.toFixed(1)}%
      </div>
    </div>
  );
};

// Paleta degradado verde -> verde claro para que la primera zona (la mas grande) destaque
const COLORS = ['#1aaa6e', '#2ecc8f', '#74b4ff', '#3d8fe0', '#ffba55', '#e09a30'];

export const ZoneBarChart = ({ data }: ZoneBarChartProps) => {
  return (
    <div style={{
      background: '#172840',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '14px',
      padding: '20px 24px',
    }}>
      <div style={{ marginBottom: '12px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#f0f4f8', margin: 0 }}>
          Leads por zona del país
        </h2>
        <p style={{ fontSize: '11px', color: '#7a9bbf', margin: '4px 0 0 0' }}>
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
            <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.04)" />
            <XAxis
              type="number"
              tick={{ fill: '#7a9bbf', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.07)' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="zona"
              tick={{ fill: '#f0f4f8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
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
