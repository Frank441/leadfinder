import { useState } from 'react';
import type { VisitNote } from '@leadfinder/shared/types/leads';

interface VisitNotesSectionProps {
  notes: VisitNote[];
  onAdd: (content: string) => Promise<void>;
  canAdd: boolean;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const VisitNotesSection = ({ notes, onAdd, canAdd }: VisitNotesSectionProps) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSaving) return;
    setIsSaving(true);
    try {
      await onAdd(content.trim());
      setContent('');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{
      background: '#172840',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '12px',
      padding: '18px 20px',
    }}>
      <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#f0f4f8', margin: '0 0 14px 0' }}>
        Notas de visita
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notes.length === 0 ? (
          <p style={{ fontSize: '12px', color: '#7a9bbf', margin: 0, fontStyle: 'italic' }}>
            Todavía no hay notas registradas para este lead.
          </p>
        ) : (
          notes.map((note) => (
            <div key={note.id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '9px',
              padding: '10px 13px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#f0f4f8' }}>{note.userName}</span>
                <span style={{ fontSize: '11px', color: '#3d5a73' }}>·</span>
                <span style={{ fontSize: '11px', color: '#7a9bbf' }}>{formatDate(note.date)}</span>
              </div>
              <p style={{ fontSize: '13px', color: '#f0f4f8', margin: 0, lineHeight: 1.5 }}>
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>

      {canAdd && (
        <form onSubmit={handleSubmit} style={{ marginTop: '14px' }}>
          <textarea
            placeholder="Agregar nueva nota..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '9px',
              color: '#f0f4f8',
              padding: '10px 13px',
              fontSize: '13px',
              outline: 'none',
              resize: 'vertical',
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
            onFocus={(e) => { e.target.style.borderColor = '#1aaa6e'; e.target.style.background = 'rgba(26,170,110,0.06)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              type="submit"
              disabled={!content.trim() || isSaving}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                background: (!content.trim() || isSaving) ? '#0f7d50' : '#1aaa6e',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: (!content.trim() || isSaving) ? 'not-allowed' : 'pointer',
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              {isSaving ? 'Guardando...' : 'Guardar nota'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
