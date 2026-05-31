import { Router } from "express";
import { authenticate } from "@/middlewares/auth";
import { CuitRepository } from "./cuit.repository";
import { CuitService }    from "./cuit.service";
import { CuitController } from "./cuit.controller";

const repository = new CuitRepository();
const service    = new CuitService(repository);
const controller = new CuitController(service);

const cuitRouter = Router();

cuitRouter.get("/:cuit/fiscal",      authenticate, controller.getFiscal);
cuitRouter.get("/:cuit/crediticio",  authenticate, controller.getCrediticio);

export default cuitRouter;
