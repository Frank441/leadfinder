import L from 'leaflet';
import type { LeadStatus } from '@leadfinder/shared/types/leads';

/**
 * Genera un icono de marcador custom (divIcon HTML) coloreado segun el estado del lead.
 * Sigue el design system: Lead=rojo, Contacto=naranja, Prospecto=azul, Cliente=verde.
 *
 * Usa divIcon en vez de L.icon porque:
 * 1) No requiere assets PNG externos (bug clasico de Leaflet con bundlers).
 * 2) Permite estilar con CSS inline, perfecto para colorear dinamicamente.
 */

const STATUS_FILL: Record<LeadStatus, string> = {
  lead:      '#e05252',
  contacto:  '#e09a30',
  prospecto: '#3d8fe0',
  cliente:   'var(--color-green)',
};

const STATUS_STROKE: Record<LeadStatus, string> = {
  lead:      '#ff7b7b',
  contacto:  '#ffba55',
  prospecto: '#74b4ff',
  cliente:   'var(--color-green-light)',
};

export const buildLeadIcon = (status: LeadStatus): L.DivIcon => {
  const fill = STATUS_FILL[status];
  const stroke = STATUS_STROKE[status];

  // Pin con punto interno y sombra sutil
  const html = `
    <div style="position: relative; transform: translate(-50%, -100%);">
      <svg width="26" height="34" viewBox="0 0 26 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 1.5 C 6.4 1.5 1.5 6.4 1.5 13 C 1.5 21.5 13 32.5 13 32.5 C 13 32.5 24.5 21.5 24.5 13 C 24.5 6.4 19.6 1.5 13 1.5 Z"
              fill="${fill}" stroke="${stroke}" stroke-width="1.5" />
        <circle cx="13" cy="13" r="4" fill="#0b1929" />
      </svg>
    </div>
  `;

  return L.divIcon({
    html,
    // Incluimos el estado en el className para que el cluster pueda
    // contar cuantos marcadores hay de cada estado leyendolo de aca.
    className: `lead-marker-icon lead-status-${status}`,
    iconSize: [26, 34],
    iconAnchor: [13, 34],
    popupAnchor: [0, -32],
  });
};
