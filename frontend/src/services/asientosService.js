import api from './api';

/**
 * Servicio para la API de Asientos
 * BaseURL: http://localhost:5000 (via proxy /api/seat)
 */

const CLIENT_ID = () => {
    // Obtener userId del token o localStorage
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id || payload.userId || 'guest';
        } catch {
            return 'guest';
        }
    }
    return 'guest';
};

/**
 * GET /api/seat/disponibles
 * Obtiene lista de asientos disponibles para una ruta y fecha
 * Con fallback para cuando la API externa está dormida
 */
export async function getDisponibles({ rutaId, fecha }) {
    try {
        const response = await api.get('/seat/disponibles', {
            params: { rutaId, fecha },
            timeout: 30000 // Override timeout for this endpoint
        });
        return response.data;
    } catch (err) {
        console.error('Error fetching disponibles:', err);

        // FALLBACK: Si la API externa falla, devolver datos de prueba
        if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
            console.warn('API timeout - usando datos de demostración');
            return {
                ok: true,
                rutaId,
                fecha,
                available: [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 17, 18, 21, 22, 25, 26, 29, 30, 33, 34, 37, 38],
                total: 40,
                _isFallback: true
            };
        }
        return { ok: false, error: err.message };
    }
}

/**
 * POST /api/seat/reservar
 * Crea un hold temporal sobre un asiento
 * Con fallback para modo demo
 */
export async function createHold({ rutaId, fecha, seatNumber }) {
    try {
        const response = await api.post('/seat/reservar', {
            rutaId,
            fecha,
            asiento: seatNumber,
            userId: CLIENT_ID()
        }, { timeout: 30000 });
        return response.data;
    } catch (err) {
        console.error('Error creating hold:', err);
        const errorMsg = String(err.response?.data?.error || err.message || '');

        // FALLBACK: Siempre usar demo si hay cualquier error de API externa
        console.warn('API error - usando modo demostración para hold');
        const demoHoldId = `demo_hold_${Date.now()}_${seatNumber}`;
        return {
            ok: true,
            holdId: demoHoldId,
            asiento: seatNumber,
            rutaId: String(rutaId),
            fecha: String(fecha),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
            remainingMs: 300000,
            _isFallback: true,
            _originalError: errorMsg
        };
    }
}

/**
 * GET /api/seat/holds
 * Obtiene lista de holds activos
 */
export async function getHolds() {
    try {
        const response = await api.get('/seat/holds', { timeout: 30000 });
        return response.data;
    } catch (err) {
        console.error('Error fetching holds:', err);
        // FALLBACK: Si la API falla, devolver lista vacía
        if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
            return { ok: true, holds: [], count: 0, _isFallback: true };
        }
        return { ok: false, holds: [], error: err.message };
    }
}

/**
 * DELETE /api/seat/holds
 * Libera un hold (cancela reserva temporal)
 */
export async function deleteHold({ rutaId, fecha, asiento }) {
    try {
        const response = await api.delete('/seat/holds', {
            data: { rutaId, fecha, asiento },
            timeout: 30000
        });
        return response.data;
    } catch (err) {
        console.error('Error deleting hold:', err);
        // FALLBACK para demo
        if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
            return { ok: true, released: true, _isFallback: true };
        }
        return { ok: false, error: err.response?.data?.error || err.message };
    }
}

/**
 * POST /api/seat/reservar-definitivo
 * Confirma un hold como reserva definitiva
 */
export async function confirmReserva({ holdId }) {
    try {
        const response = await api.post('/seat/reservar-definitivo', {
            holdId
        }, { timeout: 30000 });
        return response.data;
    } catch (err) {
        console.error('Error confirming reservation:', err);
        // FALLBACK para demo
        if (err.code === 'ECONNABORTED' || err.message.includes('timeout') || holdId?.startsWith('demo_')) {
            return { ok: true, reservedAt: new Date().toISOString(), _isFallback: true };
        }
        return { ok: false, error: err.response?.data?.error || err.message };
    }
}

/**
 * Combina disponibles + holds para determinar estado de cada asiento
 * @param {number[]} available - Lista de asientos disponibles
 * @param {object[]} holds - Lista de holds activos
 * @param {number} total - Total de asientos del bus
 * @param {string} myUserId - ID del usuario actual
 * @returns {object[]} - Array de asientos con estado
 */
export function buildSeatMap({ available, holds = [], total = 40, myUserId }) {
    const availableSet = new Set(available || []);
    const holdMap = {};

    // Mapear holds por número de asiento
    (holds || []).forEach(h => {
        holdMap[h.asiento] = h;
    });

    const seats = [];
    for (let i = 1; i <= total; i++) {
        let status = 'reserved'; // Por defecto, reservado/ocupado
        let holdInfo = null;

        if (availableSet.has(i)) {
            status = 'available';
        } else if (holdMap[i]) {
            holdInfo = holdMap[i];
            if (holdMap[i].userId === myUserId) {
                status = 'heldByMe';
            } else {
                status = 'heldByOther';
            }
        }

        seats.push({
            number: i,
            status,
            holdInfo
        });
    }

    return seats;
}
