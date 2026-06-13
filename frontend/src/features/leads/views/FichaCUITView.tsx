import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Lead, LeadStatus } from '@leadfinder/shared/types/leads';
import { ROLES } from "@leadfinder/shared/types/user";
import { useAuth } from '../../../context/AuthContext';
import { leadsService } from '../services/leadsService';
import { representantesService } from '../services/representantesService';
import type { Representante } from '@leadfinder/shared/types/leads';
import { StatusBadge } from '../components/StatusBadge';
import { StateChangeButtons } from '../components/StateChangeButtons';
import { VisitNotesSection } from '../components/VisitNotesSection';
import { SenasaCard } from '../components/SenasaCard';
import { ArcaCard } from '../components/ArcaCard';
import { BcraCard } from '../components/BcraCard';

export const FichaCUITView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lead, setLead] = useState<Lead | null>(null);
  const [representantes, setRepresentantes] = useState<Representante[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setIsLoading(true);
    Promise.all([leadsService.getById(id), representantesService.getAll()]).then(([result, reps]) => {
      if (cancelled) return;
      if (!result) setNotFound(true);
      else setLead(result);
      setRepresentantes(reps);
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, [id]);

  const handleStatusChange = async (status: LeadStatus) => {
    if (!lead) return;
    const updated = await leadsService.updateStatus(lead.id, status);
    setLead(updated);
  };

  const handleAddNote = async (content: string) => {
    if (!lead || !user) return;
    await leadsService.addNote(lead.id, content);
    const updated = await leadsService.getById(lead.id);
    if (updated) setLead(updated);
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#7a9bbf', fontSize: '13px', fontFamily: "'Inter', system-ui, sans-serif" }}>
        Cargando ficha...
      </div>
    );
  }

  if (notFound || !lead) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Inter', system-ui, sans-serif" }}>
        <p style={{ fontSize: '14px', color: '#f0f4f8', marginBottom: '12px' }}>No se encontró el lead solicitado.</p>
        <button
          onClick={() => navigate('/leads')}
          style={{
            background: 'rgba(26,170,110,0.15)', border: '1px solid rgba(26,170,110,0.4)',
            color: '#1aaa6e', borderRadius: '8px', padding: '6px 14px', fontSize: '12px',
            cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          ← Volver al listado
        </button>
      </div>
    );
  }

  const rep = lead.representanteId ? representantes.find((r) => r.id === lead.representanteId) : null;

  // Permisos por rol (US11 + US14):
  // - Notas: solo el representante deja constancia de visitas.
  // - Cambio de estado: la habilitacion fina vive dentro de StateChangeButtons.
  const canAddNote = user?.role === ROLES.representante;

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Volver */}
      <button
        onClick={() => navigate('/leads')}
        style={{
          background: 'transparent', border: 'none',
          color: '#7a9bbf', fontSize: '12px', cursor: 'pointer',
          marginBottom: '14px', padding: 0,
          fontFamily: "'Inter', system-ui, sans-serif",
          display: 'flex', alignItems: 'center', gap: '6px',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#f0f4f8'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#7a9bbf'; }}
      >
        ← Volver al listado
      </button>

      {/* Header */}
      <div style={{
        background: '#172840',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        padding: '20px 22px',
        marginBottom: '18px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '20px',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', color: '#a8bdd4', textTransform: 'uppercase', marginBottom: '6px' }}>
            CUIT {lead.cuit}
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#f0f4f8', margin: '0 0 12px 0' }}>
            {lead.razonSocial}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <StatusBadge status={lead.status} size="md" />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#7a9bbf' }}>
              📍 {lead.localidad}, {lead.provincia}
            </span>
            {rep ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#7a9bbf' }}>
                👤 {rep.name}
              </span>
            ) : (
              <span style={{ fontSize: '12px', color: '#3d5a73', fontStyle: 'italic' }}>
                Sin representante asignado
              </span>
            )}
          </div>
        </div>

        {/* Score */}
        <div style={{
          padding: '14px 20px',
          background: 'rgba(26,170,110,0.08)',
          border: '1px solid rgba(26,170,110,0.3)',
          borderRadius: '10px',
          textAlign: 'center',
          minWidth: '110px',
        }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#2ecc8f', lineHeight: 1 }}>
            {lead.score}
          </div>
          <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.04em', color: '#7a9bbf', textTransform: 'uppercase', marginTop: '4px' }}>
            Score viabilidad
          </div>
        </div>
      </div>

      {/* Cambio de estado (US11 + US14) */}
      <div style={{ marginBottom: '18px' }}>
        <StateChangeButtons
          current={lead.status}
          onChange={handleStatusChange}
          userRole={user?.role}
        />
      </div>

      {/* Cards externas (US13b/c/d - shell visual) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '18px' }}>
        <SenasaCard data={lead.senasa} />
        <ArcaCard   data={lead.arca}   />
        <BcraCard   data={lead.bcra}   />
      </div>

      {/* Notas de visita (US12) */}
      <VisitNotesSection notes={lead.notes} onAdd={handleAddNote} canAdd={canAddNote} />
    </div>
  );
};
