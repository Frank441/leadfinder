import type { Lead, LeadStatus, LeadsFilters, VisitNote } from '@leadfinder/shared/types/leads';
import { apiFetch } from '../../../lib/api';

export const leadsService = {
    async getAll(filters?: LeadsFilters): Promise<Lead[]> {
        const params = new URLSearchParams();
        if (filters?.search)          params.set('search',          filters.search);
        if (filters?.status)          params.set('status',          filters.status);
        if (filters?.zona)            params.set('zona',            filters.zona);
        if (filters?.actividad)       params.set('actividad',       filters.actividad);
        if (filters?.representanteId) params.set('representanteId', filters.representanteId);
        const qs = params.toString();
        return apiFetch<Lead[]>(`/api/v1/leads${qs ? `?${qs}` : ''}`);
    },

    async getById(id: string): Promise<Lead | null> {
        try {
            return await apiFetch<Lead>(`/api/v1/leads/${id}`);
        } catch (err) {
            if (err instanceof Error && err.message.includes('404')) return null;
            throw err;
        }
    },

    async addNote(leadId: string, content: string): Promise<VisitNote> {
        return apiFetch<VisitNote>(`/api/v1/leads/${leadId}/notas`, {
            method: 'POST',
            body:   JSON.stringify({ content }),
        });
    },

    // Pendiente de implementar en el back (próximos tickets)
    async assign(leadId: string, representanteId: string | null): Promise<Lead> {
        throw new Error(`assign(${leadId}, ${representanteId}) no implementado aún.`);
    },

    async updateStatus(leadId: string, status: LeadStatus): Promise<Lead> {
        throw new Error(`updateStatus(${leadId}, ${status}) no implementado aún.`);
    },
};
