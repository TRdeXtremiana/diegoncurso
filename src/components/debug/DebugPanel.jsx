import React, { useState, useEffect } from 'react';
import AppDebug from '../../utils/debug';
import './DebugPanel.css';

/**
 * Componente para mostrar información de depuración en la interfaz de usuario
 * Solo se muestra en modo desarrollo
 */
function DebugPanel() {
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState([]);
  const [expanded, setExpanded] = useState(false);

  // Actualizar los errores cuando cambie AppDebug.errors
  useEffect(() => {
    // Solo mostrar en desarrollo
    if (process.env.NODE_ENV !== 'development') return;

    const updateErrors = () => {
      setErrors([...AppDebug.errors]);
    };

    // Actualizar inicialmente
    updateErrors();

    // Configurar un intervalo para actualizar periódicamente
    const interval = setInterval(updateErrors, 2000);

    return () => clearInterval(interval);
  }, []);

  // No renderizar nada en producción
  if (process.env.NODE_ENV !== 'development') return null;

  // No mostrar si no hay errores y no está expandido
  if (errors.length === 0 && !expanded) return null;

  return (
    <div className={`debug-panel ${visible ? 'visible' : 'hidden'}`}>
      <div className="debug-header" onClick={() => setVisible(!visible)}>
        <span className="debug-icon">{visible ? '🔽' : '🔼'}</span>
        <span className="debug-title">Debug Panel</span>
        {errors.length > 0 && <span className="debug-count">{errors.length}</span>}
      </div>

      {visible && (
        <div className="debug-content">
          <div className="debug-controls">
            <button onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Mostrar solo errores' : 'Mostrar todo'}
            </button>
            <button onClick={() => window.AppDebug.clearErrors()}>Limpiar errores</button>
          </div>

          {errors.length > 0 ? (
            <div className="debug-errors">
              <h4>Errores recientes:</h4>
              {errors.slice(0, 5).map((error, index) => (
                <div key={index} className="debug-error">
                  <div className="error-time">{new Date(error.timestamp).toLocaleTimeString()}</div>
                  <div className="error-context">{error.context}</div>
                  <div className="error-message">{error.message}</div>
                </div>
              ))}
              {errors.length > 5 && (
                <div className="debug-more">
                  + {errors.length - 5} más errores (ver en consola con AppDebug.showAllErrors())
                </div>
              )}
            </div>
          ) : (
            <div className="debug-no-errors">No hay errores registrados</div>
          )}

          {expanded && (
            <div className="debug-info">
              <h4>Información del navegador:</h4>
              <div>User Agent: {navigator.userAgent}</div>
              {navigator.connection && (
                <div>
                  Red: {navigator.connection.effectiveType}, 
                  Downlink: {navigator.connection.downlink} Mbps, 
                  RTT: {navigator.connection.rtt} ms
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DebugPanel;