# Sistema de Recomendaciones Personalizadas por Provincia

## Resumen

Se ha implementado un sistema completo de recomendaciones personalizadas de lugares turísticos basado en la provincia de origen del usuario. El sistema filtra las calificaciones para que solo se consideren las de usuarios de la misma provincia, proporcionando recomendaciones más relevantes y personalizadas.

## Características Principales

### 1. Detección Automática de Provincia
- Al registrarse, el sistema detecta automáticamente la provincia del usuario desde su cédula ecuatoriana
- El campo `provincia` se agrega automáticamente al modelo de Usuario

### 2. Algoritmo de Recomendaciones por Provincia
- **Filtrado inteligente**: Solo considera calificaciones de usuarios de la misma provincia de origen
- **Ejemplo**: Si un usuario de Loja busca recomendaciones para Guayaquil, solo se consideran las calificaciones de otros usuarios de Loja que hayan calificado lugares de Guayaquil
- **Aislamiento**: Las calificaciones de usuarios de otras provincias (ej: Pichincha) NO influyen en las recomendaciones

### 3. Sistema de Calificaciones (1-5 estrellas)
- Las calificaciones van de 1 a 5 estrellas
- El algoritmo calcula un score basado en:
  - Promedio de calificaciones de usuarios de la misma provincia
  - Factor de confianza basado en la cantidad de calificaciones
  - Score final = promedio × (0.7 + factorConfianza × 0.3)

### 4. Colección Hija: LugaresRecomendados
- Almacena las recomendaciones personalizadas
- Combina: Usuario + Lugar Turístico + Ruta (destino)
- Incluye metadatos: provincia de origen, ciudad de destino, score, etc.

## Archivos Creados/Modificados

### Modelos
- ✅ `backend/src/models/userModel.js` - Agregado campo `provincia`
- ✅ `backend/src/models/lugaresRecomendadosModel.js` - Nuevo modelo de colección hija

### Utilidades
- ✅ `backend/src/utils/provinciaUtils.js` - Utilidades para manejo de provincias y ciudades

### Core/Algorithm
- ✅ `backend/src/core/recommendationCore.js` - Algoritmo principal de recomendaciones

### Servicios
- ✅ `backend/src/services/authService.js` - Actualizado para detectar provincia
- ✅ `backend/src/services/recomendacionService.js` - Agregado método por provincia

### Controladores
- ✅ `backend/src/controllers/recomendacionController.js` - Nuevo endpoint `verRecomendados`

### Repositorios
- ✅ `backend/src/repositories/calificacionRepo.js` - Agregado método por provincia
- ✅ `backend/src/repositories/rutaRepo.js` - Agregados métodos `findByDestino` y `findByOrigen`

### Rutas
- ✅ `backend/src/routes/recomendacionRoutes.js` - Nuevo endpoint `/ver-recomendados`

### Scripts
- ✅ `backend/src/scripts/populateCalificaciones.js` - Script para poblar calificaciones de prueba
- ✅ `backend/src/scripts/lugaresRecomendadosScript.js` - Script de la colección hija
- ✅ `backend/src/scripts/LUGARES_RECOMENDADOS_SCRIPT.md` - Documentación del script

## Endpoints API

### 1. Ver Recomendados (Principal)
```
GET /api/recomendaciones/ver-recomendados?ciudadDestino=Guayaquil
Headers: Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "usuario": {
    "id": "...",
    "nombre": "Carlos",
    "apellido": "Mendoza",
    "provincia": "Loja"
  },
  "ciudadDestino": "Guayaquil",
  "totalRecomendaciones": 5,
  "recomendados": [
    {
      "_id": "...",
      "nombre": "Malecón 2000",
      "ciudad": "Guayaquil",
      "calificacionPromedio": 4.8,
      "totalCalificaciones": 12,
      "score": 4.75,
      "provinciaOrigen": "Loja",
      "ciudadDestino": "Guayaquil",
      "provinciaDestino": "Guayas"
    }
  ]
}
```

### 2. Obtener Recomendaciones Guardadas
```
GET /api/recomendaciones/guardados?usuarioId=...&rutaId=...
Headers: Authorization: Bearer <token>
```

### 3. Recomendaciones Generales (Compatibilidad)
```
GET /api/recomendaciones?ciudad=Guayaquil&usuarioId=...
```

## Cómo Usar

### 1. Poblar Datos de Prueba

```bash
# Primero, poblar lugares turísticos y rutas
node src/scripts/populateData.js

# Luego, poblar usuarios y calificaciones
node src/scripts/populateCalificaciones.js
```

### 2. Probar el Algoritmo

```bash
# Ejecutar el script de la colección hija
node src/scripts/lugaresRecomendadosScript.js
```

### 3. Usar desde el Frontend

```javascript
// Obtener recomendaciones para un usuario
const response = await fetch('/api/recomendaciones/ver-recomendados?ciudadDestino=Guayaquil', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data.recomendados); // Array de lugares recomendados ordenados por score
```

## Ejemplo de Funcionamiento

### Escenario: Usuario de Loja busca lugares en Guayaquil

1. **Usuario de Loja** (provincia: Loja) busca recomendaciones para **Guayaquil**
2. El sistema:
   - Busca lugares turísticos en Guayaquil
   - Filtra calificaciones: **SOLO** de usuarios de Loja que hayan calificado lugares de Guayaquil
   - **IGNORA** calificaciones de usuarios de otras provincias (Pichincha, Guayas, etc.)
   - Calcula el promedio y score basado solo en calificaciones de usuarios de Loja
   - Ordena los lugares por score descendente

3. **Resultado**: El usuario de Loja ve los lugares más recomendados por otros usuarios de Loja que han visitado Guayaquil

## Estructura de la Colección Hija

```javascript
{
  usuario: ObjectId,              // Usuario que recibe la recomendación
  lugarTuristico: ObjectId,      // Lugar turístico recomendado
  ruta: ObjectId,                 // Ruta (origen -> destino)
  provinciaOrigen: "Loja",        // Provincia de origen del usuario
  ciudadDestino: "Guayaquil",     // Ciudad de destino
  provinciaDestino: "Guayas",     // Provincia de destino
  calificacionPromedio: 4.8,     // Promedio de calificaciones (1-5)
  totalCalificaciones: 12,        // Total de calificaciones de usuarios de Loja
  score: 4.75,                   // Score calculado por el algoritmo
  fechaCalculo: Date,            // Fecha de cálculo
  createdAt: Date                 // Fecha de creación
}
```

## Notas Importantes

1. **Solo usuarios ecuatorianos**: El sistema requiere que el usuario tenga una provincia asignada (solo usuarios con cédula ecuatoriana)
2. **Calificaciones necesarias**: Se requieren calificaciones de usuarios de la misma provincia para generar recomendaciones
3. **Aislamiento por provincia**: Las calificaciones de otras provincias NO influyen en las recomendaciones
4. **Actualización automática**: Las recomendaciones se actualizan automáticamente cuando se calculan nuevas

## Próximos Pasos

1. Ejecutar los scripts de población de datos
2. Probar el endpoint `/ver-recomendados` con diferentes usuarios y ciudades
3. Integrar el endpoint en el frontend en el apartado "Ver Recomendados"
4. Monitorear el rendimiento del algoritmo y ajustar si es necesario

