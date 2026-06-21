import type { SenasaData } from '@leadfinder/shared/types/leads';
import { CardEmptyState } from './CardEmptyState';

interface SenasaCardProps {
  data: SenasaData;
}

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

const isEmpty = (v: string | undefined | null) => !v || v.trim() === '' || v.toUpperCase() === 'N/A';

/**
 * Considera vacios los datos de SENASA cuando ningun campo significativo trae info real.
 */
const isSenasaEmpty = (d: SenasaData): boolean => {
  return isEmpty(d.actividad) && isEmpty(d.estadoSanitario) && d.superficieHa === 0;
};

export const SenasaCard = ({ data }: SenasaCardProps) => {
  return (
    <div style={{
      background: 'var(--color-card)',
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3d8fe0' }} />
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--color-text-sec)', textTransform: 'uppercase' }}>
          SENASA
        </span>
      </div>

      {isSenasaEmpty(data) ? (
        <CardEmptyState source="SENASA" />
      ) : (
        <>
          <Row label="Actividad"     value={data.actividad || 'Sin datos'} />
          <Row label="Superficie"    value={data.superficieHa > 0 ? `${data.superficieHa.toLocaleString('es-AR')} ha` : 'Sin datos'} />
          <Row label="Estado sanit." value={data.estadoSanitario || 'Sin datos'} />
          <Row label="RENSPA"        value={data.renspaActivo ? 'Activo' : 'Inactivo'} />
        </>
      )}
    </div>
  );
};
