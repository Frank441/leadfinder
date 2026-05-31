import type { SenasaData, ArcaData } from "@leadfinder/shared/types/leads";
import type { PrismaCuitData } from "@/types/api";
import type { CuitRepository } from "./cuit.repository";
import { NotFoundError } from "@/errors/errors";

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
            senasa:       this.mapSenasa(empresa),
            arca:         this.mapArca(empresa),
        };
    }

    // ─── Mappers ───────────────────────────────────────────────────────────────

    private mapSenasa(empresa: PrismaCuitData): SenasaData {
        const s = empresa.senasa[0] ?? null;
        return {
            actividad:      empresa.actividad_principal ?? s?.tipo_explotacion ?? 'N/A',
            cabezas:        0,
            superficieHa:   Number(s?.superficie ?? empresa.superficie ?? 0),
            estadoSanitario: s?.fecha_baja ? 'Inactivo' : 'Activo',
            renspaActivo:   !s?.fecha_baja,
        };
    }

    private mapArca(empresa: PrismaCuitData): ArcaData {
        const a = empresa.arca[0] ?? null;
        if (!a) return {
            categoria:        'Sin datos',
            estadoCUIT:       'Inactivo',
            actividadAfip:    'N/A',
            obligacionesAlDia: false,
            ultimoPago:       'N/A',
        };
        return {
            categoria:        a.monotributo !== 'NI' ? 'Monotributista' : 'Responsable Inscripto',
            estadoCUIT:       'Activo',
            actividadAfip:    a.actividad_codigo ?? 'N/A',
            obligacionesAlDia: a.imp_ganancias === 'AC' || a.imp_iva === 'AC',
            ultimoPago:       'N/A',
        };
    }
}
