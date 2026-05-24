import { KPICard } from '../components/KPICard';
import { RecentLeadsCard } from '../components/RecentLeadsCard';
import { TeamPerformanceCard } from '../components/TeamPerformanceCard';
import {
  MOCK_KPIS,
  MOCK_RECENT_LEADS,
  MOCK_TEAM_PERFORMANCE,
  GLOBAL_CONVERSION_RATE,
} from '../data/mockDashboard';

export const DashboardView = () => {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Subtítulo */}
      <p style={{ fontSize: '12px', color: '#7a9bbf', margin: '0 0 18px 0' }}>
        Resumen general del equipo comercial
      </p>

      {/* KPIs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        marginBottom: '18px',
      }}>
        {MOCK_KPIS.map((kpi) => <KPICard key={kpi.label} kpi={kpi} />)}
      </div>

      {/* 2 columnas: Recientes + Rendimiento */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '14px',
      }}>
        <RecentLeadsCard leads={MOCK_RECENT_LEADS} />
        <TeamPerformanceCard team={MOCK_TEAM_PERFORMANCE} globalRate={GLOBAL_CONVERSION_RATE} />
      </div>
    </div>
  );
};
