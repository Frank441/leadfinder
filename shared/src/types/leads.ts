export const LEAD_STATUSES = {
  lead: 'lead',
  contacto: 'contacto',
  prospecto: 'prospecto',
  cliente: 'cliente',
} as const;

export type LeadStatus = (typeof LEAD_STATUSES)[keyof typeof LEAD_STATUSES];

export interface Representante {
  id: string;
  name: string;
  email: string;
  initials: string;
}

export interface VisitNote {
  id: string;
  leadId: string;
  userId: string;
  userName: string;
  date: string; // ISO datetime
  content: string;
}

// Datos provenientes de SENASA (US13b)
export interface SenasaData {
  actividad: string;
  superficieHa: number;
  estadoSanitario: string;
  renspaActivo: boolean;
}

// Datos provenientes de ARCA / AFIP (US13c)
export interface ArcaData {
  categoria: string;
  estadoCUIT: 'Activo' | 'Inactivo';
  actividadAfip: string;
  obligacionesAlDia: boolean;
  ultimoPago: string; // 'MM/YYYY'
}

// Datos provenientes de BCRA (US13d)
export type BcraSituacion =
  | 'Normal'
  | 'Riesgo bajo'
  | 'Riesgo medio'
  | 'Riesgo alto'
  | 'Sin datos';

export interface BcraData {
  situacion: BcraSituacion; 
  situacionNumero: number; 
  chequesRechazados: number;
  deudasIncobrables: number;
  ultimaConsulta: string | null; // ISO datetime; null si no hay consulta registrada
}

export interface Lead {
  id: string;
  cuit: string;
  razonSocial: string;
  localidad: string;
  provincia: string;
  zona: string;
  actividad: string;
  status: LeadStatus;
  representanteId: string | null;
  superficieHa: number;
  lat: number;
  lng: number;
  senasa: SenasaData;
  arca: ArcaData;
  bcra: BcraData;
  notes: VisitNote[];
}

export interface LeadsFilters {
  search?: string;
  status?: LeadStatus | 'todos';
  zona?: string;
  actividad?: string;
  representanteId?: string;
}
