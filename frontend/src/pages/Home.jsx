import React, { useEffect, useState } from 'react';
import { listUsers, createUser, updateUser, deleteUser } from '../services/users';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch all users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await listUsers();
      setUsers(data);
    } catch (e) {
      setError(e.message);
      // Si es error de autorización, limpiar token y mostrar mensaje específico
      if (e.message.includes('Acceso denegado') || e.message.includes('Token')) {
        localStorage.removeItem('token');
        setError('No tienes permisos para acceder a esta sección. Solo usuarios autorizados pueden ver la información de usuarios.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Create
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

  // Delete
  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    await deleteUser(id);
    loadUsers();
  };

  // Edit
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
        await updateUser(id, editForm); // Sends PUT to /users/:id
        setEditingId(null);
        loadUsers(); // Refresh table
      } catch (e) {
        alert(e.response?.data?.error || e.message);
      }
    };



  if (loading) return <h3>Loading...</h3>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <h2>Usuarios</h2>

      {/* Create Form */}
      <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '20px' }}>
        <input placeholder="Cédula" value={formData.cedula} onChange={e => setFormData({ ...formData, cedula: e.target.value })} required />
        <input placeholder="Nombre" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} required />
        <input placeholder="Apellido" value={formData.apellido} onChange={e => setFormData({ ...formData, apellido: e.target.value })} required />
        <input placeholder="Teléfono" value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} required />
        <input placeholder="Contraseña" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
        <button type="submit" style={{ gridColumn: 'span 5' }}>Crear</button>
      </form>

      {/* Table */}
      <table border="1" width="100%" cellPadding="5">
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
          {users.length === 0 ? (
            <tr><td colSpan="5" align="center">No hay usuarios</td></tr>
          ) : users.map(u => (
            <tr key={u._id}>
              <td>{u.cedula}</td>
              <td>
                {editingId === u._id
                  ? <input value={editForm.nombre} onChange={e => setEditForm({ ...editForm, nombre: e.target.value })} />
                  : u.nombre}
              </td>
              <td>
                {editingId === u._id
                  ? <input value={editForm.apellido} onChange={e => setEditForm({ ...editForm, apellido: e.target.value })} />
                  : u.apellido}
              </td>
              <td>
                {editingId === u._id
                  ? <input value={editForm.telefono} onChange={e => setEditForm({ ...editForm, telefono: e.target.value })} />
                  : u.telefono}
              </td>
              <td>
                {editingId === u._id ? (
                  <>
                    <button onClick={() => saveEdit(u._id)}>Guardar</button>
                    <button onClick={() => setEditingId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(u)}>Editar</button>
                    <button onClick={() => handleDelete(u._id)}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
