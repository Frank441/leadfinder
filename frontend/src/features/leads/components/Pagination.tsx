interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Calcula que paginas mostrar en la barra.
 * Si hay <= 7 paginas, las muestra todas. Si hay mas, usa elipsis: 1 ... 4 5 6 ... 20
 */
const getPagesToShow = (current: number, total: number): (number | 'dots')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | 'dots')[] = [1];
  if (current > 3) pages.push('dots');

  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);
  for (let p = start; p <= end; p++) pages.push(p);

  if (current < total - 2) pages.push('dots');
  pages.push(total);
  return pages;
};

const baseBtn: React.CSSProperties = {
  minWidth: '32px',
  height: '30px',
  padding: '0 10px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.07)',
  background: 'transparent',
  color: '#7a9bbf',
  fontSize: '12px',
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'all 0.15s',
};

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = getPagesToShow(currentPage, totalPages);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '4px', marginTop: '16px', flexWrap: 'wrap',
    }}>
      <button
        type="button"
        onClick={() => canPrev && onPageChange(currentPage - 1)}
        disabled={!canPrev}
        style={{
          ...baseBtn,
          opacity: canPrev ? 1 : 0.4,
          cursor: canPrev ? 'pointer' : 'not-allowed',
        }}
      >
        ← Anterior
      </button>

      {pages.map((p, idx) => {
        if (p === 'dots') {
          return (
            <span key={`dots-${idx}`} style={{ color: '#3d5a73', fontSize: '12px', padding: '0 4px' }}>
              ...
            </span>
          );
        }
        const isActive = p === currentPage;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            style={{
              ...baseBtn,
              background: isActive ? '#1aaa6e' : 'transparent',
              borderColor: isActive ? '#1aaa6e' : 'rgba(255,255,255,0.07)',
              color: isActive ? '#fff' : '#7a9bbf',
              fontWeight: isActive ? 600 : 500,
            }}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => canNext && onPageChange(currentPage + 1)}
        disabled={!canNext}
        style={{
          ...baseBtn,
          opacity: canNext ? 1 : 0.4,
          cursor: canNext ? 'pointer' : 'not-allowed',
        }}
      >
        Siguiente →
      </button>
    </div>
  );
};
