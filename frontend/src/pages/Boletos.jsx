import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Boletos.css';

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

  const boletosSample = [
    {
      id: 1,
      origen: 'Quito',
      destino: 'Guayaquil',
      fecha: '2025-10-15',
      hora: '08:00',
      precio: '$12.50',
      asientos: 45,
      empresa: 'TransEcuador'
    },
    {
      id: 2,
      origen: 'Cuenca',
      destino: 'Quito',
      fecha: '2025-10-15',
      hora: '14:30',
      precio: '$15.00',
      asientos: 32,
      empresa: 'Buses del Sur'
    },
    {
      id: 3,
      origen: 'Guayaquil',
      destino: 'Cuenca',
      fecha: '2025-10-16',
      hora: '06:45',
      precio: '$10.00',
      asientos: 28,
      empresa: 'Rápido Express'
    }
  ];

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
              <option>Todas las ciudades</option>
              <option>Quito</option>
              <option>Guayaquil</option>
              <option>Cuenca</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Destino</label>
            <select>
              <option>Todas las ciudades</option>
              <option>Quito</option>
              <option>Guayaquil</option>
              <option>Cuenca</option>
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

              <button 
                className="reservar-btn"
                onClick={() => handleReservar(boleto.id)}
              >
                Reservar Ahora
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}