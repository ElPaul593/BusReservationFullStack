# RUNBOOK - Bus Reservation FullStack

Este documento contiene todas las instrucciones necesarias para ejecutar el proyecto localmente y desplegarlo.

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración del Backend](#configuración-del-backend)
3. [Configuración del Frontend](#configuración-del-frontend)
4. [Ejecución Local](#ejecución-local)
5. [Testing](#testing)
6. [Swagger Documentation](#swagger-documentation)
7. [Postman Collection](#postman-collection)
8. [Despliegue](#despliegue)

---

## 🔧 Requisitos Previos

- **Node.js**: >= 18.x
- **MongoDB**: Instalado y ejecutándose localmente, o acceso a MongoDB Atlas
- **npm** o **yarn**: Gestor de paquetes de Node.js

---

## 🚀 Configuración del Backend

### 1. Instalar Dependencias

```bash
cd backend
npm install
```

### 2. Configurar Variables de Entorno

Crear archivo `.env` en la carpeta `backend/`:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/busreservation
# O para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/busreservation

# JWT
JWT_SECRET=tu_secret_key_super_segura_aqui

# Puerto del servidor
PORT=5000

# Entorno
NODE_ENV=development

# API URL (para Swagger)
API_URL=http://localhost:5000
```

### 3. Ejecutar Backend

**Modo desarrollo (con nodemon):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El backend estará disponible en: `http://localhost:5000`

### 4. Verificar que el Backend Funciona

```bash
# Health check
curl http://localhost:5000/health

# Debe retornar: {"ok":true,"name":"BusReservation API"}
```

---

## 🎨 Configuración del Frontend

### 1. Instalar Dependencias

```bash
cd frontend
npm install
```

### 2. Configurar Variables de Entorno

Crear archivo `.env` en la carpeta `frontend/` (opcional):

```env
VITE_API_URL=http://localhost:5000/api
```

**Nota**: Si no se configura `VITE_API_URL`, el frontend detectará automáticamente si está en desarrollo y usará `http://localhost:5000/api`.

### 3. Ejecutar Frontend

```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173` (puerto por defecto de Vite)

---

## 🧪 Testing

### Backend Tests

**Ejecutar todos los tests:**
```bash
cd backend
npm test
```

**Modo watch (ejecuta tests al cambiar archivos):**
```bash
npm run test:watch
```

**Con cobertura de código:**
```bash
npm run test:coverage
```

### Tests Disponibles

1. **Unit Tests**: `src/__tests__/strategies/pricingStrategy.test.js`
   - Prueba las estrategias de pricing (Standard, Holiday, LastMinute)
   - Prueba el selector de estrategias

2. **Integration Tests**: `src/__tests__/integration/auth.test.js`
   - Prueba endpoints de autenticación (register, login)
   - Usa MongoDB Memory Server para tests aislados

---

## 📚 Swagger Documentation

### Acceder a Swagger UI

Una vez que el backend esté ejecutándose, accede a:

```
http://localhost:5000/api-docs
```

### Endpoints Documentados

- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Reservas**: `/api/reservas` (GET, POST), `/api/reservas/mine` (GET)
- **Boletos**: `/api/boletos` (GET, POST)
- **Stats**: `/api/stats/reservas` (GET)

### Autenticación en Swagger

1. Haz clic en el botón "Authorize" (🔒) en la parte superior
2. Ingresa: `Bearer <tu_token_jwt>`
3. Haz clic en "Authorize"
4. Ahora puedes probar endpoints protegidos directamente desde Swagger

---

## 📮 Postman Collection

### Importar Collection

1. Abre Postman
2. Click en "Import"
3. Selecciona el archivo: `docs/postman_collection.json`
4. Importa también el environment: `docs/postman_environment.json`

### Configurar Environment

1. Selecciona el environment "Bus Reservation API - Local"
2. Verifica que `baseUrl` esté configurado como: `http://localhost:5000`

### Usar la Collection

1. **Primero**: Ejecuta `Auth > Login` para obtener el token
   - El token se guardará automáticamente en la variable `{{token}}`
   
2. **Luego**: Puedes ejecutar cualquier otro endpoint protegido
   - El token se incluirá automáticamente en el header `Authorization`

### Endpoints Disponibles en Postman

- **Auth**: Register, Login (con auto-guardado de token)
- **Reservas**: Get All (con paginación), Create, Get Mine
- **Boletos**: Get All, Create
- **Stats**: Get Reservas Stats (endpoint no-trivial con agregaciones)

---

## 🏗️ Estructura del Proyecto

### Backend

```
backend/
├── src/
│   ├── config/          # Configuración (DB, Swagger)
│   ├── controllers/     # Controladores HTTP
│   ├── middleware/      # Middlewares (auth, validation, errorHandler)
│   ├── models/          # Modelos de Mongoose
│   ├── repositories/    # Repositorios (acceso a datos)
│   ├── routes/          # Rutas de Express
│   ├── services/        # Lógica de negocio
│   ├── strategies/      # Strategy Pattern (Pricing)
│   ├── utils/           # Utilidades (AppError, asyncHandler, serializers)
│   ├── validations/     # Schemas de validación Joi
│   ├── __tests__/       # Tests (unit e integration)
│   └── app.js           # Configuración de Express
└── package.json
```

### Frontend

```
frontend/
├── src/
│   ├── components/      # Componentes React
│   ├── pages/          # Páginas principales
│   ├── services/       # Servicios API
│   ├── constants/      # Constantes y configuraciones
│   └── styles/        # Estilos CSS
└── package.json
```

---

## 🔍 Verificación de Funcionalidades Implementadas

### ✅ Checklist Completado

- [x] **DTOs / Serialización**: Implementado en `src/utils/serializers.js`
- [x] **Manejo de Errores Centralizado**: `src/middleware/errorHandler.js` + `src/utils/AppError.js`
- [x] **AsyncHandler**: `src/utils/asyncHandler.js` (elimina try/catch repetitivos)
- [x] **Validación con Joi**: `src/middleware/validation.js` + `src/validations/schemas.js`
- [x] **Strategy Pattern**: Implementado en `src/strategies/` (PricingStrategy)
- [x] **Paginación y Filtros**: Implementado en `reservaRepo.findAll()` y controllers
- [x] **Endpoint No-Trivial**: `/api/stats/reservas` con agregaciones MongoDB
- [x] **Swagger/OpenAPI**: Configurado en `src/config/swagger.js`
- [x] **Postman Collection**: Creada en `docs/postman_collection.json`
- [x] **Tests**: Jest configurado con tests unitarios e integración

---

## 🐛 Solución de Problemas

### Backend no inicia

1. Verifica que MongoDB esté ejecutándose:
   ```bash
   # Windows
   net start MongoDB
   
   # Linux/Mac
   sudo systemctl start mongod
   ```

2. Verifica la conexión en `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/busreservation
   ```

3. Verifica que el puerto 5000 no esté en uso:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # Linux/Mac
   lsof -i :5000
   ```

### Frontend no se conecta al Backend

1. Verifica que el backend esté ejecutándose en `http://localhost:5000`
2. Verifica `VITE_API_URL` en `.env` del frontend
3. Verifica CORS en `backend/src/app.js`

### Tests fallan

1. Asegúrate de tener MongoDB Memory Server instalado:
   ```bash
   npm install --save-dev mongodb-memory-server
   ```

2. Si los tests de integración fallan, verifica que no haya conexiones a MongoDB activas

### Swagger no carga

1. Verifica que `swagger-jsdoc` y `swagger-ui-express` estén instalados:
   ```bash
   npm install swagger-jsdoc swagger-ui-express
   ```

2. Verifica que el backend esté ejecutándose

---

## 🚢 Despliegue

### Backend en Render/Railway/Heroku

1. **Configurar variables de entorno** en el panel de control:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT` (generalmente asignado automáticamente)
   - `NODE_ENV=production`

2. **Build command**: (no necesario, Node.js directo)
3. **Start command**: `npm start`

### Frontend en Vercel/Netlify

1. **Build command**: `npm run build`
2. **Output directory**: `dist`
3. **Environment variables**:
   - `VITE_API_URL`: URL de tu backend desplegado

---

## 📝 Notas Adicionales

### Estructura de Respuestas de la API

Todas las respuestas exitosas siguen este formato:

```json
{
  "data": [...],  // Datos serializados
  "pagination": { // Solo en endpoints paginados
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Manejo de Errores

Los errores siguen este formato:

```json
{
  "status": "fail" | "error",
  "message": "Mensaje de error descriptivo"
}
```

### Autenticación

Todos los endpoints protegidos requieren el header:

```
Authorization: Bearer <token_jwt>
```

El token se obtiene del endpoint `/api/auth/login`.

---

## 📞 Soporte

Para problemas o preguntas, revisa:
1. Los logs del backend en la consola
2. La documentación de Swagger en `/api-docs`
3. Los tests para ejemplos de uso de la API

---

**Última actualización**: 2024

