import type { RepPerformance } from '../types';

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
      background: 'var(--color-card)',
      border: '1px solid var(--color-border)',
      borderRadius: '14px',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
            Ranking del equipo
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--color-text-sec)', margin: '4px 0 0 0' }}>
            Ordenado por tasa de conversión
          </p>
        </div>
        <div style={{
          padding: '4px 10px',
          background: 'var(--color-green-bg)',
          border: '1px solid var(--color-green-border)',
          borderRadius: '20px',
          fontSize: '11px',
          color: 'var(--color-green-light)',
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
              borderBottom: idx < sorted.length - 1 ? '1px solid var(--color-input-bg)' : 'none',
            }}>
              {/* Avatar + posicion */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: isTop ? 'var(--color-green-bg)' : 'var(--color-input-bg)',
                  color: isTop ? 'var(--color-green-light)' : 'var(--color-text-sec)',
                  border: isTop ? '1px solid var(--color-green-border)' : '1px solid transparent',
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
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text)' }}>{rep.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-sec)', whiteSpace: 'nowrap' }}>
                    {rep.leads} leads · {rep.conversiones} conv.
                  </span>
                </div>
                <div style={{
                  height: '6px',
                  background: 'var(--color-input-bg)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(rep.tasaConversion / maxLeads) * 100}%`,
                    background: isTop ? 'var(--color-green)' : 'rgba(116,180,255,0.4)',
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
                color: aboveGlobal ? 'var(--color-green-light)' : '#ffba55',
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
