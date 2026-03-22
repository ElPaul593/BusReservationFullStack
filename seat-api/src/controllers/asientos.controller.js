import {
  purgeExpiredHolds,
  listAsientos,
  holdAsiento,
  listHolds,
  releaseHold,
  finalizeReservation,
  getTtlMs
} from "../services/asientos.service.js";

const badRequest = (res, message) =>
  res.status(400).json({ ok: false, error: message });

export const getDisponibles = (req, res) => {
  purgeExpiredHolds();

  const { rutaId, fecha } = req.query;
  if (!rutaId || !fecha) {
    return badRequest(res, "rutaId y fecha son obligatorios");
  }

  const data = listAsientos({ rutaId, fecha });
  return res.json({
    ok: true,
    rutaId: Number(rutaId),
    fecha,
    ttlMs: getTtlMs(),
    asientos: data
  });
};

export const postReservar = (req, res) => {
  purgeExpiredHolds();

  const { rutaId, fecha, asiento, userId } = req.body || {};
  if (!rutaId || !fecha || !asiento || !userId) {
    return badRequest(res, "rutaId, fecha, asiento y userId son obligatorios");
  }

  const result = holdAsiento({ rutaId, fecha, asiento, userId });

  if (result.error) {
    return res.status(409).json({ ok: false, error: result.error });
  }

  return res.status(201).json({
    ok: true,
    holdId: result.holdId,
    asiento: Number(asiento),
    expiresAt: result.expiresAt,
    ttlMs: getTtlMs()
  });
};

export const getHolds = (req, res) => {
  purgeExpiredHolds();
  const data = listHolds();
  return res.json({ ok: true, ttlMs: getTtlMs(), holds: data });
};

export const deleteHold = (req, res) => {
  purgeExpiredHolds();

  const { rutaId, fecha, asiento } = req.body || {};
  if (!rutaId || !fecha || !asiento) {
    return badRequest(res, "rutaId, fecha y asiento son obligatorios");
  }

  const released = releaseHold({ rutaId, fecha, asiento });
  return res.json({ ok: true, released });
};

export const postReservarDefinitivo = (req, res) => {
  purgeExpiredHolds();

  const { rutaId, fecha, asiento, holdId } = req.body || {};
  if (!rutaId || !fecha || !asiento || !holdId) {
    return badRequest(res, "rutaId, fecha, asiento y holdId son obligatorios");
  }

  const result = finalizeReservation({ rutaId, fecha, asiento, holdId });

  if (result.error) {
    return res.status(409).json({ ok: false, error: result.error });
  }

  return res.json({ ok: true, reserved: true, asiento: Number(asiento) });
};
