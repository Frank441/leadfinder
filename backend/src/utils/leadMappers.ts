import type {
    Lead, LeadStatus,
    SenasaData, ArcaData, BcraData, BcraSituacion,
    VisitNote,
} from "@leadfinder/shared/types/leads";
import type { PrismaCuitData, PrismaLeadWithRelations, PrismaVisitaWithUser } from "@/types/api";

const BCRA_SITUACION: Record<number, BcraSituacion> = {
    1: "Normal",
    2: "Riesgo bajo",
    3: "Riesgo alto",
    4: "Riesgo alto",
    5: "Riesgo alto",
    6: "Riesgo alto",
};

export function mapSenasaData(empresa: PrismaCuitData): SenasaData {
    const s = empresa.senasa[0] ?? null;
    return {
        actividad:       empresa.actividad_principal ?? s?.tipo_explotacion ?? "N/A",
        cabezas:         0,
        superficieHa:    Number(s?.superficie ?? empresa.superficie ?? 0),
        estadoSanitario: s?.fecha_baja ? "Inactivo" : "Activo",
        renspaActivo:    !s?.fecha_baja,
    };
}

export function mapArcaData(empresa: PrismaCuitData): ArcaData {
    const a = empresa.arca[0] ?? null;
    if (!a) return {
        categoria: "Sin datos", estadoCUIT: "Inactivo",
        actividadAfip: "N/A", obligacionesAlDia: false, ultimoPago: "N/A",
    };
    return {
        categoria:         a.monotributo !== "NI" ? "Monotributista" : "Responsable Inscripto",
        estadoCUIT:        "Activo",
        actividadAfip:     a.actividad_codigo ?? "N/A",
        obligacionesAlDia: a.imp_ganancias === "AC" || a.imp_iva === "AC",
        ultimoPago:        "N/A",
    };
}

export function mapBcraData(empresa: PrismaCuitData): BcraData {
    const b = empresa.bcra[0] ?? null;
    return {
        situacion:         b?.situacion_crediticia != null
                               ? (BCRA_SITUACION[b.situacion_crediticia] ?? "Sin datos")
                               : "Sin datos",
        chequesRechazados: 0,
        deudasIncobrables: 0,
        ultimaConsulta:    b?.fecha_consulta?.toISOString() ?? new Date().toISOString(),
    };
}

export function mapVisitNote(v: PrismaVisitaWithUser): VisitNote {
    return {
        id:       String(v.id_visita),
        leadId:   String(v.id_lead),
        userId:   String(v.id_usuario),
        userName: v.usuario ? `${v.usuario.nombre} ${v.usuario.apellido}` : "Usuario",
        date:     v.fecha_visita.toISOString(),
        content:  v.comentarios ?? "",
    };
}

export function mapLead(lead: PrismaLeadWithRelations): Lead {
    return {
        id:              String(lead.id_lead),
        cuit:            lead.empresa.cuit,
        razonSocial:     lead.empresa.nombre_empresa,
        localidad:       lead.empresa.localidad ?? "",
        provincia:       lead.empresa.provincia ?? "",
        zona:            lead.empresa.provincia ?? "",
        actividad:       lead.empresa.actividad_principal ?? "",
        status:          lead.estado.nombre.toLowerCase() as LeadStatus,
        score:           Number(lead.score_viabilidad ?? 0),
        representanteId: lead.id_usuario_asignado ? String(lead.id_usuario_asignado) : null,
        superficieHa:    Number(lead.empresa.superficie ?? 0),
        cabezas:         0,
        lat:             Number(lead.empresa.latitud ?? 0),
        lng:             Number(lead.empresa.longitud ?? 0),
        senasa:          mapSenasaData(lead.empresa),
        arca:            mapArcaData(lead.empresa),
        bcra:            mapBcraData(lead.empresa),
        notes:           lead.visitas.map(mapVisitNote),
    };
}
