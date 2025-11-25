import api from './api';

export async function getRutas() {
  try {
    const resp = await api.get('/rutas');
    return resp.data || [];
  } catch (err) {
    const message = err?.response?.data?.error || err?.message || 'Error al obtener rutas';
    console.error('Error obteniendo rutas:', message, err.response?.data);
    throw new Error(message);
  }
}

export async function getRutasPorProvincia(provincia) {
  try {
    const rutas = await getRutas();
    return filtrarRutasPorProvincia(rutas, provincia);
  } catch (err) {
    console.error('Error obteniendo rutas por provincia:', err);
    return [];
  }
}

// Mapeo de ciudades a provincias
const CIUDAD_PROVINCIA = {
  // Pichincha
  'Quito': 'Pichincha',
  
  // Guayas
  'Guayaquil': 'Guayas',
  'Salinas': 'Guayas',
  'Santa Elena': 'Guayas',
  
  // Azuay
  'Cuenca': 'Azuay',
  'Cañar': 'Azuay',
  'Azogues': 'Azuay',
  
  // Manabí
  'Manta': 'Manabí',
  'Portoviejo': 'Manabí',
  'Montecristi': 'Manabí',
  'Puerto López': 'Manabí',
  'Bahía de Caráquez': 'Manabí',
  
  // Tungurahua
  'Ambato': 'Tungurahua',
  'Baños': 'Tungurahua',
  
  // Imbabura
  'Ibarra': 'Imbabura',
  'Otavalo': 'Imbabura',
  
  // Loja
  'Loja': 'Loja',
  'Macará': 'Loja',
  'Catamayo': 'Loja',
  
  // Chimborazo
  'Riobamba': 'Chimborazo',
  
  // Cotopaxi
  'Latacunga': 'Cotopaxi',
  
  // El Oro
  'Machala': 'El Oro',
  'Santa Rosa': 'El Oro',
  'Pasaje': 'El Oro',
  
  // Esmeraldas
  'Esmeraldas': 'Esmeraldas',
  'Atacames': 'Esmeraldas',
  'San Lorenzo': 'Esmeraldas',
  
  // Carchi
  'Tulcán': 'Carchi',
  'San Gabriel': 'Carchi',
  
  // Bolívar
  'Guaranda': 'Bolívar',
  
  // Los Ríos
  'Babahoyo': 'Los Ríos', // Capital de Los Ríos
  'Quevedo': 'Los Ríos',
  'Ventanas': 'Los Ríos',
  
  // Morona Santiago
  'Macas': 'Morona Santiago',
  
  // Napo
  'Tena': 'Napo',
  'Archidona': 'Napo',
  
  // Pastaza
  'Puyo': 'Pastaza',
  
  // Zamora Chinchipe
  'Zamora': 'Zamora Chinchipe',
  'Yantzaza': 'Zamora Chinchipe',
  'Gualaquiza': 'Zamora Chinchipe',
  
  // Sucumbíos
  'Lago Agrio': 'Sucumbíos',
  
  // Orellana
  'Francisco de Orellana': 'Orellana',
  
  // Santo Domingo de los Tsáchilas
  'Santo Domingo': 'Santo Domingo de los Tsáchilas',
  
  // Santa Elena
  'Montañita': 'Santa Elena'
};

export function getProvinciaDeCiudad(ciudad) {
  return CIUDAD_PROVINCIA[ciudad] || null;
}

export function filtrarRutasPorProvincia(rutas, provincia) {
  if (!provincia || !rutas || rutas.length === 0) {
    return [];
  }
  
  // Filtrar rutas donde el origen pertenece a la provincia seleccionada
  return rutas.filter(ruta => {
    const provinciaOrigen = getProvinciaDeCiudad(ruta.from);
    return provinciaOrigen === provincia;
  });
}

