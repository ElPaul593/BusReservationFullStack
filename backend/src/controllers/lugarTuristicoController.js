const LugarTuristicoService = require('../services/lugarTuristicoService');

exports.getAll = async (req, res) => {
  try {
    const { ciudad } = req.query;
    const lugares = ciudad 
      ? await LugarTuristicoService.getByCiudad(ciudad)
      : await LugarTuristicoService.getAll();
    res.json(lugares);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const lugar = await LugarTuristicoService.getById(req.params.id);
    res.json(lugar);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const lugar = await LugarTuristicoService.create(req.body);
    res.status(201).json(lugar);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const lugar = await LugarTuristicoService.update(req.params.id, req.body);
    res.json(lugar);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await LugarTuristicoService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

