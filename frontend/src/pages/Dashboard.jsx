import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listUsers, createUser, updateUser, deleteUser } from '../services/users';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

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

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    loadUsers();
  }, [token, navigate]);

  const loadUsers = async () => {
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
  };

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

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header">
          <h1>Dashboard - Gestión de Usuarios</h1>
          <p>Administra los usuarios del sistema</p>
        </div>

        {error && <div className="error-message">{error}</div>}

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
