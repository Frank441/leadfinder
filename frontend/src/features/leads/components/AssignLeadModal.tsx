import { useEffect, useState } from 'react';
import type { Lead, Representante } from '@leadfinder/shared/types/leads';
import { leadsService } from '../services/leadsService';
import { representantesService } from '../services/representantesService';

interface AssignLeadModalProps {
  lead: Lead;
  onClose: () => void;
  onAssigned: (updated: Lead) => void;
}

export const AssignLeadModal = ({ lead, onClose, onAssigned }: AssignLeadModalProps) => {
  const [representantes, setRepresentantes] = useState<Representante[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(lead.representanteId);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    representantesService.getAll().then(setRepresentantes).catch(console.error);
  }, []);

  const handleConfirm = async () => {
    setIsSaving(true);
    try {
      const updated = await leadsService.assign(lead.id, selectedId);
      onAssigned(updated);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const isReassign = lead.representanteId !== null;
  const currentRep = representantes.find((r) => r.id === lead.representanteId);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '440px', margin: '0 16px',
          background: 'var(--color-card)',
          borderRadius: '14px',
          border: '1px solid var(--color-border)',
          padding: '24px',
        }}
      >
        <div style={{ marginBottom: '4px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
            {isReassign ? 'Reasignar lead' : 'Asignar lead'}
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--color-text-sec)', margin: '4px 0 0 0' }}>
            {lead.razonSocial}
          </p>
        </div>

        {isReassign && currentRep && (
          <div style={{
            marginTop: '14px',
            padding: '10px 12px',
            background: 'var(--color-card-hover)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            fontSize: '12px', color: 'var(--color-text-sec)',
          }}>
            Actualmente asignado a <strong style={{ color: 'var(--color-text)', fontWeight: 600 }}>{currentRep.name}</strong>
          </div>
        )}

        <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {representantes.map((rep) => {
            const isSelected = selectedId === rep.id;
            return (
              <button
                key={rep.id}
                type="button"
                onClick={() => setSelectedId(rep.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '9px',
                  border: `1px solid ${isSelected ? 'var(--color-green)' : 'var(--color-border)'}`,
                  background: isSelected ? 'var(--color-green-bg)' : 'transparent',
                  color: 'var(--color-text)', fontSize: '13px', cursor: 'pointer', textAlign: 'left',
                  fontFamily: "'Inter', system-ui, sans-serif",
                  transition: 'border-color 0.15s, background 0.15s',
                }}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: isSelected ? 'var(--color-green)' : 'var(--color-border-strong)',
                  color: isSelected ? '#fff' : 'var(--color-text-sec)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 600, flexShrink: 0,
                }}>
                  {rep.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{rep.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-sec)', marginTop: '2px' }}>{rep.email}</div>
                </div>
                {isSelected && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1aaa6e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {isReassign && (
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            style={{
              marginTop: '10px', padding: '8px 12px', borderRadius: '8px',
              border: '1px solid rgba(224,82,82,0.3)',
              background: selectedId === null ? 'rgba(224,82,82,0.08)' : 'transparent',
              color: '#ff7b7b', fontSize: '12px', cursor: 'pointer', width: '100%',
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            Quitar asignación
          </button>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} disabled={isSaving}
            style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-sec)', fontSize: '12px', fontWeight: 500, cursor: isSaving ? 'not-allowed' : 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}>
            Cancelar
          </button>
          <button type="button" onClick={handleConfirm}
            disabled={isSaving || selectedId === lead.representanteId}
            style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', background: (isSaving || selectedId === lead.representanteId) ? '#0f7d50' : 'var(--color-green)', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: (isSaving || selectedId === lead.representanteId) ? 'not-allowed' : 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}>
            {isSaving ? 'Guardando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};
