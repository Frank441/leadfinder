import type { AuthResult, AuthTokenPayload, LoginDTO, SignupDTO } from "@leadfinder/shared/types/auth";
import type { AuthRepository } from "./auth.repository";
import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { User } from "@leadfinder/shared/types/user";
import { ConflictError, UnauthorizedError } from "@/errors/errors";

const SALT_ROUNDS = 12;

export class AuthService {
    constructor (
        private readonly repository: AuthRepository
    ) {}

    async login(dto: LoginDTO): Promise<AuthResult> {
        const user = await this.repository.findByEmail(dto.email);

        if (!user) {
            throw new UnauthorizedError("Credenciales inválidas.");
        }

        if (!user.activo) {
            throw new UnauthorizedError("La cuenta está deshabilitada.");
        }

        const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!passwordMatch) {
            throw new UnauthorizedError("Credenciales inválidas.");
        }

        void this.repository.updateLastAccess(user.id);

        const token = this.signToken(user);

        const { passwordHash: _, ...safeUser } = user;
        return { user: safeUser, token };
    }

    async signup(dto: SignupDTO): Promise<AuthResult> {
        const existing = await this.repository.findByEmail(dto.email);
        if (existing) {
            throw new ConflictError("Ya existe un usuario con ese email.");
        }

        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        const user = await this.repository.create({ ...dto, password: passwordHash });

        const token = this.signToken(user);
        return { user, token };
    }

    async me(id: Parameters<AuthRepository['findById']>[0]): Promise<User> {
        const user = await this.repository.findById(id);
        if (!user) {
            throw new UnauthorizedError("Usuario no encontrado.");
        }

        return user;
    }

    private signToken(user: User): string {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET is not set');

        const expiresIn = (process.env.JWT_EXPIRES_IN ?? '7d') as NonNullable<SignOptions['expiresIn']>;

        const payload: AuthTokenPayload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };

        return jwt.sign(payload, secret, { expiresIn });
    }
}