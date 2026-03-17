import { v4 as uuidv4 } from "uuid";

const holds = new Map();
const reserved = new Map();

const ttlMs = Number(process.env.SEAT_HOLD_TTL_MS || 600000);
const purgeIntervalMs = Number(process.env.SEAT_PURGE_INTERVAL_MS || 60000);

const keyOf = ({ rutaId, fecha, asiento }) =>
  `${rutaId}|${fecha}|${asiento}`;

export const getTtlMs = () => ttlMs;

export const purgeExpiredHolds = () => {
  const now = Date.now();
  for (const [key, hold] of holds.entries()) {
    if (hold.expiresAt <= now) {
      holds.delete(key);
    }
  }
};

export const startPurgeInterval = () => {
  setInterval(() => {
    purgeExpiredHolds();
  }, purgeIntervalMs);
};

export const listAsientos = ({ rutaId, fecha }) => {
  const seats = [];
  for (let i = 1; i <= 40; i++) {
    const key = keyOf({ rutaId, fecha, asiento: i });
    const reservedEntry = reserved.get(key);
    const holdEntry = holds.get(key);

    if (reservedEntry) {
      seats.push({ numero: i, estado: "reserved" });
    } else if (holdEntry) {
      seats.push({
        numero: i,
        estado: "held",
        expiresAt: new Date(holdEntry.expiresAt).toISOString()
      });
    } else {
      seats.push({ numero: i, estado: "available" });
    }
  }
  return seats;
};

export const holdAsiento = ({ rutaId, fecha, asiento, userId }) => {
  const key = keyOf({ rutaId, fecha, asiento });

  if (reserved.has(key)) {
    return { error: "Asiento reservado" };
  }

  const existingHold = holds.get(key);
  if (existingHold && existingHold.expiresAt > Date.now()) {
    return { error: "Asiento en hold activo" };
  }

  const holdId = uuidv4();
  const now = Date.now();
  const expiresAt = now + ttlMs;

  holds.set(key, {
    holdId,
    userId,
    createdAt: now,
    expiresAt
  });

  return {
    holdId,
    expiresAt: new Date(expiresAt).toISOString()
  };
};

export const listHolds = () => {
  const now = Date.now();
  return [...holds.entries()].map(([key, hold]) => {
    const [rutaId, fecha, asiento] = key.split("|");
    return {
      rutaId: Number(rutaId),
      fecha,
      asiento: Number(asiento),
      holdId: hold.holdId,
      userId: hold.userId,
      createdAt: new Date(hold.createdAt).toISOString(),
      expiresAt: new Date(hold.expiresAt).toISOString(),
      remainingMs: Math.max(0, hold.expiresAt - now)
    };
  });
};

export const releaseHold = ({ rutaId, fecha, asiento }) => {
  const key = keyOf({ rutaId, fecha, asiento });
  return holds.delete(key);
};

export const finalizeReservation = ({ rutaId, fecha, asiento, holdId }) => {
  const key = keyOf({ rutaId, fecha, asiento });

  if (reserved.has(key)) {
    return { error: "Asiento ya reservado" };
  }

  const hold = holds.get(key);
  if (!hold) {
    return { error: "Hold no encontrado" };
  }

  if (hold.holdId !== holdId) {
    return { error: "holdId inválido" };
  }

  if (hold.expiresAt <= Date.now()) {
    holds.delete(key);
    return { error: "Hold expirado" };
  }

  holds.delete(key);
  reserved.set(key, {
    holdId,
    reservedAt: Date.now()
  });

  return { ok: true };
};
