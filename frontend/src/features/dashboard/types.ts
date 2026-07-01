/**
 * Tipos internos del dashboard del frontend.
 * Estos son los que esperan los componentes del feature.
 * El dashboardService traduce desde el shape del backend (en `shared/types/stats`)
 * hacia estos tipos.
 */

import type { LeadStatus } from '@leadfinder/shared/types/leads';

// Periodo en el lenguaje de la UI. El service lo traduce a "month"/"quarter"/"year".
export type Period = 'mes' | 'trimestre' | 'anio';

export const PERIOD_LABEL: Record<Period, string> = {
  mes:       'Este mes',
  trimestre: 'Último trimestre',
  anio:      'Este año',
};

// ─────────────────────────────────────────────
// KPIs hero
// ─────────────────────────────────────────────
export interface KPIData {
  value: number;
  /** Delta vs período anterior. Opcional: si el backend no lo soporta queda undefined. */
  delta?: number;
  /** Texto explicativo del delta (ej. "vs mes anterior"). */
  deltaLabel?: string;
}

export interface KPIs {
  totalLeads:     KPIData;
  tasaConversion: KPIData;
  pipelineActivo: KPIData;
  clientesNuevos: KPIData;
  unassignedLeads: KPIData;
}

// ─────────────────────────────────────────────
// Embudo de ventas
// ─────────────────────────────────────────────
export interface FunnelStage {
  status: LeadStatus;
  label: string;
  count: number;
  /** % respecto al primer estado (Lead). Lo calcula el service. */
  pctOfTotal: number;
  /** % de avance desde la etapa anterior. null para la primera etapa. */
  pctFromPrev: number | null;
}

// ─────────────────────────────────────────────
// Distribución por estado (para el donut)
// ─────────────────────────────────────────────
export interface StatusSlice {
  status: LeadStatus;
  label: string;
  count: number;
}

// ─────────────────────────────────────────────
// Rendimiento del equipo (US07a + US07b + US07c)
// ─────────────────────────────────────────────
export interface RepPerformance {
  id: string;
  name: string;
  /** Iniciales calculadas a partir del nombre. */
  initials: string;
  leads: number;
  conversiones: number;
  tasaConversion: number;
}

// ─────────────────────────────────────────────
// Distribución geográfica
// ─────────────────────────────────────────────
export interface ZoneStat {
  zona: string;
  leads: number;
  /** % del total del período. */
  pct: number;
}

// ─────────────────────────────────────────────
// Estructura consolidada que devuelve el service
// ─────────────────────────────────────────────
export interface DashboardData {
  kpis:             KPIs;
  funnel:           FunnelStage[];
  distribution:     StatusSlice[];
  zones:            ZoneStat[];
  team:             RepPerformance[];
  globalConversion: number;
}
