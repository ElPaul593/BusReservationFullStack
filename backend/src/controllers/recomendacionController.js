const RecomendacionService = require('../services/recomendacionService');
const User = require('../models/userModel');

exports.getRecomendados = async (req, res) => {
  try {
    const { ciudad, tipo = 'lugarTuristico', usuarioId } = req.query;
    
    if (!ciudad) {
      return res.status(400).json({ error: 'Ciudad es requerida' });
    }

    let recomendados;
    
    // Si hay usuarioId, obtener recomendaciones personalizadas por nacionalidad
    if (usuarioId) {
      const usuario = await User.findById(usuarioId).select('paisOrigen').lean();
      if (usuario && usuario.paisOrigen) {
        recomendados = await RecomendacionService.getRecomendadosPorNacionalidad(
          usuario.paisOrigen,
          ciudad,
          tipo
        );
      } else {
        // Si no tiene país de origen, usar recomendaciones generales
        recomendados = await RecomendacionService.getRecomendadosGenerales(ciudad, tipo);
      }
    } else {
      // Recomendaciones generales
      recomendados = await RecomendacionService.getRecomendadosGenerales(ciudad, tipo);
    }

    res.json(recomendados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

