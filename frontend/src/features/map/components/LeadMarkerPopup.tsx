import { useNavigate } from 'react-router-dom';
import type { Lead } from '@leadfinder/shared/types/leads';
import { StatusBadge } from '../../leads/components/StatusBadge';

interface LeadMarkerPopupProps {
  lead: Lead;
}

/**
 * Contenido del popup que se muestra al clickear un marcador del mapa.
 * Muestra los datos basicos del lead y un boton para ir a la ficha completa.
 */
export const LeadMarkerPopup = ({ lead }: LeadMarkerPopupProps) => {
  const navigate = useNavigate();

  return (
    <div style={{ minWidth: '200px', maxWidth: '260px' }}>
      <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em',
                    color: '#3d5a73', textTransform: 'uppercase', marginBottom: '4px' }}>
        CUIT {lead.cuit}
      </div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: '#f0f4f8', marginBottom: '8px' }}>
        {lead.razonSocial}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
        <StatusBadge status={lead.status} />
        <span style={{ fontSize: '11px', color: '#7a9bbf' }}>
          {lead.localidad}{lead.provincia ? `, ${lead.provincia}` : ''}
        </span>
      </div>

      <button
        type="button"
        onClick={() => navigate(`/leads/${lead.id}`)}
        style={{
          width: '100%',
          marginTop: '4px',
          padding: '7px 12px',
          background: '#1aaa6e',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#2ecc8f'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#1aaa6e'; }}
      >
        Ver ficha completa
      </button>
    </div>
  );
};
