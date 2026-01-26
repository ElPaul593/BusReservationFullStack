import React, { useState, useEffect } from 'react';
import { getAvailableSeats, holdSeat, deleteHold, confirmReservation, getHolds } from '../services/seats';
import './SeatSelection.css';

const SeatSelection = ({ rutaId, fecha, userId }) => {
    const [seats, setSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastResponse, setLastResponse] = useState(null);
    const [holdsList, setHoldsList] = useState([]);
    const [currentHoldId, setCurrentHoldId] = useState(null);

    // Cargar asientos
    const loadSeats = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAvailableSeats(rutaId, fecha);
            setLastResponse(data);
            if (data.ok) {
                const availableSet = new Set(data.available);
                // Generar 40 asientos
                const allSeats = Array.from({ length: 40 }, (_, i) => {
                    const num = i + 1;
                    return {
                        numero: num,
                        estado: availableSet.has(num) ? 'available' : 'reserved'
                    };
                });
                setSeats(allSeats);
            } else {
                setError('Error al cargar asientos');
            }
        } catch (err) {
            setError(err.message || 'Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const loadHolds = async () => {
        setLoading(true);
        try {
            const data = await getHolds();
            setLastResponse(data);
            if (data.ok) {
                setHoldsList(data.holds || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (rutaId && fecha) {
            loadSeats();
            setSelectedSeat(null);
            setLastResponse(null);
            setCurrentHoldId(null);
        }
    }, [rutaId, fecha]);

    const handleSeatClick = (seat) => {
        if (seat.estado === 'available') {
            setSelectedSeat(seat.numero === selectedSeat ? null : seat.numero);
        }
    };

    // 1. Crear Hold
    const handleHold = async () => {
        if (!selectedSeat) return;
        setLoading(true);
        try {
            const payload = { rutaId, fecha, asiento: selectedSeat, userId: userId || 'U001' };
            const result = await holdSeat(payload);
            setLastResponse(result);

            if (result.ok) {
                setCurrentHoldId(result.holdId);
                alert(`Hold creado! ID: ${result.holdId}`);
                await loadSeats(); // Refrescar
                setSelectedSeat(null);
            } else {
                alert('Error: ' + result.error);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 2. Confirmar Reserva
    const handleConfirm = async () => {
        // Si tenemos un holdId en memoria lo usamos, sino pedimos input o usamos el seleccionado si la logica lo permite
        // Asumiremos que el usuario quiere confirmar el hold recien creado o manual
        const holdIdToConfirm = currentHoldId || prompt("Ingrese Hold ID a confirmar:");
        if (!holdIdToConfirm) return;

        setLoading(true);
        try {
            const result = await confirmReservation({ holdId: holdIdToConfirm });
            setLastResponse(result);
            if (result.ok) {
                alert("Reserva confirmada definitivamente!");
                setCurrentHoldId(null);
                await loadSeats();
            } else {
                alert('Error: ' + (result.error || 'Falló confirmación'));
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 3. Cancelar Hold (Liberar Asiento)
    const handleDeleteHold = async () => {
        // Necesitamos asiento para liberar por ruta/fecha/asiento
        const seatToRelease = selectedSeat || prompt("Ingrese número de asiento a liberar:");
        if (!seatToRelease) return;

        setLoading(true);
        try {
            const payload = {
                rutaId,
                fecha,
                asiento: parseInt(seatToRelease)
            };

            const result = await deleteHold(payload);
            setLastResponse(result);

            if (result.ok) {
                alert("Asiento liberado!");
                await loadSeats();
            } else {
                alert('Error: ' + (result.error || 'No se pudo liberar'));
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderGrid = () => {
        if (!seats || seats.length === 0) {
            return <div>No hay asientos disponibles</div>;
        }
        
        const rows = [];
        for (let i = 0; i < 40; i += 4) {
            const rowSeats = seats.slice(i, i + 4);
            // Validar que rowSeats tenga los elementos necesarios antes de renderizar
            rows.push(
                <React.Fragment key={i}>
                    <SeatButton seat={rowSeats[0]} />
                    <SeatButton seat={rowSeats[1]} />
                    <div className="aisle"></div>
                    {rowSeats[2] ? <SeatButton seat={rowSeats[2]} /> : <div className="seat-item hidden"></div>}
                    {rowSeats[3] ? <SeatButton seat={rowSeats[3]} /> : <div className="seat-item hidden"></div>}
                </React.Fragment>
            );
        }
        return rows;
    };

    const SeatButton = ({ seat }) => {
        if (!seat) return <div className="seat-item hidden"></div>;
        let className = 'seat-item ';
        if (seat.numero === selectedSeat) className += 'seat-selected';
        else if (seat.estado === 'available') className += 'seat-available';
        else className += 'seat-reserved';

        return (
            <div className={className} onClick={() => handleSeatClick(seat)}>
                {seat.numero}
            </div>
        );
    };

    return (
        <div className="seat-grid-container">
            <h3>Selección de Asientos (Demo API)</h3>

            {loading && <p>Cargando operacion...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="bus-container">
                <div className="driver-area">Frente</div>
                <div className="seats-grid">
                    {renderGrid()}
                </div>
            </div>

            <div className="control-panel">
                <div className="action-buttons-row">
                    <button className="btn-action btn-refresh" onClick={loadSeats} disabled={loading}>
                        🔄 Recargar Asientos
                    </button>
                    <button className="btn-action btn-hold" onClick={handleHold} disabled={!selectedSeat || loading}>
                        ✋ Crear Hold
                    </button>
                    <button className="btn-action btn-confirm" onClick={handleConfirm} disabled={loading}>
                        ✅ Confirmar Reserva
                    </button>
                    <button className="btn-action btn-release" onClick={handleDeleteHold} disabled={loading}>
                        ❌ Liberar / Cancelar
                    </button>
                    <button className="btn-action btn-view-holds" onClick={loadHolds} disabled={loading}>
                        📋 Ver Todos los Holds
                    </button>
                </div>
            </div>

            {holdsList.length > 0 && (
                <div className="holds-list-panel">
                    <h4>Holds Activos:</h4>
                    <ul>
                        {holdsList.map((h, idx) => (
                            <li key={idx}>
                                HoldID: {h.holdId} | Asiento: {h.asiento} | Expira: {h.expiresAt}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {lastResponse && (
                <div className="api-response-panel">
                    <h4>Última Respuesta API:</h4>
                    <pre>{JSON.stringify(lastResponse, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default SeatSelection;
