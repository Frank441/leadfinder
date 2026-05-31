import prisma from "../../../prisma/client";

export class EstadosRepository {
    findAll() {
        return prisma.estados_lead.findMany({
            where: { activo: true },
            orderBy: { orden: "asc" },
            select: {
                id_estado:   true,
                nombre:      true,
                descripcion: true,
                orden:       true,
                activo:      true,
            },
        });
    }
}
