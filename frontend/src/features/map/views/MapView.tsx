export const MapView = () => {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '60px 20px', textAlign: 'center', fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{
        width: '60px', height: '60px', borderRadius: '50%',
        background: 'rgba(26,170,110,0.1)',
        border: '1px solid rgba(26,170,110,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '14px',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1aaa6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
      </div>
      <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#f0f4f8', margin: '0 0 6px 0' }}>
        Mapa de leads
      </h2>
      <p style={{ fontSize: '13px', color: '#7a9bbf', margin: 0, maxWidth: '380px' }}>
        Disponible en el Sprint 2 — en desarrollo por otro miembro del equipo (US09).
      </p>
    </div>
  );
};
