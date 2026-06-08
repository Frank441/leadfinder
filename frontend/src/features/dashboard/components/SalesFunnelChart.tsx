import type { FunnelStage } from '../data/mockDashboard';
import { STATUS_CONFIG } from '../../leads/components/StatusBadge';

interface SalesFunnelChartProps {
  data: FunnelStage[];
}

/**
 * Embudo de ventas con barras horizontales (formato Salesforce/HubSpot).
 *
 * Cada etapa muestra:
 * - El nombre y la cantidad de leads
 * - Una barra cuyo ancho representa el % respecto al primer estado (Lead)
 * - El % de conversión desde la etapa anterior (drop-off)
 */
export const SalesFunnelChart = ({ data }: SalesFunnelChartProps) => {
  return (
    <div style={{
      background: '#172840',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '14px',
      padding: '20px 24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#f0f4f8', margin: 0 }}>
            Embudo de ventas
          </h2>
          <p style={{ fontSize: '11px', color: '#7a9bbf', margin: '4px 0 0 0' }}>
            Cuántos leads avanzan en cada etapa hasta convertirse en clientes
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {data.map((stage) => {
          const cfg = STATUS_CONFIG[stage.status];
          return (
            <div key={stage.status}>
              {/* Header de la fila: label + count + % */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '6px', fontSize: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '8px', height: '8px', borderRadius: '50%', background: cfg.dot,
                  }} />
                  <span style={{ color: '#f0f4f8', fontWeight: 500 }}>
                    {stage.label}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#f0f4f8', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    {stage.count.toLocaleString('es-AR')}
                  </span>
                  <span style={{ color: '#7a9bbf', fontVariantNumeric: 'tabular-nums', minWidth: '46px', textAlign: 'right' }}>
                    {stage.pctOfTotal.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Barra */}
              <div style={{
                height: '14px',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '7px',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <div style={{
                  height: '100%',
                  width: `${stage.pctOfTotal}%`,
                  background: `linear-gradient(90deg, ${cfg.dot}, ${cfg.text})`,
                  borderRadius: '7px',
                  transition: 'width 0.4s ease',
                }} />
              </div>

              {/* Conversion rate desde la etapa anterior */}
              {stage.pctFromPrev !== null && (
                <div style={{
                  marginTop: '4px',
                  fontSize: '10px',
                  color: '#7a9bbf',
                  fontStyle: 'italic',
                }}>
                  ↳ Avanzaron el {stage.pctFromPrev.toFixed(1)}% desde la etapa anterior
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
