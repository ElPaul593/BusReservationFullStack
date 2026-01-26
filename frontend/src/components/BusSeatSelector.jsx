import React, { useState, useEffect, useCallback } from 'react';
import HoldTimer from './HoldTimer';
import './BusSeatSelector.css';
import {
    getDisponibles,
    createHold,
    getHolds,
    deleteHold,
    confirmReserva,
    buildSeatMap
} from '../services/asientosService';

const BusSeatSelector = ({ rutaId, fecha, onClose, onReservationComplete }) => {
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [myHold, setMyHold] = useState(null); // { holdId, asiento, expiresAt, remainingMs }
    const [apiResponse, setApiResponse] = useState(null);

    const myUserId = (() => {
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
    })();

    // Cargar estado inicial
    const loadSeats = useCallback(async () => {
        if (!rutaId || !fecha) return;

        setLoading(true);
        setError(null);

        try {
            const [disponiblesRes, holdsRes] = await Promise.all([
                getDisponibles({ rutaId, fecha }),
                getHolds()
            ]);

            setApiResponse({ disponibles: disponiblesRes, holds: holdsRes });

            if (disponiblesRes.ok) {
                const seatMap = buildSeatMap({
                    available: disponiblesRes.available,
                    holds: holdsRes.holds || [],
                    total: disponiblesRes.total || 40,
                    myUserId
                });
                setSeats(seatMap);

                // Buscar si ya tengo un hold activo
                const myActiveHold = (holdsRes.holds || []).find(
                    h => h.userId === myUserId && h.rutaId === rutaId && h.fecha === fecha
                );
                if (myActiveHold) {
                    setMyHold(myActiveHold);
                    setSelectedSeat(myActiveHold.asiento);
                }
            } else {
                setError(disponiblesRes.error || 'Error al cargar asientos');
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [rutaId, fecha, myUserId]);

    useEffect(() => {
        loadSeats();
    }, [loadSeats]);

    // Auto-refresh cada 10 segundos (opcional)
    useEffect(() => {
        const interval = setInterval(() => {
            if (!myHold) { // Solo refrescar si no tengo hold activo
                loadSeats();
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [loadSeats, myHold]);

    // Manejar selección de asiento
    const handleSeatClick = async (seat) => {
        if (seat.status !== 'available') return;
        if (myHold) {
            alert('Ya tienes un asiento en hold. Cancela o confirma primero.');
            return;
        }

        setLoading(true);
        const result = await createHold({ rutaId, fecha, seatNumber: seat.number });
        setApiResponse(result);

        if (result.ok) {
            setMyHold({
                holdId: result.holdId,
                asiento: seat.number,
                expiresAt: result.expiresAt,
                remainingMs: result.remainingMs
            });
            setSelectedSeat(seat.number);
            await loadSeats();
        } else {
            setError(result.error || 'Error al crear hold');
        }
        setLoading(false);
    };

    // Cancelar hold
    const handleCancel = async () => {
        if (!myHold) return;

        setLoading(true);
        const result = await deleteHold({
            rutaId,
            fecha,
            asiento: myHold.asiento
        });
        setApiResponse(result);

        if (result.ok) {
            setMyHold(null);
            setSelectedSeat(null);
            await loadSeats();
        } else {
            setError(result.error || 'Error al cancelar reserva');
        }
        setLoading(false);
    };

    // Confirmar reserva
    const handleConfirm = async () => {
        if (!myHold) return;

        setLoading(true);
        const result = await confirmReserva({ holdId: myHold.holdId });
        setApiResponse(result);

        if (result.ok) {
            alert(`¡Reserva confirmada! Asiento #${myHold.asiento}`);
            setMyHold(null);
            setSelectedSeat(null);
            await loadSeats();
            if (onReservationComplete) {
                onReservationComplete(result);
            }
        } else {
            setError(result.error || 'Error al confirmar reserva');
        }
        setLoading(false);
    };

    // Cuando el timer expira
    const handleTimerExpire = () => {
        setMyHold(null);
        setSelectedSeat(null);
        loadSeats();
    };

    // Renderizar grid de asientos (4 columnas: 2 + pasillo + 2)
    const renderBusGrid = () => {
        const rows = [];
        for (let i = 0; i < seats.length; i += 4) {
            const rowSeats = seats.slice(i, i + 4);
            rows.push(
                <div key={i} className="bus-row">
                    {rowSeats[0] && <SeatButton seat={rowSeats[0]} />}
                    {rowSeats[1] && <SeatButton seat={rowSeats[1]} />}
                    <div className="aisle"></div>
                    {rowSeats[2] && <SeatButton seat={rowSeats[2]} />}
                    {rowSeats[3] && <SeatButton seat={rowSeats[3]} />}
                </div>
            );
        }
        return rows;
    };

    const SeatButton = ({ seat }) => {
        const isSelected = seat.number === selectedSeat;
        let className = `seat seat-${seat.status}`;
        if (isSelected) className += ' seat-selected';

        return (
            <button
                className={className}
                onClick={() => handleSeatClick(seat)}
                disabled={loading || (seat.status !== 'available' && seat.status !== 'heldByMe')}
                title={`Asiento ${seat.number} - ${seat.status}`}
            >
                {seat.number}
            </button>
        );
    };

    return (
        <div className="bus-seat-selector">
            <div className="selector-header">
                <h2>Selección de Asientos</h2>
                <p>Ruta: {rutaId} | Fecha: {fecha}</p>
                {onClose && (
                    <button className="btn-close" onClick={onClose}>✕</button>
                )}
            </div>

            {error && (
                <div className="error-banner">
                    {error}
                    <button onClick={() => setError(null)}>✕</button>
                </div>
            )}

            {loading && <div className="loading-overlay">Cargando...</div>}

            <div className="bus-container">
                <div className="driver-section">🚌 Conductor</div>
                <div className="seats-grid">
                    {renderBusGrid()}
                </div>
            </div>

            <div className="legend">
                <span className="legend-item"><span className="dot available"></span> Disponible</span>
                <span className="legend-item"><span className="dot heldByMe"></span> Mi Hold</span>
                <span className="legend-item"><span className="dot heldByOther"></span> Ocupado (Hold)</span>
                <span className="legend-item"><span className="dot reserved"></span> Reservado</span>
            </div>

            {myHold && (
                <div className="hold-panel">
                    <div className="hold-info">
                        <strong>Asiento #{myHold.asiento} en Hold</strong>
                        <HoldTimer
                            expiresAt={myHold.expiresAt}
                            remainingMs={myHold.remainingMs}
                            onExpire={handleTimerExpire}
                        />
                    </div>
                    <div className="hold-actions">
                        <button
                            className="btn btn-confirm"
                            onClick={handleConfirm}
                            disabled={loading}
                        >
                            ✓ Confirmar Reserva
                        </button>
                        <button
                            className="btn btn-cancel"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            ✕ Cancelar
                        </button>
                    </div>
                </div>
            )}

            <div className="actions-bar">
                <button className="btn btn-refresh" onClick={loadSeats} disabled={loading}>
                    🔄 Refrescar
                </button>
            </div>

            {apiResponse && (
                <details className="api-debug">
                    <summary>Debug: Última respuesta API</summary>
                    <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                </details>
            )}
        </div>
    );
};

export default BusSeatSelector;
