import type { RequestHandler } from "express";
import type { CuitService } from "./cuit.service";
import { NotFoundError } from "@/errors/errors";

export class CuitController {
    constructor(private readonly service: CuitService) {}

    getFiscal: RequestHandler = async (req, res) => {
        try {
            const data = await this.service.getFiscal(String(req.params.cuit));
            res.json(data);
        } catch (err) {
            if (err instanceof NotFoundError) {
                res.status(404).json({ message: err.message });
                return;
            }
            console.error('[CuitController]', err);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    };
}
