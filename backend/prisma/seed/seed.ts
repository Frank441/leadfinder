import bcrypt from "bcrypt";
import { PrismaClient } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { connectionString } from "../client.js";

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed...");

  // ─────────────────────────────────────────────
  //  ROLES
  // ─────────────────────────────────────────────
  const rolDirector = await prisma.roles.upsert({
    where: { nombre: "Director" },
    update: {},
    create: {
      nombre: "Director",
      descripcion: "Acceso total. Visualiza métricas, mapas de calor y gestiona el equipo comercial.",
    },
  });

  const rolSupervisor = await prisma.roles.upsert({
    where: { nombre: "Supervisor" },
    update: {},
    create: {
      nombre: "Supervisor",
      descripcion: "Gestiona el equipo de representantes. Asigna leads y monitorea el pipeline.",
    },
  });

  const rolRepresentante = await prisma.roles.upsert({
    where: { nombre: "Representante" },
    update: {},
    create: {
      nombre: "Representante",
      descripcion: "Opera en campo. Visualiza sus leads asignados y registra visitas.",
    },
  });

  console.log("✅ Roles creados");

  // ─────────────────────────────────────────────
  //  USUARIOS
  // ─────────────────────────────────────────────
  const hashPassword = async (plain: string) => bcrypt.hash(plain, 10);

  await prisma.usuarios.upsert({
    where: { email: "director@colombomagliano.com" },
    update: {},
    create: {
      nombre: "Carlos",
      apellido: "Méndez",
      email: "director@colombomagliano.com",
      password_hash: await hashPassword("Director123!"),
      telefono: "1145678901",
      activo: true,
      id_role: rolDirector.id_role,
    },
  });

  await prisma.usuarios.upsert({
    where: { email: "supervisor@colombomagliano.com" },
    update: {},
    create: {
      nombre: "Laura",
      apellido: "Gómez",
      email: "supervisor@colombomagliano.com",
      password_hash: await hashPassword("Supervisor123!"),
      telefono: "1156789012",
      activo: true,
      id_role: rolSupervisor.id_role,
    },
  });

  const representante = await prisma.usuarios.upsert({
    where: { email: "representante@colombomagliano.com" },
    update: {},
    create: {
      nombre: "Martín",
      apellido: "Torres",
      email: "representante@colombomagliano.com",
      password_hash: await hashPassword("Representante123!"),
      telefono: "1167890123",
      activo: true,
      id_role: rolRepresentante.id_role,
    },
  });

  await prisma.usuarios.upsert({
    where: { email: "representante2@colombomagliano.com" },
    update: {},
    create: {
      nombre: "Sofía",
      apellido: "Reyes",
      email: "representante2@colombomagliano.com",
      password_hash: await hashPassword("Representante123!"),
      telefono: "1178901234",
      activo: true,
      id_role: rolRepresentante.id_role,
    },
  });

  await prisma.usuarios.upsert({
    where: { email: "representante3@colombomagliano.com" },
    update: {},
    create: {
      nombre: "Diego",
      apellido: "Fernández",
      email: "representante3@colombomagliano.com",
      password_hash: await hashPassword("Representante123!"),
      telefono: "1189012345",
      activo: true,
      id_role: rolRepresentante.id_role,
    },
  });

  await prisma.usuarios.upsert({
    where: { email: "representante4@colombomagliano.com" },
    update: {},
    create: {
      nombre: "Valentina",
      apellido: "Cruz",
      email: "representante4@colombomagliano.com",
      password_hash: await hashPassword("Representante123!"),
      telefono: "1190123456",
      activo: true,
      id_role: rolRepresentante.id_role,
    },
  });

  console.log("✅ Usuarios creados");

  // ─────────────────────────────────────────────
  //  ESTADOS DEL LEAD
  // ─────────────────────────────────────────────
  const estadoLead = await prisma.estados_lead.upsert({
    where: { nombre: "Lead" },
    update: {},
    create: {
      nombre: "Lead",
      descripcion: "Establecimiento identificado como potencial cliente. Sin contacto aún.",
      orden: 1,
      activo: true,
    },
  });

  const estadoContacto = await prisma.estados_lead.upsert({
    where: { nombre: "Contacto" },
    update: {},
    create: {
      nombre: "Contacto",
      descripcion: "Se realizó el primer contacto con el establecimiento.",
      orden: 2,
      activo: true,
    },
  });

  const estadoProspecto = await prisma.estados_lead.upsert({
    where: { nombre: "Prospecto" },
    update: {},
    create: {
      nombre: "Prospecto",
      descripcion: "Hay interés confirmado. En evaluación comercial.",
      orden: 3,
      activo: true,
    },
  });

  const estadoCliente = await prisma.estados_lead.upsert({
    where: { nombre: "Cliente" },
    update: {},
    create: {
      nombre: "Cliente",
      descripcion: "Conversión exitosa. Opera con Colombo y Magliano.",
      orden: 4,
      activo: true,
    },
  });

  console.log("✅ Estados del lead creados");

  // ─────────────────────────────────────────────
  //  TRANSICIONES DE ESTADO
  // ─────────────────────────────────────────────
  const transiciones = [
    { origen: estadoLead.id_estado,      destino: estadoContacto.id_estado  },
    { origen: estadoContacto.id_estado,  destino: estadoProspecto.id_estado  },
    { origen: estadoProspecto.id_estado, destino: estadoCliente.id_estado    },
    { origen: estadoContacto.id_estado,  destino: estadoLead.id_estado       }, // retroceso permitido
    { origen: estadoProspecto.id_estado, destino: estadoContacto.id_estado   }, // retroceso permitido
    { origen: estadoProspecto.id_estado, destino: estadoLead.id_estado      }, // retroceso permitido
  ];

  for (const t of transiciones) {
    await prisma.transiciones_estado.upsert({
      where: {
        estado_origen_estado_destino: {
          estado_origen: t.origen,
          estado_destino: t.destino,
        },
      },
      update: {},
      create: {
        estado_origen: t.origen,
        estado_destino: t.destino,
      },
    });
  }

  console.log("✅ Transiciones de estado creadas");

  // ─────────────────────────────────────────────
  //  EMPRESAS (CUITs mockeados)
  // ─────────────────────────────────────────────
  const empresa1 = await prisma.empresas.upsert({
    where: { cuit: "20123456789" },
    update: {},
    create: {
      nombre_empresa: "Establecimiento Don Luis SRL",
      cuit: "20123456789",
      actividad_principal: "Ganadería bovina",
      provincia: "Buenos Aires",
      localidad: "Tandil",
      direccion: "Ruta 226 km 45",
      latitud: -37.3317,
      longitud: -59.1332,
      renspa: "22.001.0.00123/00",
      tipo_explotacion: "G",
      superficie: 1200.00,
    },
  });

  const empresa2 = await prisma.empresas.upsert({
    where: { cuit: "27987654321" },
    update: {},
    create: {
      nombre_empresa: "Campo La Esperanza SA",
      cuit: "27987654321",
      actividad_principal: "Ganadería mixta",
      provincia: "Santa Fe",
      localidad: "Venado Tuerto",
      direccion: "Ruta 8 km 320",
      latitud: -33.7454,
      longitud: -61.9685,
      renspa: "82.003.0.00456/00",
      tipo_explotacion: "M",
      superficie: 850.50,
    },
  });

  const empresa3 = await prisma.empresas.upsert({
    where: { cuit: "30456789123" },
    update: {},
    create: {
      nombre_empresa: "Agropecuaria Los Alamos",
      cuit: "30456789123",
      actividad_principal: "Ganadería bovina",
      provincia: "Córdoba",
      localidad: "Río Cuarto",
      direccion: "Camino rural s/n",
      latitud: -33.1232,
      longitud: -64.3493,
      renspa: "16.002.0.00789/00",
      tipo_explotacion: "G",
      superficie: 2300.00,
    },
  });

  console.log("✅ Empresas creadas");

  // ─────────────────────────────────────────────
  //  DATOS SENASA (cache mockeado)
  // ─────────────────────────────────────────────
  await prisma.senasa.upsert({
    where: { id_senasa: 1 },
    update: {},
    create: {
      id_empresa: empresa1.id_empresa,
      renspa: "22.001.0.00123/00",
      titular: "Luis Alberto García",
      tipo_explotacion: "G",
      superficie: 1200.00,
      nombre_establecimiento: "Est. Don Luis",
      poligono: null,
      fecha_baja: null,
      fecha_consulta: new Date(),
    },
  });

  await prisma.senasa.upsert({
    where: { id_senasa: 2 },
    update: {},
    create: {
      id_empresa: empresa2.id_empresa,
      renspa: "82.003.0.00456/00",
      titular: "María Elena Rodríguez",
      tipo_explotacion: "M",
      superficie: 850.50,
      nombre_establecimiento: "La Esperanza",
      poligono: null,
      fecha_baja: null,
      fecha_consulta: new Date(),
    },
  });

  console.log("✅ Datos SENASA creados");

  // ─────────────────────────────────────────────
  //  DATOS ARCA (cache mockeado)
  // ─────────────────────────────────────────────
  await prisma.arca.upsert({
    where: { id_arca: 1 },
    update: {},
    create: {
      id_empresa: empresa1.id_empresa,
      cuit: "20123456789",
      denominacion: "GARCIA LUIS ALBERTO",
      imp_ganancias: "AC",
      imp_iva: "AC",
      monotributo: "NI",
      empleador: "S",
      actividad_codigo: "011110",
      fecha_consulta: new Date(),
    },
  });

  await prisma.arca.upsert({
    where: { id_arca: 2 },
    update: {},
    create: {
      id_empresa: empresa2.id_empresa,
      cuit: "27987654321",
      denominacion: "CAMPO LA ESPERANZA SA",
      imp_ganancias: "AC",
      imp_iva: "AC",
      monotributo: "NI",
      empleador: "N",
      actividad_codigo: "011120",
      fecha_consulta: new Date(),
    },
  });

  console.log("✅ Datos ARCA creados");

  // ─────────────────────────────────────────────
  //  DATOS BCRA (cache mockeado)
  // ─────────────────────────────────────────────
  await prisma.bcra.upsert({
    where: { id_bcra: 1 },
    update: {},
    create: {
      id_empresa: empresa1.id_empresa,
      cuit: "20123456789",
      denominacion: "GARCIA LUIS ALBERTO",
      periodo: "202604",
      entidad: "Banco Nación Argentina",
      situacion_crediticia: 1,
      proceso_judicial: false,
      fecha_consulta: new Date(),
    },
  });

  await prisma.bcra.upsert({
    where: { id_bcra: 2 },
    update: {},
    create: {
      id_empresa: empresa3.id_empresa,
      cuit: "30456789123",
      denominacion: "AGROPECUARIA LOS ALAMOS",
      periodo: "202604",
      entidad: "Banco Provincia",
      situacion_crediticia: 3,
      proceso_judicial: false,
      fecha_consulta: new Date(),
    },
  });

  console.log("✅ Datos BCRA creados");

  // ─────────────────────────────────────────────
  //  LEADS
  // ─────────────────────────────────────────────
  await prisma.leads.upsert({
    where: { id_lead: 1 },
    update: {},
    create: {
      id_empresa: empresa1.id_empresa,
      id_estado: estadoProspecto.id_estado,
      score_viabilidad: 82.50,
      situacion_crediticia: 1,
      fuente_origen: "SENASA",
      observaciones: "Establecimiento grande, buen historial crediticio.",
      id_usuario_asignado: representante.id_usuario,
      fecha_asignacion: new Date(),
    },
  });

  await prisma.leads.upsert({
    where: { id_lead: 2 },
    update: {},
    create: {
      id_empresa: empresa2.id_empresa,
      id_estado: estadoContacto.id_estado,
      score_viabilidad: 65.00,
      situacion_crediticia: 1,
      fuente_origen: "SENASA",
      observaciones: "Primer contacto realizado por teléfono.",
      id_usuario_asignado: representante.id_usuario,
      fecha_asignacion: new Date(),
    },
  });

  await prisma.leads.upsert({
    where: { id_lead: 3 },
    update: {},
    create: {
      id_empresa: empresa3.id_empresa,
      id_estado: estadoLead.id_estado,
      score_viabilidad: 45.00,
      situacion_crediticia: 3,
      fuente_origen: "SENASA",
      observaciones: "Situación crediticia a monitorear.",
      id_usuario_asignado: null,
    },
  });

  console.log("✅ Leads creados");

  console.log("\n Seed completado exitosamente");
  console.log("\n Credenciales de acceso:");
  console.log("   Director     → director@colombomagliano.com     / Director123!");
  console.log("   Supervisor   → supervisor@colombomagliano.com   / Supervisor123!");
  console.log("   Representante→ representante@colombomagliano.com / Representante123!");
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });