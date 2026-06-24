# API REST — Lead Finder

Documentación de los endpoints del backend.

- **Base URL (desarrollo):** `http://localhost:3000`
- **Prefijo de versión:** `/api/v1`
- **Formato:** JSON (`Content-Type: application/json`)

## Autenticación

La mayoría de los endpoints requieren un **JWT** en el header `Authorization`:

```
Authorization: Bearer <token>
```

El token se obtiene desde `POST /api/v1/auth/login` y contiene el payload:

```ts
{
  sub: string;   // id del usuario
  email: string;
  role: "director" | "supervisor" | "representante";
  iat?: number;
  exp?: number;
}
```

### Roles

| Rol             | Descripción                                              |
|-----------------|----------------------------------------------------------|
| `director`      | Acceso total, incluye estadísticas y alta de usuarios.   |
| `supervisor`    | Gestión de leads y asignación de representantes.         |
| `representante` | Acceso a sus propios leads.                              |

### Errores de autenticación / autorización

| Código | Caso                                                        | Body                                                                   |
|--------|-------------------------------------------------------------|------------------------------------------------------------------------|
| `401`  | Falta el header `Authorization` o no empieza con `Bearer `. | `{ "message": "Token requerido." }`                                    |
| `401`  | Token inválido o expirado.                                  | `{ "message": "Token inválido o expirado." }`                          |
| `403`  | El rol del usuario no tiene permiso para el recurso.        | `{ "message": "No tenés permisos para acceder a este recurso." }`      |

### Errores generales

| Código | Caso                          | Body                                              |
|--------|-------------------------------|---------------------------------------------------|
| `400`  | Parámetro/cuerpo inválido.    | `{ "message": "<detalle>" }`                      |
| `404`  | Recurso no encontrado.        | `{ "message": "<detalle>" }`                      |
| `500`  | Error interno del servidor.   | `{ "message": "Error interno del servidor." }`    |

---

## Health

### `GET /api/health`

Verifica que el servidor esté operativo. **No requiere autenticación.**

**Respuesta `200`:**
```json
{ "status": "ok", "timestamp": "2026-06-24T12:00:00.000Z" }
```

---

## Auth — `/api/v1/auth`

### `POST /api/v1/auth/login`

Inicia sesión y devuelve el usuario junto con el JWT. **Público.**

**Body:**
```json
{ "email": "director@colombomagliano.com", "password": "Director123!" }
```

**Respuesta `200`:**
```json
{
  "user": {
    "id": "1",
    "nombre": "...",
    "apellido": "...",
    "email": "...",
    "telefono": null,
    "activo": true,
    "role": "director",
    "fechaCreacion": "2026-01-01T00:00:00.000Z",
    "fechaUltimoAcceso": null
  },
  "token": "<jwt>"
}
```

**Errores:** `401` (credenciales inválidas).

---

### `POST /api/v1/auth/signup`

Crea un nuevo usuario. **Requiere autenticación y rol `director`.**

**Body:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@colombomagliano.com",
  "password": "Password123!",
  "telefono": "+54...",
  "roleId": 3
}
```
> `telefono` es opcional.

**Respuesta `201`:** mismo formato que `login` (`{ user, token }`).

**Errores:** `409` (email ya registrado), `401`/`403`.

---

### `GET /api/v1/auth/me`

Devuelve el usuario autenticado a partir del token. **Requiere autenticación.**

**Respuesta `200`:** objeto `User` (mismo formato que `user` en `login`).

---

## CUIT — `/api/v1/cuit`

Consulta datos externos (SENASA / ARCA / BCRA) por CUIT. **Todos requieren autenticación.**

### `GET /api/v1/cuit/:cuit/fiscal`

Datos fiscales y productivos de la empresa.

**Respuesta `200`:**
```json
{
  "cuit": "30-12345678-9",
  "razonSocial": "...",
  "localidad": "...",
  "provincia": "...",
  "actividad": "...",
  "superficieHa": 120,
  "senasa": {
    "actividad": "...",
    "superficieHa": 120,
    "estadoSanitario": "...",
    "renspaActivo": true
  },
  "arca": {
    "categoria": "...",
    "estadoCUIT": "Activo",
    "actividadAfip": "...",
    "obligacionesAlDia": true,
    "ultimoPago": "05/2026"
  }
}
```

**Errores:** `404` (`CUIT <cuit> no encontrado.`).

---

### `GET /api/v1/cuit/:cuit/crediticio`

Situación crediticia (BCRA).

**Respuesta `200`:**
```json
{
  "cuit": "30-12345678-9",
  "razonSocial": "...",
  "bcra": {
    "situacion": "Normal",
    "situacionNumero": 1,
    "chequesRechazados": 0,
    "deudasIncobrables": 0,
    "ultimaConsulta": "2026-06-01T00:00:00.000Z"
  }
}
```
> `situacion` ∈ `Normal | Riesgo bajo | Riesgo medio | Riesgo alto | Sin datos`.

**Errores:** `404` (`CUIT <cuit> no encontrado.`).

---

## Estados — `/api/v1/estados`

### `GET /api/v1/estados`

Lista los estados de lead activos, ordenados por `orden`. **Requiere autenticación.**

**Respuesta `200`:**
```json
[
  { "id_estado": 1, "nombre": "lead", "descripcion": "...", "orden": 1, "activo": true },
  { "id_estado": 2, "nombre": "contacto", "descripcion": "...", "orden": 2, "activo": true }
]
```

---

## Leads — `/api/v1/leads`

**Todos requieren autenticación.** El alcance de los resultados depende del rol: un `representante` ve solo sus leads asignados.

### `GET /api/v1/leads/representantes`

Lista los representantes disponibles para asignación.

**Respuesta `200`:**
```json
[
  { "id": "5", "name": "Juan Pérez", "email": "juan@...", "initials": "JP" }
]
```

---

### `GET /api/v1/leads/paginated`

Lista paginada de leads con filtros.

**Query params:**

| Parámetro         | Tipo                                                  | Default | Descripción                          |
|-------------------|-------------------------------------------------------|---------|--------------------------------------|
| `page`            | number                                                | `1`     | Página actual.                       |
| `limit`           | number                                                | `20`    | Cantidad por página.                 |
| `search`          | string                                                | —       | Búsqueda de texto.                   |
| `status`          | `lead`\|`contacto`\|`prospecto`\|`cliente`\|`todos`   | —       | Filtro por estado.                   |
| `zona`            | string                                                | —       | Filtro por zona.                     |
| `actividad`       | string                                                | —       | Filtro por actividad.                |
| `representanteId` | string                                                | —       | Filtro por representante asignado.   |

**Respuesta `200`:**
```json
{ "leads": [ /* objetos Lead */ ], "total": 137 }
```

---

### `GET /api/v1/leads`

Lista completa de leads (sin paginar).

**Query params:** `representanteId` (opcional).

**Respuesta `200`:** array de objetos `Lead`.

**Objeto `Lead`:**
```ts
{
  id: string;
  cuit: string;
  razonSocial: string;
  localidad: string;
  provincia: string;
  zona: string;
  actividad: string;
  status: "lead" | "contacto" | "prospecto" | "cliente";
  score: number;                 // 0–100
  representanteId: string | null;
  superficieHa: number;
  lat: number;
  lng: number;
  senasa: SenasaData;
  arca: ArcaData;
  bcra: BcraData;
  notes: VisitNote[];
}
```

---

### `GET /api/v1/leads/:id`

Devuelve un lead por su ID.

**Respuesta `200`:** objeto `Lead`.

**Errores:** `400` (`ID inválido.`), `404` (`Lead <id> no encontrado.`).

---

### `PUT /api/v1/leads/:id/asignar`

Asigna (o desasigna) un representante a un lead. **Requiere rol `director` o `supervisor`.**

**Body:**
```json
{ "representanteId": "5" }
```
> Enviar `null` para desasignar.

**Respuesta `200`:** objeto `Lead` actualizado.

**Errores:** `400` (`ID inválido.`), `404`, `403`.

---

### `PUT /api/v1/leads/:id/estado`

Actualiza el estado de un lead.

**Body:**
```json
{ "status": "contacto" }
```

**Respuesta `200`:** objeto `Lead` actualizado.

**Errores:** `400` (`ID inválido.` / `El estado es requerido.`), `404` (`Estado "<status>" no encontrado.`).

---

### `POST /api/v1/leads/:id/notas`

Crea una nota de visita en el lead. El autor se toma del token.

**Body:**
```json
{ "content": "Llamada realizada, interesado." }
```

**Respuesta `201`:**
```json
{
  "id": "10",
  "leadId": "3",
  "userId": "5",
  "userName": "Juan Pérez",
  "date": "2026-06-24T12:00:00.000Z",
  "content": "Llamada realizada, interesado."
}
```

**Errores:** `400` (`ID inválido.` / `El contenido de la nota es requerido.`), `404`.

---

### `PUT /api/v1/leads/:id/notas/:noteId`

Edita una nota existente.

**Body:**
```json
{ "content": "Texto actualizado." }
```

**Respuesta `200`:** objeto `VisitNote` actualizado.

**Errores:** `400`, `404` (`Nota <noteId> no encontrada.`).

---

### `DELETE /api/v1/leads/:id/notas/:noteId`

Elimina una nota.

**Respuesta `204`:** sin cuerpo.

**Errores:** `400` (`ID inválido.`), `404` (`Nota <noteId> no encontrada.`).

---

## Stats — `/api/v1/stats`

Estadísticas del dashboard. **Todos requieren autenticación y rol `director`.**

Todos los endpoints aceptan el query param obligatorio **`period`**:

| Parámetro | Valores                      | Obligatorio |
|-----------|------------------------------|-------------|
| `period`  | `month` \| `quarter` \| `year` | Sí        |

Si falta o es inválido → `400` con `El parámetro 'period' es requerido y debe ser uno de: month, quarter, year.`

### `GET /api/v1/stats/total-leads`
```json
{ "totalLeads": 137 }
```

### `GET /api/v1/stats/conversion-rate`
```json
{ "conversionRate": 0.23 }
```

### `GET /api/v1/stats/in-negotiation`
```json
{ "inNegotiation": 18 }
```

### `GET /api/v1/stats/new-clients`
```json
{ "newClients": 9 }
```

### `GET /api/v1/stats/sales-funnel`
```json
[
  { "status": "lead", "count": 80 },
  { "status": "contacto", "count": 40 },
  { "status": "prospecto", "count": 25 },
  { "status": "cliente", "count": 12 }
]
```

### `GET /api/v1/stats/team-ranking`
```json
[
  {
    "representanteId": "5",
    "name": "Juan Pérez",
    "assignedLeads": 30,
    "convertedLeads": 8,
    "conversionRate": 0.27
  }
]
```

### `GET /api/v1/stats/status-breakdown`
```json
[
  { "status": "lead", "count": 80 },
  { "status": "cliente", "count": 12 }
]
```

### `GET /api/v1/stats/leads-by-zone`
```json
[
  { "zone": "Norte", "count": 45 },
  { "zone": "Sur", "count": 30 }
]
```

---

## Resumen de endpoints

| Método   | Ruta                                   | Auth | Rol requerido                |
|----------|----------------------------------------|------|------------------------------|
| `GET`    | `/api/health`                          | No   | —                            |
| `POST`   | `/api/v1/auth/login`                   | No   | —                            |
| `POST`   | `/api/v1/auth/signup`                  | Sí   | `director`                   |
| `GET`    | `/api/v1/auth/me`                      | Sí   | cualquiera                   |
| `GET`    | `/api/v1/cuit/:cuit/fiscal`            | Sí   | cualquiera                   |
| `GET`    | `/api/v1/cuit/:cuit/crediticio`        | Sí   | cualquiera                   |
| `GET`    | `/api/v1/estados`                      | Sí   | cualquiera                   |
| `GET`    | `/api/v1/leads/representantes`         | Sí   | cualquiera                   |
| `GET`    | `/api/v1/leads/paginated`              | Sí   | cualquiera                   |
| `GET`    | `/api/v1/leads`                        | Sí   | cualquiera                   |
| `GET`    | `/api/v1/leads/:id`                    | Sí   | cualquiera                   |
| `PUT`    | `/api/v1/leads/:id/asignar`            | Sí   | `director`, `supervisor`     |
| `PUT`    | `/api/v1/leads/:id/estado`             | Sí   | cualquiera                   |
| `POST`   | `/api/v1/leads/:id/notas`              | Sí   | cualquiera                   |
| `PUT`    | `/api/v1/leads/:id/notas/:noteId`      | Sí   | cualquiera                   |
| `DELETE` | `/api/v1/leads/:id/notas/:noteId`      | Sí   | cualquiera                   |
| `GET`    | `/api/v1/stats/total-leads`            | Sí   | `director`                   |
| `GET`    | `/api/v1/stats/conversion-rate`        | Sí   | `director`                   |
| `GET`    | `/api/v1/stats/in-negotiation`         | Sí   | `director`                   |
| `GET`    | `/api/v1/stats/new-clients`            | Sí   | `director`                   |
| `GET`    | `/api/v1/stats/sales-funnel`           | Sí   | `director`                   |
| `GET`    | `/api/v1/stats/team-ranking`           | Sí   | `director`                   |
| `GET`    | `/api/v1/stats/status-breakdown`       | Sí   | `director`                   |
| `GET`    | `/api/v1/stats/leads-by-zone`          | Sí   | `director`                   |
