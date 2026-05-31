import type { RequestHandler } from "express";
import type { LeadsFilters } from "@leadfinder/shared/types/leads";
import type { LeadsService } from "./leads.service";
import { NotFoundError } from "@/errors/errors";

export class LeadsController {
    constructor(private readonly service: LeadsService) {}

    getAll: RequestHandler = async (req, res) => {
        try {
            const user = req.user!;
            const filters: LeadsFilters = {
                search:          req.query.search  as string | undefined,
                status:          req.query.status  as LeadsFilters["status"],
                zona:            req.query.zona    as string | undefined,
                actividad:       req.query.actividad as string | undefined,
                representanteId: req.query.representanteId as string | undefined,
            };
            const leads = await this.service.getAll(user.role, user.sub, filters);
            res.json(leads);
        } catch (err) {
            this.handleError(err, res);
        }
    };

    getById: RequestHandler = async (req, res) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) { res.status(400).json({ message: "ID inválido." }); return; }
            const lead = await this.service.getById(id);
            res.json(lead);
        } catch (err) {
            this.handleError(err, res);
        }
    };

    createNote: RequestHandler = async (req, res) => {
        try {
            const leadId = Number(req.params.id);
            if (isNaN(leadId)) { res.status(400).json({ message: "ID inválido." }); return; }

            const { content } = req.body as { content?: string };
            if (!content?.trim()) {
                res.status(400).json({ message: "El contenido de la nota es requerido." });
                return;
            }

            const note = await this.service.createNote(leadId, Number(req.user!.sub), content.trim());
            res.status(201).json(note);
        } catch (err) {
            this.handleError(err, res);
        }
    };

    private handleError(err: unknown, res: Parameters<RequestHandler>[1]): void {
        if (err instanceof NotFoundError) {
            res.status(404).json({ message: err.message });
            return;
        }
        console.error("[LeadsController]", err);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}
