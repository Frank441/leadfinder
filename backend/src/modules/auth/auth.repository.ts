import type { IAuthRepository, PrismaUsuarioWithRole, UserWithHash } from "@/types/api";
import type { SignupDTO } from "@leadfinder/shared/types/auth";
import { toUserId } from "@leadfinder/shared/types/user";
import type { User, UserId, UserRole } from "@leadfinder/shared/types/user";
import prisma from "../../../prisma/client";

export class AuthRepository implements IAuthRepository {
    async findByEmail(email: string): Promise<UserWithHash | null> {
        const row = await prisma.usuarios.findUnique({
            where: { email },
            include: { role: true }
        });

        if (!row) return null;
        return this.mapWithHash(row);
    }

    async findById(id: UserId): Promise<User | null> {
        const row = await prisma.usuarios.findUnique({
            where: { id_usuario: Number(id) },
            include: { role: true }
        });

        if (!row) return null;
        return this.map(row);
    }

    async create(data: SignupDTO): Promise<User> {
        const row = await prisma.usuarios.create({
            data: {
                ...data,
                password_hash: data.password,
                telefono: data.telefono ?? null,
                id_role: data.roleId
            },
            include: { role: true }
        });

        return this.map(row);
    }

    async updateLastAccess(id: UserId): Promise<void> {
        await prisma.usuarios.update({
            where: { id_usuario: Number(id) },
            data: { fecha_ultimo_acceso: new Date() }
        });
    }

    private map(row: PrismaUsuarioWithRole): User {
        return {
            id:                toUserId(row.id_usuario),
            nombre:            row.nombre,
            apellido:          row.apellido,
            email:             row.email,
            telefono:          row.telefono,
            activo:            row.activo,
            role:              row.role.nombre.toLowerCase() as UserRole,
            fechaCreacion:     row.fecha_creacion,
            fechaUltimoAcceso: row.fecha_ultimo_acceso,
        };
    }

    private mapWithHash(row: PrismaUsuarioWithRole): UserWithHash {
        return {
            ...this.map(row),
            passwordHash: row.password_hash
        };
    }
}