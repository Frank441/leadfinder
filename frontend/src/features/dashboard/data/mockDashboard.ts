/**
 * Mock data para el dashboard ejecutivo.
 *
 * 🔌 PUNTO DE INTEGRACIÓN CON EL BACKEND:
 * Reemplazar este archivo por llamadas al endpoint `/api/dashboard/metrics`
 * (o similar) cuando US03/US07 estén implementadas en el backend.
 */

export interface KPI {
  label: string;
  value: string;
  delta?: string;
  color: 'green' | 'blue' | 'orange';
}

export interface RecentLead {
  id: string;
  razonSocial: string;
  localidad: string;
  cabezas: number;
  status: 'lead' | 'contacto' | 'prospecto' | 'cliente';
}

export interface RepPerformance {
  id: string;
  name: string;
  initials: string;
  leads: number;
  conversiones: number;
  tasaConversion: number; // porcentaje
}

export const MOCK_KPIS: KPI[] = [
  { label: 'Total Leads',        value: '127',  delta: '+12 este mes',     color: 'green'  },
  { label: 'Tasa de conversión', value: '18.3%', delta: '+2.1% vs mes ant.', color: 'blue'   },
  { label: 'Prospectos activos', value: '34',   delta: '8 listos para cerrar', color: 'orange' },
  { label: 'Clientes nuevos',    value: '7',    delta: 'Este mes',         color: 'green'  },
];

export const MOCK_RECENT_LEADS: RecentLead[] = [
  { id: '1', razonSocial: 'El Trébol Agropecuaria', localidad: 'Buenos Aires', cabezas: 450, status: 'prospecto' },
  { id: '2', razonSocial: 'Los Pinos SA',           localidad: 'Córdoba',      cabezas: 280, status: 'contacto'  },
  { id: '3', razonSocial: 'La Pampa Grande SRL',    localidad: 'Santa Fe',     cabezas: 620, status: 'lead'      },
  { id: '4', razonSocial: 'Estancia Don Pedro',     localidad: 'Entre Ríos',   cabezas: 850, status: 'cliente'   },
  { id: '5', razonSocial: 'Agro Del Sur SA',        localidad: 'La Pampa',     cabezas: 190, status: 'prospecto' },
];

export const MOCK_TEAM_PERFORMANCE: RepPerformance[] = [
  { id: 'r1', name: 'Carlos Méndez',  initials: 'CM', leads: 38, conversiones: 5, tasaConversion: 13.2 },
  { id: 'r2', name: 'Ana Rodríguez',  initials: 'AR', leads: 45, conversiones: 9, tasaConversion: 20.0 },
  { id: 'r3', name: 'Pedro Gómez',    initials: 'PG', leads: 28, conversiones: 3, tasaConversion: 10.7 },
  { id: 'r4', name: 'Laura Sánchez',  initials: 'LS', leads: 16, conversiones: 4, tasaConversion: 25.0 },
];

export const GLOBAL_CONVERSION_RATE = 18.3;
