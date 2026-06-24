
export function normalizeCuit(cuit: unknown): string | null {
    if (cuit === null || cuit === undefined) { return null; }

    let str = String(cuit).trim();

    str = str.replace(/\.0+$/, "");
    str = str.replace(/-/g, "");
    str = str.replace(/\D/g, "");

    if (str.length !== 11) {
        return null;
    }

    return str;
}

export function normalizeDate(date: unknown): Date | null {
    if (date === null || date === undefined) return null;

    if (typeof date === "number") {
        const excelEpoch = new Date(1899, 11, 30);
        const result = new Date(excelEpoch.getTime() + date * 86400000);
        return isNaN(result.getTime()) ? null : result;
    }

    if (date instanceof Date) {
        return isNaN(date.getTime()) ? null : date;
    }

    if (typeof date === "string") {
        if (date === "NULL" || date.trim() === "") return null;
        const parsed = new Date(date);
        return isNaN(parsed.getTime()) ? null : parsed;
    }

    return null;
}

export function normalizeArcaString(value: unknown): string | null {
    if (value === null || value === undefined) { return null }

    const str = String(value).trim();
    return str === "" ? null : str.toUpperCase();
}

const INVALID_NOMBRE_PATTERNS = [
    "SIN NOMBRE",
    "SIN DENOMINACION",
    "S/D",
    "S/N",
    "S/NOMBRE",
    "SD",
    "SN",
    "NULL",
    "N/A",
    "NA",
    "S.N",
];

const INVALID_PATTERNS = [
    /^-+$/,
    /^\.+$/,
    /^\d+$/,
    /^\d{4}-\d{2}-\d{2}/,
    /^(MON|TUE|WED|THU|FRI|SAT|SUN)/i,
    /^[^A-Z0-9]+$/,
];

function stripAccents(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function isValidNombreEstablecimiento(value: unknown): boolean {
    if (value === null || value === undefined) return false;

    let str = stripAccents(String(value).trim().toUpperCase());
    str = str.replace(/\.+$/, "");

    if (!str || str.length < 3) return false;
    if (INVALID_NOMBRE_PATTERNS.includes(str)) return false;
    if (INVALID_PATTERNS.some((pattern) => pattern.test(str))) return false;

    return true;
}

export function pickBestSenasaRecord<T extends { nombre_establecimiento: string | null }>(
    records: T[]
): T | null {
    if (records.length === 0) return null;

    const withValidName = records.find((r) => isValidNombreEstablecimiento(r.nombre_establecimiento));
    return withValidName ?? records[0];
}