import React, { useState, useEffect } from 'react';
import './Notification.css';

/**
 * Componente para mostrar notificaciones temporales
 * @param {Object} props - Propiedades del componente
 * @param {string} props.message - Mensaje a mostrar
 * @param {string} props.type - Tipo de notificación ('success', 'info', 'warning')
 * @param {number} props.duration - Duración en milisegundos (0 para no desaparecer automáticamente)
 * @param {Function} props.onClose - Función a ejecutar al cerrar la notificación
 * @param {boolean} props.show - Si se debe mostrar la notificación
 */
function Notification({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose, 
  show = true 
}) {
  const [visible, setVisible] = useState(show);
  const [exiting, setExiting] = useState(false);
  
  useEffect(() => {
    setVisible(show);
    if (show) {
      setExiting(false);
    }
  }, [show]);
  
  useEffect(() => {
    let timer;
    if (visible && duration > 0) {
      timer = setTimeout(() => {
        handleClose();
      }, duration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, duration]);
  
  const handleClose = () => {
    setExiting(true);
    // Esperar a que termine la animación de salida
    setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 300); // Debe coincidir con la duración de la animación CSS
  };
  
  if (!visible && !exiting) return null;
  
  const notificationClasses = [
    'notification',
    `notification-${type}`,
    exiting ? 'notification-exit' : 'notification-enter'
  ].filter(Boolean).join(' ');
  
  return (
    <div className={notificationClasses}>
      <div className="notification-icon">
        {type === 'success' && '✅'}
        {type === 'info' && 'ℹ️'}
        {type === 'warning' && '⚠️'}
      </div>
      <div className="notification-content">
        <p>{message}</p>
      </div>
      <button className="notification-close" onClick={handleClose}>
        ×
      </button>
    </div>
  );
}

export default Notification;