import { useState } from 'react';

type LeadStatus = 'lead' | 'contacto' | 'prospecto' | 'cliente';

interface Lead {
  id: string;
  cuit: string;
  razonSocial: string;
  localidad: string;
  actividad: string;
  status: LeadStatus;
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; dot: string; text: string; bg: string }> = {
  lead:      { label: 'Lead',      dot: '#e05252', text: '#ff7b7b', bg: 'rgba(224,82,82,0.13)' },
  contacto:  { label: 'Contacto',  dot: '#e09a30', text: '#ffba55', bg: 'rgba(224,154,48,0.13)' },
  prospecto: { label: 'Prospecto', dot: '#3d8fe0', text: '#74b4ff', bg: 'rgba(61,143,224,0.13)' },
  cliente:   { label: 'Cliente',   dot: '#1aaa6e', text: '#2ecc8f', bg: 'rgba(26,170,110,0.13)' },
};

const MOCK_LEADS: Lead[] = [
  { id: '1',  cuit: '20-12345678-9', razonSocial: 'PÉREZ AGROPECUARIA SA',    localidad: 'Bahía Blanca, Bs.As.',      actividad: 'Ganadería bovina',        status: 'prospecto' },
  { id: '2',  cuit: '27-98765432-1', razonSocial: 'ESTANCIA DON PEDRO SRL',   localidad: 'General Pico, La Pampa',    actividad: 'Cría de ganado',          status: 'cliente'   },
  { id: '3',  cuit: '30-11223344-5', razonSocial: 'CAMPO LAS LOMAS SA',       localidad: 'Olavarría, Bs.As.',         actividad: 'Agricultura y ganadería', status: 'lead'      },
  { id: '4',  cuit: '20-55667788-2', razonSocial: 'GONZALEZ HERMANOS',        localidad: 'Venado Tuerto, Santa Fe',   actividad: 'Engorde a corral',        status: 'contacto'  },
  { id: '5',  cuit: '27-44556677-3', razonSocial: 'LA PALOMA AGRO SRL',       localidad: 'Córdoba, Córdoba',          actividad: 'Ganadería mixta',         status: 'prospecto' },
  { id: '6',  cuit: '30-99887766-1', razonSocial: 'CAMPO GRANDE SA',          localidad: 'Pigüé, Bs.As.',             actividad: 'Cría y engorde',          status: 'cliente'   },
  { id: '7',  cuit: '20-33445566-8', razonSocial: 'MARTÍNEZ ESTANCIAS',       localidad: 'Río Cuarto, Córdoba',       actividad: 'Ganadería bovina',        status: 'lead'      },
  { id: '8',  cuit: '27-22334455-6', razonSocial: 'LOS ÁLAMOS AGRO SA',       localidad: 'Trenque Lauquen, Bs.As.',  actividad: 'Agricultura y ganadería', status: 'contacto'  },
  { id: '9',  cuit: '30-77889900-4', razonSocial: 'ESTANCIA EL CEIBO SRL',    localidad: 'Gualeguaychú, Entre Ríos', actividad: 'Cría de ganado',          status: 'prospecto' },
  { id: '10', cuit: '20-66778899-7', razonSocial: 'RODRIGUEZ CAMPO SA',       localidad: 'Pergamino, Bs.As.',         actividad: 'Engorde bovino',          status: 'lead'      },
  { id: '11', cuit: '27-11223355-0', razonSocial: 'AGROPECUARIA DEL SUR SRL', localidad: 'Tandil, Bs.As.',            actividad: 'Ganadería bovina',        status: 'cliente'   },
  { id: '12', cuit: '30-44556688-9', razonSocial: 'EL RANCHO GRANDE SA',      localidad: 'Mercedes, Corrientes',      actividad: 'Cría extensiva',          status: 'contacto'  },
];

const TH: React.CSSProperties = {
  padding: '11px 16px', textAlign: 'left',
  fontSize: '10px', fontWeight: 600,
  letterSpacing: '0.06em', textTransform: 'uppercase',
  color: '#3d5a73', whiteSpace: 'nowrap',
};

const StatusBadge = ({ status }: { status: LeadStatus }) => {
  const c = STATUS_CONFIG[status];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, background: c.bg, color: c.text, whiteSpace: 'nowrap' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      {c.label}
    </span>
  );
};

export const LeadsView = () => {
  const [search, setSearch] = useState('');

  const filtered = MOCK_LEADS.filter((l) => {
    const q = search.toLowerCase();
    return l.razonSocial.toLowerCase().includes(q) || l.cuit.includes(q) || l.localidad.toLowerCase().includes(q);
  });

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <p style={{ fontSize: '12px', color: '#7a9bbf', margin: 0 }}>
          {filtered.length} {filtered.length === 1 ? 'registro' : 'registros'}
        </p>
        <button style={{ background: 'rgba(26,170,110,0.15)', border: '1px solid rgba(26,170,110,0.4)', color: '#1aaa6e', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(26,170,110,0.25)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(26,170,110,0.15)'; }}
        >
          + Nuevo CUIT
        </button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Buscar por CUIT, razón social o localidad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: '380px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '9px', color: '#f0f4f8', padding: '9px 13px', fontSize: '13px', outline: 'none', fontFamily: "'Inter', system-ui, sans-serif" }}
          onFocus={(e) => { e.target.style.borderColor = '#1aaa6e'; e.target.style.background = 'rgba(26,170,110,0.06)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
        />
      </div>

      <div style={{ background: '#172840', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <th style={TH}>CUIT</th>
              <th style={TH}>Razón social</th>
              <th style={TH}>Localidad</th>
              <th style={TH}>Actividad</th>
              <th style={TH}>Estado</th>
              <th style={TH}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#7a9bbf', fontSize: '13px' }}>No se encontraron resultados para "{search}"</td></tr>
            ) : (
              filtered.map((lead, idx) => (
                <tr key={lead.id}
                  style={{ borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#7a9bbf', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{lead.cuit}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#f0f4f8', fontWeight: 500 }}>{lead.razonSocial}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#7a9bbf', whiteSpace: 'nowrap' }}>{lead.localidad}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#7a9bbf' }}>{lead.actividad}</td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge status={lead.status} /></td>
                  <td style={{ padding: '12px 16px' }}>
                    <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', color: '#7a9bbf', padding: '4px 10px', fontSize: '11px', cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1aaa6e'; e.currentTarget.style.color = '#1aaa6e'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#7a9bbf'; }}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
