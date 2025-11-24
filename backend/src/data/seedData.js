// Datos de lugares turísticos por provincia (sin Galápagos)
const lugaresTuristicos = [
  // Azuay (Cuenca)
  {
    nombre: 'Catedral de la Inmaculada Concepción',
    ciudad: 'Cuenca',
    direccion: 'Calle Mariscal Sucre y Benigno Malo',
    descripcion: 'Catedral neogótica construida en el siglo XIX, símbolo de Cuenca',
    tipo: 'Monumento',
    horario: 'Lunes a Sábado: 8:00 - 18:00',
    precioEntrada: 0
  },
  {
    nombre: 'Parque Nacional Cajas',
    ciudad: 'Cuenca',
    direccion: 'A 30 km al oeste de Cuenca',
    descripcion: 'Reserva natural con más de 200 lagunas y paisajes andinos únicos',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 18:00',
    precioEntrada: 10
  },
  {
    nombre: 'Museo Pumapungo',
    ciudad: 'Cuenca',
    direccion: 'Calle Larga y Huayna Cápac',
    descripcion: 'Museo arqueológico con restos de la ciudad inca de Tomebamba',
    tipo: 'Museo',
    horario: 'Martes a Domingo: 9:00 - 17:30',
    precioEntrada: 2
  },
  {
    nombre: 'Museo de las Conceptas',
    ciudad: 'Cuenca',
    direccion: 'Calle Hermano Miguel y Presidente Córdova',
    descripcion: 'Museo de arte religioso colonial en antiguo convento',
    tipo: 'Museo',
    horario: 'Lunes a Viernes: 9:00 - 18:30, Sábados: 10:00 - 13:00',
    precioEntrada: 2
  },
  {
    nombre: 'Mirador de Turi',
    ciudad: 'Cuenca',
    direccion: 'Parroquia Turi',
    descripcion: 'Mirador con vista panorámica de toda la ciudad de Cuenca',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 20:00',
    precioEntrada: 0
  },
  {
    nombre: 'Ruinas de Todos los Santos',
    ciudad: 'Cuenca',
    direccion: 'Calle Larga y Todos los Santos',
    descripcion: 'Ruinas arqueológicas de la época colonial',
    tipo: 'Monumento',
    horario: 'Martes a Domingo: 9:00 - 17:00',
    precioEntrada: 1
  },

  // Bolívar (Guaranda)
  {
    nombre: 'Cascada de San Vicente',
    ciudad: 'Guaranda',
    direccion: 'Parroquia San Vicente, Guaranda',
    descripcion: 'Hermosa cascada natural rodeada de vegetación',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 17:00',
    precioEntrada: 1
  },
  {
    nombre: 'Parque Central de Guaranda',
    ciudad: 'Guaranda',
    direccion: 'Centro de Guaranda',
    descripcion: 'Parque central con monumentos y arquitectura colonial',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 22:00',
    precioEntrada: 0
  },
  {
    nombre: 'Mirador de Guaranda',
    ciudad: 'Guaranda',
    direccion: 'Cerro de Guaranda',
    descripcion: 'Mirador con vista panorámica de los siete cerros',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 18:00',
    precioEntrada: 0
  },
  {
    nombre: 'Cascada de Salinas',
    ciudad: 'Guaranda',
    direccion: 'Parroquia Salinas',
    descripcion: 'Cascada natural en zona rural de Guaranda',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 0
  },

  // Cañar (Azogues)
  {
    nombre: 'Complejo Arqueológico Ingapirca',
    ciudad: 'Cañar',
    direccion: 'A 16 km de Cañar',
    descripcion: 'Ruinas incas más importantes del Ecuador, templo del sol',
    tipo: 'Monumento',
    horario: 'Todos los días: 9:00 - 17:00',
    precioEntrada: 6
  },
  {
    nombre: 'Catedral de Azogues',
    ciudad: 'Azogues',
    direccion: 'Parque Central de Azogues',
    descripcion: 'Catedral neoclásica del siglo XIX',
    tipo: 'Monumento',
    horario: 'Todos los días: 7:00 - 19:00',
    precioEntrada: 0
  },
  {
    nombre: 'Museo del Banco Central',
    ciudad: 'Azogues',
    direccion: 'Centro de Azogues',
    descripcion: 'Museo con arte y arqueología de la región',
    tipo: 'Museo',
    horario: 'Martes a Domingo: 9:00 - 17:00',
    precioEntrada: 1
  },
  {
    nombre: 'Mirador de Ingapirca',
    ciudad: 'Cañar',
    direccion: 'Complejo Arqueológico Ingapirca',
    descripcion: 'Mirador con vista del complejo arqueológico y paisaje andino',
    tipo: 'Parque',
    horario: 'Todos los días: 9:00 - 17:00',
    precioEntrada: 6
  },

  // Carchi (Tulcán)
  {
    nombre: 'Cementerio de Tulcán',
    ciudad: 'Tulcán',
    direccion: 'Calle Sucre y 10 de Agosto',
    descripcion: 'Cementerio con esculturas de ciprés únicas en el mundo',
    tipo: 'Monumento',
    horario: 'Todos los días: 8:00 - 18:00',
    precioEntrada: 0
  },
  {
    nombre: 'Reserva Ecológica El Ángel',
    ciudad: 'Tulcán',
    direccion: 'A 27 km de Tulcán',
    descripcion: 'Reserva con frailejones gigantes y paisajes paramunos',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 5
  },
  {
    nombre: 'Parque Central de Tulcán',
    ciudad: 'Tulcán',
    direccion: 'Centro de Tulcán',
    descripcion: 'Parque central con monumentos y áreas verdes',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 22:00',
    precioEntrada: 0
  },
  {
    nombre: 'Laguna de El Voladero',
    ciudad: 'Tulcán',
    direccion: 'Reserva El Ángel',
    descripcion: 'Laguna andina en la reserva ecológica',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 5
  },
  {
    nombre: 'Frontera de Rumichaca',
    ciudad: 'Tulcán',
    direccion: 'A 7 km de Tulcán',
    descripcion: 'Puente internacional entre Ecuador y Colombia',
    tipo: 'Monumento',
    horario: 'Todos los días: 24 horas',
    precioEntrada: 0
  },

  // Cotopaxi (Latacunga)
  {
    nombre: 'Volcán Cotopaxi',
    ciudad: 'Latacunga',
    direccion: 'Parque Nacional Cotopaxi',
    descripcion: 'Volcán activo más alto del mundo, 5897 metros de altura',
    tipo: 'Montaña',
    horario: 'Todos los días: 8:00 - 15:00',
    precioEntrada: 10
  },
  {
    nombre: 'Laguna de Limpiopungo',
    ciudad: 'Latacunga',
    direccion: 'Parque Nacional Cotopaxi',
    descripcion: 'Hermosa laguna andina a los pies del volcán Cotopaxi',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 15:00',
    precioEntrada: 10
  },
  {
    nombre: 'Centro Histórico de Latacunga',
    ciudad: 'Latacunga',
    direccion: 'Centro de Latacunga',
    descripcion: 'Centro histórico con arquitectura colonial y republicana',
    tipo: 'Centro Histórico',
    horario: 'Todos los días: 24 horas',
    precioEntrada: 0
  },
  {
    nombre: 'Museo de la Casa de los Marqueses',
    ciudad: 'Latacunga',
    direccion: 'Calle Maldonado',
    descripcion: 'Museo histórico en casa colonial del siglo XVIII',
    tipo: 'Museo',
    horario: 'Martes a Domingo: 9:00 - 17:00',
    precioEntrada: 2
  },
  {
    nombre: 'Refugio José Rivas',
    ciudad: 'Latacunga',
    direccion: 'Parque Nacional Cotopaxi',
    descripcion: 'Refugio de montaña a 4800 metros de altura',
    tipo: 'Montaña',
    horario: 'Todos los días: 8:00 - 15:00',
    precioEntrada: 10
  },
  {
    nombre: 'Laguna de Quilotoa',
    ciudad: 'Latacunga',
    direccion: 'A 60 km de Latacunga',
    descripcion: 'Laguna volcánica de color turquesa, una de las más hermosas del Ecuador',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 18:00',
    precioEntrada: 2
  },

  // Chimborazo (Riobamba)
  {
    nombre: 'Volcán Chimborazo',
    ciudad: 'Riobamba',
    direccion: 'Reserva de Producción Faunística Chimborazo',
    descripcion: 'Punto más alejado del centro de la Tierra, 6263 metros',
    tipo: 'Montaña',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 5
  },
  {
    nombre: 'Centro Histórico de Riobamba',
    ciudad: 'Riobamba',
    direccion: 'Centro de Riobamba',
    descripcion: 'Centro histórico con arquitectura colonial y republicana',
    tipo: 'Centro Histórico',
    horario: 'Todos los días: 24 horas',
    precioEntrada: 0
  },
  {
    nombre: 'Museo de la Concepción',
    ciudad: 'Riobamba',
    direccion: 'Calle Argentinos y España',
    descripcion: 'Museo de arte religioso y colonial',
    tipo: 'Museo',
    horario: 'Martes a Domingo: 9:00 - 17:00',
    precioEntrada: 2
  },
  {
    nombre: 'Refugio Carrel',
    ciudad: 'Riobamba',
    direccion: 'Volcán Chimborazo',
    descripcion: 'Refugio de montaña a 4800 metros en el Chimborazo',
    tipo: 'Montaña',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 5
  },
  {
    nombre: 'Balneario de Guano',
    ciudad: 'Riobamba',
    direccion: 'A 8 km de Riobamba',
    descripcion: 'Balneario de aguas termales',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 18:00',
    precioEntrada: 3
  },
  {
    nombre: 'Nariz del Diablo',
    ciudad: 'Riobamba',
    direccion: 'A 45 km de Riobamba',
    descripcion: 'Famosa formación rocosa donde pasa el tren más difícil del mundo',
    tipo: 'Monumento',
    horario: 'Todos los días: 8:00 - 17:00',
    precioEntrada: 5
  },

  // El Oro (Machala)
  {
    nombre: 'Museo de la Bananera',
    ciudad: 'Machala',
    direccion: 'Avenida 25 de Junio',
    descripcion: 'Museo dedicado a la historia de la producción bananera',
    tipo: 'Museo',
    horario: 'Lunes a Viernes: 9:00 - 17:00',
    precioEntrada: 2
  },
  {
    nombre: 'Playa de Jambelí',
    ciudad: 'Machala',
    direccion: 'A 30 km de Machala',
    descripcion: 'Hermosa playa del Pacífico con restaurantes y actividades acuáticas',
    tipo: 'Playa',
    horario: 'Todos los días: 6:00 - 18:00',
    precioEntrada: 0
  },
  {
    nombre: 'Parque Central de Machala',
    ciudad: 'Machala',
    direccion: 'Centro de Machala',
    descripcion: 'Parque central con monumentos y áreas verdes',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 22:00',
    precioEntrada: 0
  },
  {
    nombre: 'Malecón de Puerto Bolívar',
    ciudad: 'Machala',
    direccion: 'Puerto Bolívar',
    descripcion: 'Malecón con vista al mar y restaurantes de mariscos',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 22:00',
    precioEntrada: 0
  },
  {
    nombre: 'Isla de Jambelí',
    ciudad: 'Machala',
    direccion: 'A 30 km de Machala',
    descripcion: 'Isla con playas, manglares y vida silvestre',
    tipo: 'Playa',
    horario: 'Todos los días: 6:00 - 18:00',
    precioEntrada: 0
  },

  // Esmeraldas (Esmeraldas)
  {
    nombre: 'Playa de Atacames',
    ciudad: 'Esmeraldas',
    direccion: 'A 30 km de Esmeraldas',
    descripcion: 'Famosa playa con ambiente turístico y vida nocturna',
    tipo: 'Playa',
    horario: 'Todos los días: 24 horas',
    precioEntrada: 0
  },
  {
    nombre: 'Reserva Ecológica Manglares Cayapas-Mataje',
    ciudad: 'Esmeraldas',
    direccion: 'Cantón San Lorenzo',
    descripcion: 'Reserva de manglares con gran biodiversidad',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 3
  },
  {
    nombre: 'Playa de Súa',
    ciudad: 'Esmeraldas',
    direccion: 'A 25 km de Esmeraldas',
    descripcion: 'Playa tranquila ideal para familias',
    tipo: 'Playa',
    horario: 'Todos los días: 24 horas',
    precioEntrada: 0
  },
  {
    nombre: 'Playa de Tonsupa',
    ciudad: 'Esmeraldas',
    direccion: 'A 28 km de Esmeraldas',
    descripcion: 'Playa con olas para surf y ambiente relajado',
    tipo: 'Playa',
    horario: 'Todos los días: 24 horas',
    precioEntrada: 0
  },
  {
    nombre: 'Malecón de Esmeraldas',
    ciudad: 'Esmeraldas',
    direccion: 'Malecón de Esmeraldas',
    descripcion: 'Paseo marítimo con restaurantes y vista al océano',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 24:00',
    precioEntrada: 0
  },
  {
    nombre: 'Museo de Esmeraldas',
    ciudad: 'Esmeraldas',
    direccion: 'Centro de Esmeraldas',
    descripcion: 'Museo con historia y cultura afroecuatoriana',
    tipo: 'Museo',
    horario: 'Lunes a Viernes: 9:00 - 17:00',
    precioEntrada: 1
  },

  // Guayas (Guayaquil)
  {
    nombre: 'Malecón 2000',
    ciudad: 'Guayaquil',
    direccion: 'Malecón Simón Bolívar',
    descripcion: 'Paseo marítimo renovado con museos, restaurantes y jardines',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 24:00',
    precioEntrada: 0
  },
  {
    nombre: 'Las Peñas',
    ciudad: 'Guayaquil',
    direccion: 'Barrio Las Peñas',
    descripcion: 'Barrio histórico con casas coloridas y vista panorámica',
    tipo: 'Centro Histórico',
    horario: 'Todos los días: 24 horas',
    precioEntrada: 0
  },
  {
    nombre: 'Parque Histórico Guayaquil',
    ciudad: 'Guayaquil',
    direccion: 'Vía Samborondón',
    descripcion: 'Parque temático sobre la historia y cultura de la costa',
    tipo: 'Parque',
    horario: 'Miércoles a Domingo: 9:00 - 16:30',
    precioEntrada: 5
  },
  {
    nombre: 'Parque Seminario (Iguana Park)',
    ciudad: 'Guayaquil',
    direccion: 'Calle Chimborazo y 10 de Agosto',
    descripcion: 'Parque con iguanas libres, monumento a Simón Bolívar',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 22:00',
    precioEntrada: 0
  },
  {
    nombre: 'Museo Antropológico y de Arte Contemporáneo',
    ciudad: 'Guayaquil',
    direccion: 'Malecón y Loja',
    descripcion: 'MAAC con arte precolombino y contemporáneo',
    tipo: 'Museo',
    horario: 'Martes a Domingo: 10:00 - 18:00',
    precioEntrada: 3
  },
  {
    nombre: 'Cerro Santa Ana',
    ciudad: 'Guayaquil',
    direccion: 'Barrio Las Peñas',
    descripcion: 'Cerro con escalinatas, mirador y restaurantes',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 22:00',
    precioEntrada: 0
  },
  {
    nombre: 'Jardín Botánico de Guayaquil',
    ciudad: 'Guayaquil',
    direccion: 'Avenida Francisco de Orellana',
    descripcion: 'Jardín botánico con flora nativa de la costa',
    tipo: 'Parque',
    horario: 'Martes a Domingo: 9:00 - 17:00',
    precioEntrada: 2
  },
  {
    nombre: 'Museo Municipal de Guayaquil',
    ciudad: 'Guayaquil',
    direccion: 'Calle Sucre entre Chile y Pedro Carbo',
    descripcion: 'Museo con historia de Guayaquil y la independencia',
    tipo: 'Museo',
    horario: 'Martes a Sábado: 9:00 - 17:30',
    precioEntrada: 2
  },

  // Imbabura (Ibarra)
  {
    nombre: 'Laguna de Yahuarcocha',
    ciudad: 'Ibarra',
    direccion: 'A 3 km de Ibarra',
    descripcion: 'Laguna andina ideal para deportes acuáticos y paseos',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 18:00',
    precioEntrada: 0
  },
  {
    nombre: 'Centro Histórico de Ibarra',
    ciudad: 'Ibarra',
    direccion: 'Centro de Ibarra',
    descripcion: 'Centro histórico con arquitectura blanca colonial',
    tipo: 'Centro Histórico',
    horario: 'Todos los días: 24 horas',
    precioEntrada: 0
  },
  {
    nombre: 'Laguna de Cuicocha',
    ciudad: 'Ibarra',
    direccion: 'A 14 km de Cotacachi',
    descripcion: 'Laguna volcánica en cráter con islas, ideal para paseos en bote',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 17:00',
    precioEntrada: 2
  },
  {
    nombre: 'Mercado de Otavalo',
    ciudad: 'Otavalo',
    direccion: 'Plaza de Ponchos, Otavalo',
    descripcion: 'Famoso mercado indígena más grande de Sudamérica',
    tipo: 'Centro Histórico',
    horario: 'Todos los días: 7:00 - 18:00',
    precioEntrada: 0
  },
  {
    nombre: 'Laguna de San Pablo',
    ciudad: 'Otavalo',
    direccion: 'A 3 km de Otavalo',
    descripcion: 'Laguna andina con vista al volcán Imbabura',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 18:00',
    precioEntrada: 0
  },
  {
    nombre: 'Parque Condor',
    ciudad: 'Otavalo',
    direccion: 'A 10 km de Otavalo',
    descripcion: 'Centro de rescate y exhibición de aves rapaces',
    tipo: 'Parque',
    horario: 'Martes a Domingo: 9:30 - 17:00',
    precioEntrada: 5
  },
  {
    nombre: 'Museo de las Culturas',
    ciudad: 'Ibarra',
    direccion: 'Calle Sucre y Oviedo',
    descripcion: 'Museo con historia y cultura de Imbabura',
    tipo: 'Museo',
    horario: 'Martes a Domingo: 9:00 - 17:00',
    precioEntrada: 1
  },

  // Loja (Loja)
  {
    nombre: 'Parque Nacional Podocarpus',
    ciudad: 'Loja',
    direccion: 'A 8 km de Loja',
    descripcion: 'Parque nacional con bosques nublados y gran biodiversidad',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 5
  },
  {
    nombre: 'Centro Histórico de Loja',
    ciudad: 'Loja',
    direccion: 'Centro de Loja',
    descripcion: 'Centro histórico con iglesias coloniales y arquitectura tradicional',
    tipo: 'Centro Histórico',
    horario: 'Todos los días: 24 horas',
    precioEntrada: 0
  },
  {
    nombre: 'Catedral de Loja',
    ciudad: 'Loja',
    direccion: 'Parque Central de Loja',
    descripcion: 'Catedral neoclásica del siglo XIX',
    tipo: 'Monumento',
    horario: 'Todos los días: 7:00 - 19:00',
    precioEntrada: 0
  },
  {
    nombre: 'Puerta de la Ciudad',
    ciudad: 'Loja',
    direccion: 'Avenida 8 de Diciembre',
    descripcion: 'Monumento arquitectónico símbolo de Loja',
    tipo: 'Monumento',
    horario: 'Todos los días: 8:00 - 20:00',
    precioEntrada: 0
  },
  {
    nombre: 'Museo de la Música',
    ciudad: 'Loja',
    direccion: 'Calle Bernardo Valdivieso',
    descripcion: 'Museo dedicado a los músicos lojanos',
    tipo: 'Museo',
    horario: 'Lunes a Viernes: 9:00 - 17:00',
    precioEntrada: 1
  },
  {
    nombre: 'Mirador de Loja',
    ciudad: 'Loja',
    direccion: 'Cerro de Loja',
    descripcion: 'Mirador con vista panorámica de la ciudad',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 20:00',
    precioEntrada: 0
  },

  // Los Ríos (Babahoyo)
  {
    nombre: 'Museo de Babahoyo',
    ciudad: 'Babahoyo',
    direccion: 'Centro de Babahoyo',
    descripcion: 'Museo con historia de la provincia y cultura local',
    tipo: 'Museo',
    horario: 'Lunes a Viernes: 9:00 - 17:00',
    precioEntrada: 1
  },
  {
    nombre: 'Parque Central de Babahoyo',
    ciudad: 'Babahoyo',
    direccion: 'Centro de Babahoyo',
    descripcion: 'Parque central con monumentos y áreas verdes',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 22:00',
    precioEntrada: 0
  },
  {
    nombre: 'Río Babahoyo',
    ciudad: 'Babahoyo',
    direccion: 'Malecón de Babahoyo',
    descripcion: 'Río principal con paseo fluvial y restaurantes',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 22:00',
    precioEntrada: 0
  },
  {
    nombre: 'Catedral de Babahoyo',
    ciudad: 'Babahoyo',
    direccion: 'Parque Central',
    descripcion: 'Catedral moderna con arquitectura única',
    tipo: 'Monumento',
    horario: 'Todos los días: 7:00 - 19:00',
    precioEntrada: 0
  },

  // Manabí (Portoviejo)
  {
    nombre: 'Playa de Manta',
    ciudad: 'Manta',
    direccion: 'Malecón de Manta',
    descripcion: 'Playa urbana con malecón, restaurantes y vida nocturna',
    tipo: 'Playa',
    horario: 'Todos los días: 24 horas',
    precioEntrada: 0
  },
  {
    nombre: 'Parque Nacional Machalilla',
    ciudad: 'Puerto López',
    direccion: 'A 30 km de Puerto López',
    descripcion: 'Parque nacional con playas, bosques secos y arqueología',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 10
  },
  {
    nombre: 'Playa de Los Frailes',
    ciudad: 'Puerto López',
    direccion: 'Parque Nacional Machalilla',
    descripcion: 'Una de las playas más hermosas del Ecuador',
    tipo: 'Playa',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 10
  },
  {
    nombre: 'Isla de la Plata',
    ciudad: 'Puerto López',
    direccion: 'A 40 km de Puerto López',
    descripcion: 'Isla conocida como "Galápagos de los pobres" con aves y ballenas',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 15
  },
  {
    nombre: 'Centro Histórico de Portoviejo',
    ciudad: 'Portoviejo',
    direccion: 'Centro de Portoviejo',
    descripcion: 'Centro histórico con arquitectura tradicional manabita',
    tipo: 'Centro Histórico',
    horario: 'Todos los días: 24 horas',
    precioEntrada: 0
  },
  {
    nombre: 'Museo de Manta',
    ciudad: 'Manta',
    direccion: 'Avenida Malecón',
    descripcion: 'Museo con arqueología de la cultura Manteña',
    tipo: 'Museo',
    horario: 'Martes a Domingo: 9:00 - 17:00',
    precioEntrada: 2
  },
  {
    nombre: 'Playa de Crucita',
    ciudad: 'Portoviejo',
    direccion: 'A 30 km de Portoviejo',
    descripcion: 'Playa tranquila ideal para parapente',
    tipo: 'Playa',
    horario: 'Todos los días: 24 horas',
    precioEntrada: 0
  },
  {
    nombre: 'Montecristi',
    ciudad: 'Montecristi',
    direccion: 'A 15 km de Manta',
    descripcion: 'Ciudad histórica donde se confeccionan los sombreros de paja toquilla',
    tipo: 'Centro Histórico',
    horario: 'Todos los días: 8:00 - 18:00',
    precioEntrada: 0
  },

  // Morona Santiago (Macas)
  {
    nombre: 'Catedral de Macas',
    ciudad: 'Macas',
    direccion: 'Centro de Macas',
    descripcion: 'Catedral moderna con arquitectura única en la Amazonía',
    tipo: 'Monumento',
    horario: 'Todos los días: 7:00 - 19:00',
    precioEntrada: 0
  },
  {
    nombre: 'Mirador de Macas',
    ciudad: 'Macas',
    direccion: 'Cerro de Macas',
    descripcion: 'Mirador con vista panorámica de la ciudad y la selva',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 18:00',
    precioEntrada: 0
  },
  {
    nombre: 'Parque Central de Macas',
    ciudad: 'Macas',
    direccion: 'Centro de Macas',
    descripcion: 'Parque central con monumentos y áreas verdes',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 22:00',
    precioEntrada: 0
  },
  {
    nombre: 'Río Upano',
    ciudad: 'Macas',
    direccion: 'Río Upano',
    descripcion: 'Río principal ideal para paseos y actividades acuáticas',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 18:00',
    precioEntrada: 0
  },
  {
    nombre: 'Cascada de Chiguaza',
    ciudad: 'Macas',
    direccion: 'A 25 km de Macas',
    descripcion: 'Hermosa cascada en medio de la selva amazónica',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 2
  },

  // Napo (Tena)
  {
    nombre: 'Parque Amazónico La Isla',
    ciudad: 'Tena',
    direccion: 'A 2 km de Tena',
    descripcion: 'Parque temático sobre la Amazonía ecuatoriana',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 17:00',
    precioEntrada: 3
  },
  {
    nombre: 'Río Napo',
    ciudad: 'Tena',
    direccion: 'Río Napo',
    descripcion: 'Río principal de la Amazonía, ideal para rafting y paseos',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 18:00',
    precioEntrada: 0
  },
  {
    nombre: 'Cascada de Latas',
    ciudad: 'Tena',
    direccion: 'A 15 km de Tena',
    descripcion: 'Cascada natural ideal para bañarse',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 1
  },
  {
    nombre: 'Malecón de Tena',
    ciudad: 'Tena',
    direccion: 'Malecón de Tena',
    descripcion: 'Paseo fluvial con vista a los ríos Tena y Pano',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 22:00',
    precioEntrada: 0
  },
  {
    nombre: 'Parque Central de Tena',
    ciudad: 'Tena',
    direccion: 'Centro de Tena',
    descripcion: 'Parque central con monumentos y áreas verdes',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 22:00',
    precioEntrada: 0
  },
  {
    nombre: 'Cascada de San Rafael',
    ciudad: 'Tena',
    direccion: 'A 30 km de Tena',
    descripcion: 'Una de las cascadas más altas de la Amazonía',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 3
  },

  // Pastaza (Puyo)
  {
    nombre: 'Parque Botánico Las Orquídeas',
    ciudad: 'Puyo',
    direccion: 'A 5 km de Puyo',
    descripcion: 'Jardín botánico con orquídeas y plantas amazónicas',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 17:00',
    precioEntrada: 4
  },
  {
    nombre: 'Cascada del Pailón del Diablo',
    ciudad: 'Puyo',
    direccion: 'A 20 km de Puyo',
    descripcion: 'Impresionante cascada en medio de la selva amazónica',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 5
  },
  {
    nombre: 'Parque Central de Puyo',
    ciudad: 'Puyo',
    direccion: 'Centro de Puyo',
    descripcion: 'Parque central con monumentos y áreas verdes',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 22:00',
    precioEntrada: 0
  },
  {
    nombre: 'Museo Etnográfico de Puyo',
    ciudad: 'Puyo',
    direccion: 'Centro de Puyo',
    descripcion: 'Museo con cultura de los pueblos amazónicos',
    tipo: 'Museo',
    horario: 'Lunes a Viernes: 9:00 - 17:00',
    precioEntrada: 2
  },
  {
    nombre: 'Río Pastaza',
    ciudad: 'Puyo',
    direccion: 'Río Pastaza',
    descripcion: 'Río principal ideal para paseos y actividades acuáticas',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 18:00',
    precioEntrada: 0
  },
  {
    nombre: 'Cascada de Hola Vida',
    ciudad: 'Puyo',
    direccion: 'A 15 km de Puyo',
    descripcion: 'Cascada natural en reserva ecológica',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 3
  },

  // Pichincha (Quito)
  {
    nombre: 'Centro Histórico de Quito',
    ciudad: 'Quito',
    direccion: 'Centro Histórico de Quito',
    descripcion: 'Centro histórico más grande y mejor conservado de América Latina, Patrimonio de la Humanidad',
    tipo: 'Centro Histórico',
    horario: 'Todos los días: 24 horas',
    precioEntrada: 0
  },
  {
    nombre: 'Mitad del Mundo',
    ciudad: 'Quito',
    direccion: 'San Antonio de Pichincha',
    descripcion: 'Monumento a la línea ecuatorial, donde se divide el hemisferio norte y sur',
    tipo: 'Monumento',
    horario: 'Todos los días: 9:00 - 18:00',
    precioEntrada: 5
  },
  {
    nombre: 'Teleférico de Quito',
    ciudad: 'Quito',
    direccion: 'Volcán Pichincha',
    descripcion: 'Teleférico que sube al volcán Pichincha con vistas espectaculares',
    tipo: 'Montaña',
    horario: 'Todos los días: 9:00 - 20:00',
    precioEntrada: 9
  },
  {
    nombre: 'Basílica del Voto Nacional',
    ciudad: 'Quito',
    direccion: 'Calle Venezuela y Carchi',
    descripcion: 'Basílica neogótica más grande de América, con gárgolas de fauna ecuatoriana',
    tipo: 'Monumento',
    horario: 'Todos los días: 9:00 - 17:00',
    precioEntrada: 2
  },
  {
    nombre: 'Iglesia de la Compañía',
    ciudad: 'Quito',
    direccion: 'Calle García Moreno y Sucre',
    descripcion: 'Iglesia barroca con fachada de oro, joya del arte colonial',
    tipo: 'Monumento',
    horario: 'Lunes a Jueves: 9:30 - 18:30, Viernes: 9:30 - 17:30, Sábados: 9:30 - 16:30',
    precioEntrada: 5
  },
  {
    nombre: 'Museo de la Ciudad',
    ciudad: 'Quito',
    direccion: 'Calle García Moreno y Rocafuerte',
    descripcion: 'Museo sobre la historia de Quito desde la época precolombina',
    tipo: 'Museo',
    horario: 'Martes a Domingo: 9:00 - 17:00',
    precioEntrada: 3
  },
  {
    nombre: 'Panecillo',
    ciudad: 'Quito',
    direccion: 'Cerro del Panecillo',
    descripcion: 'Mirador con monumento a la Virgen de Quito, vista panorámica',
    tipo: 'Monumento',
    horario: 'Todos los días: 9:00 - 18:00',
    precioEntrada: 1
  },
  {
    nombre: 'Capilla del Hombre',
    ciudad: 'Quito',
    direccion: 'Calle Mariano Calvache y Lorenzo Chávez',
    descripcion: 'Museo y capilla del artista Oswaldo Guayasamín',
    tipo: 'Museo',
    horario: 'Lunes a Domingo: 10:00 - 17:00',
    precioEntrada: 8
  },
  {
    nombre: 'Parque La Carolina',
    ciudad: 'Quito',
    direccion: 'Avenida Amazonas y Naciones Unidas',
    descripcion: 'Parque urbano más grande de Quito con lagos y áreas recreativas',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 20:00',
    precioEntrada: 0
  },
  {
    nombre: 'Museo Nacional del Ecuador',
    ciudad: 'Quito',
    direccion: 'Avenida Patria y 6 de Diciembre',
    descripcion: 'Museo con arte e historia del Ecuador',
    tipo: 'Museo',
    horario: 'Martes a Domingo: 9:00 - 17:00',
    precioEntrada: 2
  },

  // Tungurahua (Ambato)
  {
    nombre: 'Catedral de Ambato',
    ciudad: 'Ambato',
    direccion: 'Parque Montalvo',
    descripcion: 'Catedral neoclásica en el corazón de Ambato',
    tipo: 'Monumento',
    horario: 'Todos los días: 7:00 - 19:00',
    precioEntrada: 0
  },
  {
    nombre: 'Museo de la Casa de Montalvo',
    ciudad: 'Ambato',
    direccion: 'Calle Bolívar y Montalvo',
    descripcion: 'Casa museo del escritor Juan Montalvo',
    tipo: 'Museo',
    horario: 'Martes a Domingo: 9:00 - 17:00',
    precioEntrada: 1
  },
  {
    nombre: 'Parque Montalvo',
    ciudad: 'Ambato',
    direccion: 'Centro de Ambato',
    descripcion: 'Parque central con monumento a Juan Montalvo',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 22:00',
    precioEntrada: 0
  },
  {
    nombre: 'Mirador de Ambato',
    ciudad: 'Ambato',
    direccion: 'Cerro de Ambato',
    descripcion: 'Mirador con vista panorámica de la ciudad y volcanes',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 18:00',
    precioEntrada: 0
  },
  {
    nombre: 'Feria de Frutas y Flores',
    ciudad: 'Ambato',
    direccion: 'Centro de Ambato',
    descripcion: 'Feria tradicional más importante de Ambato (Febrero)',
    tipo: 'Centro Histórico',
    horario: 'Durante la feria: 8:00 - 20:00',
    precioEntrada: 0
  },
  {
    nombre: 'Cascada de Agoyán',
    ciudad: 'Ambato',
    direccion: 'A 20 km de Ambato',
    descripcion: 'Cascada natural en zona rural',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 1
  },

  // Zamora Chinchipe (Zamora)
  {
    nombre: 'Cascada de San Francisco',
    ciudad: 'Zamora',
    direccion: 'A 15 km de Zamora',
    descripcion: 'Hermosa cascada en medio de la selva amazónica',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 2
  },
  {
    nombre: 'Parque Central de Zamora',
    ciudad: 'Zamora',
    direccion: 'Centro de Zamora',
    descripcion: 'Parque central con monumentos y áreas verdes',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 22:00',
    precioEntrada: 0
  },
  {
    nombre: 'Río Zamora',
    ciudad: 'Zamora',
    direccion: 'Río Zamora',
    descripcion: 'Río principal ideal para paseos y actividades acuáticas',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 18:00',
    precioEntrada: 0
  },
  {
    nombre: 'Cascada de El Chorro',
    ciudad: 'Zamora',
    direccion: 'A 10 km de Zamora',
    descripcion: 'Cascada natural en reserva ecológica',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 2
  },

  // Sucumbíos (Lago Agrio)
  {
    nombre: 'Reserva de Producción Faunística Cuyabeno',
    ciudad: 'Lago Agrio',
    direccion: 'A 60 km de Lago Agrio',
    descripcion: 'Reserva amazónica con lagunas y gran biodiversidad',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 10
  },
  {
    nombre: 'Laguna Grande de Cuyabeno',
    ciudad: 'Lago Agrio',
    direccion: 'Reserva Cuyabeno',
    descripcion: 'Laguna amazónica ideal para observación de delfines y aves',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 10
  },
  {
    nombre: 'Parque Central de Lago Agrio',
    ciudad: 'Lago Agrio',
    direccion: 'Centro de Lago Agrio',
    descripcion: 'Parque central con monumentos y áreas verdes',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 22:00',
    precioEntrada: 0
  },
  {
    nombre: 'Río Aguarico',
    ciudad: 'Lago Agrio',
    direccion: 'Río Aguarico',
    descripcion: 'Río principal ideal para paseos y observación de fauna',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 18:00',
    precioEntrada: 0
  },
  {
    nombre: 'Laguna de Zancudococha',
    ciudad: 'Lago Agrio',
    direccion: 'Reserva Cuyabeno',
    descripcion: 'Laguna amazónica con gran diversidad de aves',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 10
  },

  // Orellana (Francisco de Orellana)
  {
    nombre: 'Parque Nacional Yasuní',
    ciudad: 'Francisco de Orellana',
    direccion: 'A 100 km de Francisco de Orellana',
    descripcion: 'Parque nacional con la mayor biodiversidad del planeta',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 10
  },
  {
    nombre: 'Parque Central de Coca',
    ciudad: 'Francisco de Orellana',
    direccion: 'Centro de Francisco de Orellana',
    descripcion: 'Parque central con monumentos y áreas verdes',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 22:00',
    precioEntrada: 0
  },
  {
    nombre: 'Río Napo',
    ciudad: 'Francisco de Orellana',
    direccion: 'Río Napo',
    descripcion: 'Río principal de la Amazonía, ideal para paseos fluviales',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 18:00',
    precioEntrada: 0
  },
  {
    nombre: 'Laguna de Añangu',
    ciudad: 'Francisco de Orellana',
    direccion: 'Parque Nacional Yasuní',
    descripcion: 'Laguna amazónica con torre de observación de aves',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 10
  },
  {
    nombre: 'Museo Arqueológico de Coca',
    ciudad: 'Francisco de Orellana',
    direccion: 'Centro de Francisco de Orellana',
    descripcion: 'Museo con arqueología de culturas amazónicas',
    tipo: 'Museo',
    horario: 'Lunes a Viernes: 9:00 - 17:00',
    precioEntrada: 2
  },

  // Santo Domingo de los Tsáchilas (Santo Domingo)
  {
    nombre: 'Parque Central de Santo Domingo',
    ciudad: 'Santo Domingo',
    direccion: 'Centro de Santo Domingo',
    descripcion: 'Parque central con monumentos y áreas verdes',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 22:00',
    precioEntrada: 0
  },
  {
    nombre: 'Museo Etnográfico Tsáchila',
    ciudad: 'Santo Domingo',
    direccion: 'Centro de Santo Domingo',
    descripcion: 'Museo sobre la cultura y tradiciones del pueblo Tsáchila',
    tipo: 'Museo',
    horario: 'Lunes a Viernes: 9:00 - 17:00',
    precioEntrada: 2
  },
  {
    nombre: 'Comunidad Tsáchila',
    ciudad: 'Santo Domingo',
    direccion: 'A 15 km de Santo Domingo',
    descripcion: 'Comunidad indígena con tours culturales y tradiciones',
    tipo: 'Centro Histórico',
    horario: 'Todos los días: 8:00 - 17:00',
    precioEntrada: 5
  },
  {
    nombre: 'Cascada de San Jacinto',
    ciudad: 'Santo Domingo',
    direccion: 'A 20 km de Santo Domingo',
    descripcion: 'Cascada natural en zona de bosque húmedo',
    tipo: 'Parque',
    horario: 'Todos los días: 8:00 - 16:00',
    precioEntrada: 2
  },
  {
    nombre: 'Río Toachi',
    ciudad: 'Santo Domingo',
    direccion: 'Río Toachi',
    descripcion: 'Río ideal para actividades acuáticas y paseos',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 18:00',
    precioEntrada: 0
  },

  // Santa Elena (Santa Elena)
  {
    nombre: 'Museo Los Amantes de Sumpa',
    ciudad: 'Santa Elena',
    direccion: 'Avenida Principal',
    descripcion: 'Museo arqueológico con restos de la cultura Las Vegas',
    tipo: 'Museo',
    horario: 'Martes a Domingo: 9:00 - 17:00',
    precioEntrada: 2
  },
  {
    nombre: 'Playa de Salinas',
    ciudad: 'Salinas',
    direccion: 'Malecón de Salinas',
    descripcion: 'Playa turística con hoteles, restaurantes y actividades acuáticas',
    tipo: 'Playa',
    horario: 'Todos los días: 24 horas',
    precioEntrada: 0
  },
  {
    nombre: 'Playa de Montañita',
    ciudad: 'Montañita',
    direccion: 'A 20 km de Santa Elena',
    descripcion: 'Famosa playa para surf y vida bohemia',
    tipo: 'Playa',
    horario: 'Todos los días: 24 horas',
    precioEntrada: 0
  },
  {
    nombre: 'Playa de Ayangue',
    ciudad: 'Ayangue',
    direccion: 'A 15 km de Santa Elena',
    descripcion: 'Playa tranquila ideal para familias y snorkel',
    tipo: 'Playa',
    horario: 'Todos los días: 24 horas',
    precioEntrada: 0
  },
  {
    nombre: 'Parque Central de Santa Elena',
    ciudad: 'Santa Elena',
    direccion: 'Centro de Santa Elena',
    descripcion: 'Parque central con monumentos y áreas verdes',
    tipo: 'Parque',
    horario: 'Todos los días: 6:00 - 22:00',
    precioEntrada: 0
  },
  {
    nombre: 'Museo de Ballenas',
    ciudad: 'Salinas',
    direccion: 'Malecón de Salinas',
    descripcion: 'Museo sobre ballenas jorobadas y vida marina',
    tipo: 'Museo',
    horario: 'Martes a Domingo: 9:00 - 17:00',
    precioEntrada: 3
  }
];

// Datos de rutas entre ciudades
const rutas = [
  // Rutas principales - Quito y Guayaquil
  { name: 'Guayaquil - Quito', from: 'Guayaquil', to: 'Quito', seats: 40 },
  { name: 'Quito - Guayaquil', from: 'Quito', to: 'Guayaquil', seats: 40 },
  
  // Rutas desde Macas
  { name: 'Macas - Cuenca', from: 'Macas', to: 'Cuenca', seats: 35 },
  { name: 'Cuenca - Macas', from: 'Cuenca', to: 'Macas', seats: 35 },
  { name: 'Macas - Puyo', from: 'Macas', to: 'Puyo', seats: 30 },
  { name: 'Puyo - Macas', from: 'Puyo', to: 'Macas', seats: 30 },
  { name: 'Macas - Tena', from: 'Macas', to: 'Tena', seats: 30 },
  { name: 'Tena - Macas', from: 'Tena', to: 'Macas', seats: 30 },
  
  // Rutas desde Lago Agrio
  { name: 'Lago Agrio - Puyo', from: 'Lago Agrio', to: 'Puyo', seats: 30 },
  { name: 'Puyo - Lago Agrio', from: 'Puyo', to: 'Lago Agrio', seats: 30 },
  { name: 'Lago Agrio - Tena', from: 'Lago Agrio', to: 'Tena', seats: 30 },
  { name: 'Tena - Lago Agrio', from: 'Tena', to: 'Lago Agrio', seats: 30 },
  { name: 'Lago Agrio - Francisco de Orellana', from: 'Lago Agrio', to: 'Francisco de Orellana', seats: 30 },
  { name: 'Francisco de Orellana - Lago Agrio', from: 'Francisco de Orellana', to: 'Lago Agrio', seats: 30 },
  
  // Rutas desde Quito a otras ciudades
  { name: 'Quito - Cuenca', from: 'Quito', to: 'Cuenca', seats: 40 },
  { name: 'Cuenca - Quito', from: 'Cuenca', to: 'Quito', seats: 40 },
  { name: 'Quito - Ambato', from: 'Quito', to: 'Ambato', seats: 40 },
  { name: 'Ambato - Quito', from: 'Ambato', to: 'Quito', seats: 40 },
  { name: 'Quito - Ibarra', from: 'Quito', to: 'Ibarra', seats: 40 },
  { name: 'Ibarra - Quito', from: 'Ibarra', to: 'Quito', seats: 40 },
  { name: 'Quito - Latacunga', from: 'Quito', to: 'Latacunga', seats: 40 },
  { name: 'Latacunga - Quito', from: 'Latacunga', to: 'Quito', seats: 40 },
  { name: 'Quito - Riobamba', from: 'Quito', to: 'Riobamba', seats: 40 },
  { name: 'Riobamba - Quito', from: 'Riobamba', to: 'Quito', seats: 40 },
  { name: 'Quito - Tena', from: 'Quito', to: 'Tena', seats: 35 },
  { name: 'Tena - Quito', from: 'Tena', to: 'Quito', seats: 35 },
  { name: 'Quito - Puyo', from: 'Quito', to: 'Puyo', seats: 35 },
  { name: 'Puyo - Quito', from: 'Puyo', to: 'Quito', seats: 35 },
  { name: 'Quito - Santo Domingo', from: 'Quito', to: 'Santo Domingo', seats: 40 },
  { name: 'Santo Domingo - Quito', from: 'Santo Domingo', to: 'Quito', seats: 40 },
  { name: 'Quito - Guaranda', from: 'Quito', to: 'Guaranda', seats: 40 },
  { name: 'Guaranda - Quito', from: 'Guaranda', to: 'Quito', seats: 40 },
  { name: 'Quito - Tulcán', from: 'Quito', to: 'Tulcán', seats: 40 },
  { name: 'Tulcán - Quito', from: 'Tulcán', to: 'Quito', seats: 40 },
  { name: 'Quito - Esmeraldas', from: 'Quito', to: 'Esmeraldas', seats: 35 },
  { name: 'Esmeraldas - Quito', from: 'Esmeraldas', to: 'Quito', seats: 35 },
  
  // Rutas desde Guayaquil
  { name: 'Guayaquil - Cuenca', from: 'Guayaquil', to: 'Cuenca', seats: 40 },
  { name: 'Cuenca - Guayaquil', from: 'Cuenca', to: 'Guayaquil', seats: 40 },
  { name: 'Guayaquil - Machala', from: 'Guayaquil', to: 'Machala', seats: 40 },
  { name: 'Machala - Guayaquil', from: 'Machala', to: 'Guayaquil', seats: 40 },
  { name: 'Guayaquil - Manta', from: 'Guayaquil', to: 'Manta', seats: 40 },
  { name: 'Manta - Guayaquil', from: 'Manta', to: 'Guayaquil', seats: 40 },
  { name: 'Guayaquil - Babahoyo', from: 'Guayaquil', to: 'Babahoyo', seats: 40 },
  { name: 'Babahoyo - Guayaquil', from: 'Babahoyo', to: 'Guayaquil', seats: 40 },
  { name: 'Guayaquil - Portoviejo', from: 'Guayaquil', to: 'Portoviejo', seats: 40 },
  { name: 'Portoviejo - Guayaquil', from: 'Portoviejo', to: 'Guayaquil', seats: 40 },
  { name: 'Guayaquil - Salinas', from: 'Guayaquil', to: 'Salinas', seats: 40 },
  { name: 'Salinas - Guayaquil', from: 'Salinas', to: 'Guayaquil', seats: 40 },
  { name: 'Guayaquil - Santa Elena', from: 'Guayaquil', to: 'Santa Elena', seats: 40 },
  { name: 'Santa Elena - Guayaquil', from: 'Santa Elena', to: 'Guayaquil', seats: 40 },
  { name: 'Guayaquil - Santo Domingo', from: 'Guayaquil', to: 'Santo Domingo', seats: 40 },
  { name: 'Santo Domingo - Guayaquil', from: 'Santo Domingo', to: 'Guayaquil', seats: 40 },
  
  // Rutas desde Cuenca
  { name: 'Cuenca - Loja', from: 'Cuenca', to: 'Loja', seats: 40 },
  { name: 'Loja - Cuenca', from: 'Loja', to: 'Cuenca', seats: 40 },
  { name: 'Cuenca - Cañar', from: 'Cuenca', to: 'Cañar', seats: 35 },
  { name: 'Cañar - Cuenca', from: 'Cañar', to: 'Cuenca', seats: 35 },
  { name: 'Cuenca - Azogues', from: 'Cuenca', to: 'Azogues', seats: 35 },
  { name: 'Azogues - Cuenca', from: 'Azogues', to: 'Cuenca', seats: 35 },
  { name: 'Cuenca - Riobamba', from: 'Cuenca', to: 'Riobamba', seats: 40 },
  { name: 'Riobamba - Cuenca', from: 'Riobamba', to: 'Cuenca', seats: 40 },
  
  // Rutas desde Ambato
  { name: 'Ambato - Riobamba', from: 'Ambato', to: 'Riobamba', seats: 40 },
  { name: 'Riobamba - Ambato', from: 'Riobamba', to: 'Ambato', seats: 40 },
  { name: 'Ambato - Guaranda', from: 'Ambato', to: 'Guaranda', seats: 35 },
  { name: 'Guaranda - Ambato', from: 'Guaranda', to: 'Ambato', seats: 35 },
  { name: 'Ambato - Latacunga', from: 'Ambato', to: 'Latacunga', seats: 40 },
  { name: 'Latacunga - Ambato', from: 'Latacunga', to: 'Ambato', seats: 40 },
  { name: 'Ambato - Baños', from: 'Ambato', to: 'Baños', seats: 35 },
  { name: 'Baños - Ambato', from: 'Baños', to: 'Ambato', seats: 35 },
  
  // Rutas desde Ibarra
  { name: 'Ibarra - Tulcán', from: 'Ibarra', to: 'Tulcán', seats: 40 },
  { name: 'Tulcán - Ibarra', from: 'Tulcán', to: 'Ibarra', seats: 40 },
  { name: 'Ibarra - Esmeraldas', from: 'Ibarra', to: 'Esmeraldas', seats: 35 },
  { name: 'Esmeraldas - Ibarra', from: 'Esmeraldas', to: 'Ibarra', seats: 35 },
  { name: 'Ibarra - Otavalo', from: 'Ibarra', to: 'Otavalo', seats: 35 },
  { name: 'Otavalo - Ibarra', from: 'Otavalo', to: 'Ibarra', seats: 35 },
  { name: 'Ibarra - Latacunga', from: 'Ibarra', to: 'Latacunga', seats: 40 },
  { name: 'Latacunga - Ibarra', from: 'Latacunga', to: 'Ibarra', seats: 40 },
  
  // Rutas desde Loja
  { name: 'Loja - Zamora', from: 'Loja', to: 'Zamora', seats: 35 },
  { name: 'Zamora - Loja', from: 'Zamora', to: 'Loja', seats: 35 },
  { name: 'Loja - Macará', from: 'Loja', to: 'Macará', seats: 35 },
  { name: 'Macará - Loja', from: 'Macará', to: 'Loja', seats: 35 },
  { name: 'Loja - Catamayo', from: 'Loja', to: 'Catamayo', seats: 35 },
  { name: 'Catamayo - Loja', from: 'Catamayo', to: 'Loja', seats: 35 },
  
  // Rutas desde Manta
  { name: 'Manta - Portoviejo', from: 'Manta', to: 'Portoviejo', seats: 40 },
  { name: 'Portoviejo - Manta', from: 'Portoviejo', to: 'Manta', seats: 40 },
  { name: 'Manta - Montecristi', from: 'Manta', to: 'Montecristi', seats: 35 },
  { name: 'Montecristi - Manta', from: 'Montecristi', to: 'Manta', seats: 35 },
  { name: 'Manta - Puerto López', from: 'Manta', to: 'Puerto López', seats: 35 },
  { name: 'Puerto López - Manta', from: 'Puerto López', to: 'Manta', seats: 35 },
  { name: 'Manta - Bahía de Caráquez', from: 'Manta', to: 'Bahía de Caráquez', seats: 35 },
  { name: 'Bahía de Caráquez - Manta', from: 'Bahía de Caráquez', to: 'Manta', seats: 35 },
  
  // Rutas desde Riobamba
  { name: 'Riobamba - Guaranda', from: 'Riobamba', to: 'Guaranda', seats: 35 },
  { name: 'Guaranda - Riobamba', from: 'Guaranda', to: 'Riobamba', seats: 35 },
  { name: 'Riobamba - Latacunga', from: 'Riobamba', to: 'Latacunga', seats: 40 },
  { name: 'Latacunga - Riobamba', from: 'Latacunga', to: 'Riobamba', seats: 40 },
  { name: 'Riobamba - Baños', from: 'Riobamba', to: 'Baños', seats: 35 },
  { name: 'Baños - Riobamba', from: 'Baños', to: 'Riobamba', seats: 35 },
  
  // Rutas desde Esmeraldas
  { name: 'Esmeraldas - Atacames', from: 'Esmeraldas', to: 'Atacames', seats: 35 },
  { name: 'Atacames - Esmeraldas', from: 'Atacames', to: 'Esmeraldas', seats: 35 },
  { name: 'Esmeraldas - San Lorenzo', from: 'Esmeraldas', to: 'San Lorenzo', seats: 30 },
  { name: 'San Lorenzo - Esmeraldas', from: 'San Lorenzo', to: 'Esmeraldas', seats: 30 },
  
  // Rutas desde Machala
  { name: 'Machala - Santa Rosa', from: 'Machala', to: 'Santa Rosa', seats: 35 },
  { name: 'Santa Rosa - Machala', from: 'Santa Rosa', to: 'Machala', seats: 35 },
  { name: 'Machala - Pasaje', from: 'Machala', to: 'Pasaje', seats: 35 },
  { name: 'Pasaje - Machala', from: 'Pasaje', to: 'Machala', seats: 35 },
  { name: 'Machala - Loja', from: 'Machala', to: 'Loja', seats: 40 },
  { name: 'Loja - Machala', from: 'Loja', to: 'Machala', seats: 40 },
  
  // Rutas desde Puyo
  { name: 'Puyo - Tena', from: 'Puyo', to: 'Tena', seats: 30 },
  { name: 'Tena - Puyo', from: 'Tena', to: 'Puyo', seats: 30 },
  { name: 'Puyo - Baños', from: 'Puyo', to: 'Baños', seats: 35 },
  { name: 'Baños - Puyo', from: 'Baños', to: 'Puyo', seats: 35 },
  { name: 'Puyo - Ambato', from: 'Puyo', to: 'Ambato', seats: 35 },
  { name: 'Ambato - Puyo', from: 'Ambato', to: 'Puyo', seats: 35 },
  
  // Rutas desde Tena
  { name: 'Tena - Francisco de Orellana', from: 'Tena', to: 'Francisco de Orellana', seats: 30 },
  { name: 'Francisco de Orellana - Tena', from: 'Francisco de Orellana', to: 'Tena', seats: 30 },
  { name: 'Tena - Archidona', from: 'Tena', to: 'Archidona', seats: 30 },
  { name: 'Archidona - Tena', from: 'Archidona', to: 'Tena', seats: 30 },
  
  // Rutas desde Francisco de Orellana
  { name: 'Francisco de Orellana - Lago Agrio', from: 'Francisco de Orellana', to: 'Lago Agrio', seats: 30 },
  { name: 'Lago Agrio - Francisco de Orellana', from: 'Lago Agrio', to: 'Francisco de Orellana', seats: 30 },
  
  // Rutas desde Santo Domingo
  { name: 'Santo Domingo - Esmeraldas', from: 'Santo Domingo', to: 'Esmeraldas', seats: 35 },
  { name: 'Esmeraldas - Santo Domingo', from: 'Esmeraldas', to: 'Santo Domingo', seats: 35 },
  { name: 'Santo Domingo - Manta', from: 'Santo Domingo', to: 'Manta', seats: 40 },
  { name: 'Manta - Santo Domingo', from: 'Manta', to: 'Santo Domingo', seats: 40 },
  { name: 'Santo Domingo - Quevedo', from: 'Santo Domingo', to: 'Quevedo', seats: 40 },
  { name: 'Quevedo - Santo Domingo', from: 'Quevedo', to: 'Santo Domingo', seats: 40 },
  
  // Rutas desde Salinas
  { name: 'Salinas - Santa Elena', from: 'Salinas', to: 'Santa Elena', seats: 35 },
  { name: 'Santa Elena - Salinas', from: 'Santa Elena', to: 'Salinas', seats: 35 },
  { name: 'Salinas - Montañita', from: 'Salinas', to: 'Montañita', seats: 35 },
  { name: 'Montañita - Salinas', from: 'Montañita', to: 'Salinas', seats: 35 },
  { name: 'Salinas - Manta', from: 'Salinas', to: 'Manta', seats: 40 },
  { name: 'Manta - Salinas', from: 'Manta', to: 'Salinas', seats: 40 },
  
  // Rutas desde Babahoyo
  { name: 'Babahoyo - Quevedo', from: 'Babahoyo', to: 'Quevedo', seats: 40 },
  { name: 'Quevedo - Babahoyo', from: 'Quevedo', to: 'Babahoyo', seats: 40 },
  { name: 'Babahoyo - Ventanas', from: 'Babahoyo', to: 'Ventanas', seats: 35 },
  { name: 'Ventanas - Babahoyo', from: 'Ventanas', to: 'Babahoyo', seats: 35 },
  
  // Rutas desde Tulcán
  { name: 'Tulcán - San Gabriel', from: 'Tulcán', to: 'San Gabriel', seats: 35 },
  { name: 'San Gabriel - Tulcán', from: 'San Gabriel', to: 'Tulcán', seats: 35 },
  
  // Rutas desde Zamora
  { name: 'Zamora - Yantzaza', from: 'Zamora', to: 'Yantzaza', seats: 30 },
  { name: 'Yantzaza - Zamora', from: 'Yantzaza', to: 'Zamora', seats: 30 },
  { name: 'Zamora - Gualaquiza', from: 'Zamora', to: 'Gualaquiza', seats: 30 },
  { name: 'Gualaquiza - Zamora', from: 'Gualaquiza', to: 'Zamora', seats: 30 }
];

module.exports = {
  lugaresTuristicos,
  rutas
};

