import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HERO_CONTENT, FEATURES, RUTAS_POPULARES, CTA_CONTENT } from '../constants/demo';
import { getRutas } from '../services/rutas';
import BusSeatSelector from '../components/BusSeatSelector';

export default function Demo() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Quick reservation state
  const [showQuickReserve, setShowQuickReserve] = useState(false);
  const [rutas, setRutas] = useState([]);
  const [selectedRuta, setSelectedRuta] = useState('');
  const [selectedFecha, setSelectedFecha] = useState('');
  const [showSeatSelector, setShowSeatSelector] = useState(false);

  useEffect(() => {
    loadRutas();
  }, []);

  const loadRutas = async () => {
    try {
      const response = await getRutas();
      setRutas(Array.isArray(response) ? response : response.data || []);
    } catch (e) {
      console.error('Error loading rutas:', e);
    }
  };

  const handleGetStarted = () => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleQuickReserve = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setShowQuickReserve(true);
  };

  const handleStartSeatSelection = () => {
    if (!selectedRuta || !selectedFecha) {
      alert('Por favor selecciona ruta y fecha');
      return;
    }
    setShowSeatSelector(true);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="demo-container">
      {/* QUICK RESERVATION BANNER - PROMINENT */}
      <section className="quick-reserve-banner">
        <div className="container">
          <div className="quick-reserve-content">
            <span className="quick-icon">🎫</span>
            <h2>¡Reserva tu asiento ahora!</h2>
            <p>Selecciona tu ruta, fecha y asiento en segundos</p>
            <button className="btn-quick-reserve" onClick={handleQuickReserve}>
              🚌 Haz tu reserva rápida aquí
            </button>
          </div>
        </div>
      </section>

      {/* Quick Reserve Modal */}
      {showQuickReserve && !showSeatSelector && (
        <div className="modal-overlay" onClick={() => setShowQuickReserve(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowQuickReserve(false)}>✕</button>
            <h2>🚌 Reserva Rápida</h2>
            <div className="quick-form">
              <div className="form-group">
                <label>Selecciona tu ruta:</label>
                <select value={selectedRuta} onChange={e => setSelectedRuta(e.target.value)}>
                  <option value="">-- Elige una ruta --</option>
                  {rutas.map(r => (
                    <option key={r._id || r.id} value={r._id || r.id}>
                      {r.from} ➜ {r.to} (${r.price})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Fecha de viaje:</label>
                <input
                  type="date"
                  value={selectedFecha}
                  onChange={e => setSelectedFecha(e.target.value)}
                  min={today}
                />
              </div>
              <button
                className="btn-primary btn-full"
                onClick={handleStartSeatSelection}
                disabled={!selectedRuta || !selectedFecha}
              >
                Ver Asientos Disponibles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seat Selector Modal */}
      {showSeatSelector && (
        <div className="modal-overlay">
          <div className="modal-content modal-large">
            <BusSeatSelector
              rutaId={selectedRuta}
              fecha={selectedFecha}
              onClose={() => {
                setShowSeatSelector(false);
                setShowQuickReserve(false);
              }}
              onReservationComplete={() => {
                setShowSeatSelector(false);
                setShowQuickReserve(false);
                alert('¡Reserva completada exitosamente!');
              }}
            />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            {HERO_CONTENT.title}
            <span className="hero-subtitle">{HERO_CONTENT.subtitle}</span>
          </h1>
          <p className="hero-description">
            {HERO_CONTENT.description}
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleGetStarted}>
              {token ? 'Ir al Dashboard' : 'Iniciar Sesión'}
            </button>
            <button className="btn-secondary" onClick={() => navigate('/boletos')}>
              Ver Boletos
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="bus-illustration">
            🚌
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">¿Por qué elegirnos?</h2>
          <div className="features-grid">
            {FEATURES.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="routes-section">
        <div className="container">
          <h2 className="section-title">Rutas Populares</h2>
          <div className="routes-grid">
            {RUTAS_POPULARES.map((ruta, index) => (
              <div key={index} className="route-card">
                <div className="route-info">
                  <h4>{ruta.origen} ➜ {ruta.destino}</h4>
                  <p>Desde <span className="price">{ruta.precio}</span></p>
                  <span className="duration">{ruta.duracion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{CTA_CONTENT.title}</h2>
            <p>{CTA_CONTENT.description}</p>
            <button className="btn-primary" onClick={handleGetStarted}>
              {token ? 'Ver mis Reservas' : 'Registrarse Gratis'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

