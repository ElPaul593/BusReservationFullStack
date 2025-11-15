import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../services/auth';
import { validarCedula } from '../services/cedula';
import { PAISES } from '../constants/paises';

export default function RegisterForm() {
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [paisOrigen, setPaisOrigen] = useState('');
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});
  const [validandoCedula, setValidandoCedula] = useState(false);
  const [cedulaValida, setCedulaValida] = useState(null);
  const navigate = useNavigate();

  const cedulaDigits = cedula.replace(/\D/g, '');

  // Validar cédula ecuatoriana automáticamente
  useEffect(() => {
    const validarCedulaEcuatoriana = async () => {
      // Extraer país seleccionado y cédula de 10 dígitos
      const paisSeleccionado = paisOrigen.trim();
      const cedulaLimpia = cedulaDigits;
      
      // Solo validar si el país es Ecuador y la cédula tiene exactamente 10 dígitos
      if (paisSeleccionado === 'Ecuador' && cedulaLimpia.length === 10 && /^\d{10}$/.test(cedulaLimpia)) {
        setValidandoCedula(true);
        try {
          const resultado = await validarCedula(cedulaLimpia);
          setCedulaValida(resultado.valida);
          if (!resultado.valida) {
            setError('La cédula ecuatoriana no es válida. Por favor, verifique el número.');
          } else {
            setError(null);
          }
        } catch (err) {
          setCedulaValida(false);
          setError(err.message || 'Error al validar la cédula');
        } finally {
          setValidandoCedula(false);
        }
      } else {
        // Resetear validación si no es Ecuador o no tiene 10 dígitos
        if (paisSeleccionado !== 'Ecuador' || cedulaLimpia.length !== 10) {
          setCedulaValida(null);
          if (paisSeleccionado !== 'Ecuador') {
            setError(null);
          }
        }
      }
    };

    // Validar después de un pequeño delay para evitar muchas peticiones
    const timeoutId = setTimeout(validarCedulaEcuatoriana, 500);
    return () => clearTimeout(timeoutId);
  }, [cedulaDigits, paisOrigen]);

  const cedulaError = useMemo(() => {
    if (!touched.cedula) return null;
    const cedulaLimpia = cedulaDigits;
    const paisSeleccionado = paisOrigen.trim();
    
    if (cedulaLimpia.length === 0) return 'La cédula es requerida';
    if (!/^\d+$/.test(cedulaLimpia)) return 'La cédula debe contener solo dígitos';
    if (cedulaLimpia.length > 10) return 'Máximo 10 dígitos';
    if (cedulaLimpia.length < 6) return 'La cédula es muy corta';
    
    // Si es Ecuador y tiene 10 dígitos, verificar validación
    if (paisSeleccionado === 'Ecuador' && cedulaLimpia.length === 10) {
      if (validandoCedula) return 'Validando cédula ecuatoriana...';
      if (cedulaValida === false) return 'La cédula ecuatoriana no es válida';
      if (cedulaValida === true) return null; // Cédula válida, no mostrar error
    }
    
    return null;
  }, [cedulaDigits, touched.cedula, paisOrigen, cedulaValida, validandoCedula]);

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

  const paisOrigenError = useMemo(() => {
    if (!touched.paisOrigen) return null;
    if (!paisOrigen.trim()) return 'El país de origen es requerido';
    return null;
  }, [paisOrigen, touched.paisOrigen]);

  const isFormValid =
    !cedulaError && !nombreError && !apellidoError && !passwordError && !telefonoError && !paisOrigenError &&
    cedulaDigits && nombre && apellido && password && telefono && paisOrigen &&
    // Si es Ecuador, la cédula debe estar validada y ser válida
    (paisOrigen.trim() !== 'Ecuador' || (cedulaDigits.length === 10 && cedulaValida === true));

  const handleCedulaChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '');
    setCedula(digitsOnly.slice(0, 10));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ cedula: true, nombre: true, apellido: true, password: true, telefono: true, paisOrigen: true });
    setError(null);
    
    // Extraer país seleccionado y cédula limpia
    const paisSeleccionado = paisOrigen.trim();
    const cedulaLimpia = cedulaDigits;
    
    // BLOQUEAR: Validar cédula ecuatoriana antes de enviar - NO PERMITIR REGISTRO SI NO ES VÁLIDA
    if (paisSeleccionado === 'Ecuador') {
      if (cedulaLimpia.length !== 10) {
        setError('La cédula ecuatoriana debe tener exactamente 10 dígitos.');
        return;
      }
      
      if (validandoCedula) {
        setError('Por favor, espere a que se valide la cédula ecuatoriana.');
        return;
      }
      
      if (cedulaValida === null) {
        setError('Por favor, espere a que se valide la cédula ecuatoriana.');
        return;
      }
      
      if (cedulaValida === false) {
        setError('La cédula ecuatoriana no es válida. Por favor, verifique el número según el algoritmo de validación.');
        return;
      }
      
      // Solo permitir si cedulaValida === true
      if (cedulaValida !== true) {
        setError('La cédula ecuatoriana debe ser validada antes de continuar.');
        return;
      }
    }
    
    if (!isFormValid) {
      setError('Por favor, complete todos los campos correctamente.');
      return;
    }
    
    try {
      await register({
        cedula: cedulaDigits,
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        telefono: telefono.trim(),
        paisOrigen: paisOrigen.trim(),
        password
      });
      const data = await login({ cedula: cedulaDigits, password });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
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
              <label htmlFor="cedula">
                Cédula
                {paisOrigen.trim() === 'Ecuador' && cedulaDigits.length === 10 && (
                  <span style={{marginLeft: '8px', fontSize: '0.85em'}}>
                    {validandoCedula && '⏳ Validando...'}
                    {!validandoCedula && cedulaValida === true && '✓ Válida'}
                    {!validandoCedula && cedulaValida === false && '✗ Inválida'}
                  </span>
                )}
              </label>
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
                style={{
                  borderColor: paisOrigen.trim() === 'Ecuador' && cedulaDigits.length === 10
                    ? (cedulaValida === true ? '#28a745' : cedulaValida === false ? '#dc3545' : undefined)
                    : undefined
                }}
              />
              {cedulaError && <div className="error">{cedulaError}</div>}
              {paisOrigen.trim() === 'Ecuador' && cedulaDigits.length === 10 && !cedulaError && cedulaValida === true && (
                <div style={{color: '#28a745', fontSize: '0.85em', marginTop: '4px'}}>
                  ✓ Cédula ecuatoriana válida
                </div>
              )}
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

          <div className="field">
            <label htmlFor="paisOrigen">País de Origen</label>
            <select
              id="paisOrigen"
              className="input"
              value={paisOrigen}
              onChange={(e) => setPaisOrigen(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, paisOrigen: true }))}
              required
            >
              <option value="">Seleccione un país</option>
              {PAISES.map((pais, index) => (
                <option key={index} value={pais}>{pais}</option>
              ))}
            </select>
            {paisOrigenError && <div className="error">{paisOrigenError}</div>}
          </div>

          <button 
            className="btn btn-primary" 
            type="submit" 
            disabled={
              !isFormValid || 
              (paisOrigen.trim() === 'Ecuador' && cedulaDigits.length === 10 && cedulaValida !== true) ||
              validandoCedula
            }
          >
            {validandoCedula ? 'Validando cédula...' : 'Crear cuenta'}
          </button>

          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </main>
  );
}
