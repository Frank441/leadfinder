import type { Lead, VisitNote, LeadsFilters } from "@leadfinder/shared/types/leads";
import type { UserRole, UserId } from "@leadfinder/shared/types/user";
import type { LeadsRepository } from "./leads.repository";
import { NotFoundError } from "@/errors/errors";
import { mapLead, mapVisitNote } from "@/utils/leadMappers";

export class LeadsService {
    constructor(private readonly repository: LeadsRepository) {}

    async getAll(role: UserRole, userId: UserId, filters?: LeadsFilters): Promise<Lead[]> {
        const leads = await this.repository.findAll(role, userId, filters);
        return leads.map(mapLead);
    }

    async getById(id: number): Promise<Lead> {
        const lead = await this.repository.findById(id);
        if (!lead) throw new NotFoundError(`Lead ${id} no encontrado.`);
        return mapLead(lead);
    }

    async createNote(leadId: number, userId: number, content: string): Promise<VisitNote> {
        const lead = await this.repository.findById(leadId);
        if (!lead) throw new NotFoundError(`Lead ${leadId} no encontrado.`);
        const visita = await this.repository.createNote(leadId, userId, content);
        return mapVisitNote(visita);
    }
}
