import type { LeadStatus } from '@leadfinder/shared/types/leads';

export const STATUS_CONFIG: Record<LeadStatus, { label: string; dot: string; text: string; bg: string }> = {
  lead:      { label: 'Lead',      dot: '#e05252', text: '#ff7b7b', bg: 'rgba(224,82,82,0.13)' },
  contacto:  { label: 'Contacto',  dot: '#e09a30', text: '#ffba55', bg: 'rgba(224,154,48,0.13)' },
  prospecto: { label: 'Prospecto', dot: '#3d8fe0', text: '#74b4ff', bg: 'rgba(61,143,224,0.13)' },
  cliente:   { label: 'Cliente',   dot: '#1aaa6e', text: '#2ecc8f', bg: 'rgba(26,170,110,0.13)' },
};

interface StatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge = ({ status, size = 'sm' }: StatusBadgeProps) => {
  const c = STATUS_CONFIG[status];
  const padding = size === 'md' ? '4px 12px' : '2px 8px';
  const fontSize = size === 'md' ? '12px' : '11px';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding, borderRadius: '20px',
      fontSize, fontWeight: 500,
      background: c.bg, color: c.text,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      {c.label}
    </span>
  );
};
