import type { User, UserId, UserRole } from "./user";

export interface LoginDTO {
    email:    string;
    password: string;
}

export interface SignupDTO {
    nombre:    string;
    apellido:  string;
    email:     string;
    password:  string;
    telefono?: string;
    roleId:    number;
}

export interface AuthTokenPayload {
    sub: UserId;
    email: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}

export interface AuthResult {
    user: User;
    token: string;
}