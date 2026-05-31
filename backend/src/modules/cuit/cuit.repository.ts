import type { PrismaCuitData } from "@/types/api";
import prisma from "../../../prisma/client";

export class CuitRepository {
    findByCuit(cuit: string): Promise<PrismaCuitData | null> {
        return prisma.empresas.findUnique({
            where: { cuit },
            include: { senasa: true, arca: true, bcra: true },
        });
    }
}
