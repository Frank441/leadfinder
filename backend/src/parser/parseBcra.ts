import xlsx from "xlsx";
import { Bcra, BcraEntidad, ParserResult, ParserError } from "../types/parser";
import { normalizeCuit, normalizeDate } from "../utils/excelNormalizers";

interface BcraRow {
  CUIT: unknown;
  denominacion: unknown;
  periodo: unknown;
  entidad: unknown;
  situacion: unknown;
  monto: unknown;
  FechaHoraConsultaEndpoint: unknown;
}

const MAX_SITUACION = 6;

export function parseBcra(
  filePath: string,
  options: { maxSituacion?: number } = {}
): { records: Bcra[]; result: ParserResult } {
  const startTime = Date.now();
  const errors: ParserError[] = [];
  const umbral = options.maxSituacion ?? MAX_SITUACION;

  const workbook = xlsx.readFile(filePath, { cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json<BcraRow>(sheet, { defval: null });

  const byKey = new Map<
    string,
    { denominacion: string; entidades: BcraEntidad[]; periodo: number | null; fecha_consulta: Date | null }
  >();

  let skipped = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2;

    const cuit = normalizeCuit(row.CUIT);
    if (!cuit) {
      errors.push({ row: rowNum, cuit: cuit ?? "", message: `CUIT inválido: "${row.CUIT}"` });
      skipped++;
      continue;
    }

    const situacion = Number(row.situacion);
    if (isNaN(situacion) || situacion < 1 || situacion > 6) {
      errors.push({
        row: rowNum,
        cuit,
        message: `Situación inválida: "${row.situacion}"`,
      });
      skipped++;
      continue;
    }

    const monto = row.monto !== null ? Number(String(row.monto).replace(",", ".")) : 0;
    const periodo = row.periodo ? Number(row.periodo) : null;
    const fechaConsulta = normalizeDate(row.FechaHoraConsultaEndpoint);

    if (!byKey.has(cuit)) {
      byKey.set(cuit, {
        denominacion: row.denominacion ? String(row.denominacion).trim() : "",
        entidades: [],
        periodo,
        fecha_consulta: fechaConsulta,
      });
    }

    byKey.get(cuit)!.entidades.push({
      entidad: row.entidad ? String(row.entidad).trim() : "",
      situacion,
      monto: isNaN(monto) ? 0 : monto,
      periodo: periodo ?? 0,
    });
  }

  const records: Bcra[] = [];

  for (const [cuit, data] of byKey.entries()) {
    const peor = Math.max(...data.entidades.map((e) => e.situacion));

    if (peor > umbral) {
      continue;
    }

    records.push({
      cuit,
      denominacion: data.denominacion,
      situacion_peor: peor,
      entidades: data.entidades,
      periodo: data.periodo,
      fecha_consulta: data.fecha_consulta,
    });
  }

  const totalCuits = byKey.size;
  const filtrados = totalCuits - records.length;

  return {
    records,
    result: {
      source: "bcra",
      totalRows: rows.length,
      parsedRows: records.length,
      skippedRows: skipped + filtrados,
      errors,
      durationMs: Date.now() - startTime,
    },
  };
}