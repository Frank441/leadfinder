# leadfinder

## Configuración del entorno de desarrollo

### Prerequisitos
Antes de comenzar, asegurate de tener instalado:
- Node.js v20+
- pnpm
- Docker Desktop

### 1. Clonar el repositorio
```bash
git clone https://github.com/Frank441/leadfinder.git
cd leadfinder
```

### 2. Configurar las variables de entorno
```bash
cp .env.example .env
```

Completá en el `.env` los valores vacíos con los datos provistos por el equipo de desarrollo:
- `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`
- `DATABASE_URL`
- `JWT_SECRET`

### 3. Instalar dependencias
```bash
pnpm install && pnpm --filter shared build
```

### 4. Inicializar la base de datos
```bash
pnpm run db:dev
```

> Este comando levanta el contenedor de PostgreSQL, espera a que esté listo y aplica las migraciones automáticamente. Requiere que Docker Desktop esté corriendo.

### 5. Generar el cliente Prisma
```bash
npx prisma generate
```

### 6. Cargar datos de prueba
```bash
npx prisma db seed
```

Una vez completado, las credenciales de acceso disponibles son:

| Rol           | Email                                  | Password          |
|---------------|----------------------------------------|-------------------|
| Director      | director@colombomagliano.com           | Director123!      |
| Supervisor    | supervisor@colombomagliano.com         | Supervisor123!    |
| Representante | representante@colombomagliano.com      | Representante123! |

### 7. Iniciar el servidor de desarrollo
```bash
pnpm dev
```

### 8. Iniciar el cliente
Abrí una nueva terminal desde la raíz del proyecto:
```bash
cd frontend
pnpm dev
```

Una vez completados los pasos, el backend estará disponible en `http://localhost:3000` y el frontend en `http://localhost:5173`.

---

## Comandos útiles

### Resetear la base de datos
Si necesitás borrar todo y empezar de cero:
```bash
cd backend
npx prisma migrate reset
```
> Este comando borra todos los datos, re-aplica las migraciones y corre el seed automáticamente.

### Apagar el contenedor de la base de datos
```bash
docker compose down
```
Los datos persisten en el volumen `pg_dev_data`. Si querés borrar también los datos del volumen:
```bash
docker compose down -v
```