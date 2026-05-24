import type { Lead, LeadStatus, LeadsFilters, VisitNote } from '@leadfinder/shared/test';
import { MOCK_LEADS } from '../data/mockLeads';

/**
 * Capa de servicios para Leads.
 *
 * 🔌 PUNTO DE INTEGRACIÓN CON EL BACKEND:
 * Cuando el backend esté listo, reemplazá el cuerpo de cada función
 * por la llamada real (fetch / axios). Los componentes NO cambian.
 *
 * Ejemplo:
 *   async getAll(filters) {
 *     const params = new URLSearchParams(filters as Record<string, string>);
 *     const res = await fetch(`/api/leads?${params}`, {
 *       headers: { Authorization: `Bearer ${getToken()}` },
 *     });
 *     return res.json();
 *   }
 */

// Estado mutable interno (simula la base de datos durante desarrollo)
let _leads: Lead[] = MOCK_LEADS.map((l) => ({ ...l, notes: [...l.notes] }));

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const leadsService = {
  async getAll(filters?: LeadsFilters): Promise<Lead[]> {
    await delay(150);
    let result = [..._leads];

    if (filters?.status && filters.status !== 'todos') {
      result = result.filter((l) => l.status === filters.status);
    }
    if (filters?.zona) {
      result = result.filter((l) => l.zona === filters.zona);
    }
    if (filters?.actividad) {
      result = result.filter((l) => l.actividad === filters.actividad);
    }
    if (filters?.representanteId) {
      result = result.filter((l) => l.representanteId === filters.representanteId);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.razonSocial.toLowerCase().includes(q) ||
          l.cuit.includes(q) ||
          l.localidad.toLowerCase().includes(q),
      );
    }
    return result;
  },

  async getById(id: string): Promise<Lead | null> {
    await delay(150);
    return _leads.find((l) => l.id === id) ?? null;
  },

  async assign(leadId: string, representanteId: string | null): Promise<Lead> {
    await delay(250);
    const idx = _leads.findIndex((l) => l.id === leadId);
    if (idx < 0) throw new Error('Lead no encontrado');
    _leads[idx] = { ..._leads[idx], representanteId };
    return _leads[idx];
  },

  async updateStatus(leadId: string, status: LeadStatus): Promise<Lead> {
    await delay(250);
    const idx = _leads.findIndex((l) => l.id === leadId);
    if (idx < 0) throw new Error('Lead no encontrado');
    _leads[idx] = { ..._leads[idx], status };
    return _leads[idx];
  },

  async addNote(
    leadId: string,
    note: { userId: string; userName: string; content: string },
  ): Promise<VisitNote> {
    await delay(250);
    const idx = _leads.findIndex((l) => l.id === leadId);
    if (idx < 0) throw new Error('Lead no encontrado');
    const newNote: VisitNote = {
      id: `n${Date.now()}`,
      leadId,
      date: new Date().toISOString(),
      ...note,
    };
    _leads[idx] = { ..._leads[idx], notes: [newNote, ..._leads[idx].notes] };
    return newNote;
  },
};
