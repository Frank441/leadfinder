import type { RepPerformance } from '../data/mockDashboard';

interface TeamPerformanceCardProps {
  team: RepPerformance[];
  globalRate: number;
}

export const TeamPerformanceCard = ({ team, globalRate }: TeamPerformanceCardProps) => {
  return (
    <div style={{
      background: '#172840',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '12px',
      padding: '18px 20px',
    }}>
      <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#f0f4f8', margin: '0 0 14px 0' }}>
        Rendimiento del equipo
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {team.map((rep, idx) => (
          <div key={rep.id} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 0',
            borderBottom: idx < team.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'rgba(26,170,110,0.15)', color: '#1aaa6e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 600, flexShrink: 0,
            }}>
              {rep.initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#f0f4f8' }}>{rep.name}</div>
              <div style={{ fontSize: '11px', color: '#7a9bbf', marginTop: '2px' }}>
                {rep.leads} leads · {rep.conversiones} conv.
              </div>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#2ecc8f', fontVariantNumeric: 'tabular-nums' }}>
              {rep.tasaConversion.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      {/* Conversión global */}
      <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', color: '#7a9bbf' }}>Conversión global</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#2ecc8f', fontVariantNumeric: 'tabular-nums' }}>
            {globalRate.toFixed(1)}%
          </span>
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            width: `${Math.min(globalRate, 100)}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #1aaa6e, #2ecc8f)',
            borderRadius: '4px',
          }} />
        </div>
      </div>
    </div>
  );
};
