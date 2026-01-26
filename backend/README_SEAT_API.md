# Seat Availability API - Test Commands

## 1. Get Available Seats
```bash
curl "http://localhost:5000/api/seat/disponibles?rutaId=123&fecha=2026-01-26"
```

## 2. Create Hold (Reserve)
```bash
curl -X POST "http://localhost:5000/api/seat/reservar" \
  -H "Content-Type: application/json" \
  -d "{\"rutaId\":\"123\",\"fecha\":\"2026-01-26\",\"asiento\":12,\"userId\":\"U001\"}"
```

## 3. Get Active Holds
```bash
curl "http://localhost:5000/api/seat/holds"
```

## 4. Delete Hold (Release Seat)
```bash
curl -X DELETE "http://localhost:5000/api/seat/holds" \
  -H "Content-Type: application/json" \
  -d "{\"rutaId\":\"123\",\"fecha\":\"2026-01-26\",\"asiento\":12}"
```

## 5. Confirm Reservation (Permanent)
```bash
# Replace HOLD_ID_HERE with the ID received from step 2
curl -X POST "http://localhost:5000/api/seat/reservar-definitivo" \
  -H "Content-Type: application/json" \
  -d "{\"holdId\":\"HOLD_ID_HERE\"}"
```
