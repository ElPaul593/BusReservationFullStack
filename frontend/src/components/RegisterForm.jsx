import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../services/auth';

export default function RegisterForm() {
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const cedulaDigits = cedula.replace(/\D/g, '');

  const cedulaError = useMemo(() => {
    if (!touched.cedula) return null;
    if (cedula.length === 0) return 'La cédula es requerida';
    if (!/^\d+$/.test(cedula)) return 'La cédula debe contener solo dígitos';
    if (cedula.length > 10) return 'Máximo 10 dígitos';
    if (cedula.length < 6) return 'La cédula es muy corta';
    return null;
  }, [cedula, touched.cedula]);

  const nombreError = useMemo(() => {
    if (!touched.nombre) return null;
    if (!nombre.trim()) return 'El nombre es requerido';
    return null;
  }, [nombre, touched.nombre]);

  const apellidoError = useMemo(() => {
    if (!touched.apellido) return null;
    if (!apellido.trim()) return 'El apellido es requerido';
    return null;
  }, [apellido, touched.apellido]);

  const passwordError = useMemo(() => {
    if (!touched.password) return null;
    if (password.length === 0) return 'La contraseña es requerida';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return null;
  }, [password, touched.password]);

  const telefonoError = useMemo(() => {
    if (!touched.telefono) return null;
    if (!telefono.trim()) return 'El teléfono es requerido';
    // basic digits-only check
    if (!/^\d+$/.test(telefono.trim())) return 'El teléfono debe contener solo dígitos';
    return null;
  }, [telefono, touched.telefono]);

  const isFormValid = !cedulaError && !nombreError && !apellidoError && !passwordError && !telefonoError && cedula && nombre && apellido && password && telefono;

  const handleCedulaChange = (e) => {
    const raw = e.target.value;
    const digitsOnly = raw.replace(/\D/g, '');
    setCedula(digitsOnly.slice(0, 10));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ cedula: true, nombre: true, apellido: true, password: true, telefono: true });
    setError(null);
    if (!isFormValid) return;
    try {
      await register({ cedula: cedulaDigits, nombre: nombre.trim(), apellido: apellido.trim(), telefono: telefono.trim(), password });
      // Auto-login after successful registration
      const data = await login({ cedula: cedulaDigits, password });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al registrar');
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto' }}>
      <h2>Registro de usuario</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="cedula">Cédula</label>
          <input
            id="cedula"
            name="cedula"
            inputMode="numeric"
            pattern="\\d*"
            value={cedula}
            onChange={handleCedulaChange}
            onBlur={() => setTouched((t) => ({ ...t, cedula: true }))}
            maxLength={10}
            required
            style={{ display: 'block', width: '100%', padding: 8 }}
          />
          {cedulaError && <small style={{ color: 'red' }}>{cedulaError}</small>}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
            required
            style={{ display: 'block', width: '100%', padding: 8 }}
          />
          {nombreError && <small style={{ color: 'red' }}>{nombreError}</small>}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label htmlFor="apellido">Apellido</label>
          <input
            id="apellido"
            name="apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, apellido: true }))}
            required
            style={{ display: 'block', width: '100%', padding: 8 }}
          />
          {apellidoError && <small style={{ color: 'red' }}>{apellidoError}</small>}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            name="telefono"
            inputMode="numeric"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 15))}
            onBlur={() => setTouched((t) => ({ ...t, telefono: true }))}
            required
            style={{ display: 'block', width: '100%', padding: 8 }}
          />
          {telefonoError && <small style={{ color: 'red' }}>{telefonoError}</small>}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            required
            style={{ display: 'block', width: '100%', padding: 8 }}
          />
          {passwordError && <small style={{ color: 'red' }}>{passwordError}</small>}
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={!isFormValid}>Crear cuenta</button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}
