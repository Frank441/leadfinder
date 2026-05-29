
export interface Senasa {
    cuit: string;             
    renspa: string;
    titular: string;
    superficie: number;
    localidad: string | null;
    direccion: string | null;
    latitud: number | null;
    longitud: number | null;
    tipo_explotacion: string | null;
    nombre_establecimiento: string | null;
    fecha_inscripcion: Date | null;
    fecha_baja: Date | null;
    fecha_consulta: Date | null;
    poligono: string | null;
}

export interface Arca {
    cuit: string;              
  denominacion: string;
  imp_ganancias: string | null; 
  imp_iva: string | null;
  monotributo: string | null;
  empleador: boolean;     
  actividad_codigo: string | null;      
}

export interface Bcra {
    cuit: string;
    denominacion: string;
    situacion_peor: number;
    entidades: BcraEntidad[];
    periodo: number | null;
    fecha_consulta: Date | null;
}

export interface BcraEntidad {
    entidad: string;
    situacion: number;
    monto: number;
    periodo: number | null;
}

export interface CuitConsolidado {
    cuit: string;
    senasa: Senasa[] | null;
    arca: Arca | null;
    bcra: Bcra;
}

export interface ParserResult {
    source: "senasa" | "arca" | "bcra";
    totalRows: number;
    parsedRows: number;
    skippedRows: number;
    errors: ParserError[];
    durationMs: number;
}

export interface ParserError {
  row: number;
  cuit: string;
  message: string;
}