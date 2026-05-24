import type { SenasaData } from '@leadfinder/shared/test';

interface SenasaCardProps {
  data: SenasaData;
}

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

export const SenasaCard = ({ data }: SenasaCardProps) => {
  return (
    <div style={{
      background: '#172840',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '12px',
      padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3d8fe0' }} />
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', color: '#7a9bbf', textTransform: 'uppercase' }}>
          SENASA
        </span>
      </div>
      <Row label="Actividad"     value={data.actividad} />
      <Row label="Cabezas"       value={`${data.cabezas.toLocaleString('es-AR')} cab.`} />
      <Row label="Superficie"    value={`${data.superficieHa.toLocaleString('es-AR')} ha`} />
      <Row label="Estado sanit." value={data.estadoSanitario} />
      <Row label="RENSPA"        value={data.renspaActivo ? 'Activo' : 'Inactivo'} />
    </div>
  );
};
