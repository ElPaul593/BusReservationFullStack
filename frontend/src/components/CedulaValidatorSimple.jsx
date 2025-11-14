import React, { useState } from 'react';
import { validarCedula } from '../services/cedula';

export default function CedulaValidatorSimple() {
  const [cedula, setCedula] = useState('');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setCedula(value);
    setResultado(null);
  };

  const handleValidar = async () => {
    if (cedula.length !== 10) {
      setResultado({ valida: false, mensaje: 'La cédula debe tener 10 dígitos' });
      return;
    }

    setCargando(true);
    try {
      const respuesta = await validarCedula(cedula);
      setResultado(respuesta);
    } catch (err) {
      setResultado({ valida: false, mensaje: err.message });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="cedula-validator-simple">
      <div className="validator-header">
        <h3>Validar Cédula</h3>
      </div>
      <div className="validator-body">
        <div className="validator-input-group">
          <input
            type="text"
            value={cedula}
            onChange={handleChange}
            placeholder="Ingrese cédula (10 dígitos)"
            maxLength="10"
            className="validator-input"
          />
          <button
            type="button"
            onClick={handleValidar}
            disabled={cargando || cedula.length !== 10}
            className="validator-btn"
          >
            {cargando ? '...' : 'Validar'}
          </button>
        </div>
        {resultado && (
          <div className={`validator-result ${resultado.valida ? 'valida' : 'invalida'}`}>
            {resultado.valida ? '✓' : '✗'} {resultado.mensaje}
          </div>
        )}
      </div>
    </div>
  );
}

