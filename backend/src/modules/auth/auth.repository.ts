import type { IRepository } from "@/types/api";
import type { CreateUserDTO, UpdateUserDTO, User, UserId } from "@inrias/shared/user";

export class AuthRepository implements IRepository<User, UserId> {
    async findById(id: UserId): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
    
    async findAll(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }

    async create(data: CreateUserDTO): Promise<User> {
        throw new Error("Method not implemented.");
    }

    async update(id: UserId, data: UpdateUserDTO): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async patch(id: UserId, data: Partial<UpdateUserDTO>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async remove(id: UserId): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}