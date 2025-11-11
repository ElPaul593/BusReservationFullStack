import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Demo.css';

export default function Demo() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleGetStarted = () => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="demo-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Reserva tu Viaje
            <span className="hero-subtitle">Fácil, Rápido y Seguro</span>
          </h1>
          <p className="hero-description">
            La plataforma líder en reservas de buses interprovinciales. 
            Conectamos Ecuador de costa a costa con los mejores servicios de transporte.
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
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Rutas Interprovinciales</h3>
              <p>Conectamos las principales ciudades del Ecuador con rutas directas y cómodas.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💺</div>
              <h3>Reserva tu Asiento</h3>
              <p>Selecciona tu asiento favorito y viaja con la comodidad que mereces.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Boletos Digitales</h3>
              <p>Recibe tu boleto al instante y viaja sin complicaciones con tu móvil.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Pago Seguro</h3>
              <p>Transacciones protegidas para que reserves con total tranquilidad.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="routes-section">
        <div className="container">
          <h2 className="section-title">Rutas Populares</h2>
          <div className="routes-grid">
            <div className="route-card">
              <div className="route-info">
                <h4>Quito ➜ Guayaquil</h4>
                <p>Desde <span className="price">$12.50</span></p>
                <span className="duration">8 horas</span>
              </div>
            </div>
            <div className="route-card">
              <div className="route-info">
                <h4>Cuenca ➜ Quito</h4>
                <p>Desde <span className="price">$15.00</span></p>
                <span className="duration">6 horas</span>
              </div>
            </div>
            <div className="route-card">
              <div className="route-info">
                <h4>Guayaquil ➜ Cuenca</h4>
                <p>Desde <span className="price">$10.00</span></p>
                <span className="duration">4 horas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>¿Listo para tu próximo viaje?</h2>
            <p>Únete a miles de usuarios que ya confían en nosotros</p>
            <button className="btn-primary" onClick={handleGetStarted}>
              {token ? 'Ver mis Reservas' : 'Registrarse Gratis'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
