import React, { useState, useEffect } from 'react';
import { checkInternetConnection } from '../../utils/networkUtils';
import './NetworkErrorHandler.css';

/**
 * Componente para manejar y mostrar errores de red
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @param {Function} props.onRetry - Función a ejecutar al reintentar
 * @param {boolean} props.checkOnMount - Si se debe verificar la conexión al montar el componente
 * @param {number} props.checkInterval - Intervalo en milisegundos para verificar la conexión
 */
function NetworkErrorHandler({ 
  children, 
  onRetry, 
  checkOnMount = true,
  checkInterval = 30000 // 30 segundos por defecto
}) {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  
  // Función para verificar la conexión
  const checkConnection = async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    const online = await checkInternetConnection();
    setIsOnline(online);
    setIsChecking(false);
  };
  
  // Verificar conexión al montar el componente
  useEffect(() => {
    if (checkOnMount) {
      checkConnection();
    }
  }, [checkOnMount]);
  
  // Verificar conexión periódicamente
  useEffect(() => {
    if (checkInterval > 0) {
      const intervalId = setInterval(checkConnection, checkInterval);
      return () => clearInterval(intervalId);
    }
  }, [checkInterval]);
  
  // Escuchar eventos de conexión del navegador
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Manejar el reintento
  const handleRetry = async () => {
    await checkConnection();
    if (isOnline && onRetry) {
      onRetry();
    }
  };
  
  return (
    <div className="network-error-handler">
      {!isOnline && (
        <div className="network-error">
          <div className="network-error-icon">📶</div>
          <div className="network-error-content">
            <h3>Problema de conexión</h3>
            <p>Parece que no tienes conexión a Internet. Verifica tu conexión e intenta de nuevo.</p>
            <button 
              className="network-error-retry" 
              onClick={handleRetry}
              disabled={isChecking}
            >
              {isChecking ? 'Verificando...' : 'Reintentar'}
            </button>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

export default NetworkErrorHandler;