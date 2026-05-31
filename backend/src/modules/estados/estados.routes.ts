import { Router } from "express";
import { authenticate } from "@/middlewares/auth";
import { EstadosRepository } from "./estados.repository";
import { EstadosController } from "./estados.controller";

const repository  = new EstadosRepository();
const controller  = new EstadosController(repository);

const estadosRouter = Router();

estadosRouter.get("/", authenticate, controller.getAll);

export default estadosRouter;
