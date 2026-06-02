import prisma from "../../prisma/client";

const GEOREF_URL = "https://apis.datos.gob.ar/georef/api/v2.0/ubicacion";
const BATCH_SIZE = 1000;

interface EmpresaCoords {
    id_empresa: number;
    latitud: number;
    longitud: number;
}

interface GeorefUbicacion {
    provincia: { nombre: string } | null;
}

async function fetchProvincesBatch(
    empresas: EmpresaCoords[]
): Promise<Map <number, string>> {

    const result = new Map<number, string>();

    const body = {
        ubicaciones: empresas.map(e => ({
            lat: Number(e.latitud),
            lon: Number(e.longitud),
            campos: "provincia",
        })),
    };

    const res = await fetch(GEOREF_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        return result;
    }    
    
    const data = await res.json();
    const resultados = data?.resultados ?? [];

    for (let i = 0; i < empresas.length; i++) {
        const provincia = resultados[i]?.ubicacion?.provincia?.nombre ?? null;
        if (provincia) {
            result.set(empresas[i].id_empresa, provincia);
        }
    }

    return result;
}

export async function loadProvincias(): Promise<void> {

    const empresas = await prisma.$queryRaw<EmpresaCoords[]>`
        SELECT id_empresa, latitud, longitud 
        FROM empresas 
        WHERE provincia IS NULL AND latitud IS NOT NULL
    `;

    let actualizadas = 0;
    let fallidas = 0;

    for (let i = 0; i < empresas.length; i += BATCH_SIZE) {
        const batch = empresas.slice(i, i + BATCH_SIZE);
        const provincias = await fetchProvincesBatch(batch);

        await Promise.all(
            batch.map(async (e) => {
                const provincia = provincias.get(e.id_empresa);
                if (!provincia) {
                    fallidas++;
                    return;
                }
                await prisma.empresas.update({
                    where: { id_empresa: e.id_empresa },
                    data: { provincia },
                });
                actualizadas++;
            })
        );
    }

    console.log(`✓ ${actualizadas} empresas con provincia asignada`);
    if (fallidas > 0) console.log(`⚠ ${fallidas} empresas sin provincia`);
}

