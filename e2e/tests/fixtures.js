// Fixtures reproducibles para las pruebas de interfaz.
// NUNCA usar documentos reales, contraseñas reales ni datos de producción.
export const TRAVELER = {
  _id: 'e2e-user',
  nombre: 'Usuario',
  apellido: 'Pruebas',
  cedula: '0999999999'
};

export const ROUTES = [
  { _id: '507f1f77bcf86cd799439011', from: 'Quito', to: 'Guayaquil', price: 15, seats: 40, duration: '8 horas', name: 'Ruta Costa' },
  { _id: '507f1f77bcf86cd799439012', from: 'Cuenca', to: 'Quito', price: 12, seats: 35, duration: '7 horas', name: 'Ruta Sierra' }
];

export const PLACES = [
  { _id: '507f191e810c19729de860aa', nombre: 'Malecón 2000', ciudad: 'Guayaquil', tipo: 'Cultural', direccion: 'Malecón Simón Bolívar', descripcion: 'Paseo turístico', imagen: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=' },
  { _id: '507f191e810c19729de860ab', nombre: 'Parque Histórico', ciudad: 'Guayaquil', tipo: 'Naturaleza', direccion: 'Samborondón', descripcion: 'Patrimonio cultural', imagen: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=' },
  { _id: '507f191e810c19729de860ac', nombre: 'Mitad del Mundo', ciudad: 'Quito', tipo: 'Cultural', direccion: 'San Antonio de Pichincha', imagen: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=' }
];

export const HOTELS = [
  { _id: '507f191e810c19729de860ad', nombre: 'Hotel Centro', ciudad: 'Guayaquil', direccion: 'Centro', precioPromedio: 45 }
];

export const RECOMMENDATIONS = [
  { _id: '507f191e810c19729de860aa', nombre: 'Malecón 2000', tipo: 'lugarTuristico', ciudad: 'Guayaquil', direccion: 'Malecón Simón Bolívar', score: 4.7, promedioGeneral: 4.5, totalCalificaciones: 12 },
  { _id: '507f191e810c19729de860ab', nombre: 'Parque Histórico', tipo: 'lugarTuristico', ciudad: 'Guayaquil', direccion: 'Samborondón', score: 4.3, promedioGeneral: 4.2, totalCalificaciones: 8 }
];

export function testToken() {
  const json = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  // Token de simulación: NO está firmado y NUNCA autoriza llamadas reales.
  return `${json({ alg: 'none', typ: 'JWT' })}.${json({ id: TRAVELER._id, rol: 'usuario', exp: 9999999999 })}.e2e`;
}

export async function authenticated(page) {
  const token = testToken();
  await page.addInitScript((value) => {
    localStorage.setItem('token', value);
  }, token);
}

// Respuestas controladas: validan el comportamiento del frontend;
// NO sustituyen las pruebas de integración con backend y base reales.
export async function mockApi(page, { loginStatus = 200 } = {}) {
  const calls = [];
  const state = { hold: null };
  await page.route('**/api/**', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const path = url.pathname.replace(/^\/api/, '');
    const method = req.method();
    const body = req.postDataJSON?.() ?? null;
    calls.push({ method, path, query: url.search, body });
    const reply = (payload, status = 200) => route.fulfill({
      status, contentType: 'application/json', body: JSON.stringify(payload)
    });

    if (path === '/auth/login' && method === 'POST') {
      return loginStatus === 200
        ? reply({ token: testToken(), user: TRAVELER })
        : reply({ error: 'Credenciales incorrectas' }, loginStatus);
    }
    if (path === '/users/me' && method === 'GET') return reply(TRAVELER);
    if (path === '/users' && method === 'GET') return reply([]);
    if (path.startsWith('/reservas/mine') && method === 'GET') return reply({ data: [], pagination: { totalPages: 1 } });
    if (path === '/rutas' && method === 'GET') return reply(ROUTES);
    if (path === '/hoteles' && method === 'GET') {
      return reply(HOTELS.filter(h => !url.searchParams.get('ciudad') || h.ciudad.toLowerCase() === url.searchParams.get('ciudad').toLowerCase()));
    }
    if (path === '/lugares-turisticos' && method === 'GET') {
      return reply(PLACES.filter(p => !url.searchParams.get('ciudad') || p.ciudad.toLowerCase() === url.searchParams.get('ciudad').toLowerCase()));
    }
    if (path === '/recomendaciones' && method === 'GET') return reply(RECOMMENDATIONS);
    if (path === '/calificaciones' && method === 'GET') return reply([]);
    if (path === '/calificaciones' && method === 'POST') return reply({ _id: 'e2e-rating', ...body }, 201);
    if (path === '/asientos/disponibles' && method === 'GET') {
      return reply({ ok: true, total: 4, available: [1, 2, 3, 4] });
    }
    if (path === '/asientos/holds' && method === 'GET') {
      return reply({ ok: true, holds: state.hold ? [state.hold] : [] });
    }
    if (path === '/asientos/reservar' && method === 'POST') {
      state.hold = {
        holdId: 'e2e-hold-1', rutaId: body.rutaId, fecha: body.fecha,
        asiento: body.asiento, userId: TRAVELER._id,
        expiresAt: new Date(Date.now() + 5 * 60_000).toISOString(),
        remainingMs: 300_000
      };
      return reply({ ok: true, ...state.hold });
    }
    if (path === '/asientos/holds' && method === 'DELETE') {
      state.hold = null;
      return reply({ ok: true });
    }
    if (path === '/pricing/calcular-precio' && method === 'POST') {
      return reply({ ok: true, cantidad: body.cantidad, precioUnitario: 15, subtotal: body.cantidad * 15, porcentajeDescuento: 0, montoDescuento: 0, total: body.cantidad * 15, ahorros: 0 });
    }
    return reply({ error: `Sin fixture E2E para ${method} ${path}` }, 501);
  });
  return { calls, state };
}
