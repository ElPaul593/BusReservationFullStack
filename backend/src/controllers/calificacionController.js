const CalificacionService = require('../services/calificacionService');

exports.getAll = async (req, res) => {
  try {
    const { tipo, referencia, usuario } = req.query;
    let calificaciones;
    
    if (tipo && referencia) {
      calificaciones = await CalificacionService.getByTipoYReferencia(tipo, referencia);
    } else if (usuario) {
      calificaciones = await CalificacionService.getByUsuario(usuario);
    } else {
      calificaciones = await CalificacionService.getAll();
    }
    
    res.json(calificaciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const calificacion = await CalificacionService.getById(req.params.id);
    res.json(calificacion);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    // Usar el userId del token en lugar del body para mayor seguridad
    const data = { ...req.body, usuario: req.user._id.toString() };
    const calificacion = await CalificacionService.create(data);
    res.status(201).json(calificacion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const calificacion = await CalificacionService.update(req.params.id, req.body);
    res.json(calificacion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await CalificacionService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

