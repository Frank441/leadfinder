import L from 'leaflet';
import type { LeadStatus } from '@leadfinder/shared/types/leads';

/**
 * Construye el icono del cluster (grupo de marcadores) cuando hay muchos leads cerca.
 * El anillo del cluster se divide en segmentos coloreados segun la proporcion
 * de cada estado de los leads que contiene. El numero en el centro indica el total.
 *
 * Asi el supervisor o representante ve de un vistazo si en una zona predominan
 * leads sin contactar, prospectos avanzados o clientes ya cerrados.
 */

const STATUS_COLOR: Record<LeadStatus, string> = {
  lead:      '#e05252',
  contacto:  '#e09a30',
  prospecto: '#3d8fe0',
  cliente:   'var(--color-green)',
};

// Orden del embudo de ventas, asi los segmentos se leen Lead -> Contacto -> ... -> Cliente
const ORDER: LeadStatus[] = ['lead', 'contacto', 'prospecto', 'cliente'];

// Lee el estado desde el className del DivIcon del marcador hijo.
// El className lo seteamos en leadMarkerIcon.ts como "lead-marker-icon lead-status-X".
const extractStatusFromMarker = (marker: { options: { icon?: { options?: { className?: string } } } }): LeadStatus | null => {
  const className = marker.options.icon?.options?.className ?? '';
  for (const status of ORDER) {
    if (className.includes(`lead-status-${status}`)) return status;
  }
  return null;
};

interface MarkerClusterLike {
  getChildCount: () => number;
  getAllChildMarkers: () => Array<{ options: { icon?: { options?: { className?: string } } } }>;
}

export const buildClusterIcon = (cluster: MarkerClusterLike): L.DivIcon => {
  const count = cluster.getChildCount();
  const markers = cluster.getAllChildMarkers();

  // Cuenta leads por estado
  const counts: Record<LeadStatus, number> = { lead: 0, contacto: 0, prospecto: 0, cliente: 0 };
  for (const m of markers) {
    const s = extractStatusFromMarker(m);
    if (s) counts[s]++;
  }

  // Tamano del cluster segun cantidad de leads (densidad visual)
  let size: number;
  if (count < 10)        size = 42;
  else if (count < 100)  size = 52;
  else                   size = 60;

  const strokeWidth = 6;
  const r = (size - strokeWidth) / 2 - 1; // radio del anillo, dejando margen
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;

  // Construye los segmentos del anillo: cada estado ocupa una porcion
  // proporcional al porcentaje que representa.
  let accumulated = 0;
  const segments = ORDER
    .filter((status) => counts[status] > 0)
    .map((status) => {
      const pct = counts[status] / count;
      const segLen = pct * circ;
      const offset = -accumulated; // negativo: corre el dash hacia adelante
      accumulated += segLen;
      return `
        <circle cx="${cx}" cy="${cy}" r="${r}"
                fill="none"
                stroke="${STATUS_COLOR[status]}"
                stroke-width="${strokeWidth}"
                stroke-linecap="butt"
                stroke-dasharray="${segLen} ${circ - segLen}"
                stroke-dashoffset="${offset}"
                transform="rotate(-90 ${cx} ${cy})" />
      `;
    })
    .join('');

  // Para que el numero del centro se lea bien sobre cualquier color
  const fontSize = count < 100 ? 13 : count < 1000 ? 12 : 11;

  const html = `
    <div style="position: relative; width: ${size}px; height: ${size}px;">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <!-- Disco interno oscuro: hace de "fondo" para que el numero blanco contraste -->
        <circle cx="${cx}" cy="${cy}" r="${r - strokeWidth / 2}" fill="rgba(11,25,41,0.92)" />
        <!-- Aro guia gris muy sutil, para cuando un cluster tiene un solo estado -->
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
                stroke="var(--color-border-strong)" stroke-width="${strokeWidth}" />
        ${segments}
      </svg>
      <div style="
        position: absolute; inset: 0;
        display: flex; align-items: center; justify-content: center;
        color: #ffffff;
        font-family: 'Inter', system-ui, sans-serif;
        font-size: ${fontSize}px;
        font-weight: 700;
        pointer-events: none;
        text-shadow: 0 1px 2px rgba(0,0,0,0.4);
      ">${count}</div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'lead-cluster-icon',
    iconSize: L.point(size, size, true),
  });
};
