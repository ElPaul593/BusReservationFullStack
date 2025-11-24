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

exports.seedRutas = async (req, res) => {
  try {
    const { clearExisting } = req.body;
    const result = await RutaService.seedRutas(clearExisting);
    res.status(200).json({ 
      message: 'Rutas pobladas exitosamente', 
      ...result 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};