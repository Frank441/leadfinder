import L from 'leaflet';

/**
 * Construye el icono del cluster (grupo de marcadores) cuando hay muchos leads cerca.
 * Alineado al design system: dark theme + verde primario.
 *
 * El tamaño del cluster crece con la cantidad de leads para dar sensacion de densidad.
 */
export const buildClusterIcon = (cluster: { getChildCount: () => number }): L.DivIcon => {
  const count = cluster.getChildCount();

  // Escala el tamaño y la opacidad segun cantidad
  let size: number;
  let bg: string;
  let border: string;
  if (count < 10) {
    size = 36;
    bg = 'rgba(26,170,110,0.85)';
    border = 'rgba(46,204,143,1)';
  } else if (count < 100) {
    size = 44;
    bg = 'rgba(26,170,110,0.9)';
    border = 'rgba(46,204,143,1)';
  } else {
    size = 52;
    bg = 'rgba(26,170,110,0.95)';
    border = 'rgba(46,204,143,1)';
  }

  const html = `
    <div style="
      width: ${size}px; height: ${size}px;
      background: ${bg};
      border: 2px solid ${border};
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: white;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: ${count < 100 ? '13px' : '12px'};
      font-weight: 700;
      box-shadow: 0 0 0 4px rgba(26,170,110,0.18);
    ">${count}</div>
  `;

  return L.divIcon({
    html,
    className: 'lead-cluster-icon',
    iconSize: L.point(size, size, true),
  });
};
