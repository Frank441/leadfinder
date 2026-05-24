import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lead } from '@leadfinder/shared/test';
import { useAuth } from '../../../context/AuthContext';
import { leadsService } from '../services/leadsService';
import { MOCK_REPRESENTANTES } from '../data/mockRepresentantes';
import { StatusBadge } from '../components/StatusBadge';
import { ScoreBadge } from '../components/ScoreBadge';
import { StatusTabs } from '../components/StatusTabs';
import type { StatusFilter } from '../components/StatusTabs';
import { LeadsFilters } from '../components/LeadsFilters';
import { AssignLeadModal } from '../components/AssignLeadModal';

const TH: React.CSSProperties = {
  padding: '11px 16px', textAlign: 'left',
  fontSize: '10px', fontWeight: 600,
  letterSpacing: '0.06em', textTransform: 'uppercase',
  color: '#3d5a73', whiteSpace: 'nowrap',
};

const RepresentanteCell = ({ representanteId }: { representanteId: string | null }) => {
  const rep = representanteId ? MOCK_REPRESENTANTES.find((r) => r.id === representanteId) : null;
  if (!rep) {
    return (
      <span style={{ color: '#3d5a73', fontStyle: 'italic', fontSize: '12px' }}>
        Sin asignar
      </span>
    );
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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [zonaFilter, setZonaFilter] = useState('');
  const [actividadFilter, setActividadFilter] = useState('');
  const [assignTarget, setAssignTarget] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Reload leads cuando cambia el usuario.
  // Si es representante, sólo ve los leads asignados a él (matching por user.id).
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    leadsService.getAll().then((data) => {
      if (cancelled) return;
      const filtered = user?.role === 'representante'
        ? data.filter((l) => l.representanteId === user.id)
        : data;
      setLeads(filtered);
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, [user]);

  // Aplicar filtros locales sobre el dataset (búsqueda + status + zona + actividad)
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

  const handleAssigned = (updated: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  const canAssign = user?.role === 'supervisor';

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Subtítulo + acciones */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <p style={{ fontSize: '12px', color: '#7a9bbf', margin: 0 }}>
          {filtered.length} {filtered.length === 1 ? 'lead' : 'leads'} en total
        </p>
        <button style={{
          background: 'rgba(26,170,110,0.15)',
          border: '1px solid rgba(26,170,110,0.4)',
          color: '#1aaa6e',
          borderRadius: '8px',
          padding: '6px 14px',
          fontSize: '12px',
          fontWeight: 500,
          cursor: 'pointer',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          + Nuevo Lead
        </button>
      </div>

      {/* Búsqueda + filtros + tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
        <input
          type="text"
          placeholder="Buscar por nombre o CUIT..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: '1 1 260px',
            minWidth: '220px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '9px',
            color: '#f0f4f8',
            padding: '9px 13px',
            fontSize: '13px',
            outline: 'none',
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

      {/* Tabla */}
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
            ) : filtered.length === 0 ? (
              <tr><td colSpan={canAssign ? 7 : 6} style={{ padding: '40px', textAlign: 'center', color: '#7a9bbf', fontSize: '13px' }}>No se encontraron leads con los filtros aplicados</td></tr>
            ) : (
              filtered.map((lead, idx) => (
                <tr
                  key={lead.id}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  style={{
                    borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: '13px', color: '#f0f4f8', fontWeight: 500 }}>{lead.razonSocial}</div>
                    <div style={{ fontSize: '11px', color: '#7a9bbf', marginTop: '2px' }}>
                      {lead.cabezas} cab. · {lead.superficieHa.toLocaleString('es-AR')} ha
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#7a9bbf', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{lead.cuit}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#7a9bbf', whiteSpace: 'nowrap' }}>{lead.zona}</td>
                  <td style={{ padding: '12px 16px' }}><RepresentanteCell representanteId={lead.representanteId} /></td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge status={lead.status} /></td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}><ScoreBadge score={lead.score} /></td>
                  {canAssign && (
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setAssignTarget(lead); }}
                        style={{
                          background: 'transparent',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: '6px',
                          color: '#7a9bbf',
                          padding: '4px 10px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
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
