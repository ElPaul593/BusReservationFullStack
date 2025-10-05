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
    if (!/^\d+$/.test(telefono.trim())) return 'El teléfono debe contener solo dígitos';
    return null;
  }, [telefono, touched.telefono]);

  const isFormValid =
    !cedulaError && !nombreError && !apellidoError && !passwordError && !telefonoError &&
    cedula && nombre && apellido && password && telefono;

  const handleCedulaChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '');
    setCedula(digitsOnly.slice(0, 10));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ cedula: true, nombre: true, apellido: true, password: true, telefono: true });
    setError(null);
    if (!isFormValid) return;
    try {
      await register({
        cedula: cedulaDigits,
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        telefono: telefono.trim(),
        password
      });
      const data = await login({ cedula: cedulaDigits, password });
      localStorage.setItem('token', data.token);
      navigate('/users'); // or '/dashboard'
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Error al registrar');
    }
  };

  return (
    <main className="center-screen">
      <div className="card" role="dialog" aria-labelledby="reg-title" style={{maxWidth: 760}}>
        <h2 id="reg-title">Registro de usuario</h2>
        <form onSubmit={handleSubmit} noValidate className="form-grid" style={{gridTemplateColumns:'1fr', gap: 14}}>
          <div className="row-between" style={{gap:14, flexWrap:'wrap'}}>
            <div className="field" style={{flex:'1 1 240px'}}>
              <label htmlFor="cedula">Cédula</label>
              <input
                id="cedula"
                className="input"
                inputMode="numeric"
                pattern="\\d*"
                value={cedula}
                onChange={handleCedulaChange}
                onBlur={() => setTouched((t) => ({ ...t, cedula: true }))}
                maxLength={10}
                placeholder="1723456789"
                required
              />
              {cedulaError && <div className="error">{cedulaError}</div>}
            </div>

            <div className="field" style={{flex:'1 1 240px'}}>
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                className="input"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
                placeholder="Pablo"
                required
              />
              {nombreError && <div className="error">{nombreError}</div>}
            </div>

            <div className="field" style={{flex:'1 1 240px'}}>
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                className="input"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, apellido: true }))}
                placeholder="Criollo"
                required
              />
              {apellidoError && <div className="error">{apellidoError}</div>}
            </div>
          </div>

          <div className="row-between" style={{gap:14, flexWrap:'wrap'}}>
            <div className="field" style={{flex:'1 1 240px'}}>
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                className="input"
                inputMode="numeric"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 15))}
                onBlur={() => setTouched((t) => ({ ...t, telefono: true }))}
                placeholder="0999999999"
                required
              />
              {telefonoError && <div className="error">{telefonoError}</div>}
            </div>

            <div className="field" style={{flex:'1 1 240px'}}>
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                placeholder="••••••"
                required
              />
              {passwordError && <div className="error">{passwordError}</div>}
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={!isFormValid}>
            Crear cuenta
          </button>

          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </main>
  );
}
