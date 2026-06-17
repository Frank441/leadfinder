import type { Lead, LeadStatus, LeadsFilters, VisitNote } from '@leadfinder/shared/types/leads';
import { apiFetch } from '../../../lib/api';

export const leadsService = {
    async getAll(): Promise<Lead[]> {
        return apiFetch<Lead[]>('/api/v1/leads');
    },

    async getPaginated(filters?: LeadsFilters, page: number = 1, limit: number = 20): Promise<{ leads: Lead[]; total: number }> {
        const params = new URLSearchParams();
        if (filters?.search)          params.set('search',          filters.search);
        if (filters?.status)          params.set('status',          filters.status);
        if (filters?.zona)            params.set('zona',            filters.zona);
        if (filters?.actividad)       params.set('actividad',       filters.actividad);
        if (filters?.representanteId) params.set('representanteId', filters.representanteId);
        params.set('page',  String(page));
        params.set('limit', String(limit));
        return apiFetch<{ leads: Lead[]; total: number }>(`/api/v1/leads/paginated?${params.toString()}`);
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

    async deleteNote(leadId: string, noteId: string): Promise<void> {
        await apiFetch<void>(`/api/v1/leads/${leadId}/notas/${noteId}`, {
            method: 'DELETE',
        });
    },

    async editNote(leadId: string, noteId: string, content: string): Promise<VisitNote> {
        return apiFetch<VisitNote>(`/api/v1/leads/${leadId}/notas/${noteId}`, {
            method: 'PUT',
            body:   JSON.stringify({ content }),
        });
    },

    async assign(leadId: string, representanteId: string | null): Promise<Lead> {
        return apiFetch<Lead>(`/api/v1/leads/${leadId}/asignar`, {
            method: 'PUT',
            body:   JSON.stringify({ representanteId }),
        });
    },

    async updateStatus(leadId: string, status: LeadStatus): Promise<Lead> {
        return apiFetch<Lead>(`/api/v1/leads/${leadId}/estado`, {
            method: 'PUT',
            body:   JSON.stringify({ status }),
        });
    },
};
