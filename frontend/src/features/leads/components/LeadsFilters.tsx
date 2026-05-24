import { ZONAS, ACTIVIDADES } from '../data/mockRepresentantes';

interface LeadsFiltersProps {
  zona: string;
  actividad: string;
  onChangeZona: (zona: string) => void;
  onChangeActividad: (actividad: string) => void;
}

const selectStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '9px',
  color: '#f0f4f8',
  padding: '8px 13px',
  fontSize: '12px',
  outline: 'none',
  fontFamily: "'Inter', system-ui, sans-serif",
  minWidth: '140px',
  cursor: 'pointer',
};

// Estilo aplicado a cada <option> para que el dropdown nativo respete el dark theme.
// Sin esto el sistema operativo renderiza las opciones con sus colores por defecto.
const optionStyle: React.CSSProperties = {
  background: '#172840',
  color: '#f0f4f8',
};

export const LeadsFilters = ({ zona, actividad, onChangeZona, onChangeActividad }: LeadsFiltersProps) => {
  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <select value={zona} onChange={(e) => onChangeZona(e.target.value)} style={selectStyle}>
        <option value="" style={optionStyle}>Todas las zonas</option>
        {ZONAS.map((z) => <option key={z} value={z} style={optionStyle}>{z}</option>)}
      </select>
      <select value={actividad} onChange={(e) => onChangeActividad(e.target.value)} style={selectStyle}>
        <option value="" style={optionStyle}>Todas las actividades</option>
        {ACTIVIDADES.map((a) => <option key={a} value={a} style={optionStyle}>{a}</option>)}
      </select>
    </div>
  );
};
