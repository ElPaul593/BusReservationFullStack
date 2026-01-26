import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { listUsers, createUser, updateUser, deleteUser, getCurrentUser } from '../services/users';
import { getUserReservations, cancelReserva, createReserva, createMultiSeatReserva } from '../services/reservas';
import CedulaValidatorSimple from '../components/CedulaValidatorSimple';
import BusSeatSelector from '../components/BusSeatSelector';
import { getRutas } from '../services/rutas';

export default function Dashboard() {
  // --- Estados Generales ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const isUserManagementDashboard = location.pathname === '/dashboard';
  const authorizedCedulas = ['1722108188', '1724643976'];

  // --- Estados para Gestión de Usuarios (Admin) ---
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
    telefono: '',
    password: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    password: ''
  });

  // --- Estados para Mis Reservas (User) ---
  const [reservas, setReservas] = useState([]);
  const [resLoading, setResLoading] = useState(true);
  const [resError, setResError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- Estados para Reserva Rápida ---
  const [showQuickReserve, setShowQuickReserve] = useState(false);
  const [rutas, setRutas] = useState([]);
  const [selectedRuta, setSelectedRuta] = useState('');
  const [selectedFecha, setSelectedFecha] = useState('');
  const [showSeatSelector, setShowSeatSelector] = useState(false);
  const [isQuickReservation, setIsQuickReservation] = useState(false);

  // --- Estados para Cambiar Asiento ---
  const [changingSeatFor, setChangingSeatFor] = useState(null); // { reservaId, rutaId, fecha, currentSeat }

  // --- Callbacks y Effects ---

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listUsers();
      setUsers(data);
    } catch (e) {
      setError(e.message);
      if (e.message.includes('Acceso denegado') || e.message.includes('Token')) {
        localStorage.removeItem('token');
        setError('No tienes permisos para acceder a esta sección.');
      }
    } finally {
      setLoading(false);
    }
  }, [isUserManagementDashboard]); // Added dependency to suppress lint warning if needed, though empty [] is fine for initial load function

  // Wrapper for fetching reservations to reuse in cancel handler
  const loadReservas = useCallback(async () => {
    try {
      setResLoading(true);
      const response = await getUserReservations(page);
      setReservas(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error cargando reservas:", err);
      setResError("No se pudieron cargar tus reservas.");
    } finally {
      setResLoading(false);
    }
  }, [page]);

  // Efecto principal de autenticación y carga inicial
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const checkAccess = async () => {
      // Caso 1: Dashboard de Reservas (Usuario normal)
      if (!isUserManagementDashboard) {
        setAuthorized(true);
        setLoading(false);
        return;
      }

      // Caso 2: Dashboard de Admin (Gestión de Usuarios)
      try {
        const currentUser = await getCurrentUser();
        const userCedula = String(currentUser.cedula || '').trim();

        if (authorizedCedulas.includes(userCedula)) {
          setAuthorized(true);
          loadUsers();
        } else {
          navigate('/demo', { replace: true });
        }
      } catch (err) {
        if (err.message.includes('Token') || err.message.includes('autenticado') || err.message.includes('Acceso denegado')) {
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
        } else {
          navigate('/demo', { replace: true });
        }
      }
    };

    checkAccess();
  }, [token, navigate, loadUsers, isUserManagementDashboard, authorizedCedulas.join(',')]); // Added primitive dependency for array

  // Efecto para cargar reservas
  useEffect(() => {
    if (isUserManagementDashboard || !token) return;
    loadReservas();
    loadRutasData();
  }, [isUserManagementDashboard, token, page, loadReservas]);

  const loadRutasData = async () => {
    try {
      const response = await getRutas();
      setRutas(Array.isArray(response) ? response : response.data || []);
    } catch (e) {
      console.error('Error loading rutas:', e);
    }
  };

  // --- Handlers User ---
  const handleCancelReserva = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;
    try {
      await cancelReserva(id);
      alert('Reserva cancelada exitosamente');
      loadReservas();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleQuickReserve = () => {
    setShowQuickReserve(true);
  };

  const handleStartSeatSelection = () => {
    if (!selectedRuta || !selectedFecha) {
      alert('Por favor selecciona ruta y fecha');
      return;
    }
    setIsQuickReservation(true); // Marcar como reserva rápida
    setShowSeatSelector(true);
  };

  const handleChangeSeat = (reserva) => {
    // Abrir selector de asientos para cambiar el asiento de esta reserva
    // Asegurar que rutaId sea un string (puede venir como objeto)
    const rutaIdValue = reserva.ruta?._id || reserva.ruta?.id || reserva.ruta || '';
    const rutaIdString = typeof rutaIdValue === 'object' && rutaIdValue !== null
      ? (rutaIdValue._id || rutaIdValue.id || String(rutaIdValue))
      : String(rutaIdValue);

    setChangingSeatFor({
      reservaId: reserva._id || reserva.id,
      rutaId: rutaIdString,
      fecha: reserva.fecha || new Date().toISOString().split('T')[0], // Usar fecha de la reserva o hoy
      currentSeat: reserva.seatNumber
    });
    setIsQuickReservation(false); // No es reserva rápida, es cambio de asiento
    setShowSeatSelector(true);
  };

  const today = new Date().toISOString().split('T')[0];

  // --- Handlers de Admin ---
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData);
      setFormData({ cedula: '', nombre: '', apellido: '', telefono: '', password: '' });
      loadUsers();
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    }
  };

  const startEdit = (u) => {
    setEditingId(u._id);
    setEditForm({
      nombre: u.nombre,
      apellido: u.apellido,
      telefono: u.telefono,
      password: ''
    });
  };

  const saveEdit = async (id) => {
    try {
      await updateUser(id, editForm);
      setEditingId(null);
      loadUsers();
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    }
  };

  // --- Render ---

  if (!token) return null;

  if (loading && isUserManagementDashboard) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  // Vista: Mis Reservas
  if (!isUserManagementDashboard) {
    // Filtrar reservas canceladas y reservas rápidas
    const reservasActivas = reservas.filter(r =>
      r.status !== 'cancelled' && !r.isQuickReservation
    );

    return (
      <div className="dashboard-container">
        <div className="container">
          <div className="dashboard-header">
            <h1>Mis Reservas</h1>
            <p>Gestiona tus reservas de viaje</p>
          </div>

          {/* Botón de Reserva Rápida */}
          <div className="quick-action-bar" style={{ marginBottom: '20px', padding: '20px', background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ color: 'white', margin: '0 0 10px' }}>¿Quieres hacer una nueva reserva?</h3>
            <button
              onClick={handleQuickReserve}
              style={{ background: 'white', color: '#11998e', border: 'none', padding: '12px 24px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
            >
              🚌 Reserva Rápida
            </button>
          </div>

          {/* Modal de Reserva Rápida */}
          {showQuickReserve && !showSeatSelector && (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div className="modal-content" style={{ background: 'white', borderRadius: '16px', padding: '30px', maxWidth: '500px', width: '90%', position: 'relative' }}>
                <button onClick={() => setShowQuickReserve(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🚌 Reserva Rápida</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Selecciona tu ruta:</label>
                    <select value={selectedRuta} onChange={e => setSelectedRuta(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #ddd' }}>
                      <option value="">-- Elige una ruta --</option>
                      {rutas.map(r => (
                        <option key={r._id || r.id} value={r._id || r.id}>
                          {r.from} ➜ {r.to} (${r.price})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Fecha de viaje:</label>
                    <input type="date" value={selectedFecha} onChange={e => setSelectedFecha(e.target.value)} min={today} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #ddd' }} />
                  </div>
                  <button onClick={handleStartSeatSelection} disabled={!selectedRuta || !selectedFecha} style={{ background: '#11998e', color: 'white', padding: '15px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Ver Asientos Disponibles
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Selector de Asientos Modal */}
          {showSeatSelector && (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
              <div style={{ background: 'white', borderRadius: '16px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
                <BusSeatSelector
                  rutaId={changingSeatFor?.rutaId ? String(changingSeatFor.rutaId) : (selectedRuta ? String(selectedRuta) : '')}
                  fecha={changingSeatFor?.fecha || selectedFecha}
                  onClose={() => {
                    setShowSeatSelector(false);
                    setShowQuickReserve(false);
                    setChangingSeatFor(null);
                    setIsQuickReservation(false);
                  }}
                  onReservationComplete={async (result) => {
                    // Si estamos cambiando asiento, cancelar la reserva anterior y crear nueva
                    if (changingSeatFor) {
                      try {
                        // Cancelar reserva anterior
                        await cancelReserva(changingSeatFor.reservaId);
                        // Crear UNA SOLA reserva con el/los nuevo(s) asiento(s)
                        if (result.ok && changingSeatFor.rutaId) {
                          const asientos = result.asientos || (result.asiento ? [result.asiento] : []);
                          if (asientos.length > 0) {
                            try {
                              // Crear UNA reserva con todos los asientos
                              await createMultiSeatReserva({
                                ruta: changingSeatFor.rutaId,
                                asientos,
                                fecha: result.fecha || changingSeatFor.fecha,
                                pricing: result.precio,
                                tipo: 'NORMAL'
                              });
                              alert(`¡Asiento${asientos.length > 1 ? 's' : ''} cambiado${asientos.length > 1 ? 's' : ''} exitosamente! (${asientos.length} asiento${asientos.length > 1 ? 's' : ''})`);
                            } catch (createErr) {
                              console.error('Error creando nueva reserva:', createErr);
                              alert('Asiento confirmado en la API externa, pero hubo un error al actualizar la reserva en el sistema.');
                            }
                          } else {
                            alert('¡Asiento cambiado exitosamente!');
                          }
                        } else {
                          alert('¡Asiento cambiado exitosamente!');
                        }
                      } catch (err) {
                        alert('Error al cambiar asiento: ' + err.message);
                      }
                    } else {
                      // Reserva rápida o normal - crear UNA reserva con todos los asientos
                      if (result.ok && selectedRuta) {
                        const asientos = result.asientos || (result.asiento ? [result.asiento] : []);
                        if (asientos.length > 0) {
                          try {
                            // Crear UNA reserva con todos los asientos
                            await createMultiSeatReserva({
                              ruta: selectedRuta,
                              asientos,
                              fecha: result.fecha || selectedFecha,
                              pricing: result.precio,
                              tipo: isQuickReservation ? 'RAPIDA' : 'NORMAL'
                            });

                            if (isQuickReservation) {
                              alert(`¡Reserva rápida completada!\nAsientos: [${asientos.join(', ')}]\nTotal: $${result.precio?.totalPagar?.toLocaleString() || '0'}\n\nNota: Esta reserva rápida no aparecerá en "Mis reservas".`);
                            } else {
                              alert(`¡Reserva completada!\n${asientos.length} asiento${asientos.length > 1 ? 's' : ''}: [${asientos.join(', ')}]\nTotal: $${result.precio?.totalPagar?.toLocaleString() || '0'}`);
                            }
                          } catch (err) {
                            console.error('Error creando reserva:', err);
                            alert('Reserva confirmada en la API externa, pero hubo un error al guardarla en el sistema.');
                          }
                        } else {
                          alert('¡Reserva completada!');
                        }
                      } else if (result.ok) {
                        alert('¡Reserva completada!');
                      }
                    }
                    setShowSeatSelector(false);
                    setShowQuickReserve(false);
                    setChangingSeatFor(null);
                    setIsQuickReservation(false);
                    loadReservas();
                  }}
                />
              </div>
            </div>
          )}

          <div className="dashboard-section">
            {resLoading ? (
              <div className="loading-spinner"></div>
            ) : resError ? (
              <p className="error-message">{resError}</p>
            ) : reservasActivas.length === 0 ? (
              <div className="empty-state">
                <p>No tienes reservas activas. ¡Haz una reserva rápida arriba!</p>
              </div>
            ) : (
              <div className="reservas-grid">
                {reservasActivas.map((reserva) => (
                  <div key={reserva._id || reserva.id} className="boleto-card">
                    <div className="boleto-header">
                      <div className="route">
                        <span className="origen">{reserva.ruta?.from || 'Origen'}</span>
                        <span className="arrow">➜</span>
                        <span className="destino">{reserva.ruta?.to || 'Destino'}</span>
                      </div>
                      <div className="precioStatus">
                        <span className={`status-badge ${reserva.status}`}>{reserva.status === 'reserved' ? 'Confirmada' : reserva.status}</span>
                      </div>
                    </div>
                    <div className="boleto-info">
                      <div className="info-item">
                        <span className="label">Asiento:</span>
                        <span className="value">#{reserva.seatNumber}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Precio:</span>
                        <span className="value">
                          {reserva.precio?.totalPagar
                            ? `$${reserva.precio.totalPagar.toFixed(2)}`
                            : `$${reserva.ruta?.price || '0.00'}`}
                          {reserva.precio?.recargo > 0 && (
                            <span style={{ fontSize: '12px', color: '#dc3545', marginLeft: '5px' }}>
                              (incluye {reserva.precio.motivoRecargo})
                            </span>
                          )}
                        </span>
                      </div>
                      {reserva.precio?.precioBase && (
                        <div className="info-item" style={{ fontSize: '12px', color: '#666' }}>
                          <span className="label">Precio Base:</span>
                          <span className="value">${reserva.precio.precioBase.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="info-item">
                        <span className="label">Duración:</span>
                        <span className="value">{reserva.ruta?.duration}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Fecha Compra:</span>
                        <span className="value">{new Date(reserva.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="boleto-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        className="change-seat-btn"
                        onClick={() => handleChangeSeat(reserva)}
                        style={{ backgroundColor: '#11998e', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
                      >
                        🔄 Cambiar Asiento
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancelReserva(reserva._id || reserva.id)}
                        style={{ backgroundColor: '#e74c3c', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
                      >
                        Cancelar Reserva
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginación simple */}
            {totalPages > 1 && (
              <div className="pagination">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Anterior</button>
                <span>Página {page} de {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Siguiente</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Vista: Dashboard Admin
  if (!authorized) return null;

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header">
          <h1>Dashboard - Gestión de Usuarios</h1>
          <p>Administra los usuarios del sistema</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Cédula Validator */}
        <div className="dashboard-section">
          <CedulaValidatorSimple />
        </div>

        {/* Create Form */}
        <div className="dashboard-section">
          <h2>Crear Nuevo Usuario</h2>
          <form onSubmit={handleCreate} className="user-form">
            <div className="form-row">
              <div className="field">
                <input
                  className="input"
                  placeholder="Cédula"
                  value={formData.cedula}
                  onChange={e => setFormData({ ...formData, cedula: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <input
                  className="input"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <input
                  className="input"
                  placeholder="Apellido"
                  value={formData.apellido}
                  onChange={e => setFormData({ ...formData, apellido: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <input
                  className="input"
                  placeholder="Teléfono"
                  value={formData.telefono}
                  onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <input
                  className="input"
                  type="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Crear</button>
            </div>
          </form>
        </div>

        {/* Users Table */}
        <div className="dashboard-section">
          <h2>Lista de Usuarios</h2>
          {users.length === 0 ? (
            <div className="empty-state">
              <p>No hay usuarios registrados</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Cédula</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>{u.cedula}</td>
                      <td>
                        {editingId === u._id
                          ? <input
                            className="input"
                            value={editForm.nombre}
                            onChange={e => setEditForm({ ...editForm, nombre: e.target.value })}
                          />
                          : u.nombre}
                      </td>
                      <td>
                        {editingId === u._id
                          ? <input
                            className="input"
                            value={editForm.apellido}
                            onChange={e => setEditForm({ ...editForm, apellido: e.target.value })}
                          />
                          : u.apellido}
                      </td>
                      <td>
                        {editingId === u._id
                          ? <input
                            className="input"
                            value={editForm.telefono}
                            onChange={e => setEditForm({ ...editForm, telefono: e.target.value })}
                          />
                          : u.telefono}
                      </td>
                      <td>
                        {editingId === u._id ? (
                          <div className="action-buttons">
                            <button
                              className="btn btn-primary"
                              onClick={() => saveEdit(u._id)}
                            >
                              Guardar
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={() => setEditingId(null)}
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="action-buttons">
                            <button
                              className="btn btn-secondary"
                              onClick={() => startEdit(u)}
                            >
                              Editar
                            </button>
                            <button
                              className="btn btn-ghost"
                              onClick={() => handleDelete(u._id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
