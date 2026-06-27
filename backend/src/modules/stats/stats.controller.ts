import type { RequestHandler } from "express";
import type { StatsPeriod } from "@leadfinder/shared/types/stats";
import type { StatsService } from "./stats.service";

const VALID_PERIODS: StatsPeriod[] = ["month", "quarter", "year"];

export class StatsController {
    constructor(private readonly service: StatsService) {}

    private parsePeriod(req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]): StatsPeriod | null {
        const period = req.query.period as string | undefined;
        if (!period || !VALID_PERIODS.includes(period as StatsPeriod)) {
            res.status(400).json({
                message: `El parámetro 'period' es requerido y debe ser uno de: ${VALID_PERIODS.join(", ")}.`,
            });
            return null;
        }
        return period as StatsPeriod;
    }

    private handleError(err: unknown, res: Parameters<RequestHandler>[1]): void {
        console.error("[StatsController]", err);
        res.status(500).json({ message: "Error interno del servidor." });
    }

    getTotalLeads: RequestHandler = async (req, res) => {
        try {
            const period = this.parsePeriod(req, res);
            if (!period) return;
            const user = req.user!;
            const data = await this.service.getTotalLeads(user.role, user.sub, period);
            res.json({ totalLeads: data });
        } catch (err) {
            this.handleError(err, res);
        }
    };

    getConversionRate: RequestHandler = async (req, res) => {
        try {
            const period = this.parsePeriod(req, res);
            if (!period) return;
            const user = req.user!;
            const data = await this.service.getConversionRate(user.role, user.sub, period);
            res.json({ conversionRate: data });
        } catch (err) {
            this.handleError(err, res);
        }
    };

    getInNegotiation: RequestHandler = async (req, res) => {
        try {
            const period = this.parsePeriod(req, res);
            if (!period) return;
            const user = req.user!;
            const data = await this.service.getInNegotiation(user.role, user.sub, period);
            res.json({ inNegotiation: data });
        } catch (err) {
            this.handleError(err, res);
        }
    };

    getNewClients: RequestHandler = async (req, res) => {
        try {
            const period = this.parsePeriod(req, res);
            if (!period) return;
            const user = req.user!;
            const data = await this.service.getNewClients(user.role, user.sub, period);
            res.json({ newClients: data });
        } catch (err) {
            this.handleError(err, res);
        }
    };

    getSalesFunnel: RequestHandler = async (req, res) => {
        try {
            const period = this.parsePeriod(req, res);
            if (!period) return;
            const user = req.user!;
            const data = await this.service.getSalesFunnel(user.role, user.sub, period);
            res.json(data);
        } catch (err) {
            this.handleError(err, res);
        }
    };

    getTeamRanking: RequestHandler = async (req, res) => {
        try {
            const period = this.parsePeriod(req, res);
            if (!period) return;
            const data = await this.service.getTeamRanking(period);
            res.json(data);
        } catch (err) {
            this.handleError(err, res);
        }
    };

    getSupervisorRanking: RequestHandler = async (req, res) => {
        try {
            const period = this.parsePeriod(req, res);
            if (!period) return;
            const data = await this.service.getSupervisorRanking(period);
            res.json(data);
        } catch (err) {
            this.handleError(err, res);
        }
    };

    getStatusBreakdown: RequestHandler = async (req, res) => {
        try {
            const period = this.parsePeriod(req, res);
            if (!period) return;
            const user = req.user!;
            const data = await this.service.getStatusBreakdown(user.role, user.sub, period);
            res.json(data);
        } catch (err) {
            this.handleError(err, res);
        }
    };

    getLeadsByZone: RequestHandler = async (req, res) => {
        try {
            const period = this.parsePeriod(req, res);
            if (!period) return;
            const user = req.user!;
            const data = await this.service.getLeadsByZone(user.role, user.sub, period);
            res.json(data);
        } catch (err) {
            this.handleError(err, res);
        }
    };
}