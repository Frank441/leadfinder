import type { LeadsFilters } from "@leadfinder/shared/types/leads";
import type { UserRole, UserId } from "@leadfinder/shared/types/user";
import type { PrismaLeadWithRelations, PrismaVisitaWithUser } from "@/types/api";
import { LEAD_INCLUDE } from "@/types/api";
import prisma from "../../../prisma/client";

export class LeadsRepository {
    async findAll(
        role: UserRole,
        userId: UserId,
        filters: LeadsFilters = {},
    ): Promise<PrismaLeadWithRelations[]> {
        const leads = await prisma.leads.findMany({
            include:  LEAD_INCLUDE,
            orderBy: { fecha_creacion: "desc" },
        });

        return leads.filter((lead) => {
            if (role === "representante" && lead.id_usuario_asignado !== Number(userId)) return false;
            if (filters.representanteId && String(lead.id_usuario_asignado) !== filters.representanteId) return false;
            if (filters.status && filters.status !== "todos" && lead.estado.nombre.toLowerCase() !== filters.status) return false;
            if (filters.zona && lead.empresa.provincia?.toLowerCase() !== filters.zona.toLowerCase()) return false;
            if (filters.actividad && !lead.empresa.actividad_principal?.toLowerCase().includes(filters.actividad.toLowerCase())) return false;
            if (filters.search) {
                const q = filters.search.toLowerCase();
                const match =
                    lead.empresa.nombre_empresa.toLowerCase().includes(q) ||
                    lead.empresa.cuit.includes(q) ||
                    (lead.empresa.localidad ?? "").toLowerCase().includes(q);
                if (!match) return false;
            }
            return true;
        });
    }

    findById(id: number): Promise<PrismaLeadWithRelations | null> {
        return prisma.leads.findUnique({
            where:   { id_lead: id },
            include: LEAD_INCLUDE,
        });
    }

    createNote(leadId: number, userId: number, content: string): Promise<PrismaVisitaWithUser> {
        return prisma.visitas.create({
            data: {
                id_lead:      leadId,
                id_usuario:   userId,
                fecha_visita: new Date(),
                comentarios:  content,
            },
            include: { usuario: true },
        });
    }
}
