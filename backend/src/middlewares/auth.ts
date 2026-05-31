import type { AuthTokenPayload } from "@leadfinder/shared/types/auth";
import type { UserRole } from "@leadfinder/shared/types/user";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const authenticate: RequestHandler = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Token requerido.' });
        return;
    }

    // TODO: Usar tc(...).
    try {
        const token = header.slice(7);
        req.user = jwt.verify(token, process.env.JWT_SECRET!) as unknown as AuthTokenPayload;
        next();
    } catch {
        res.status(401).json({ message: 'Token inválido o expirado.' });
    }
}

export const authorize = (...roles: UserRole[]): RequestHandler => {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if (!userRole) {
            res.status(401).json({ message: 'No autenticado.' });
            return;
        }

        if (!roles.includes(userRole)) {
            res.status(403).json({ message: 'No tenés permisos para acceder a este recurso.' });
            return;
        }

        next();
    }
}