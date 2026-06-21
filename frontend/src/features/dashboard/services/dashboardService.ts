import type {
  StatsPeriod,
  FunnelStage as BackendFunnelStage,
  RepresentanteRanking,
  StatusCount,
  ZoneCount,
} from '@leadfinder/shared/types/stats';
import type { LeadStatus } from '@leadfinder/shared/types/leads';
import { apiFetch } from '../../../lib/api';
import type {
  Period,
  DashboardData,
  FunnelStage,
  StatusSlice,
  RepPerformance,
  ZoneStat,
} from '../types';

/**
 * Adapta el lenguaje de período de la UI al que espera el backend.
 */
const toBackendPeriod = (period: Period): StatsPeriod => ({
  mes:       'month',
  trimestre: 'quarter',
  anio:      'year',
}[period] as StatsPeriod);

/**
 * El backend devuelve los estados con mayúscula inicial ("Lead", "Contacto"...).
 * El frontend usa lowercase. Esta función mapea de forma segura.
 * Si el string no matchea, devuelve null para que la fila se descarte.
 */
const toLeadStatus = (s: string): LeadStatus | null => {
  const v = s.trim().toLowerCase();
  if (v === 'lead' || v === 'contacto' || v === 'prospecto' || v === 'cliente') return v;
  return null;
};

const STATUS_LABEL: Record<LeadStatus, string> = {
  lead:      'Lead',
  contacto:  'Contacto',
  prospecto: 'Prospecto',
  cliente:   'Cliente',
};

/**
 * Calcula las iniciales de un nombre completo (ej. "Ana Rodríguez" -> "AR").
 */
const buildInitials = (name: string): string => {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
};

// ─────────────────────────────────────────────
// ADAPTERS de respuestas del backend a los tipos del feature
// ─────────────────────────────────────────────

/**
 * El embudo necesita pctOfTotal y pctFromPrev, que el backend no devuelve.
 * Los calculamos acá usando el orden Lead → Contacto → Prospecto → Cliente.
 *
 * pctOfTotal: porcentaje sobre la suma de TODOS los estados.
 * Esto refleja la composicion real del pipeline (ej. Lead = 99.7% si casi todos
 * los leads estan sin contactar). No usamos el count del primer estado como base
 * porque el backend devuelve snapshot actual, no datos historicos acumulados.
 */
const adaptFunnel = (raw: BackendFunnelStage[]): FunnelStage[] => {
  // Mapeamos a un dict para garantizar el orden y manejar estados faltantes
  const byStatus = new Map<LeadStatus, number>();
  for (const r of raw) {
    const s = toLeadStatus(r.status);
    if (s) byStatus.set(s, (byStatus.get(s) ?? 0) + r.count);
  }

  const ORDER: LeadStatus[] = ['lead', 'contacto', 'prospecto', 'cliente'];
  const total = Array.from(byStatus.values()).reduce((sum, n) => sum + n, 0);
  let prevCount: number | null = null;

  return ORDER.map((status) => {
    const count = byStatus.get(status) ?? 0;
    const pctOfTotal = total === 0 ? 0 : (count / total) * 100;
    const pctFromPrev = prevCount === null || prevCount === 0 ? null : (count / prevCount) * 100;
    prevCount = count;
    return { status, label: STATUS_LABEL[status], count, pctOfTotal, pctFromPrev };
  });
};

const adaptStatusBreakdown = (raw: StatusCount[]): StatusSlice[] => {
  const out: StatusSlice[] = [];
  for (const r of raw) {
    const s = toLeadStatus(r.status);
    if (s) out.push({ status: s, label: STATUS_LABEL[s], count: r.count });
  }
  return out;
};

const adaptTeamRanking = (raw: RepresentanteRanking[]): RepPerformance[] => {
  return raw.map((r) => ({
    id:              r.representanteId,
    name:            r.name,
    initials:        buildInitials(r.name),
    leads:           r.assignedLeads,
    conversiones:    r.convertedLeads,
    tasaConversion:  r.conversionRate,
  }));
};

const adaptZones = (raw: ZoneCount[]): ZoneStat[] => {
  const total = raw.reduce((acc, z) => acc + z.count, 0);
  return raw
    .map((z) => ({
      zona:  z.zone,
      leads: z.count,
      pct:   total === 0 ? 0 : (z.count / total) * 100,
    }))
    .sort((a, b) => b.leads - a.leads);
};

// ─────────────────────────────────────────────
// LLAMADAS A LA API
// ─────────────────────────────────────────────

const get = <T>(path: string, period: StatsPeriod): Promise<T> =>
  apiFetch<T>(`/api/v1/stats/${path}?period=${period}`);

const PERIOD_LABELS_DELTA: Record<Period, string> = {
  mes:       'vs mes anterior',
  trimestre: 'vs trimestre anterior',
  anio:      'vs año anterior',
};

export const dashboardService = {
  /**
   * Trae todos los datos del dashboard ejecutivo para el período indicado.
   * Las 8 llamadas se hacen en paralelo para mantener el tiempo total bajo.
   *
   * Nota sobre los deltas:
   * El backend NO expone aún un parámetro para "período anterior".
   * Por eso `delta` y `deltaLabel` quedan undefined y los componentes
   * los esconden. Cuando el backend lo soporte, alcanza con sumar las
   * llamadas al período previo y calcular acá el cambio porcentual.
   */
  async getDashboard(period: Period): Promise<DashboardData> {
    const p = toBackendPeriod(period);

    const [
      totalLeadsRes,
      conversionRateRes,
      inNegotiationRes,
      newClientsRes,
      funnelRes,
      teamRes,
      breakdownRes,
      zonesRes,
    ] = await Promise.all([
      get<{ totalLeads: number }>('total-leads',         p),
      get<{ conversionRate: number }>('conversion-rate', p),
      get<{ inNegotiation: number }>('in-negotiation',   p),
      get<{ newClients: number }>('new-clients',         p),
      get<BackendFunnelStage[]>('sales-funnel',          p),
      get<RepresentanteRanking[]>('team-ranking',        p),
      get<StatusCount[]>('status-breakdown',             p),
      get<ZoneCount[]>('leads-by-zone',                  p),
    ]);

    const deltaLabel = PERIOD_LABELS_DELTA[period];

    return {
      kpis: {
        totalLeads:     { value: totalLeadsRes.totalLeads,         deltaLabel },
        tasaConversion: { value: conversionRateRes.conversionRate, deltaLabel },
        pipelineActivo: { value: inNegotiationRes.inNegotiation,   deltaLabel },
        clientesNuevos: { value: newClientsRes.newClients,         deltaLabel },
      },
      funnel:           adaptFunnel(funnelRes),
      distribution:     adaptStatusBreakdown(breakdownRes),
      team:             adaptTeamRanking(teamRes),
      zones:            adaptZones(zonesRes),
      globalConversion: conversionRateRes.conversionRate,
    };
  },
};
