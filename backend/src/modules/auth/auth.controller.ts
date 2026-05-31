import type { LoginDTO, SignupDTO } from "@leadfinder/shared/types/auth";
import { toUserId } from "@leadfinder/shared/types/user";
import type { RequestHandler } from "express";
import { type AuthService } from "./auth.service";
import { ConflictError, UnauthorizedError } from "@/errors/errors";


export class AuthController {
    constructor(
        private readonly service: AuthService
    ) {}

    login: RequestHandler = async (req, res) => {
        // TODO: Usar tc(...).
        try {
            const dto: LoginDTO = req.body;
            const result = await this.service.login(dto);
            res.status(200).json(result);
        } catch (err) {
            this.handleError(err, res);
        }
    }

    signup: RequestHandler = async (req, res) => {
        // TODO: Usar tc(...).
        try {
            const dto: SignupDTO = req.body;
            const result = await this.service.signup(dto);
            res.status(201).json(result);
        } catch (err) {
            this.handleError(err, res);
        }
    }

    /**
     * Requiere el middleware `authenticate` antes de esta ruta.
     * El middleware adjunta `req.user` con el payload del JTW.
     */
    me: RequestHandler = async (req, res) => {
        // TODO: Usar tc(...).
        try {
            const userId = toUserId(req.user!.sub);
            const user = await this.service.me(userId);
            res.status(200).json(user);
        } catch (err) {
            this.handleError(err, res);
        }
    }


    private handleError(err: unknown, res: Parameters<RequestHandler>[1]): void {
        if (err instanceof UnauthorizedError || err instanceof ConflictError) {
            res.status(err.statusCode).json({ message: err.message });
            return;
        }

        console.error('[AuthController]', err);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
}