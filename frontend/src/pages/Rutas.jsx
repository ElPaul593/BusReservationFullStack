import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/users';
import { PROVINCIAS_ARRAY, getProvinciaFromCedula } from '../constants/provincias';

export default function Rutas() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [provinciaUsuario, setProvinciaUsuario] = useState(null);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('');
  const [rutasRecomendadas, setRutasRecomendadas] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    (async () => {
      try {
        const me = await getCurrentUser();
        setUser(me);
        
        // Si el usuario es ecuatoriano (tiene cédula), obtener su provincia
        if (me.cedula) {
          const provincia = getProvinciaFromCedula(me.cedula);
          setProvinciaUsuario(provincia);
          setProvinciaSeleccionada(provincia || '');
        } else {
          // Si es extranjero, no hay provincia por defecto
          setProvinciaUsuario(null);
        }
      } catch (err) {
        console.error('Error al obtener usuario actual:', err.message);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    })();
  }, [token, navigate]);

  // Cargar rutas recomendadas cuando cambie la provincia seleccionada
  useEffect(() => {
    if (provinciaSeleccionada) {
      cargarRutasPorProvincia(provinciaSeleccionada);
    } else {
      setRutasRecomendadas([]);
    }
  }, [provinciaSeleccionada]);

  const cargarRutasPorProvincia = (provincia) => {
    // Rutas de ejemplo basadas en la provincia
    // En una aplicación real, esto vendría de una API
    const rutasPorProvincia = {
      'Pichincha': [
        { origen: 'Quito', destino: 'Guayaquil', precio: '$25', duracion: '8 horas', empresa: 'Flota Imbabura' },
        { origen: 'Quito', destino: 'Cuenca', precio: '$20', duracion: '9 horas', empresa: 'Cooperativa Loja' },
        { origen: 'Quito', destino: 'Ambato', precio: '$8', duracion: '2 horas', empresa: 'Transportes Baños' },
        { origen: 'Quito', destino: 'Ibarra', precio: '$6', duracion: '2.5 horas', empresa: 'Flota Imbabura' }
      ],
      'Guayas': [
        { origen: 'Guayaquil', destino: 'Quito', precio: '$25', duracion: '8 horas', empresa: 'Flota Imbabura' },
        { origen: 'Guayaquil', destino: 'Cuenca', precio: '$15', duracion: '4 horas', empresa: 'Cooperativa Loja' },
        { origen: 'Guayaquil', destino: 'Manta', precio: '$12', duracion: '3 horas', empresa: 'Reina del Camino' },
        { origen: 'Guayaquil', destino: 'Machala', precio: '$8', duracion: '2 horas', empresa: 'Transportes Ecuador' }
      ],
      'Azuay': [
        { origen: 'Cuenca', destino: 'Quito', precio: '$20', duracion: '9 horas', empresa: 'Cooperativa Loja' },
        { origen: 'Cuenca', destino: 'Guayaquil', precio: '$15', duracion: '4 horas', empresa: 'Cooperativa Loja' },
        { origen: 'Cuenca', destino: 'Loja', precio: '$10', duracion: '3 horas', empresa: 'Transportes Loja' },
        { origen: 'Cuenca', destino: 'Machala', precio: '$12', duracion: '4 horas', empresa: 'Transportes Ecuador' }
      ],
      'Manabí': [
        { origen: 'Manta', destino: 'Guayaquil', precio: '$12', duracion: '3 horas', empresa: 'Reina del Camino' },
        { origen: 'Manta', destino: 'Quito', precio: '$18', duracion: '6 horas', empresa: 'Reina del Camino' },
        { origen: 'Portoviejo', destino: 'Guayaquil', precio: '$10', duracion: '2.5 horas', empresa: 'Reina del Camino' }
      ],
      'Tungurahua': [
        { origen: 'Ambato', destino: 'Quito', precio: '$8', duracion: '2 horas', empresa: 'Transportes Baños' },
        { origen: 'Ambato', destino: 'Riobamba', precio: '$5', duracion: '1 hora', empresa: 'Transportes Baños' },
        { origen: 'Ambato', destino: 'Cuenca', precio: '$15', duracion: '6 horas', empresa: 'Cooperativa Loja' }
      ],
      'Imbabura': [
        { origen: 'Ibarra', destino: 'Quito', precio: '$6', duracion: '2.5 horas', empresa: 'Flota Imbabura' },
        { origen: 'Ibarra', destino: 'Tulcán', precio: '$4', duracion: '1.5 horas', empresa: 'Flota Imbabura' },
        { origen: 'Ibarra', destino: 'Otavalo', precio: '$2', duracion: '30 minutos', empresa: 'Transportes Otavalo' }
      ],
      'El Oro': [
        { origen: 'Machala', destino: 'Guayaquil', precio: '$8', duracion: '2 horas', empresa: 'Transportes Ecuador' },
        { origen: 'Machala', destino: 'Cuenca', precio: '$12', duracion: '4 horas', empresa: 'Transportes Ecuador' },
        { origen: 'Machala', destino: 'Loja', precio: '$10', duracion: '3 horas', empresa: 'Transportes Loja' }
      ],
      'Loja': [
        { origen: 'Loja', destino: 'Cuenca', precio: '$10', duracion: '3 horas', empresa: 'Transportes Loja' },
        { origen: 'Loja', destino: 'Guayaquil', precio: '$15', duracion: '5 horas', empresa: 'Transportes Loja' },
        { origen: 'Loja', destino: 'Machala', precio: '$10', duracion: '3 horas', empresa: 'Transportes Loja' }
      ]
    };

    // Obtener rutas para la provincia seleccionada o mostrar rutas generales
    const rutas = rutasPorProvincia[provincia] || [
      { origen: 'Quito', destino: 'Guayaquil', precio: '$25', duracion: '8 horas', empresa: 'Flota Imbabura' },
      { origen: 'Guayaquil', destino: 'Cuenca', precio: '$15', duracion: '4 horas', empresa: 'Cooperativa Loja' },
      { origen: 'Cuenca', destino: 'Loja', precio: '$10', duracion: '3 horas', empresa: 'Transportes Loja' }
    ];

    setRutasRecomendadas(rutas);
  };

  if (!token) {
    return null;
  }

  if (loading) {
    return (
      <div className="rutas-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando rutas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rutas-container">
      <div className="container">
        <div className="rutas-header">
          <h1>Rutas Recomendadas</h1>
          <p>Descubre las mejores rutas según tu provincia de origen</p>
        </div>

        {/* Mensaje de bienvenida para usuarios ecuatorianos */}
        {user?.cedula && provinciaUsuario && (
          <div className="bienvenida-provincia">
            <h2>BIENVENIDO CIUDADANO DE LA PROVINCIA DE {provinciaUsuario.toUpperCase()}</h2>
            <p>Hemos detectado que eres de {provinciaUsuario} según tu cédula. Aquí tienes rutas recomendadas para ti.</p>
          </div>
        )}

        {/* Mensaje para extranjeros */}
        {!user?.cedula && (
          <div className="bienvenida-provincia">
            <h2>BIENVENIDO</h2>
            <p>Selecciona una provincia para ver las rutas recomendadas.</p>
          </div>
        )}

        {/* Dropdown de provincias */}
        <div className="provincia-selector">
          <label htmlFor="provincia-select">Selecciona una provincia para ver rutas recomendadas:</label>
          <select
            id="provincia-select"
            className="input"
            value={provinciaSeleccionada}
            onChange={(e) => setProvinciaSeleccionada(e.target.value)}
            style={{ maxWidth: '400px', marginTop: '8px' }}
          >
            <option value="">Seleccione una provincia</option>
            {PROVINCIAS_ARRAY.map((prov) => (
              <option key={prov.codigo} value={prov.nombre}>
                {prov.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Rutas recomendadas */}
        {provinciaSeleccionada && rutasRecomendadas.length > 0 && (
          <div className="rutas-section">
            <h3>Rutas desde {provinciaSeleccionada}</h3>
            <div className="rutas-grid">
              {rutasRecomendadas.map((ruta, index) => (
                <div key={index} className="ruta-card">
                  <div className="ruta-header">
                    <div className="ruta-route">
                      <span className="ruta-origen">{ruta.origen}</span>
                      <span className="ruta-arrow">➜</span>
                      <span className="ruta-destino">{ruta.destino}</span>
                    </div>
                    <div className="ruta-precio">{ruta.precio}</div>
                  </div>
                  <div className="ruta-info">
                    <div className="ruta-item">
                      <span className="ruta-label">Duración:</span>
                      <span className="ruta-value">{ruta.duracion}</span>
                    </div>
                    <div className="ruta-item">
                      <span className="ruta-label">Empresa:</span>
                      <span className="ruta-value">{ruta.empresa}</span>
                    </div>
                  </div>
                  <button 
                    className="btn-ruta"
                    onClick={() => navigate(`/boletos?origen=${ruta.origen}&destino=${ruta.destino}`)}
                  >
                    Ver Boletos
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {provinciaSeleccionada && rutasRecomendadas.length === 0 && (
          <div className="no-rutas">
            <p>No hay rutas disponibles para {provinciaSeleccionada} en este momento.</p>
          </div>
        )}

        {!provinciaSeleccionada && (
          <div className="no-rutas">
            <p>Por favor, selecciona una provincia para ver las rutas recomendadas.</p>
          </div>
        )}
      </div>
    </div>
  );
}

