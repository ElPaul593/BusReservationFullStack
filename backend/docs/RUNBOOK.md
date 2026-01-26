# RUNBOOK - BusReservationFullStack

## 1. Backend Setup
**Requisitos**: Node.js v18+, MongoDB (local o Atlas).

### Instalación
```bash
cd backend
npm install
```

### Configuración (.env)
Asegurar que existe el archivo `.env` en `/backend` con:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bus-reservation
JWT_SECRET=tu_secreto_seguro
NODE_ENV=development
```

### Ejecutar Desarrollo
```bash
npm run dev
# Server running on port 5000
# DB Connected
```

## 2. Frontend Setup
**Requisitos**: Node.js v18+.

### Instalación
```bash
cd frontend
npm install
```

### Ejecución
```bash
npm run dev
# Local: http://localhost:5173
```
El frontend detectará automáticamente el API en `http://localhost:5000/api` si estás en localhost.

## 3. Pruebas y Validación (QA)

### Tests Automatizados (Backend)
```bash
cd backend
npm test
# Ejecuta Jest (Unit + Integration)
```

### Documentación API (Swagger)
1. Levantar backend (`npm run dev`).
2. Abrir navegador: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
3. Probar endpoints directamente desde la UI.

### Postman Collection
1. Importar archivo: `backend/docs/postman_collection.json` en Postman.
2. Crear Environment o Variable Global `baseUrl` = `http://localhost:5000/api`.
3. Ejecutar request `Auth > Register` o `Login` para obtener Token.
4. Usar el token para probar endpoints protegidos.

## 4. Endpoints Clave
- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Reservas (Paginado)**: `GET /api/reservas?page=1&limit=10`
- **Estrategia Precios**: `POST /api/boletos` (Calcula precio según fecha/hora)

## 5. Solución de Problemas Comunes
- **Error "Cannot find module 'joi'"**: Ejecutar `npm install` en carpeta backend.
- **Error de Conexión Mongo**: Verificar que mongod está corriendo o la URI es correcta.
