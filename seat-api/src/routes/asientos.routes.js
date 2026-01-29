import { Router } from "express";
import {
  getDisponibles,
  postReservar,
  getHolds,
  deleteHold,
  postReservarDefinitivo
} from "../controllers/asientos.controller.js";

const router = Router();

router.get("/disponibles", getDisponibles);
router.post("/reservar", postReservar);
router.get("/holds", getHolds);
router.delete("/holds", deleteHold);
router.post("/reservar-definitivo", postReservarDefinitivo);

export default router;
