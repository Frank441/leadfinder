import type { BcraData, BcraSituacion } from "@leadfinder/shared/types/leads";
import { CardEmptyState } from './CardEmptyState';

interface BcraCardProps {
  data: BcraData;
}

const SITUACION_COLOR: Record<BcraSituacion, { ring: string; text: string; bg: string }> = {
  'Normal':       { ring: 'var(--color-green)', text: 'var(--color-green-light)', bg: 'var(--color-green-bg)' },
  'Riesgo bajo':  { ring: '#e09a30', text: '#ffba55', bg: 'rgba(224,154,48,0.13)' },
  'Riesgo medio': { ring: '#e0742e', text: '#ff9a52', bg: 'rgba(224,116,46,0.13)' },
  'Riesgo alto':  { ring: '#e05252', text: '#ff7b7b', bg: 'rgba(224,82,82,0.13)' },
  'Sin datos':    { ring: 'var(--color-text-muted)', text: 'var(--color-text-sec)', bg: 'rgba(122,155,191,0.08)' },
};

const Row = ({ label, value }: { label: string; value: string | number }) => (
  <div style={{ marginBottom: '10px' }}>
    <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', color: 'var(--color-text-label)', textTransform: 'uppercase' }}>
      {label}
    </div>
    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', marginTop: '2px' }}>
      {value}
    </div>
  </div>
);

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Sin datos';

/**
 * El criterio "sin datos" del BCRA pasa cuando el backend devuelve `situacion: "Sin datos"`,
 * no hay numero de situacion crediticia y no hay fecha de consulta.
 */
const isBcraEmpty = (d: BcraData): boolean => {
  return d.situacion === 'Sin datos' && !d.situacionNumero && !d.ultimaConsulta;
};

export const BcraCard = ({ data }: BcraCardProps) => {
  const c = SITUACION_COLOR[data.situacion];

  return (
    <div style={{
      background: 'var(--color-card)',
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.ring }} />
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--color-text-sec)', textTransform: 'uppercase' }}>
          BCRA
        </span>
      </div>

      {isBcraEmpty(data) ? (
        <CardEmptyState source="BCRA" />
      ) : (
        <>
          {/* Indicador grande */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '6px 0 18px 0' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              border: `2px solid ${c.ring}`,
              background: c.bg,
              color: c.text,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', fontWeight: 700,
            }}>
              {data.situacion === 'Normal' ? '✓' : data.situacion === 'Sin datos' ? '?' : '!'}
            </div>
            <div style={{ marginTop: '8px', fontSize: '13px', fontWeight: 600, color: c.text }}>
              {data.situacion}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-sec)', marginTop: '2px' }}>
              Situación crediticia: {data.situacionNumero ?? 'Sin datos'}
            </div>
          </div>

          <Row label="Cheques rechazados" value={data.chequesRechazados === 0 ? 'Sin registros' : data.chequesRechazados} />
          <Row label="Deudas incob."      value={data.deudasIncobrables === 0 ? 'Sin registros' : data.deudasIncobrables} />
          <Row label="Última consulta"    value={formatDate(data.ultimaConsulta)} />
        </>
      )}
    </div>
  );
};
