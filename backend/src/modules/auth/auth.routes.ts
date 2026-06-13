import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { authenticate, authorize } from "@/middlewares/auth";
import { ROLES } from "@leadfinder/shared/types/user";

const authRepository = new AuthRepository();
const authService    = new AuthService(authRepository);
const authController = new AuthController(authService);

const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.post('/signup', authenticate, authorize(ROLES.director), authController.signup);
authRouter.get('/me', authenticate, authController.me);


export default authRouter;


