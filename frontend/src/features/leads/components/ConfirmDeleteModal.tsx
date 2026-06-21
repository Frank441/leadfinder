import { useState } from 'react';

interface ConfirmDeleteModalProps {
  onConfirm: () => Promise<void>;
  onClose:   () => void;
}

export const ConfirmDeleteModal = ({ onConfirm, onClose }: ConfirmDeleteModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)',
    }}>
      <div style={{
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '14px',
        padding: '28px 28px 24px',
        width: '100%', maxWidth: '380px',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 8px 0' }}>
          ¿Eliminar nota?
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--color-text-sec)', margin: '0 0 24px 0', lineHeight: 1.5 }}>
          Esta acción no se puede deshacer. La nota será eliminada permanentemente.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            disabled={isDeleting}
            style={{
              padding: '8px 18px', borderRadius: '8px',
              border: '1px solid var(--color-border)',
              background: 'transparent', color: 'var(--color-text-sec)',
              fontSize: '13px', cursor: isDeleting ? 'not-allowed' : 'pointer',
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            style={{
              padding: '8px 18px', borderRadius: '8px', border: 'none',
              background: isDeleting ? '#a01e2a' : '#dc3545',
              color: '#fff', fontSize: '13px', fontWeight: 600,
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};