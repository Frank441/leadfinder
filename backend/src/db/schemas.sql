-- Usuarios y roles (US01, US04, US08 / TT12)
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('director','supervisor','representante')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- CUITs del universo prospectable
CREATE TABLE cuits (
  cuit        TEXT PRIMARY KEY,       -- 11 dígitos, sin guiones
  razon_social TEXT,
  actividad   TEXT,                   -- SENASA
  situacion_fiscal TEXT,              -- ARCA/BCRA
  lat         NUMERIC(9,6),
  lng         NUMERIC(9,6),
  last_synced TIMESTAMPTZ
);

-- Leads: relación entre un CUIT y el equipo comercial
CREATE TABLE leads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cuit          TEXT REFERENCES cuits(cuit),
  asignado_a    UUID REFERENCES users(id),
  asignado_por  UUID REFERENCES users(id),
  estado        TEXT NOT NULL CHECK (
                  estado IN ('nuevo', 'contactado', 'interesado', 'prospecto', 'cliente', 'descartado')
                ),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Notas de visita (US12)
CREATE TABLE notas (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id    UUID REFERENCES leads(id) ON DELETE CASCADE,
  autor_id   UUID REFERENCES users(id),
  contenido  TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit log (trazabilidad de cambios de estado)
CREATE TABLE lead_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     UUID REFERENCES leads(id),
  usuario_id  UUID REFERENCES users(id),
  evento      TEXT NOT NULL,           -- 'asignado', 'estado_cambiado', etc.
  detalle     JSONB,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Índices críticos para el MVP
CREATE INDEX idx_leads_asignado ON leads(asignado_a);
CREATE INDEX idx_leads_estado   ON leads(estado);
CREATE INDEX idx_cuits_geo      ON cuits(lat, lng);  -- soporte para consultas por zona