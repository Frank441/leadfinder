import xlsx from "xlsx";
import { ParserError, ParserResult, Senasa } from "../types/parser";
import { isValidNombreEstablecimiento, normalizeCuit, normalizeDate } from "../utils/excelNormalizers";

interface SenasaRow {
  renspa: unknown;
  titular: unknown;
  cuit: unknown;
  fecha_inscripcion: unknown;
  fecha_baja: unknown;
  latitud: unknown;
  longitud: unknown;
  localidad: unknown;
  direccion: unknown;
  superficie: unknown;
  nombre_establecimiento: unknown;
  tipo_explotacion: unknown;
  fetched_at_utc: unknown;
  poligono: unknown;
}

export function parseSenasa(
    filePath: string
): {records: Senasa[]; result: ParserResult} {

    const startTime = Date.now();
    const errors: ParserError[] = [];

    const workbook = xlsx.readFile(filePath, { cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json<SenasaRow>(sheet, { defval: null });

    const records: Senasa[] = [];
    let skipped = 0;

    for (let i = 0; i < rows.length; i++) {

        const row = rows[i];
        const rowNum = i + 2;
        
        const cuit = normalizeCuit(row.cuit);
        if (!cuit) {
        errors.push({ row: rowNum, cuit: cuit ?? "", message: `CUIT inválido: "${row.cuit}"` });
        skipped++;
        continue;
        }

        const renspa = row.renspa ? String(row.renspa).trim() : null;
        if (!renspa || renspa === "NULL") {
            errors.push({ row: rowNum, cuit, message: "renspa vacío o NULL" });
            skipped++;
            continue;
        }

        const superficie = row.superficie !== null && !isNaN(Number(row.superficie))
            ? Number(row.superficie): 0;

        const tipo_explotacion = row.tipo_explotacion
            ? String(row.tipo_explotacion).trim(): null;

        const validTipoExplotacion = tipo_explotacion && tipo_explotacion.length <= 5
            ? tipo_explotacion: null;

        records.push({
            cuit,
            renspa,
            titular: row.titular ? String(row.titular).trim() : "",
            superficie,
            localidad: row.localidad ? String(row.localidad).trim() : null,
            direccion: row.direccion ? String(row.direccion).trim() : null,
            latitud: row.latitud !== null ? Number(row.latitud) : null,
            longitud: row.longitud !== null ? Number(row.longitud) : null,
            tipo_explotacion: validTipoExplotacion,
            nombre_establecimiento: isValidNombreEstablecimiento(row.nombre_establecimiento)
                ? String(row.nombre_establecimiento).trim()
                : null,
            fecha_inscripcion: normalizeDate(row.fecha_inscripcion),
            fecha_baja: normalizeDate(row.fecha_baja),
            fecha_consulta: normalizeDate(row.fetched_at_utc),
            poligono: row.poligono ? String(row.poligono).trim() : null,
            });
        }
            
    return {
        records,
        result: {
        source: "senasa",
        totalRows: rows.length,
        parsedRows: records.length,
        skippedRows: skipped,
        errors,
        durationMs: Date.now() - startTime,
        },
    };
}
