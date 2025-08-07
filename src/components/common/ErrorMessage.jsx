import React from 'react';
import './ErrorMessage.css';

/**
 * Componente para mostrar mensajes de error de manera consistente
 * @param {Object} props - Propiedades del componente
 * @param {string} props.message - Mensaje de error a mostrar
 * @param {string} props.type - Tipo de error ('error', 'warning', 'info')
 * @param {boolean} props.retry - Si se debe mostrar un botón para reintentar
 * @param {Function} props.onRetry - Función a ejecutar al hacer clic en reintentar
 * @param {boolean} props.dismissible - Si se puede cerrar el mensaje
 * @param {Function} props.onDismiss - Función a ejecutar al cerrar el mensaje
 */
function ErrorMessage({ 
  message, 
  type = 'error', 
  retry = false, 
  onRetry, 
  dismissible = true, 
  onDismiss 
}) {
  if (!message) return null;
  
  const handleRetry = (e) => {
    e.preventDefault();
    if (onRetry) onRetry();
  };
  
  const handleDismiss = (e) => {
    e.preventDefault();
    if (onDismiss) onDismiss();
  };
  
  return (
    <div className={`error-message ${type}`}>
      <div className="error-icon">
        {type === 'error' && '❌'}
        {type === 'warning' && '⚠️'}
        {type === 'info' && 'ℹ️'}
      </div>
      <div className="error-content">
        <p>{message}</p>
        {retry && (
          <button className="error-retry" onClick={handleRetry}>
            Reintentar
          </button>
        )}
      </div>
      {dismissible && (
        <button className="error-dismiss" onClick={handleDismiss}>
          ×
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;