import type { Lead, VisitNote, LeadsFilters, Representante } from "@leadfinder/shared/types/leads";
import type { UserRole, UserId } from "@leadfinder/shared/types/user";
import type { LeadsRepository } from "./leads.repository";
import { NotFoundError } from "@/errors/errors";
import { mapLead, mapVisitNote } from "@/utils/leadMappers";

export class LeadsService {
    constructor(private readonly repository: LeadsRepository) {}

    async getAll(role: UserRole, userId: UserId, filters: LeadsFilters = {}): Promise<Lead[]> {
        const leads = await this.repository.getAll(role, userId, filters);
        return leads.map(mapLead);
}

    async getPaginated(
        role: UserRole,
        userId: UserId,
        filters?: LeadsFilters,
        page: number = 1,
        limit: number = 20,
    ): Promise<{ leads: Lead[]; total: number }> {
        const { leads, total } = await this.repository.getPaginated(role, userId, filters, page, limit);
        return { leads: leads.map(mapLead), total };
    }

    async getById(id: number): Promise<Lead> {
        const lead = await this.repository.findById(id);
        if (!lead) throw new NotFoundError(`Lead ${id} no encontrado.`);
        return mapLead(lead);
    }

    getRepresentantes(): Promise<Representante[]> {
        return this.repository.getRepresentantes();
    }

    async assign(leadId: number, representanteId: string | null): Promise<Lead> {
        const lead = await this.repository.findById(leadId);
        if (!lead) throw new NotFoundError(`Lead ${leadId} no encontrado.`);
        const updated = await this.repository.updateAsignado(
            leadId,
            representanteId ? Number(representanteId) : null,
        );
        return mapLead(updated);
    }

    async updateStatus(leadId: number, status: string): Promise<Lead> {
        const lead = await this.repository.findById(leadId);
        if (!lead) throw new NotFoundError(`Lead ${leadId} no encontrado.`);
        const estado = await this.repository.findEstadoByNombre(status);
        if (!estado) throw new NotFoundError(`Estado "${status}" no encontrado.`);
        const updated = await this.repository.updateEstado(leadId, estado.id_estado);
        return mapLead(updated);
    }

    async createNote(leadId: number, userId: number, content: string): Promise<VisitNote> {
        const lead = await this.repository.findById(leadId);
        if (!lead) throw new NotFoundError(`Lead ${leadId} no encontrado.`);
        const visita = await this.repository.createNote(leadId, userId, content);
        return mapVisitNote(visita);
    }

    async deleteNote(leadId: number, noteId: number): Promise<void> {
        const lead = await this.repository.findById(leadId);
        if (!lead) throw new NotFoundError(`Lead ${leadId} no encontrado.`);
        const note = lead.visitas.find((v) => v.id_visita === noteId);
        if (!note) throw new NotFoundError(`Nota ${noteId} no encontrada.`);
        await this.repository.deleteNote(noteId);
    }

    async editNote(leadId: number, noteId: number, content: string): Promise<VisitNote> {
        const lead = await this.repository.findById(leadId);
        if (!lead) throw new NotFoundError(`Lead ${leadId} no encontrado.`);
        const note = lead.visitas.find((v) => v.id_visita === noteId);
        if (!note) throw new NotFoundError(`Nota ${noteId} no encontrada.`);
        const updated = await this.repository.editNote(noteId, content);
        return mapVisitNote(updated);
    }
}