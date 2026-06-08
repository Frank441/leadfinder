import type { RepPerformance } from '../data/mockDashboard';

interface TeamPerformanceCardProps {
  team: RepPerformance[];
  globalRate: number;
}

/**
 * Ranking del equipo (US07a + US07b + US07c).
 * Ordenamos por tasa de conversion descendente para que el top performer este arriba.
 * Resaltamos visualmente al primero.
 */
export const TeamPerformanceCard = ({ team, globalRate }: TeamPerformanceCardProps) => {
  const sorted = [...team].sort((a, b) => b.tasaConversion - a.tasaConversion);
  const maxLeads = Math.max(...team.map((r) => r.leads), 1);
  const topId = sorted[0]?.id;

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
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#f0f4f8', margin: 0 }}>
            Ranking del equipo
          </h2>
          <p style={{ fontSize: '11px', color: '#7a9bbf', margin: '4px 0 0 0' }}>
            Ordenado por tasa de conversión
          </p>
        </div>
        <div style={{
          padding: '4px 10px',
          background: 'rgba(26,170,110,0.12)',
          border: '1px solid rgba(26,170,110,0.3)',
          borderRadius: '20px',
          fontSize: '11px',
          color: '#2ecc8f',
          fontWeight: 600,
        }}>
          Equipo: {globalRate.toFixed(1)}%
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {sorted.map((rep, idx) => {
          const isTop = rep.id === topId;
          const aboveGlobal = rep.tasaConversion >= globalRate;

          return (
            <div key={rep.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 0',
              borderBottom: idx < sorted.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              {/* Avatar + posicion */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: isTop ? 'rgba(26,170,110,0.25)' : 'rgba(255,255,255,0.06)',
                  color: isTop ? '#2ecc8f' : '#7a9bbf',
                  border: isTop ? '1px solid rgba(26,170,110,0.5)' : '1px solid transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700,
                }}>
                  {rep.initials}
                </div>
                {isTop && (
                  <span style={{
                    position: 'absolute', top: '-4px', right: '-4px',
                    fontSize: '12px',
                  }}>
                    👑
                  </span>
                )}
              </div>

              {/* Info + barra */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#f0f4f8' }}>{rep.name}</span>
                  <span style={{ fontSize: '11px', color: '#7a9bbf', whiteSpace: 'nowrap' }}>
                    {rep.leads} leads · {rep.conversiones} conv.
                  </span>
                </div>
                <div style={{
                  height: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(rep.leads / maxLeads) * 100}%`,
                    background: isTop ? '#1aaa6e' : 'rgba(116,180,255,0.4)',
                    borderRadius: '3px',
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>

              {/* Tasa de conversion */}
              <div style={{
                minWidth: '54px',
                textAlign: 'right',
                fontSize: '14px',
                fontWeight: 700,
                color: aboveGlobal ? '#2ecc8f' : '#ffba55',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {rep.tasaConversion.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
