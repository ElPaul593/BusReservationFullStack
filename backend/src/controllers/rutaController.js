const RutaService = require('../services/rutaService');

exports.getAll = async (req, res) => {
  try {
    const rutas = await RutaService.getAll();
    res.json(rutas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const ruta = await RutaService.create(req.body);
    res.status(201).json(ruta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
