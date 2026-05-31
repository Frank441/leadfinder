import type { Brand } from "./utils";

export type UserId = Brand<string, "UserId">;
export const toUserId = (value: string | number): UserId => {
    return `${value}` as UserId;
}

export type UserRole =
    | "director"
    | "supervisor"
    | "representante";


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