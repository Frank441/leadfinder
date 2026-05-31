import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { authenticate, authorize } from "@/middlewares/auth";

const authRepository = new AuthRepository();
const authService    = new AuthService(authRepository);
const authController = new AuthController(authService);

const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.post('/signup', authenticate, authorize('director'), authController.signup);
authRouter.get('/me', authenticate, authController.me);


export default authRouter;


