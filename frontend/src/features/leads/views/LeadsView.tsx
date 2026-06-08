import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lead, Representante } from '@leadfinder/shared/types/leads';
import { useAuth } from '../../../context/AuthContext';
import { leadsService } from '../services/leadsService';
import { representantesService } from '../services/representantesService';
import { StatusBadge } from '../components/StatusBadge';
import { ScoreBadge } from '../components/ScoreBadge';
import { StatusTabs } from '../components/StatusTabs';
import type { StatusFilter } from '../components/StatusTabs';
import { LeadsFilters } from '../components/LeadsFilters';
import { AssignLeadModal } from '../components/AssignLeadModal';
import { Pagination } from '../components/Pagination';

const TH: React.CSSProperties = {
  padding: '11px 16px', textAlign: 'left',
  fontSize: '10px', fontWeight: 600,
  letterSpacing: '0.06em', textTransform: 'uppercase',
  color: '#3d5a73', whiteSpace: 'nowrap',
};

const ITEMS_PER_PAGE = 20;

const RepresentanteCell = ({ representanteId, representantes }: { representanteId: string | null; representantes: Representante[] }) => {
  const rep = representanteId ? representantes.find((r) => r.id === representanteId) : null;
  if (!rep) {
    return <span style={{ color: '#3d5a73', fontStyle: 'italic', fontSize: '12px' }}>Sin asignar</span>;
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '22px', height: '22px', borderRadius: '50%',
        background: 'rgba(26,170,110,0.15)', color: '#1aaa6e',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '10px', fontWeight: 600,
      }}>
        {rep.initials}
      </div>
      <span style={{ fontSize: '12px', color: '#f0f4f8' }}>{rep.name}</span>
    </div>
  );
};

export const LeadsView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [representantes, setRepresentantes] = useState<Representante[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [zonaFilter, setZonaFilter] = useState('');
  const [actividadFilter, setActividadFilter] = useState('');
  const [assignTarget, setAssignTarget] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Paginacion client-side: cargamos todos los leads y mostramos de a 20.
  // Cuando el backend soporte ?page=X&limit=Y, esto pasa a server-side.
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    Promise.all([leadsService.getAll(), representantesService.getAll()]).then(([data, reps]) => {
      if (cancelled) return;
      setLeads(data);
      setRepresentantes(reps);
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, [user]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return leads.filter((l) => {
      if (statusFilter !== 'todos' && l.status !== statusFilter) return false;
      if (zonaFilter && l.zona !== zonaFilter) return false;
      if (actividadFilter && l.actividad !== actividadFilter) return false;
      if (q && !(
        l.razonSocial.toLowerCase().includes(q) ||
        l.cuit.includes(q) ||
        l.localidad.toLowerCase().includes(q)
      )) return false;
      return true;
    });
  }, [leads, search, statusFilter, zonaFilter, actividadFilter]);

  // Reset a pagina 1 cuando cambian los filtros (sino podrias quedar en una pagina vacia)
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, zonaFilter, actividadFilter]);

  // Slice de la pagina actual
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedLeads = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  // Rango "X-Y" mostrado en el contador
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const rangeEnd   = Math.min(page * ITEMS_PER_PAGE, filtered.length);

  const handleAssigned = (updated: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  const canAssign = user?.role === 'director' || user?.role === 'supervisor';

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <p style={{ fontSize: '12px', color: '#7a9bbf', margin: 0 }}>
          {isLoading
            ? 'Cargando leads...'
            : filtered.length === 0
              ? '0 leads'
              : `Mostrando ${rangeStart}–${rangeEnd} de ${filtered.length.toLocaleString('es-AR')} leads`}
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
        <input
          type="text"
          placeholder="Buscar por nombre o CUIT..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: '1 1 260px', minWidth: '220px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '9px', color: '#f0f4f8',
            padding: '9px 13px', fontSize: '13px', outline: 'none',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
          onFocus={(e) => { e.target.style.borderColor = '#1aaa6e'; e.target.style.background = 'rgba(26,170,110,0.06)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
        />
        <LeadsFilters
          zona={zonaFilter}
          actividad={actividadFilter}
          onChangeZona={setZonaFilter}
          onChangeActividad={setActividadFilter}
        />
        <StatusTabs value={statusFilter} onChange={setStatusFilter} />
      </div>

      <div style={{ background: '#172840', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <th style={TH}>Establecimiento</th>
              <th style={TH}>CUIT</th>
              <th style={TH}>Zona</th>
              <th style={TH}>Representante</th>
              <th style={TH}>Estado</th>
              <th style={{ ...TH, textAlign: 'center' }}>Score</th>
              {canAssign && <th style={TH}></th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={canAssign ? 7 : 6} style={{ padding: '40px', textAlign: 'center', color: '#7a9bbf', fontSize: '13px' }}>Cargando...</td></tr>
            ) : paginatedLeads.length === 0 ? (
              <tr><td colSpan={canAssign ? 7 : 6} style={{ padding: '40px', textAlign: 'center', color: '#7a9bbf', fontSize: '13px' }}>No se encontraron leads con los filtros aplicados</td></tr>
            ) : (
              paginatedLeads.map((lead, idx) => (
                <tr
                  key={lead.id}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  style={{
                    borderBottom: idx < paginatedLeads.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: '13px', color: '#f0f4f8', fontWeight: 500 }}>{lead.razonSocial}</div>
                    <div style={{ fontSize: '11px', color: '#7a9bbf', marginTop: '2px' }}>
                      {lead.superficieHa.toLocaleString('es-AR')} ha
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#7a9bbf', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{lead.cuit}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#7a9bbf', whiteSpace: 'nowrap' }}>{lead.zona}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <RepresentanteCell representanteId={lead.representanteId} representantes={representantes} />
                  </td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge status={lead.status} /></td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}><ScoreBadge score={lead.score} /></td>
                  {canAssign && (
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setAssignTarget(lead); }}
                        style={{
                          background: 'transparent',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: '6px', color: '#7a9bbf',
                          padding: '4px 10px', fontSize: '11px',
                          cursor: 'pointer', whiteSpace: 'nowrap',
                          fontFamily: "'Inter', system-ui, sans-serif",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1aaa6e'; e.currentTarget.style.color = '#1aaa6e'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#7a9bbf'; }}
                      >
                        {lead.representanteId ? 'Reasignar' : 'Asignar'}
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {assignTarget && (
        <AssignLeadModal
          lead={assignTarget}
          onClose={() => setAssignTarget(null)}
          onAssigned={handleAssigned}
        />
      )}
    </div>
  );
};
