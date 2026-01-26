# Seat API Integration - Test Commands

## A) Test External API Directly (Vercel)

### Test 1: Get Available Seats
```bash
curl -X GET "https://apiconsumidorac.vercel.app/api/asientos/disponibles?rutaId=123&fecha=2026-01-26"
```

Expected response:
```json
{
  "ok": true,
  "rutaId": "123",
  "fecha": "2026-01-26",
  "ttlMs": 300000,
  "asientos": [
    {"numero": 1, "estado": "available"},
    {"numero": 2, "estado": "available"},
    ...
  ]
}
```

### Test 2: Reserve/Hold a Seat
```bash
curl -X POST "https://apiconsumidorac.vercel.app/api/asientos/reservar" \
  -H "Content-Type: application/json" \
  -d '{"rutaId":"123","fecha":"2026-01-26","asiento":12,"userId":"U001"}'
```

Expected response:
```json
{
  "ok": true,
  "holdId": "...",
  "asiento": 12,
  "ttlMs": 300000,
  "expiresAt": "2026-01-26T..."
}
```

### Test 3: Get All Holds
```bash
curl -X GET "https://apiconsumidorac.vercel.app/api/asientos/holds"
```

---

## B) Test Through BusReservation Backend Proxy (Local)

Make sure backend is running on http://localhost:5000

### Test 1: Get Available Seats via Proxy
```bash
curl -X GET "http://localhost:5000/api/seat/disponibles?rutaId=123&fecha=2026-01-26"
```

### Test 2: Reserve/Hold a Seat via Proxy
```bash
curl -X POST "http://localhost:5000/api/seat/reservar" \
  -H "Content-Type: application/json" \
  -d "{\"rutaId\":\"123\",\"fecha\":\"2026-01-26\",\"asiento\":12,\"userId\":\"U001\"}"
```

---

## PowerShell Commands (Windows)

### Test 1: Get Available Seats via Proxy
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/seat/disponibles?rutaId=123&fecha=2026-01-26" -Method Get
```

### Test 2: Reserve/Hold a Seat via Proxy
```powershell
$body = @{
    rutaId = "123"
    fecha = "2026-01-26"
    asiento = 12
    userId = "U001"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/seat/reservar" -Method Post -Body $body -ContentType "application/json"
```

---

## Expected Errors

### 400 - Missing Parameters
```json
{
  "ok": false,
  "error": "Falta rutaId o fecha"
}
```

### 409 - Seat Already Held/Reserved
```json
{
  "ok": false,
  "error": "Asiento ya está reservado",
  "expiresAt": "2026-01-26T..."
}
```

### 500 - Configuration Error
```json
{
  "ok": false,
  "error": "SEAT_API_URL no configurado"
}
```
