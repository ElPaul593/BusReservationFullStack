import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

export default function LoginForm() {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({ cedula: false, password: false });
  const navigate = useNavigate();

  // validation: cedula must be exactly 10 digits (or configurable: min 7? user requested max 10)
  const cedulaDigits = cedula.replace(/\D/g, '');

  const cedulaError = useMemo(() => {
    if (!touched.cedula) return null;
    if (cedula.length === 0) return 'La cédula es requerida';
    if (!/^\d+$/.test(cedula)) return 'La cédula debe contener solo dígitos';
    if (cedula.length > 10) return 'Máximo 10 dígitos';
    if (cedula.length < 6) return 'La cédula es muy corta';
    return null;
  }, [cedula, touched.cedula]);

  const passwordError = useMemo(() => {
    if (!touched.password) return null;
    if (password.length === 0) return 'La contraseña es requerida';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return null;
  }, [password, touched.password]);

  const isFormValid = !cedulaError && !passwordError && cedula.length > 0 && password.length > 0;

  const handleCedulaChange = (e) => {
    // allow only digits in state
    const raw = e.target.value;
    const digitsOnly = raw.replace(/\D/g, '');
    // enforce max length 10
    setCedula(digitsOnly.slice(0, 10));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ cedula: true, password: true });
    setError(null);
    if (!isFormValid) return;
    try {
      const data = await login({ cedula: cedulaDigits, password });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error en el login');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '2rem auto' }}>
      <h2>Iniciar sesión</h2>
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
          <button type="submit" disabled={!isFormValid}>Entrar</button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}
