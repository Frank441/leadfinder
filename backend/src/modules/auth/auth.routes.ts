import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";

const authRepository = new AuthRepository();
const authService    = new AuthService(authRepository);
const authController = new AuthController(authService);

const authRouter = Router();

authRouter.get('/:id', authController.findById);
authRouter.get('/', authController.findAll);

authRouter.post('/', authController.create);

authRouter.put('/:id', authController.update);
authRouter.patch('/:id', authController.patch);

authRouter.delete('/:id', authController.remove);

export default authRouter;


