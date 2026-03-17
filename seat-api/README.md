# Seat Availability API

API externa para gestionar disponibilidad de asientos con holds temporales (TTL) y reservas definitivas.

## ✅ Requisitos
- Node.js 18+

## ▶️ Correr local
```bash
npm i
npm run dev
```

## ⚙️ Variables de entorno
```
PORT=3000
NODE_ENV=development

SEAT_HOLD_TTL_MS=600000
SEAT_PURGE_INTERVAL_MS=60000

ALLOWED_ORIGINS=https://mi-frontend.vercel.app,http://localhost:5173
```

## ✅ Endpoints

### 1) GET /api/asientos/disponibles
```bash
curl "http://localhost:3000/api/asientos/disponibles?rutaId=123&fecha=2026-01-26"
```

### 2) POST /api/asientos/reservar
```bash
curl -X POST http://localhost:3000/api/asientos/reservar \
  -H "Content-Type: application/json" \
  -d '{"rutaId":123,"fecha":"2026-01-26","asiento":12,"userId":"U001"}'
```

### 3) GET /api/asientos/holds
```bash
curl http://localhost:3000/api/asientos/holds
```

### 4) DELETE /api/asientos/holds
```bash
curl -X DELETE http://localhost:3000/api/asientos/holds \
  -H "Content-Type: application/json" \
  -d '{"rutaId":123,"fecha":"2026-01-26","asiento":12}'
```

### 5) POST /api/asientos/reservar-definitivo
```bash
curl -X POST http://localhost:3000/api/asientos/reservar-definitivo \
  -H "Content-Type: application/json" \
  -d '{"rutaId":123,"fecha":"2026-01-26","asiento":12,"holdId":"..."}'
```

---

## 🚀 Deploy rápido (Render/Railway/Fly)
1. Subir este repo a GitHub.
2. Crear nuevo servicio (Render/Railway/Fly/Cloud Run).
3. Setear variables de entorno del `.env.example`.
4. Build command: `npm install`
5. Start command: `npm start`

---

## ✅ Snippet de consumo (BusReservationFullStack)
```js
const SEAT_API_URL = process.env.SEAT_API_URL;

async function getDisponibles(rutaId, fecha) {
  const res = await fetch(
    `${SEAT_API_URL}/api/asientos/disponibles?rutaId=${rutaId}&fecha=${fecha}`
  );
  return res.json();
}

async function reservarAsiento(payload) {
  const res = await fetch(`${SEAT_API_URL}/api/asientos/reservar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}
```
