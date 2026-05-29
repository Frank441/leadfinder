import xlsx from "xlsx";
import { Arca, ParserResult, ParserError } from "../types/parser";
import { normalizeCuit, normalizeArcaString } from "../utils/excelNormalizers";

interface ArcaRow {
  CUIT: unknown;
  "DENOMINACION ": unknown;    
  "IMP GANANCIAS": unknown;
  "IMP IVA": unknown;
  MONOTRIBUTO: unknown;
  "INTEGRANTE SOC": unknown;
  EMPLEADOR: unknown;
  "ACTIVIDAD MONOTRIBUTO": unknown;
}

export function parseArca(
  filePath: string
): { records: Arca[]; result: ParserResult } {
  const startTime = Date.now();
  const errors: ParserError[] = [];

  const workbook = xlsx.readFile(filePath, { cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json<ArcaRow>(sheet, { defval: null });

  const records: Arca[] = [];
  let skipped = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2;

    const cuit = normalizeCuit(row.CUIT);
    if (!cuit) {
      skipped++;
      continue;
    }
    
    const denominacionRaw =
      row["DENOMINACION "] ??
      (row as unknown as Record<string, unknown>)["DENOMINACION"] ??
      null;
    const denominacion = denominacionRaw
      ? String(denominacionRaw).trim()
      : "";

    const impGanancias = normalizeArcaString(row["IMP GANANCIAS"]);
    const impIva = normalizeArcaString(row["IMP IVA"]);
    const monotributo = normalizeArcaString(row["MONOTRIBUTO"]);
    const actividad_codigo = normalizeArcaString(row["ACTIVIDAD MONOTRIBUTO"]);

    const empleadorRaw = normalizeArcaString(row.EMPLEADOR);
    const empleador = empleadorRaw === "S";

    records.push({
      cuit,
      denominacion,
      imp_ganancias: impGanancias,
      imp_iva: impIva,
      monotributo,
      actividad_codigo: actividad_codigo,
      empleador,

    });
  }

  return {
    records,
    result: {
      source: "arca",
      totalRows: rows.length,
      parsedRows: records.length,
      skippedRows: skipped,
      errors,
      durationMs: Date.now() - startTime,
    },
  };
}