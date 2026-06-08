import { useState } from 'react';
import { KPIHeroCard } from '../components/KPIHeroCard';
import { PeriodSelector } from '../components/PeriodSelector';
import { SalesFunnelChart } from '../components/SalesFunnelChart';
import { StatusDistributionDonut } from '../components/StatusDistributionDonut';
import { ZoneBarChart } from '../components/ZoneBarChart';
import { TeamPerformanceCard } from '../components/TeamPerformanceCard';
import {
  getKPIs,
  getFunnel,
  getStatusDistribution,
  getZoneStats,
  getTeam,
  getGlobalConversionRate,
} from '../data/mockDashboard';
import type { Period } from '../data/mockDashboard';

export const DashboardView = () => {
  const [period, setPeriod] = useState<Period>('mes');

  const kpis = getKPIs(period);
  const funnel = getFunnel(period);
  const distribution = getStatusDistribution(period);
  const zones = getZoneStats(period);
  const team = getTeam(period);
  const globalRate = getGlobalConversionRate(period);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header con subtitulo + selector temporal */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '12px', flexWrap: 'wrap', marginBottom: '20px',
      }}>
        <p style={{ fontSize: '12px', color: '#7a9bbf', margin: 0 }}>
          Resumen general del equipo comercial
        </p>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* SECCION 1: KPIs hero
          Grid: 1 KPI estrella (hero) ocupa mas espacio que los otros 3 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        marginBottom: '16px',
      }}>
        <KPIHeroCard label="Total de leads"     data={kpis.totalLeads}     format="number"     accent="blue" />
        <KPIHeroCard label="Tasa de conversión" data={kpis.tasaConversion} format="percentage" accent="green" hero />
        <KPIHeroCard label="En negociación"     data={kpis.pipelineActivo} format="number"     accent="orange" />
        <KPIHeroCard label="Clientes nuevos"    data={kpis.clientesNuevos} format="number"     accent="green" />
      </div>

      {/* SECCION 2: Embudo de ventas (full width) */}
      <div style={{ marginBottom: '16px' }}>
        <SalesFunnelChart data={funnel} />
      </div>

      {/* SECCION 3: Ranking del equipo + Distribucion del pipeline */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '14px',
        marginBottom: '16px',
        alignItems: 'stretch',
      }}>
        <TeamPerformanceCard team={team} globalRate={globalRate} />
        <StatusDistributionDonut data={distribution} />
      </div>

      {/* SECCION 4: Distribucion por zona */}
      <ZoneBarChart data={zones} />
    </div>
  );
};
