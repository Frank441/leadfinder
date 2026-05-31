import type { User } from "@leadfinder/shared/types/user";
import type { RequestHandler } from "express";
import type { Prisma } from "../../generated/prisma";

export interface IRepository<T, I> {
    findById(id: I): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(data: unknown): Promise<T>;
    update(id: I, data: unknown): Promise<boolean>;
    patch(id: I, data: Partial<unknown>): Promise<boolean>;
    remove(id: I): Promise<boolean>;
}

export interface UserWithHash extends User {
    passwordHash: string;
}

export type PrismaUsuarioWithRole = Prisma.usuariosGetPayload<{ include: { role: true } }>;

export type PrismaCuitData = Prisma.empresasGetPayload<{
    include: { senasa: true; arca: true };
}>;

export interface IAuthRepository {
    findByEmail(email: string): Promise<UserWithHash | null>
}



export interface IController {
    findById: RequestHandler;
    findAll: RequestHandler;

    create: RequestHandler;

    update: RequestHandler;
    patch: RequestHandler;

    remove: RequestHandler;
}