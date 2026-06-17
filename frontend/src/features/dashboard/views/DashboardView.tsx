import { useEffect, useState } from 'react';
import { KPIHeroCard } from '../components/KPIHeroCard';
import { PeriodSelector } from '../components/PeriodSelector';
import { SalesFunnelChart } from '../components/SalesFunnelChart';
import { StatusDistributionDonut } from '../components/StatusDistributionDonut';
import { ZoneBarChart } from '../components/ZoneBarChart';
import { TeamPerformanceCard } from '../components/TeamPerformanceCard';
import { dashboardService } from '../services/dashboardService';
import type { Period, DashboardData } from '../types';

export const DashboardView = () => {
  const [period, setPeriod] = useState<Period>('mes');
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    dashboardService.getDashboard(period)
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando dashboard:', err);
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'No se pudo cargar el dashboard.');
        setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [period]);

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

      {error && (
        <div style={{
          background: 'rgba(224,82,82,0.12)',
          border: '1px solid rgba(224,82,82,0.3)',
          borderRadius: '12px',
          padding: '14px 18px',
          color: '#ff7b7b',
          fontSize: '13px',
          marginBottom: '16px',
        }}>
          {error}
        </div>
      )}

      {isLoading && !data ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          color: '#7a9bbf',
          fontSize: '13px',
        }}>
          Cargando datos...
        </div>
      ) : data ? (
        <div style={{ opacity: isLoading ? 0.55 : 1, transition: 'opacity 0.15s' }}>
          {/* SECCION 1: KPIs hero */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
            marginBottom: '16px',
          }}>
            <KPIHeroCard label="Total de leads"     data={data.kpis.totalLeads}     format="number"     accent="blue" />
            <KPIHeroCard label="Tasa de conversión" data={data.kpis.tasaConversion} format="percentage" accent="green" hero />
            <KPIHeroCard label="En negociación"     data={data.kpis.pipelineActivo} format="number"     accent="orange" />
            <KPIHeroCard label="Clientes nuevos"    data={data.kpis.clientesNuevos} format="number"     accent="green" />
          </div>

          {/* SECCION 2: Embudo de ventas */}
          <div style={{ marginBottom: '16px' }}>
            <SalesFunnelChart data={data.funnel} />
          </div>

          {/* SECCION 3: Ranking del equipo + Distribucion del pipeline */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '14px',
            marginBottom: '16px',
            alignItems: 'stretch',
          }}>
            <TeamPerformanceCard team={data.team} globalRate={data.globalConversion} />
            <StatusDistributionDonut data={data.distribution} />
          </div>

          {/* SECCION 4: Distribucion por zona */}
          <ZoneBarChart data={data.zones} />
        </div>
      ) : null}
    </div>
  );
};
