import type { SenasaData, ArcaData, BcraData } from "@leadfinder/shared/types/leads";
import type { CuitRepository } from "./cuit.repository";
import { NotFoundError } from "@/errors/errors";
import { mapSenasaData, mapArcaData, mapBcraData } from "@/utils/leadMappers";

export interface FiscalResponse {
    cuit:         string;
    razonSocial:  string;
    localidad:    string | null;
    provincia:    string | null;
    actividad:    string | null;
    superficieHa: number;
    senasa:       SenasaData;
    arca:         ArcaData;
}

export interface CrediticioResponse {
    cuit:        string;
    razonSocial: string;
    bcra:        BcraData;
}

export class CuitService {
    constructor(private readonly repository: CuitRepository) {}

    async getFiscal(cuit: string): Promise<FiscalResponse> {
        const empresa = await this.repository.findByCuit(cuit);
        if (!empresa) throw new NotFoundError(`CUIT ${cuit} no encontrado.`);

        return {
            cuit:         empresa.cuit,
            razonSocial:  empresa.nombre_empresa,
            localidad:    empresa.localidad,
            provincia:    empresa.provincia,
            actividad:    empresa.actividad_principal,
            superficieHa: Number(empresa.superficie ?? 0),
            senasa:       mapSenasaData(empresa),
            arca:         mapArcaData(empresa),
        };
    }

    async getCrediticio(cuit: string): Promise<CrediticioResponse> {
        const empresa = await this.repository.findByCuit(cuit);
        if (!empresa) throw new NotFoundError(`CUIT ${cuit} no encontrado.`);

        return {
            cuit:        empresa.cuit,
            razonSocial: empresa.nombre_empresa,
            bcra:        mapBcraData(empresa),
        };
    }
}
