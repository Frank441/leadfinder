import type { UserRole, UserId } from "@leadfinder/shared/types/user";
import { ROLES } from "@leadfinder/shared/types/user";
import type { StatsPeriod } from "@leadfinder/shared/types/stats";
import prisma from "../../../prisma/client";

const STATUS_ORDER = ["Lead", "Contacto", "Prospecto", "Cliente"];
const NEGOTIATION_STATUSES = ["Contacto", "Prospecto"];

function getPeriodRange(period: StatsPeriod): { gte: Date } {
    const now = new Date();
    const start = new Date(now);

    if (period === "month") {
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
    } else if (period === "quarter") {
        const currentQuarterMonth = Math.floor(now.getMonth() / 3) * 3;
        start.setMonth(currentQuarterMonth, 1);
        start.setHours(0, 0, 0, 0);
    } else {
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
    }

    return { gte: start };
}

export class StatsRepository {
    private baseWhere(role: UserRole, userId: UserId, period: StatsPeriod) {
        return {
            empresa: { provincia: { not: null } },
            fecha_creacion: getPeriodRange(period),
            ...(role === ROLES.representante && { id_usuario_asignado: Number(userId) }),
        };
    }

    async getTotalLeads(role: UserRole, userId: UserId, period: StatsPeriod): Promise<number> {
        return prisma.leads.count({ where: this.baseWhere(role, userId, period) });
    }

    async getConversionRate(role: UserRole, userId: UserId, period: StatsPeriod): Promise<number> {
        const where = this.baseWhere(role, userId, period);
        const [total, converted] = await prisma.$transaction([
            prisma.leads.count({ where }),
            prisma.leads.count({ where: { ...where, estado: { nombre: "Cliente" } } }),
        ]);
        return total === 0 ? 0 : Math.round((converted / total) * 10000) / 100;
    }

    async getInNegotiation(role: UserRole, userId: UserId, period: StatsPeriod): Promise<number> {
        const where = this.baseWhere(role, userId, period);
        return prisma.leads.count({
            where: { ...where, estado: { nombre: { in: NEGOTIATION_STATUSES } } },
        });
    }

    async getNewClients(role: UserRole, userId: UserId, period: StatsPeriod): Promise<number> {
        const { gte } = getPeriodRange(period);
        return prisma.leads.count({
            where: {
                empresa: { provincia: { not: null } },
                estado: { nombre: "Cliente" },
                fecha_ultima_actividad: { gte },
                ...(role === ROLES.representante && { id_usuario_asignado: Number(userId) }),
            },
        });
    }

    async getSalesFunnel(role: UserRole, userId: UserId, period: StatsPeriod): Promise<{ status: string; count: number }[]> {
        const where = this.baseWhere(role, userId, period);
        const counts = await prisma.estados_lead.findMany({
            where: { nombre: { in: STATUS_ORDER } },
            select: {
                nombre: true,
                _count: { select: { leads: { where } } },
            },
        });

        return STATUS_ORDER.map((status) => {
            const found = counts.find((c) => c.nombre === status);
            return { status, count: found?._count.leads ?? 0 };
        });
    }

    async getTeamRanking(period: StatsPeriod): Promise<{
        representanteId: string;
        name: string;
        assignedLeads: number;
        convertedLeads: number;
    }[]> {
        const { gte } = getPeriodRange(period);

        const representantes = await prisma.usuarios.findMany({
            where: { activo: true, role: { nombre: "Representante" } },
            select: { id_usuario: true, nombre: true, apellido: true },
        });

        return Promise.all(
            representantes.map(async (rep) => {
                const where = {
                    empresa: { provincia: { not: null } },
                    fecha_creacion: { gte },
                    id_usuario_asignado: rep.id_usuario,
                };
                const [assigned, converted] = await prisma.$transaction([
                    prisma.leads.count({ where }),
                    prisma.leads.count({ where: { ...where, estado: { nombre: "Cliente" } } }),
                ]);
                return {
                    representanteId: String(rep.id_usuario),
                    name: `${rep.nombre} ${rep.apellido}`,
                    assignedLeads: assigned,
                    convertedLeads: converted,
                };
            }),
        );
    }

    async getSupervisorRanking(period: StatsPeriod): Promise<{
        supervisorId: string;
        name: string;
        assignedLeads: number;
        convertedLeads: number;
    }[]> {
        const { gte } = getPeriodRange(period);

        const supervisores = await prisma.usuarios.findMany({
            where: { activo: true, role: { nombre: "Supervisor" } },
            select: { id_usuario: true, nombre: true, apellido: true },
        });

        const baseWhere = {
            empresa: { provincia: { not: null } },
            fecha_creacion: { gte },
        };
        const [assigned, converted] = await prisma.$transaction([
            prisma.leads.count({ where: baseWhere }),
            prisma.leads.count({ where: { ...baseWhere, estado: { nombre: "Cliente" } } }),
        ]);

        return supervisores.map((sup) => ({
            supervisorId:  String(sup.id_usuario),
            name:          `${sup.nombre} ${sup.apellido}`,
            assignedLeads: assigned,
            convertedLeads: converted,
        }));
    }

    async getCurrentStatusBreakdown(role: UserRole, userId: UserId, period: StatsPeriod): Promise<{ status: string; count: number }[]> {
        const where = this.baseWhere(role, userId, period);
        const counts = await prisma.estados_lead.findMany({
            select: {
                nombre: true,
                _count: { select: { leads: { where } } },
            },
        });
        return counts
            .map((c) => ({ status: c.nombre, count: c._count.leads }))
            .filter((c) => c.count > 0);
    }

    async getLeadsByProvincia(role: UserRole, userId: UserId, period: StatsPeriod): Promise<{ provincia: string | null }[]> {
        const where = this.baseWhere(role, userId, period);
        const rows = await prisma.leads.findMany({
            where,
            select: { empresa: { select: { provincia: true } } },
        });
        return rows.map((r) => ({ provincia: r.empresa.provincia }));
    }
}