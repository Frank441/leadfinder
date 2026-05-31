import type { LoginDTO, AuthResult } from '@leadfinder/shared/types/auth';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function login(credentials: LoginDTO): Promise<AuthResult> {
    const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    const data = await res.json() as { message?: string } & Partial<AuthResult>;

    if (!res.ok) {
        throw new Error(data.message ?? 'Error al iniciar sesión.');
    }

    return data as AuthResult;
}
