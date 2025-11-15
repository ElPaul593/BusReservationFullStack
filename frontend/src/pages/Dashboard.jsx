import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { listUsers, createUser, updateUser, deleteUser, getCurrentUser } from '../services/users';
import CedulaValidatorSimple from '../components/CedulaValidatorSimple';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  // Determinar si estamos en la ruta de dashboard de gestión de usuarios
  const isUserManagementDashboard = location.pathname === '/dashboard';
  
  // Cédulas autorizadas para acceder al dashboard
  const authorizedCedulas = ['1722108188', '1724643976'];

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
        setError('No tienes permisos para acceder a esta sección. Solo usuarios autorizados pueden ver la información de usuarios.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    

    if (!isUserManagementDashboard) {
      setAuthorized(true);
      setLoading(false);

      
      return;
    }

    const checkAccess = async () => {
      try {
        const currentUser = await getCurrentUser();
        const userCedula = String(currentUser.cedula || '').trim();
        
        if (authorizedCedulas.includes(userCedula)) {
          setAuthorized(true);
          loadUsers();
        } else {
          // Redirigir inmediatamente sin mostrar mensaje
          navigate('/demo', { replace: true });
          return;
        }
      } catch (err) {
        // Si hay error de autenticación, redirigir a login
        if (err.message.includes('Token') || err.message.includes('autenticado') || err.message.includes('Acceso denegado')) {
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
        } else {
          // Para otros errores, también redirigir
          navigate('/demo', { replace: true });
        }
      }
    };
    
    checkAccess();
  }, [token, navigate, loadUsers, isUserManagementDashboard]);

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

  if (!token) {
    return null;
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }


  if (!isUserManagementDashboard) {
    return (
      <div className="dashboard-container">
        <div className="container">
          <div className="dashboard-header">
            <h1>Mis Reservas</h1>
            <p>Gestiona tus reservas de viaje</p>
          </div>
          <div className="dashboard-section">
            <div className="empty-state">
              <p>No tienes reservas aún. <a href="/boletos">Explora nuestros boletos disponibles</a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si no está autorizado para gestión de usuarios, no mostrar nada (ya fue redirigido)
  if (!authorized && isUserManagementDashboard) {
    return null; // No mostrar nada, la redirección ya se hizo
  }

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
