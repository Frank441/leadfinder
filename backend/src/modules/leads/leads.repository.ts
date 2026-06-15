import type { LeadsFilters, Representante } from "@leadfinder/shared/types/leads";
import type { UserRole, UserId } from "@leadfinder/shared/types/user";
import { ROLES } from "@leadfinder/shared/types/user";
import type { PrismaLeadWithRelations, PrismaVisitaWithUser } from "@/types/api";
import { LEAD_INCLUDE } from "@/types/api";
import { getProvinciasByZona, getActividadDbValues  } from "@/utils/leadMappers";
import prisma from "../../../prisma/client";
import type { Prisma } from '../../../generated/prisma/index';

export class LeadsRepository {
    async getAll(
        role: UserRole,
        userId: UserId,
    ): Promise<PrismaLeadWithRelations[]> {
        const where = {
            empresa: { provincia: { not: null } },
            ...(role === ROLES.representante && { id_usuario_asignado: Number(userId) }),
        };
        return prisma.leads.findMany({ where, include: LEAD_INCLUDE, orderBy: { fecha_creacion: 'desc' } });
    }


    async getPaginated(
        role: UserRole,
        userId: UserId,
        filters: LeadsFilters = {},
        page: number = 1,
        limit: number = 20,
    ): Promise<{ leads: PrismaLeadWithRelations[]; total: number }> {
        const where: Prisma.leadsWhereInput = {
            empresa: {
                AND: [
                    { provincia: { not: null } },
                    ...(filters.zona
                        ? [{
                            OR: getProvinciasByZona(filters.zona).map(p => ({
                                provincia: { equals: p, mode: 'insensitive' as const },
                            })),
                        }]
                        : []),
                    ...(filters.actividad
                        ? [{
                            OR: getActividadDbValues(filters.actividad).map(code => ({
                                tipo_explotacion: { equals: code, mode: 'insensitive' as const },
                            })),
                        }]
                        : []),
                    ...(filters.search
                        ? [{
                            OR: [
                                { nombre_empresa: { contains: filters.search, mode: 'insensitive' as const } },
                                { cuit:           { contains: filters.search } },
                                { localidad:      { contains: filters.search, mode: 'insensitive' as const } },
                            ],
                        }]
                        : []),
                ],
            },
            ...(role === ROLES.representante && { id_usuario_asignado: Number(userId) }),
            ...(filters.representanteId    && { id_usuario_asignado: Number(filters.representanteId) }),
            ...(filters.status && filters.status !== 'todos' && {
                estado: { nombre: { equals: filters.status, mode: 'insensitive' as const } },
            }),
        };

    const [leads, total] = await prisma.$transaction([
        prisma.leads.findMany({
            where,
            include: LEAD_INCLUDE,
            orderBy: { fecha_creacion: 'desc' },
            skip:    (page - 1) * limit,
            take:    limit,
        }),
        prisma.leads.count({ where }),
    ]);

    return { leads, total };
}

    findById(id: number): Promise<PrismaLeadWithRelations | null> {
        return prisma.leads.findUnique({
            where:   { id_lead: id },
            include: LEAD_INCLUDE,
        });
    }

    async getRepresentantes(): Promise<Representante[]> {
        const rows = await prisma.usuarios.findMany({
            where: { activo: true, role: { nombre: "Representante" } },
            include: { role: true },
            orderBy: { nombre: "asc" },
        });
        return rows.map((r) => ({
            id:       String(r.id_usuario),
            name:     `${r.nombre} ${r.apellido}`,
            email:    r.email,
            initials: `${r.nombre[0]}${r.apellido[0]}`.toUpperCase(),
        }));
    }

    async updateAsignado(
        leadId: number,
        representanteId: number | null,
    ): Promise<PrismaLeadWithRelations> {
        return prisma.leads.update({
            where:   { id_lead: leadId },
            data:    {
                id_usuario_asignado: representanteId,
                fecha_asignacion:    representanteId ? new Date() : null,
            },
            include: LEAD_INCLUDE,
        });
    }

    async updateEstado(leadId: number, estadoId: number): Promise<PrismaLeadWithRelations> {
        return prisma.leads.update({
            where:   { id_lead: leadId },
            data:    { id_estado: estadoId, fecha_ultima_actividad: new Date() },
            include: LEAD_INCLUDE,
        });
    }

    findEstadoByNombre(nombre: string): Promise<{ id_estado: number } | null> {
        return prisma.estados_lead.findFirst({
            where:  { nombre: { equals: nombre, mode: "insensitive" } },
            select: { id_estado: true },
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
