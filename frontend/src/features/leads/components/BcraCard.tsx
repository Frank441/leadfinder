import type { BcraData, BcraSituacion } from "@leadfinder/shared/types/leads";

interface BcraCardProps {
  data: BcraData;
}

const SITUACION_COLOR: Record<BcraSituacion, { ring: string; text: string; bg: string }> = {
  'Normal':       { ring: '#1aaa6e', text: '#2ecc8f', bg: 'rgba(26,170,110,0.13)' },
  'Riesgo bajo':  { ring: '#e09a30', text: '#ffba55', bg: 'rgba(224,154,48,0.13)' },
  'Riesgo alto':  { ring: '#e05252', text: '#ff7b7b', bg: 'rgba(224,82,82,0.13)' },
  'Sin datos':    { ring: '#3d5a73', text: '#7a9bbf', bg: 'rgba(122,155,191,0.08)' },
};

const Row = ({ label, value }: { label: string; value: string | number }) => (
  <div style={{ marginBottom: '10px' }}>
    <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.04em', color: '#3d5a73', textTransform: 'uppercase' }}>
      {label}
    </div>
    <div style={{ fontSize: '13px', fontWeight: 600, color: '#f0f4f8', marginTop: '2px' }}>
      {value}
    </div>
  </div>
);

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const BcraCard = ({ data }: BcraCardProps) => {
  const c = SITUACION_COLOR[data.situacion];
  const icon = data.situacion === 'Normal' ? '✓' : data.situacion === 'Sin datos' ? '?' : '!';

  return (
    <div style={{
      background: '#172840',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '12px',
      padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.ring }} />
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', color: '#7a9bbf', textTransform: 'uppercase' }}>
          BCRA
        </span>
      </div>

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
          {icon}
        </div>
        <div style={{ marginTop: '8px', fontSize: '13px', fontWeight: 600, color: c.text }}>
          {data.situacion}
        </div>
        <div style={{ fontSize: '11px', color: '#7a9bbf', marginTop: '2px' }}>Situación crediticia</div>
      </div>

      <Row label="Cheques rechazados" value={data.chequesRechazados === 0 ? 'Sin registros' : data.chequesRechazados} />
      <Row label="Deudas incob."      value={data.deudasIncobrables === 0 ? 'Sin registros' : data.deudasIncobrables} />
      <Row label="Última consulta"    value={formatDate(data.ultimaConsulta)} />
    </div>
  );
};
