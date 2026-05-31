
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