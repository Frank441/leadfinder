import { useState } from 'react';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';  
import type { VisitNote } from '@leadfinder/shared/types/leads';

interface VisitNotesSectionProps {
  notes: VisitNote[];
  onAdd:    (content: string) => Promise<void>;
  onEdit:   (noteId: string, content: string) => Promise<void>;
  onDelete: (noteId: string) => Promise<void>;
  canManageNotes?: boolean;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const IconButton = ({
  onClick, title, children, danger = false,
}: {
  onClick: () => void; title: string; children: React.ReactNode; danger?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '26px', height: '26px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hovered
          ? danger ? 'rgba(220,53,69,0.15)' : 'var(--color-border)'
          : 'var(--color-card-hover)',
        border: `1px solid ${hovered ? (danger ? 'rgba(220,53,69,0.5)' : 'rgba(255,255,255,0.15)') : 'var(--color-input-bg)'}`,
        borderRadius: '6px',
        cursor: 'pointer',
        color: hovered ? (danger ? '#dc3545' : 'var(--color-text)') : 'var(--color-text-sec)',
        fontSize: '12px',
        transition: 'all 0.15s',
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
};

export const VisitNotesSection = ({ notes, onAdd, onEdit, onDelete, canManageNotes }: VisitNotesSectionProps) => {
  const [content, setContent]       = useState('');
  const [isSaving, setIsSaving]     = useState(false);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

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

  const handleEditSubmit = async (noteId: string) => {
    if (!editContent.trim()) return;
    setIsSaving(true);
    try {
      await onEdit(noteId, editContent.trim());
      setEditingId(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    setDeletingId(noteId);
    try {
      await onDelete(noteId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{
      background: 'var(--color-card)',
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      padding: '18px 20px',
    }}>
      <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 14px 0' }}>
        Notas de visita
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notes.length === 0 ? (
          <p style={{ fontSize: '12px', color: 'var(--color-text-sec)', margin: 0, fontStyle: 'italic' }}>
            Todavía no hay notas registradas para este lead.
          </p>
        ) : (
          notes.map((note) => (
            <div key={note.id} style={{
              background: 'var(--color-card-hover)',
              border: '1px solid var(--color-input-bg)',
              borderRadius: '9px',
              padding: '10px 13px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}>

              {/* Note content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text)' }}>{note.userName}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>·</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-sec)' }}>{formatDate(note.date)}</span>
                </div>

                {editingId === note.id ? (
                  <div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      style={{
                        width: '100%',
                        background: 'var(--color-input-bg)',
                        border: '1px solid #1aaa6e',
                        borderRadius: '9px',
                        color: 'var(--color-text)',
                        padding: '10px 13px',
                        fontSize: '13px',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: "'Inter', system-ui, sans-serif",
                        boxSizing: 'border-box',
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{
                          padding: '6px 14px', borderRadius: '7px',
                          border: '1px solid var(--color-border)',
                          background: 'transparent', color: 'var(--color-text-sec)',
                          fontSize: '12px', cursor: 'pointer',
                          fontFamily: "'Inter', system-ui, sans-serif",
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleEditSubmit(note.id)}
                        disabled={!editContent.trim() || isSaving}
                        style={{
                          padding: '6px 14px', borderRadius: '7px',
                          border: 'none',
                          background: (!editContent.trim() || isSaving) ? '#0f7d50' : 'var(--color-green)',
                          color: '#fff', fontSize: '12px', fontWeight: 600,
                          cursor: (!editContent.trim() || isSaving) ? 'not-allowed' : 'pointer',
                          fontFamily: "'Inter', system-ui, sans-serif",
                        }}
                      >
                        {isSaving ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--color-text)', margin: 0, lineHeight: 1.5 }}>
                    {note.content}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              {canManageNotes && editingId !== note.id && (
                <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', paddingTop: '2px' }}>
                  <IconButton
                    title="Editar nota"
                    onClick={() => {
                      setEditingId(note.id);
                      setEditContent(note.content);
                    }}
                  >
                    ✏️
                  </IconButton>
                  <IconButton
                    title="Eliminar nota"
                    danger
                    onClick={() => setPendingDeleteId(note.id)}
                  >
                    {deletingId === note.id ? '...' : '🗑️'}
                  </IconButton>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {canManageNotes && (
        <form onSubmit={handleSubmit} style={{ marginTop: '14px' }}>
          <textarea
            placeholder="Agregar nueva nota..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              background: 'var(--color-input-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: '9px',
              color: 'var(--color-text)',
              padding: '10px 13px',
              fontSize: '13px',
              outline: 'none',
              resize: 'vertical',
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-green)'; e.target.style.background = 'var(--color-input-focus-bg)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.background = 'var(--color-input-bg)'; }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              type="submit"
              disabled={!content.trim() || isSaving}
              style={{
                padding: '8px 18px', borderRadius: '8px', border: 'none',
                background: (!content.trim() || isSaving) ? '#0f7d50' : 'var(--color-green)',
                color: '#fff', fontSize: '12px', fontWeight: 600,
                cursor: (!content.trim() || isSaving) ? 'not-allowed' : 'pointer',
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              {isSaving ? 'Guardando...' : 'Guardar nota'}
            </button>
          </div>
        </form>
      )}

      {pendingDeleteId && (
        <ConfirmDeleteModal
          onConfirm={() => handleDelete(pendingDeleteId)}
          onClose={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  );
};