import { Router } from "express";
import { authenticate } from "@/middlewares/auth";
import { LeadsRepository }  from "./leads.repository";
import { LeadsService }     from "./leads.service";
import { LeadsController }  from "./leads.controller";

const repository = new LeadsRepository();
const service    = new LeadsService(repository);
const controller = new LeadsController(service);

const leadsRouter = Router();

leadsRouter.get("/",           authenticate, controller.getAll);
leadsRouter.get("/:id",        authenticate, controller.getById);
leadsRouter.post("/:id/notas", authenticate, controller.createNote);

export default leadsRouter;
