import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../leads/components/StatusBadge';
import type { RecentLead } from '../data/mockDashboard';

interface RecentLeadsCardProps {
  leads: RecentLead[];
}

export const RecentLeadsCard = ({ leads }: RecentLeadsCardProps) => {
  const navigate = useNavigate();

  return (
    <div style={{
      background: '#172840',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '12px',
      padding: '18px 20px',
    }}>
      <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#f0f4f8', margin: '0 0 14px 0' }}>
        Leads recientes
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {leads.map((lead, idx) => (
          <div
            key={lead.id}
            onClick={() => navigate(`/leads/${lead.id}`)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: idx < leads.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#f0f4f8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {lead.razonSocial}
              </div>
              <div style={{ fontSize: '11px', color: '#7a9bbf', marginTop: '2px' }}>
                {lead.localidad} · {lead.cabezas} cab.
              </div>
            </div>
            <StatusBadge status={lead.status} />
          </div>
        ))}
      </div>
    </div>
  );
};
