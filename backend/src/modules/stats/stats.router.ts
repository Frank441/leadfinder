import { Router } from "express";
import { authenticate, authorize } from "@/middlewares/auth";
import { ROLES } from "@leadfinder/shared/types/user";
import { StatsRepository } from "./stats.repository";
import { StatsService }    from "./stats.service";
import { StatsController } from "./stats.controller";

const repository = new StatsRepository();
const service    = new StatsService(repository);
const controller = new StatsController(service);

const statsRouter = Router();

const auth         = [authenticate, authorize(ROLES.director, ROLES.supervisor)];
const directorOnly = [authenticate, authorize(ROLES.director)];

statsRouter.get("/total-leads",        ...auth,         controller.getTotalLeads);
statsRouter.get("/conversion-rate",    ...auth,         controller.getConversionRate);
statsRouter.get("/in-negotiation",     ...auth,         controller.getInNegotiation);
statsRouter.get("/new-clients",        ...auth,         controller.getNewClients);
statsRouter.get("/sales-funnel",       ...auth,         controller.getSalesFunnel);
statsRouter.get("/team-ranking",       ...auth,         controller.getTeamRanking);
statsRouter.get("/status-breakdown",   ...auth,         controller.getStatusBreakdown);
statsRouter.get("/leads-by-zone",      ...auth,         controller.getLeadsByZone);
statsRouter.get("/supervisor-ranking", ...directorOnly, controller.getSupervisorRanking);

export default statsRouter;