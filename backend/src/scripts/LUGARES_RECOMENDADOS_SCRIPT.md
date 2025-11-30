# Script de la Colección Hija: LugaresRecomendados

## Descripción

La colección `LugaresRecomendados` es una colección hija que almacena las recomendaciones personalizadas de lugares turísticos basadas en:
- **Provincia de origen del usuario**: Solo se consideran calificaciones de usuarios de la misma provincia
- **Ciudad de destino**: Lugares turísticos de la ciudad a la que viaja el usuario
- **Ruta**: La ruta específica (origen -> destino)

## Estructura de la Colección

```javascript
{
  usuario: ObjectId,              // Referencia al usuario que recibe la recomendación
  lugarTuristico: ObjectId,      // Referencia al lugar turístico recomendado
  ruta: ObjectId,                // Referencia a la ruta (origen -> destino)
  provinciaOrigen: String,       // Provincia de origen del usuario (ej: "Loja")
  ciudadDestino: String,         // Ciudad de destino (ej: "Guayaquil")
  provinciaDestino: String,      // Provincia de destino (ej: "Guayas")
  calificacionPromedio: Number,  // Promedio de calificaciones (1-5) de usuarios de la misma provincia
  totalCalificaciones: Number,   // Total de calificaciones de usuarios de la misma provincia
  score: Number,                 // Score calculado por el algoritmo de recomendaciones
  fechaCalculo: Date,            // Fecha en que se calculó esta recomendación
  createdAt: Date                // Fecha de creación del registro
}
```

## Índices

La colección tiene los siguientes índices para búsquedas eficientes:

1. `{ usuario: 1, ruta: 1 }` - Búsqueda por usuario y ruta
2. `{ provinciaOrigen: 1, ciudadDestino: 1 }` - Búsqueda por provincia y destino
3. `{ provinciaOrigen: 1, provinciaDestino: 1 }` - Búsqueda por provincias
4. `{ score: -1 }` - Ordenamiento por score descendente
5. `{ fechaCalculo: -1 }` - Ordenamiento por fecha de cálculo

## Ejemplos de Uso

### 1. Crear recomendaciones para un usuario

```javascript
const RecommendationCore = require('../core/recommendationCore');

// Usuario de Loja buscando lugares en Guayaquil
const recomendados = await RecommendationCore.getRecomendadosPorProvincia(
  'Loja',        // Provincia de origen
  'Guayaquil',   // Ciudad de destino
  usuarioId      // ID del usuario (opcional, para guardar en la colección)
);
```

### 2. Consultar recomendaciones guardadas

```javascript
const recomendaciones = await RecommendationCore.getRecomendadosGuardados(
  usuarioId,
  rutaId
);
```

### 3. Consultar por provincia y destino

```javascript
const recomendaciones = await RecommendationCore.getRecomendadosPorProvinciaYDestino(
  'Loja',      // Provincia de origen
  'Guayaquil'  // Ciudad de destino
);
```

### 4. Consultas directas con Mongoose

```javascript
const LugaresRecomendados = require('../models/lugaresRecomendadosModel');

// Obtener todas las recomendaciones de un usuario
const recomendaciones = await LugaresRecomendados.find({ usuario: usuarioId })
  .populate('lugarTuristico')
  .populate('ruta')
  .sort({ score: -1 })
  .lean();

// Obtener recomendaciones por provincia de origen
const recomendacionesLoja = await LugaresRecomendados.find({ 
  provinciaOrigen: 'Loja',
  ciudadDestino: 'Guayaquil'
})
  .populate('lugarTuristico')
  .sort({ score: -1 })
  .lean();
```

## Algoritmo de Recomendaciones

El algoritmo funciona de la siguiente manera:

1. **Filtrado por provincia**: Solo se consideran calificaciones de usuarios de la misma provincia de origen
   - Ejemplo: Si un usuario de Loja busca recomendaciones para Guayaquil, solo se consideran las calificaciones de otros usuarios de Loja que hayan calificado lugares de Guayaquil
   - Las calificaciones de usuarios de otras provincias (ej: Pichincha) NO influyen

2. **Cálculo del score**:
   - Promedio de calificaciones (1-5 estrellas) de usuarios de la misma provincia
   - Factor de confianza basado en la cantidad de calificaciones
   - Score final = promedio × (0.7 + factorConfianza × 0.3)

3. **Ordenamiento**: Los lugares se ordenan por score descendente (mejores primero)

## Script de Ejecución

Para ejecutar el script de ejemplo:

```bash
node src/scripts/lugaresRecomendadosScript.js
```

Este script incluye:
- Creación de recomendaciones para usuarios
- Consulta de recomendaciones guardadas
- Consulta por provincia y destino
- Estadísticas de la colección
- Limpieza de recomendaciones antiguas

## Notas Importantes

1. **Provincia requerida**: El usuario debe tener una provincia asignada (solo usuarios ecuatorianos)
2. **Calificaciones necesarias**: Se requieren calificaciones de usuarios de la misma provincia para generar recomendaciones
3. **Actualización automática**: Las recomendaciones se actualizan automáticamente cuando se calculan nuevas recomendaciones
4. **Limpieza periódica**: Se recomienda limpiar recomendaciones antiguas (más de 30 días) periódicamente

