import type { ArcaData } from '@leadfinder/shared/types/leads';

interface ArcaCardProps {
  data: ArcaData;
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div style={{ marginBottom: '10px' }}>
    <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.04em', color: '#3d5a73', textTransform: 'uppercase' }}>
      {label}
    </div>
    <div style={{ fontSize: '13px', fontWeight: 600, color: '#f0f4f8', marginTop: '2px' }}>
      {value}
    </div>
  </div>
);

export const ArcaCard = ({ data }: ArcaCardProps) => {
  return (
    <div style={{
      background: '#172840',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '12px',
      padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e09a30' }} />
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', color: '#7a9bbf', textTransform: 'uppercase' }}>
          ARCA (AFIP)
        </span>
      </div>
      <Row label="Categoría"      value={data.categoria} />
      <Row label="Estado CUIT"    value={data.estadoCUIT} />
      <Row label="Actividad AFIP" value={data.actividadAfip} />
      <Row label="Obligaciones"   value={data.obligacionesAlDia ? 'Al día' : 'Con atrasos'} />
      <Row label="Último pago"    value={data.ultimoPago} />
    </div>
  );
};
