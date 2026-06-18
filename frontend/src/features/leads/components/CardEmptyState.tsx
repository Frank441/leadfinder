interface CardEmptyStateProps {
  /** Nombre del organismo (ej. "SENASA", "ARCA", "BCRA") */
  source: string;
}

/**
 * Mensaje de fallback que se muestra cuando la integracion con un organismo externo
 * (SENASA, ARCA, BCRA) no devuelve datos o falla.
 *
 * Cumple el criterio de US13b/c/d: "Si la API falla, se muestra un mensaje
 * 'Información no disponible'".
 */
export const CardEmptyState = ({ source }: CardEmptyStateProps) => {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '20px 10px',
      textAlign: 'center',
      gap: '8px',
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        background: 'rgba(122,155,191,0.08)',
        border: '1px solid rgba(122,155,191,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#7a9bbf', fontSize: '18px', fontWeight: 700,
      }}>
        ⓘ
      </div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#f0f4f8' }}>
        Información no disponible
      </div>
      <div style={{ fontSize: '11px', color: '#7a9bbf', maxWidth: '210px', lineHeight: 1.4 }}>
        No se pudieron obtener los datos de {source} para este CUIT.
      </div>
    </div>
  );
};
