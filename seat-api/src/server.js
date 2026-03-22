import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import asientosRoutes from "./routes/asientos.routes.js";
import { startPurgeInterval } from "./services/asientos.service.js";

dotenv.config();

const app = express();
app.use(express.json());

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
const NODE_ENV = process.env.NODE_ENV || "development";

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (!ALLOWED_ORIGINS) {
      if (NODE_ENV === "development") return callback(null, true);
      return callback(new Error("CORS: origin not allowed"));
    }

    const allowed = ALLOWED_ORIGINS.split(",").map((value) => value.trim());
    if (allowed.includes(origin)) return callback(null, true);

    return callback(new Error("CORS: origin not allowed"));
  }
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  return res.json({ ok: true, service: "Seat Availability API" });
});

app.use("/api/asientos", asientosRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Seat API running on port ${PORT}`);
});

startPurgeInterval();
