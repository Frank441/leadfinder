# leadfinder

## Configuración del entorno de desarrollo

### Prerequisitos
Antes de comenzar, asegurate de tener instalado:
- Node.js v20+
- pnpm
- Docker y Docker Compose

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
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`
- `DATABASE_URL`
- `JWT_SECRET`

### 3. Inicializar la base de datos
```bash
docker compose up -d
```

### 4. Instalar dependencias
```bash
pnpm install && pnpm --filter shared build
```

### 5. Ejecutar las migraciones
```bash
cd backend
npx prisma migrate dev
```

### 6. Cargar datos de prueba
```bash
npx prisma db seed
```

### 7. Iniciar el servidor de desarrollo
```bash
pnpm dev
```

### 8. Iniciar el cliente
```bash
cd ../frontend
pnpm dev
```

Una vez completados los pasos, el backend estará disponible en `http://localhost:3000` y el frontend en `http://localhost:5173`.