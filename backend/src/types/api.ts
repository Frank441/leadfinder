import type { RequestHandler } from "express";

export interface IRepository<T, I> {
    findById(id: I): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(data: unknown): Promise<T>;
    update(id: I, data: unknown): Promise<boolean>;
    patch(id: I, data: Partial<unknown>): Promise<boolean>;
    remove(id: I): Promise<boolean>;
}



export interface IController {
    findById: RequestHandler;
    findAll: RequestHandler;

    create: RequestHandler;

    update: RequestHandler;
    patch: RequestHandler;

    remove: RequestHandler;
}