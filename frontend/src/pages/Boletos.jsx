import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BOLETOS_SAMPLE } from '../constants/boletos';
import { CIUDADES, CIUDADES_OPTIONS } from '../constants/ciudades';

export default function Boletos() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

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

  const boletosSample = BOLETOS_SAMPLE;

  const handleReservar = (boletoId) => {
    alert(`Reservando boleto ID: ${boletoId}`);
    // Aquí iría la lógica para reservar
  };

  if (!token) {
    return null; // No mostrar nada mientras redirige
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando boletos disponibles...</p>
      </div>
    );
  }

  return (
    <div className="boletos-container">
      <div className="container">
        <div className="boletos-header">
          <h1>Boletos Disponibles</h1>
          <p>Encuentra y reserva tu viaje perfecto</p>
        </div>

        <div className="search-filters">
          <div className="filter-group">
            <label>Origen</label>
            <select>
              {CIUDADES_OPTIONS.map((option, index) => (
                <option key={index} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Destino</label>
            <select>
              {CIUDADES_OPTIONS.map((option, index) => (
                <option key={index} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Fecha</label>
            <input type="date" />
          </div>
          <button className="search-btn">Buscar</button>
        </div>

        <div className="boletos-grid">
          {boletosSample.map(boleto => (
            <div key={boleto.id} className="boleto-card">
              <div className="boleto-header">
                <div className="route">
                  <span className="origen">{boleto.origen}</span>
                  <span className="arrow">➜</span>
                  <span className="destino">{boleto.destino}</span>
                </div>
                <div className="precio">{boleto.precio}</div>
              </div>
              
              <div className="boleto-info">
                <div className="info-item">
                  <span className="label">Fecha:</span>
                  <span className="value">{boleto.fecha}</span>
                </div>
                <div className="info-item">
                  <span className="label">Hora:</span>
                  <span className="value">{boleto.hora}</span>
                </div>
                <div className="info-item">
                  <span className="label">Empresa:</span>
                  <span className="value">{boleto.empresa}</span>
                </div>
                <div className="info-item">
                  <span className="label">Asientos:</span>
                  <span className="value">{boleto.asientos} disponibles</span>
                </div>
              </div>

              <div className="boleto-actions">
                <button 
                  className="reservar-btn"
                  onClick={() => handleReservar(boleto.id)}
                >
                  Reservar Ahora
                </button>
                <div className="destino-links">
                  <Link 
                    to={`/destino?ciudad=${encodeURIComponent(boleto.destino)}`}
                    className="link-destino"
                  >
                    Ver Hoteles y Lugares
                  </Link>
                  <Link 
                    to={`/recomendados?ciudad=${encodeURIComponent(boleto.destino)}`}
                    className="link-recomendados"
                  >
                    Ver Recomendados
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}