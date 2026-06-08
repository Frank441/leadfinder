/**
 * Mock data del dashboard ejecutivo.
 *
 * 🔌 PUNTO DE INTEGRACION CON EL BACKEND:
 * Cuando exista el endpoint GET /api/v1/dashboard/metrics?period=mes|trimestre|anio
 * se crea un dashboardService que devuelva esta misma forma. Los componentes
 * NO necesitan cambiar — solo se reemplaza el import de este mock por la
 * llamada al service.
 */

import type { LeadStatus } from '@leadfinder/shared/types/leads';

export type Period = 'mes' | 'trimestre' | 'anio';

export const PERIOD_LABEL: Record<Period, string> = {
  mes: 'Este mes',
  trimestre: 'Último trimestre',
  anio: 'Este año',
};

// ─────────────────────────────────────────────────────────────
// KPIs hero
// ─────────────────────────────────────────────────────────────
export interface KPIData {
  value: number;
  delta: number; // % vs período anterior (positivo o negativo)
  deltaLabel: string;
}

export interface KPIs {
  totalLeads:        KPIData;
  tasaConversion:    KPIData;
  pipelineActivo:    KPIData;
  clientesNuevos:    KPIData;
}

const KPIS_BY_PERIOD: Record<Period, KPIs> = {
  mes: {
    totalLeads:     { value: 847,   delta:  +12.3, deltaLabel: 'vs mes anterior' },
    tasaConversion: { value: 18.3,  delta:  +2.1,  deltaLabel: 'vs mes anterior' },
    pipelineActivo: { value: 446,   delta:  +8.7,  deltaLabel: 'vs mes anterior' },
    clientesNuevos: { value: 58,    delta:  +24.0, deltaLabel: 'vs mes anterior' },
  },
  trimestre: {
    totalLeads:     { value: 2418,  delta:  +18.5, deltaLabel: 'vs trimestre anterior' },
    tasaConversion: { value: 17.2,  delta:  +1.5,  deltaLabel: 'vs trimestre anterior' },
    pipelineActivo: { value: 1283,  delta:  +14.2, deltaLabel: 'vs trimestre anterior' },
    clientesNuevos: { value: 162,   delta:  +21.5, deltaLabel: 'vs trimestre anterior' },
  },
  anio: {
    totalLeads:     { value: 9314,  delta:  +34.7, deltaLabel: 'vs año anterior' },
    tasaConversion: { value: 16.8,  delta:  +3.2,  deltaLabel: 'vs año anterior' },
    pipelineActivo: { value: 4982,  delta:  +28.1, deltaLabel: 'vs año anterior' },
    clientesNuevos: { value: 624,   delta:  +41.0, deltaLabel: 'vs año anterior' },
  },
};

export const getKPIs = (period: Period): KPIs => KPIS_BY_PERIOD[period];

// ─────────────────────────────────────────────────────────────
// Embudo de ventas
// ─────────────────────────────────────────────────────────────
export interface FunnelStage {
  status: LeadStatus;
  label: string;
  count: number;
  pctOfTotal: number;       // % respecto al primer estado (Lead)
  pctFromPrev: number | null; // % de conversión desde la etapa anterior
}

const FUNNEL_BY_PERIOD: Record<Period, FunnelStage[]> = {
  mes: [
    { status: 'lead',      label: 'Lead',      count: 847, pctOfTotal: 100,  pctFromPrev: null },
    { status: 'contacto',  label: 'Contacto',  count: 312, pctOfTotal: 36.8, pctFromPrev: 36.8 },
    { status: 'prospecto', label: 'Prospecto', count: 134, pctOfTotal: 15.8, pctFromPrev: 42.9 },
    { status: 'cliente',   label: 'Cliente',   count: 58,  pctOfTotal: 6.8,  pctFromPrev: 43.3 },
  ],
  trimestre: [
    { status: 'lead',      label: 'Lead',      count: 2418, pctOfTotal: 100,  pctFromPrev: null },
    { status: 'contacto',  label: 'Contacto',  count: 892,  pctOfTotal: 36.9, pctFromPrev: 36.9 },
    { status: 'prospecto', label: 'Prospecto', count: 391,  pctOfTotal: 16.2, pctFromPrev: 43.8 },
    { status: 'cliente',   label: 'Cliente',   count: 162,  pctOfTotal: 6.7,  pctFromPrev: 41.4 },
  ],
  anio: [
    { status: 'lead',      label: 'Lead',      count: 9314, pctOfTotal: 100,  pctFromPrev: null },
    { status: 'contacto',  label: 'Contacto',  count: 3471, pctOfTotal: 37.3, pctFromPrev: 37.3 },
    { status: 'prospecto', label: 'Prospecto', count: 1511, pctOfTotal: 16.2, pctFromPrev: 43.5 },
    { status: 'cliente',   label: 'Cliente',   count: 624,  pctOfTotal: 6.7,  pctFromPrev: 41.3 },
  ],
};

export const getFunnel = (period: Period): FunnelStage[] => FUNNEL_BY_PERIOD[period];

// ─────────────────────────────────────────────────────────────
// Distribución por estado (para el donut)
// ─────────────────────────────────────────────────────────────
export interface StatusSlice {
  status: LeadStatus;
  label: string;
  count: number;
}

export const getStatusDistribution = (period: Period): StatusSlice[] => {
  const funnel = getFunnel(period);
  return funnel.map((f) => ({ status: f.status, label: f.label, count: f.count }));
};

// ─────────────────────────────────────────────────────────────
// Rendimiento del equipo (US07a + US07b + US07c)
// ─────────────────────────────────────────────────────────────
export interface RepPerformance {
  id: string;
  name: string;
  initials: string;
  leads: number;
  conversiones: number;
  tasaConversion: number;
}

const TEAM_BY_PERIOD: Record<Period, RepPerformance[]> = {
  mes: [
    { id: 'r2', name: 'Ana Rodríguez',  initials: 'AR', leads: 145, conversiones: 29, tasaConversion: 20.0 },
    { id: 'r4', name: 'Laura Sánchez',  initials: 'LS', leads:  76, conversiones: 19, tasaConversion: 25.0 },
    { id: 'r1', name: 'Carlos Méndez',  initials: 'CM', leads: 138, conversiones: 18, tasaConversion: 13.0 },
    { id: 'r3', name: 'Pedro Gómez',    initials: 'PG', leads: 128, conversiones: 14, tasaConversion: 10.9 },
    { id: 'r5', name: 'Diego Fernández', initials: 'DF', leads:  98, conversiones: 11, tasaConversion: 11.2 },
    { id: 'r6', name: 'Sofía López',    initials: 'SL', leads:  62, conversiones: 13, tasaConversion: 20.9 },
  ],
  trimestre: [
    { id: 'r2', name: 'Ana Rodríguez',  initials: 'AR', leads: 412, conversiones: 78, tasaConversion: 18.9 },
    { id: 'r4', name: 'Laura Sánchez',  initials: 'LS', leads: 214, conversiones: 51, tasaConversion: 23.8 },
    { id: 'r1', name: 'Carlos Méndez',  initials: 'CM', leads: 398, conversiones: 49, tasaConversion: 12.3 },
    { id: 'r3', name: 'Pedro Gómez',    initials: 'PG', leads: 367, conversiones: 38, tasaConversion: 10.4 },
    { id: 'r5', name: 'Diego Fernández', initials: 'DF', leads: 287, conversiones: 31, tasaConversion: 10.8 },
    { id: 'r6', name: 'Sofía López',    initials: 'SL', leads: 178, conversiones: 35, tasaConversion: 19.7 },
  ],
  anio: [
    { id: 'r2', name: 'Ana Rodríguez',  initials: 'AR', leads: 1612, conversiones: 305, tasaConversion: 18.9 },
    { id: 'r4', name: 'Laura Sánchez',  initials: 'LS', leads:  812, conversiones: 198, tasaConversion: 24.4 },
    { id: 'r1', name: 'Carlos Méndez',  initials: 'CM', leads: 1542, conversiones: 184, tasaConversion: 11.9 },
    { id: 'r3', name: 'Pedro Gómez',    initials: 'PG', leads: 1389, conversiones: 134, tasaConversion:  9.6 },
    { id: 'r5', name: 'Diego Fernández', initials: 'DF', leads: 1098, conversiones: 117, tasaConversion: 10.6 },
    { id: 'r6', name: 'Sofía López',    initials: 'SL', leads:  691, conversiones: 139, tasaConversion: 20.1 },
  ],
};

export const getTeam = (period: Period): RepPerformance[] => TEAM_BY_PERIOD[period];

// ─────────────────────────────────────────────────────────────
// Distribución geográfica (US06 / vision territorial)
// ─────────────────────────────────────────────────────────────
export interface ZoneStat {
  zona: string;
  leads: number;
  pct: number; // % del total
}

const ZONE_BY_PERIOD: Record<Period, ZoneStat[]> = {
  mes: [
    { zona: 'Pampa Húmeda', leads: 381, pct: 45.0 },
    { zona: 'Centro',        leads: 212, pct: 25.0 },
    { zona: 'NEA',           leads:  85, pct: 10.0 },
    { zona: 'NOA',           leads:  68, pct:  8.0 },
    { zona: 'Cuyo',          leads:  59, pct:  7.0 },
    { zona: 'Patagonia',     leads:  42, pct:  5.0 },
  ],
  trimestre: [
    { zona: 'Pampa Húmeda', leads: 1088, pct: 45.0 },
    { zona: 'Centro',        leads:  604, pct: 25.0 },
    { zona: 'NEA',           leads:  241, pct: 10.0 },
    { zona: 'NOA',           leads:  193, pct:  8.0 },
    { zona: 'Cuyo',          leads:  169, pct:  7.0 },
    { zona: 'Patagonia',     leads:  123, pct:  5.0 },
  ],
  anio: [
    { zona: 'Pampa Húmeda', leads: 4191, pct: 45.0 },
    { zona: 'Centro',        leads: 2328, pct: 25.0 },
    { zona: 'NEA',           leads:  931, pct: 10.0 },
    { zona: 'NOA',           leads:  745, pct:  8.0 },
    { zona: 'Cuyo',          leads:  652, pct:  7.0 },
    { zona: 'Patagonia',     leads:  467, pct:  5.0 },
  ],
};

export const getZoneStats = (period: Period): ZoneStat[] => ZONE_BY_PERIOD[period];

// ─────────────────────────────────────────────────────────────
// Tasa de conversión global del equipo (US07c)
// ─────────────────────────────────────────────────────────────
export const getGlobalConversionRate = (period: Period): number => {
  const team = getTeam(period);
  const totalConv = team.reduce((acc, r) => acc + r.conversiones, 0);
  const totalLeads = team.reduce((acc, r) => acc + r.leads, 0);
  return totalLeads === 0 ? 0 : (totalConv / totalLeads) * 100;
};
