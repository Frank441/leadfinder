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
    include: { senasa: true; arca: true; bcra: true };
}>;

export const LEAD_INCLUDE = {
    empresa: { include: { senasa: true, arca: true, bcra: true } },
    estado:  true,
    visitas: { include: { usuario: true }, orderBy: { fecha_visita: 'desc' as const } },
} as const;

export type PrismaLeadWithRelations = Prisma.leadsGetPayload<{
    include: {
        empresa: { include: { senasa: true; arca: true; bcra: true } };
        estado:  true;
        visitas: { include: { usuario: true } };
    };
}>;

export type PrismaVisitaWithUser = Prisma.visitasGetPayload<{
    include: { usuario: true };
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