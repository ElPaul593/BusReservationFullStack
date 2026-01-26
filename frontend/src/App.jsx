import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Demo from './pages/Demo';
import Login from './components/LoginForm';
import Register from './components/RegisterForm';
import Dashboard from './pages/Dashboard';
import Boletos from './pages/Boletos';
import Rutas from './pages/Rutas';
import Profile from './pages/Profile';
import Destino from './pages/Destino';
import Recomendados from './pages/Recomendados';
import ValidarCedula from './pages/ValidarCedula';
import SeatBooking from './pages/SeatBooking';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/demo" replace />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/boletos" element={<PrivateRoute><Boletos /></PrivateRoute>} />
        <Route path="/rutas" element={<PrivateRoute><Rutas /></PrivateRoute>} />
        <Route path="/rutas" element={<PrivateRoute><Rutas /></PrivateRoute>} />
        <Route path="/reservas" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/seat-booking" element={<PrivateRoute><SeatBooking /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/destino" element={<PrivateRoute><Destino /></PrivateRoute>} />
        <Route path="/recomendados" element={<PrivateRoute><Recomendados /></PrivateRoute>} />
        <Route path="/validar-cedula" element={<ValidarCedula />} />
      </Routes>
    </div>
  );
}
