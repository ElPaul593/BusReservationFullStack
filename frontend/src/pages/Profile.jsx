import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  // Datos de ejemplo del usuario
  const userSample = {
    cedula: '1724643976',
    nombre: 'Pablo',
    apellido: 'Criollo',
    telefono: '0963386219',
    createdAt: '2025-01-15T10:30:00Z'
  };
  
  const [formData, setFormData] = useState({
    nombre: userSample.nombre,
    apellido: userSample.apellido,
    telefono: userSample.telefono,
    password: ''
  });

  useEffect(() => {
    // Validar autenticación
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Simular carga de datos
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [token, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Simular actualización
    setTimeout(() => {
      setSuccess('Perfil actualizado exitosamente');
      setEditing(false);
    }, 500);
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.'
    );
    
    if (confirmDelete) {
      alert('Función de eliminar cuenta - Aquí se conectaría con el backend');
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setFormData({
      nombre: userSample.nombre,
      apellido: userSample.apellido,
      telefono: userSample.telefono,
      password: ''
    });
    setError(null);
    setSuccess(null);
  };

  if (!token) {
    return null; // No mostrar nada mientras redirige
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Mi Perfil</h1>
          <div className="profile-actions">
            {!editing ? (
              <button 
                className="btn-edit" 
                onClick={() => setEditing(true)}
              >
                Editar Perfil
              </button>
            ) : (
              <button 
                className="btn-cancel" 
                onClick={handleCancelEdit}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {!editing ? (
          <div className="profile-info">
            <div className="info-group">
              <label>Cédula:</label>
              <span>{userSample.cedula}</span>
            </div>
            <div className="info-group">
              <label>Nombre:</label>
              <span>{userSample.nombre}</span>
            </div>
            <div className="info-group">
              <label>Apellido:</label>
              <span>{userSample.apellido}</span>
            </div>
            <div className="info-group">
              <label>Teléfono:</label>
              <span>{userSample.telefono}</span>
            </div>
            <div className="info-group">
              <label>Fecha de registro:</label>
              <span>{new Date(userSample.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="profile-form">
            <div className="form-group">
              <label>Cédula:</label>
              <input 
                type="text" 
                value={userSample.cedula} 
                disabled 
                className="input-disabled"
              />
              <small>La cédula no se puede modificar</small>
            </div>
            
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Apellido:</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Teléfono:</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Nueva Contraseña:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Dejar vacío para mantener la actual"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save">
                Guardar Cambios
              </button>
            </div>
          </form>
        )}

        <div className="danger-zone">
          <h3>Zona de Peligro</h3>
          <p>Una vez que elimines tu cuenta, no hay vuelta atrás.</p>
          <button 
            className="btn-delete" 
            onClick={handleDeleteAccount}
          >
            Eliminar Cuenta
          </button>
        </div>
      </div>
    </div>
  );
}