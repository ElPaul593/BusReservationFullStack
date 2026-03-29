const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const AuthService = require('../../services/authService');
const Ruta = require('../../models/rutaModel');
const Reserva = require('../../models/reservaModel');

let mongoServer;
let userToken;
let adminToken;
let testUserId;
let testRutaId;
let testReservaId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Crear usuario normal
  const user = await AuthService.register({
    cedula: '9999999999',
    nombre: 'Test',
    apellido: 'User',
    telefono: '0999999999',
    paisOrigen: 'Ecuador',
    password: 'password123'
  });
  testUserId = user.id || user._id;

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ cedula: '9999999999', password: 'password123' });
  userToken = loginRes.body.token;

  // Crear usuario admin
  const User = require('../../models/userModel');
  await User.create({
    cedula: '1111111111',
    nombre: 'Admin',
    apellido: 'User',
    telefono: '0111111111',
    paisOrigen: 'Ecuador',
    password: require('bcryptjs').hashSync('admin123', 10),
    role: 'admin'
  });

  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({ cedula: '1111111111', password: 'admin123' });
  adminToken = adminLogin.body.token;

  // Crear ruta de prueba
  const ruta = await Ruta.create({
    from: 'Quito',
    to: 'Guayaquil',
    price: 15,
    duration: '8h',
    seats: 40
  });
  testRutaId = ruta._id.toString();

  // Crear reserva de prueba para el usuario
  const reserva = await Reserva.create({
    user: testUserId,
    ruta: testRutaId,
    seatNumber: 5,
    seatNumbers: [5],
    status: 'reserved',
    fecha: '2026-06-01'
  });
  testReservaId = reserva._id.toString();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  const Pago = require('../../models/pagoModel');
  await Pago.deleteMany({});
});

describe('Pagos API Integration Tests', () => {
  describe('POST /api/pagos - Crear pago', () => {
    test('debe crear un pago pendiente para una reserva válida', async () => {
      const response = await request(app)
        .post('/api/pagos')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ reservaId: testReservaId, metodoPago: 'tarjeta' })
        .expect(201);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('estado', 'pendiente');
      expect(response.body.data).toHaveProperty('metodoPago', 'tarjeta');
      expect(response.body.data).toHaveProperty('monto');
      expect(response.body.data.monto).toBeGreaterThan(0);
      expect(response.body.data).toHaveProperty('pricing');
    });

    test('debe retornar 400 si faltan campos requeridos', async () => {
      const response = await request(app)
        .post('/api/pagos')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ reservaId: testReservaId })
        .expect(400);

      expect(response.body).toHaveProperty('status', 'fail');
    });

    test('debe retornar 400 si el metodoPago es inválido', async () => {
      const response = await request(app)
        .post('/api/pagos')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ reservaId: testReservaId, metodoPago: 'bitcoin' })
        .expect(400);

      expect(response.body).toHaveProperty('status', 'fail');
    });

    test('debe retornar 404 si la reserva no existe', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .post('/api/pagos')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ reservaId: fakeId, metodoPago: 'efectivo' })
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    test('debe retornar 401 si no hay token', async () => {
      await request(app)
        .post('/api/pagos')
        .send({ reservaId: testReservaId, metodoPago: 'tarjeta' })
        .expect(401);
    });

    test('no debe permitir pagar una reserva cancelada', async () => {
      const cancelledReserva = await Reserva.create({
        user: testUserId,
        ruta: testRutaId,
        seatNumber: 10,
        seatNumbers: [10],
        status: 'cancelled',
        fecha: '2026-06-01'
      });

      const response = await request(app)
        .post('/api/pagos')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ reservaId: cancelledReserva._id.toString(), metodoPago: 'tarjeta' })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/pagos/:id/confirmar - Confirmar pago', () => {
    let pagoId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/pagos')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ reservaId: testReservaId, metodoPago: 'transferencia' })
        .expect(201);
      pagoId = res.body.data.id;
    });

    test('debe confirmar un pago pendiente', async () => {
      const response = await request(app)
        .post(`/api/pagos/${pagoId}/confirmar`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Pago confirmado exitosamente');
      expect(response.body.data).toHaveProperty('estado', 'completado');
      expect(response.body.data).toHaveProperty('fechaPago');
    });

    test('no debe confirmar un pago ya completado', async () => {
      // Confirmar primero
      await request(app)
        .post(`/api/pagos/${pagoId}/confirmar`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      // Intentar confirmar de nuevo
      const response = await request(app)
        .post(`/api/pagos/${pagoId}/confirmar`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/pagos/mine - Mis pagos', () => {
    test('debe retornar los pagos del usuario autenticado', async () => {
      // Crear un pago
      await request(app)
        .post('/api/pagos')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ reservaId: testReservaId, metodoPago: 'efectivo' });

      const response = await request(app)
        .get('/api/pagos/mine')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body).toHaveProperty('pagination');
    });

    test('debe retornar 401 sin token', async () => {
      await request(app)
        .get('/api/pagos/mine')
        .expect(401);
    });
  });

  describe('GET /api/pagos - Admin: todos los pagos', () => {
    test('admin debe poder ver todos los pagos', async () => {
      // Crear un pago
      await request(app)
        .post('/api/pagos')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ reservaId: testReservaId, metodoPago: 'paypal' });

      const response = await request(app)
        .get('/api/pagos')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('pagination');
    });

    test('usuario normal no puede ver todos los pagos', async () => {
      await request(app)
        .get('/api/pagos')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('PATCH /api/pagos/:id/estado - Admin: actualizar estado', () => {
    let pagoId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/pagos')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ reservaId: testReservaId, metodoPago: 'tarjeta' })
        .expect(201);
      pagoId = res.body.data.id;
    });

    test('admin puede actualizar estado a reembolsado', async () => {
      const response = await request(app)
        .patch(`/api/pagos/${pagoId}/estado`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ estado: 'reembolsado' })
        .expect(200);

      expect(response.body.data).toHaveProperty('estado', 'reembolsado');
    });

    test('admin puede actualizar estado a fallido', async () => {
      const response = await request(app)
        .patch(`/api/pagos/${pagoId}/estado`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ estado: 'fallido' })
        .expect(200);

      expect(response.body.data).toHaveProperty('estado', 'fallido');
    });

    test('usuario normal no puede actualizar estado', async () => {
      await request(app)
        .patch(`/api/pagos/${pagoId}/estado`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ estado: 'completado' })
        .expect(403);
    });

    test('debe retornar 400 con estado inválido', async () => {
      await request(app)
        .patch(`/api/pagos/${pagoId}/estado`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ estado: 'invalido' })
        .expect(400);
    });
  });

  describe('GET /api/pagos/:id - Obtener pago por ID', () => {
    test('debe retornar un pago existente', async () => {
      const createRes = await request(app)
        .post('/api/pagos')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ reservaId: testReservaId, metodoPago: 'tarjeta' })
        .expect(201);

      const pagoId = createRes.body.data.id;

      const response = await request(app)
        .get(`/api/pagos/${pagoId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.data).toHaveProperty('id', pagoId);
      expect(response.body.data).toHaveProperty('metodoPago', 'tarjeta');
    });

    test('debe retornar 404 para ID inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      await request(app)
        .get(`/api/pagos/${fakeId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });
});
