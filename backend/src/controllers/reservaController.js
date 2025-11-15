const ReservaService = require('../services/reservaService');

exports.getAll = async (req, res) => {
  try {
    const reservas = await ReservaService.getAll();
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = { 
      ...req.body, 
      usuario: req.user.id 
    };

    const reserva = await ReservaService.create(data);
    res.status(201).json(reserva);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
