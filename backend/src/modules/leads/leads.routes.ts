import { Router } from "express";
import { authenticate, authorize } from "@/middlewares/auth";
import { LeadsRepository }  from "./leads.repository";
import { LeadsService }     from "./leads.service";
import { LeadsController }  from "./leads.controller";

const repository = new LeadsRepository();
const service    = new LeadsService(repository);
const controller = new LeadsController(service);

const leadsRouter = Router();

// Ruta fija antes de /:id para evitar conflicto con el wildcard
leadsRouter.get("/representantes",    authenticate, controller.getRepresentantes);

leadsRouter.get("/",                  authenticate, controller.getAll);
leadsRouter.get("/:id",               authenticate, controller.getById);
leadsRouter.put("/:id/asignar",       authenticate, authorize("director", "supervisor"), controller.assign);
leadsRouter.put("/:id/estado",        authenticate, controller.updateStatus);
leadsRouter.post("/:id/notas",        authenticate, controller.createNote);

export default leadsRouter;
