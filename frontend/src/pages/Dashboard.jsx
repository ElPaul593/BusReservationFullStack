import React from 'react';

export default function Dashboard() {
  const token = localStorage.getItem('token');

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      <p>Bienvenido. Token almacenado: {token ? 'sí' : 'no'}</p>
      <p>Esta es una página placeholder para la aplicación BusReservation.</p>
    </div>
  );
}
