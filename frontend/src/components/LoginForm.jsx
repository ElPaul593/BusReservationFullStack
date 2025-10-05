import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

export default function LoginForm() {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({ cedula: false, password: false });
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

  const passwordError = useMemo(() => {
    if (!touched.password) return null;
    if (password.length === 0) return 'La contraseña es requerida';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return null;
  }, [password, touched.password]);

  const isFormValid = !cedulaError && !passwordError && cedula && password;

  const handleCedulaChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '');
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
      navigate('/users'); // or '/dashboard'
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Error en el login');
    }
  };

  return (
    <main className="center-screen">
      <div className="card" role="dialog" aria-labelledby="login-title">
        <h2 id="login-title">Iniciar sesión</h2>
        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          <div className="field">
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

          <div className="field">
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

          <button className="btn btn-primary" type="submit" disabled={!isFormValid}>
            Entrar
          </button>

          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </main>
  );
}
