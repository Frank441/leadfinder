import type { LeadStatus } from '@leadfinder/shared/test';

export type StatusFilter = LeadStatus | 'todos';

interface StatusTabsProps {
  value: StatusFilter;
  onChange: (status: StatusFilter) => void;
}

const TABS: { value: StatusFilter; label: string; activeBg: string; activeColor: string }[] = [
  { value: 'todos',     label: 'Todos',     activeBg: '#1aaa6e',                   activeColor: '#fff' },
  { value: 'lead',      label: 'Lead',      activeBg: 'rgba(224,82,82,0.18)',      activeColor: '#ff7b7b' },
  { value: 'contacto',  label: 'Contacto',  activeBg: 'rgba(224,154,48,0.18)',     activeColor: '#ffba55' },
  { value: 'prospecto', label: 'Prospecto', activeBg: 'rgba(61,143,224,0.18)',     activeColor: '#74b4ff' },
  { value: 'cliente',   label: 'Cliente',   activeBg: 'rgba(26,170,110,0.18)',     activeColor: '#2ecc8f' },
];

export const StatusTabs = ({ value, onChange }: StatusTabsProps) => {
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {TABS.map((tab) => {
        const isActive = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: isActive ? tab.activeBg : 'transparent',
              color: isActive ? tab.activeColor : '#7a9bbf',
              fontSize: '12px',
              fontWeight: isActive ? 600 : 500,
              cursor: 'pointer',
              fontFamily: "'Inter', system-ui, sans-serif",
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
