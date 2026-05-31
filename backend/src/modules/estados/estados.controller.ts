import type { RequestHandler } from "express";
import type { EstadosRepository } from "./estados.repository";

export class EstadosController {
    constructor(private readonly repository: EstadosRepository) {}

    getAll: RequestHandler = async (_req, res) => {
        const estados = await this.repository.findAll();
        res.json(estados);
    };
}
