import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Lead, Representante } from '@leadfinder/shared/types/leads';
import { ROLES } from "@leadfinder/shared/types/user";
import { useAuth } from '../../../context/AuthContext';
import { leadsService } from '../services/leadsService';
import { representantesService } from '../services/representantesService';
import { StatusBadge } from '../components/StatusBadge';
import { StatusTabs } from '../components/StatusTabs';
import type { StatusFilter } from '../components/StatusTabs';
import { LeadsFilters } from '../components/LeadsFilters';
import { AssignLeadModal } from '../components/AssignLeadModal';
import { Pagination } from '../components/Pagination';

const TH: React.CSSProperties = {
  padding: '11px 16px', textAlign: 'left',
  fontSize: '11px', fontWeight: 600,
  letterSpacing: '0.06em', textTransform: 'uppercase',
  color: 'var(--color-text-label)', whiteSpace: 'nowrap',
};

const ITEMS_PER_PAGE = 20;

const RepresentanteCell = ({ representanteId, representantes }: { representanteId: string | null; representantes: Representante[] }) => {
  const rep = representanteId ? representantes.find((r) => r.id === representanteId) : null;
  if (!rep) {
    return <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '12px' }}>Sin asignar</span>;
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '22px', height: '22px', borderRadius: '50%',
        background: 'var(--color-green-bg)', color: 'var(--color-green)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '10px', fontWeight: 600,
      }}>
        {rep.initials}
      </div>
      <span style={{ fontSize: '12px', color: 'var(--color-text)' }}>{rep.name}</span>
    </div>
  );
};

export const LeadsView = () => {
  const { user } = useAuth();
  console.log('user:', user);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page            = Number(searchParams.get('page'))     || 1;
  const search          = searchParams.get('search')           || '';
  const statusFilter    = (searchParams.get('status')          || 'todos') as StatusFilter;
  const zonaFilter      = searchParams.get('zona')             || '';
  const actividadFilter = searchParams.get('actividad')        || '';

  const setPage = (p: number) =>
    setSearchParams(prev => { prev.set('page', String(p)); return prev; });

  const setSearch = (v: string) =>
    setSearchParams(prev => { v ? prev.set('search', v) : prev.delete('search'); prev.set('page', '1'); return prev; });

  const setStatusFilter = (v: StatusFilter) =>
    setSearchParams(prev => { v !== 'todos' ? prev.set('status', v) : prev.delete('status'); prev.set('page', '1'); return prev; });

  const setZonaFilter = (v: string) =>
    setSearchParams(prev => { v ? prev.set('zona', v) : prev.delete('zona'); prev.set('page', '1'); return prev; });

  const setActividadFilter = (v: string) =>
    setSearchParams(prev => { v ? prev.set('actividad', v) : prev.delete('actividad'); prev.set('page', '1'); return prev; });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [representantes, setRepresentantes] = useState<Representante[]>([]);
  const [total, setTotal] = useState(0);
  const [assignTarget, setAssignTarget] = useState<Lead | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
      let cancelled = false;
      setIsFetching(true);
      Promise.all([
        leadsService.getPaginated({
          search:    search          || undefined,
          status:    statusFilter !== 'todos' ? statusFilter : undefined,
          zona:      zonaFilter      || undefined,
          actividad: actividadFilter || undefined,
        }, page),
        representantesService.getAll(),
      ]).then(([{ leads: newLeads, total }, reps]) => {
        if (cancelled) return;
        setLeads(newLeads);
        setTotal(total);
        setRepresentantes(reps);
        setIsFetching(false);
      });
      return () => { cancelled = true; };
    }, [user, page, search, statusFilter, zonaFilter, actividadFilter]);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const rangeStart = total === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const rangeEnd   = Math.min(page * ITEMS_PER_PAGE, total);

  const handleAssigned = (updated: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  const canAssign = user?.role === ROLES.supervisor;

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <p style={{ fontSize: '12px', color: 'var(--color-text-sec)', margin: 0 }}>
          {isFetching && leads.length === 0
            ? 'Cargando leads...'
            : total === 0
              ? '0 leads'
              : `Mostrando ${rangeStart}–${rangeEnd} de ${total.toLocaleString('es-AR')} leads`}
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
            background: 'var(--color-input-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '9px', color: 'var(--color-text)',
            padding: '9px 13px', fontSize: '13px', outline: 'none',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--color-green)'; e.target.style.background = 'var(--color-input-focus-bg)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.background = 'var(--color-input-bg)'; }}
        />
        <LeadsFilters
          zona={zonaFilter}
          actividad={actividadFilter}
          onChangeZona={setZonaFilter}
          onChangeActividad={setActividadFilter}
        />
        <StatusTabs value={statusFilter} onChange={setStatusFilter} />
      </div>

      <div style={{ opacity: isFetching ? 0.5 : 1, transition: 'opacity 0.15s' }}>
        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden', overflowX: "auto" }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed'}}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ ...TH, width: '45%' }}>Establecimiento</th>
                <th style={{ ...TH, width: '150px' }}>CUIT</th>
                <th style={{ ...TH, width: '140px' }}>Zona</th>
                <th style={{ ...TH, width: '220px' }}>Representante</th>
                <th style={{ ...TH, width: '120px' }}>Estado</th>
                {canAssign && <th style={{ ...TH, width: '110px' }} />}
              </tr>
            </thead>
            <tbody>
              {isFetching && leads.length === 0 ? (
                <tr><td colSpan={canAssign ? 7 : 6} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-sec)', fontSize: '13px' }}>Cargando...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={canAssign ? 7 : 6} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-sec)', fontSize: '13px' }}>No se encontraron leads con los filtros aplicados</td></tr>
              ) : (
                leads.map((lead, idx) => (
                  <tr
                    key={lead.id}
                    onClick={() => navigate(`/leads/${lead.id}?${searchParams.toString()}`)}
                    style={{
                      borderBottom: idx < leads.length - 1 ? '1px solid var(--color-border)' : 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-card-hover)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '12px 16px', overflow: 'hidden' }}>
                      <div style={{ fontSize: '13px', color: 'var(--color-text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {lead.razonSocial}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-sec)', marginTop: '2px' }}>
                        {lead.superficieHa.toLocaleString('es-AR')} ha
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--color-text-sec)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                        {`${lead.cuit.slice(0, 2)}-${lead.cuit.slice(2, 10)}-${lead.cuit.slice(10)}`}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--color-text-sec)', whiteSpace: 'nowrap' }}>{lead.zona}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <RepresentanteCell representanteId={lead.representanteId} representantes={representantes} />
                    </td>
                    <td style={{ padding: '12px 16px' }}><StatusBadge status={lead.status} /></td>
                    {canAssign && (
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setAssignTarget(lead); }}
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--color-border)',
                            borderRadius: '6px', color: 'var(--color-text-sec)',
                            padding: '4px 10px', fontSize: '11px',
                            cursor: 'pointer', whiteSpace: 'nowrap',
                            fontFamily: "'Inter', system-ui, sans-serif",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-green)'; e.currentTarget.style.color = 'var(--color-green)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-sec)'; }}
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
      </div>

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