import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/common/Notification';

// Crear el contexto
const NotificationContext = createContext();

/**
 * Proveedor de notificaciones para la aplicación
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 */
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  /**
   * Añadir una nueva notificación
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo de notificación ('success', 'info', 'warning')
   * @param {number} duration - Duración en milisegundos (0 para no desaparecer automáticamente)
   */
  const addNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  /**
   * Eliminar una notificación por su ID
   * @param {string} id - ID de la notificación a eliminar
   */
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  /**
   * Mostrar una notificación de éxito
   * @param {string} message - Mensaje a mostrar
   * @param {number} duration - Duración en milisegundos
   */
  const showSuccess = useCallback((message, duration = 3000) => {
    return addNotification(message, 'success', duration);
  }, [addNotification]);

  /**
   * Mostrar una notificación de información
   * @param {string} message - Mensaje a mostrar
   * @param {number} duration - Duración en milisegundos
   */
  const showInfo = useCallback((message, duration = 3000) => {
    return addNotification(message, 'info', duration);
  }, [addNotification]);

  /**
   * Mostrar una notificación de advertencia
   * @param {string} message - Mensaje a mostrar
   * @param {number} duration - Duración en milisegundos
   */
  const showWarning = useCallback((message, duration = 3000) => {
    return addNotification(message, 'warning', duration);
  }, [addNotification]);

  /**
   * Eliminar todas las notificaciones
   */
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Valor del contexto
  const value = {
    addNotification,
    removeNotification,
    showSuccess,
    showInfo,
    showWarning,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Renderizar las notificaciones */}
      <div className="notifications-container">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
            show={true}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

/**
 * Hook para usar el contexto de notificaciones
 * @returns {Object} - Métodos para gestionar notificaciones
 */
export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe usarse dentro de un NotificationProvider');
  }
  return context;
}