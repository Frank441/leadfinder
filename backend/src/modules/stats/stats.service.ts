import type { UserRole, UserId } from "@leadfinder/shared/types/user";
import type {
    StatsPeriod,
    FunnelStage,
    RepresentanteRanking,
    StatusCount,
    ZoneCount,
} from "@leadfinder/shared/types/stats";
import type { StatsRepository } from "./stats.repository";
import { mapProvinciaToZona } from "@/utils/leadMappers";

export class StatsService {
    constructor(private readonly repository: StatsRepository) {}

    getTotalLeads(role: UserRole, userId: UserId, period: StatsPeriod): Promise<number> {
        return this.repository.getTotalLeads(role, userId, period);
    }

    getConversionRate(role: UserRole, userId: UserId, period: StatsPeriod): Promise<number> {
        return this.repository.getConversionRate(role, userId, period);
    }

    getInNegotiation(role: UserRole, userId: UserId, period: StatsPeriod): Promise<number> {
        return this.repository.getInNegotiation(role, userId, period);
    }

    getNewClients(role: UserRole, userId: UserId, period: StatsPeriod): Promise<number> {
        return this.repository.getNewClients(role, userId, period);
    }

    getSalesFunnel(role: UserRole, userId: UserId, period: StatsPeriod): Promise<FunnelStage[]> {
        return this.repository.getSalesFunnel(role, userId, period);
    }

    async getTeamRanking(period: StatsPeriod): Promise<RepresentanteRanking[]> {
        const raw = await this.repository.getTeamRanking(period);
        return raw
            .map((rep) => ({
                representanteId: rep.representanteId,
                name:            rep.name,
                assignedLeads:   rep.assignedLeads,
                convertedLeads:  rep.convertedLeads,
                conversionRate:  rep.assignedLeads === 0
                    ? 0
                    : Math.round((rep.convertedLeads / rep.assignedLeads) * 10000) / 100,
            }))
            .sort((a, b) => b.conversionRate - a.conversionRate);
    }

    getStatusBreakdown(role: UserRole, userId: UserId, period: StatsPeriod): Promise<StatusCount[]> {
        return this.repository.getCurrentStatusBreakdown(role, userId, period);
    }

    async getLeadsByZone(role: UserRole, userId: UserId, period: StatsPeriod): Promise<ZoneCount[]> {
        const rows = await this.repository.getLeadsByProvincia(role, userId, period);
        const zoneMap = new Map<string, number>();
        for (const { provincia } of rows) {
            if (!provincia) continue;
            const zone = mapProvinciaToZona(provincia);
            zoneMap.set(zone, (zoneMap.get(zone) ?? 0) + 1);
        }
        return Array.from(zoneMap.entries())
            .map(([zone, count]) => ({ zone, count }))
            .sort((a, b) => b.count - a.count);
    }
}