-- CreateTable
CREATE TABLE "roles" (
    "id_role" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_role")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(30),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_ultimo_acceso" TIMESTAMP(3),
    "token_reset" VARCHAR(255),
    "id_role" INTEGER NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "estados_lead" (
    "id_estado" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "estados_lead_pkey" PRIMARY KEY ("id_estado")
);

-- CreateTable
CREATE TABLE "transiciones_estado" (
    "id_transicion" SERIAL NOT NULL,
    "estado_origen" INTEGER NOT NULL,
    "estado_destino" INTEGER NOT NULL,

    CONSTRAINT "transiciones_estado_pkey" PRIMARY KEY ("id_transicion")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id_empresa" SERIAL NOT NULL,
    "nombre_empresa" VARCHAR(200) NOT NULL,
    "cuit" VARCHAR(20) NOT NULL,
    "actividad_principal" VARCHAR(200),
    "provincia" VARCHAR(100),
    "localidad" VARCHAR(100),
    "direccion" TEXT,
    "latitud" DECIMAL(10,7),
    "longitud" DECIMAL(10,7),
    "renspa" VARCHAR(50),
    "tipo_explotacion" VARCHAR(5),
    "superficie" DECIMAL(10,2),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id_empresa")
);

-- CreateTable
CREATE TABLE "leads" (
    "id_lead" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "id_estado" INTEGER NOT NULL,
    "score_viabilidad" DECIMAL(5,2),
    "situacion_crediticia" INTEGER,
    "fuente_origen" VARCHAR(100),
    "observaciones" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_ultima_actividad" TIMESTAMP(3),
    "id_usuario_asignado" INTEGER,
    "fecha_asignacion" TIMESTAMP(3),
    "fecha_conversion" TIMESTAMP(3),

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id_lead")
);

-- CreateTable
CREATE TABLE "contactos" (
    "id_contacto" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "nombre" VARCHAR(100),
    "apellido" VARCHAR(100),
    "telefono" VARCHAR(50),
    "email" VARCHAR(150),
    "cargo" VARCHAR(100),
    "contacto_principal" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contactos_pkey" PRIMARY KEY ("id_contacto")
);

-- CreateTable
CREATE TABLE "visitas" (
    "id_visita" SERIAL NOT NULL,
    "id_lead" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fecha_visita" TIMESTAMP(3) NOT NULL,
    "resultado" VARCHAR(100),
    "comentarios" TEXT,
    "latitud" DECIMAL(10,7),
    "longitud" DECIMAL(10,7),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitas_pkey" PRIMARY KEY ("id_visita")
);

-- CreateTable
CREATE TABLE "senasa" (
    "id_senasa" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "renspa" VARCHAR(50),
    "titular" VARCHAR(200),
    "tipo_explotacion" VARCHAR(5),
    "superficie" DECIMAL(10,2),
    "nombre_establecimiento" VARCHAR(200),
    "poligono" TEXT,
    "fecha_baja" TIMESTAMP(3),
    "fecha_consulta" TIMESTAMP(3),

    CONSTRAINT "senasa_pkey" PRIMARY KEY ("id_senasa")
);

-- CreateTable
CREATE TABLE "arca" (
    "id_arca" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "cuit" VARCHAR(20),
    "denominacion" VARCHAR(200),
    "imp_ganancias" VARCHAR(10),
    "imp_iva" VARCHAR(10),
    "monotributo" VARCHAR(10),
    "empleador" VARCHAR(5),
    "actividad_codigo" VARCHAR(20),
    "fecha_consulta" TIMESTAMP(3),

    CONSTRAINT "arca_pkey" PRIMARY KEY ("id_arca")
);

-- CreateTable
CREATE TABLE "bcra" (
    "id_bcra" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "cuit" VARCHAR(20),
    "denominacion" VARCHAR(200),
    "periodo" VARCHAR(10),
    "entidad" VARCHAR(200),
    "situacion_crediticia" INTEGER,
    "proceso_judicial" BOOLEAN DEFAULT false,
    "fecha_consulta" TIMESTAMP(3),

    CONSTRAINT "bcra_pkey" PRIMARY KEY ("id_bcra")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_key" ON "roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "estados_lead_nombre_key" ON "estados_lead"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "transiciones_estado_estado_origen_estado_destino_key" ON "transiciones_estado"("estado_origen", "estado_destino");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cuit_key" ON "empresas"("cuit");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "roles"("id_role") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transiciones_estado" ADD CONSTRAINT "transiciones_estado_estado_origen_fkey" FOREIGN KEY ("estado_origen") REFERENCES "estados_lead"("id_estado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transiciones_estado" ADD CONSTRAINT "transiciones_estado_estado_destino_fkey" FOREIGN KEY ("estado_destino") REFERENCES "estados_lead"("id_estado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresas"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "estados_lead"("id_estado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_id_usuario_asignado_fkey" FOREIGN KEY ("id_usuario_asignado") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contactos" ADD CONSTRAINT "contactos_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresas"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitas" ADD CONSTRAINT "visitas_id_lead_fkey" FOREIGN KEY ("id_lead") REFERENCES "leads"("id_lead") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitas" ADD CONSTRAINT "visitas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "senasa" ADD CONSTRAINT "senasa_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresas"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arca" ADD CONSTRAINT "arca_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresas"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bcra" ADD CONSTRAINT "bcra_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresas"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;
