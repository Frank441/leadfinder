import type { Brand } from "./utils";

export type UserId = Brand<string, "UserId">;
export const toUserId = (value: string | number): UserId => {
    return `${value}` as UserId;
}

export const ROLES = {
    director: 'director',
    supervisor: 'supervisor',
    representante: 'representante', 
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];


export interface User {
    id:                UserId;
    nombre:            string;
    apellido:          string;
    email:             string;
    telefono:          string | null;
    activo:            boolean;
    role:              UserRole;
    fechaCreacion:     Date;
    fechaUltimoAcceso: Date | null;
}