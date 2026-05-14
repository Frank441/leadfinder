import type { AuthRepository } from "./auth.repository";

export class AuthService {
    constructor (
        private readonly repository: AuthRepository
    ) {}
}