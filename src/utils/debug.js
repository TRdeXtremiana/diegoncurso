// Utilidad para depuración

// Objeto global para almacenar información de depuración
import debugConfig from '../config/debugConfig';

const AppDebug = {
  errors: [],
  warnings: [],
  info: [],
  config: {
    logToConsole: debugConfig.errorHandling.logErrorsToConsole,
    logToUI: false,
    maxLogEntries: debugConfig.debugPanel.maxErrors,
    detailedErrors: true
  }
};

// Función para registrar errores en la consola con más detalles
export const logError = (error, context = '') => {
  // Si la depuración no está habilitada y no es un entorno de producción, no hacer nada
  if (!debugConfig.enabled && process.env.NODE_ENV !== 'production') {
    return error;
  }
  
  const timestamp = new Date().toISOString();
  
  // Crear un objeto de error enriquecido
  const enrichedError = {
    timestamp,
    message: error.message || 'Error desconocido',
    context,
    stack: error.stack,
    originalError: error,
    // Información del navegador
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
    // Información de la red si está disponible
    networkInfo: typeof navigator !== 'undefined' && navigator.connection ? {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt
    } : 'N/A'
  };
  
  // Añadir al registro de errores
  AppDebug.errors.unshift(enrichedError);
  
  // Mantener el tamaño del registro bajo control
  if (AppDebug.errors.length > AppDebug.config.maxLogEntries) {
    AppDebug.errors.pop();
  }
  
  if (AppDebug.config.logToConsole) {
    console.error(`[ERROR][${timestamp}]${context ? ` [${context}]` : ''}: `, error);
    
    // Si el error tiene una pila de llamadas, la mostramos
    if (error && error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
  
  // Enviar el error al servidor si está habilitado
  if (debugConfig.errorHandling.logErrorsToServer && process.env.NODE_ENV === 'production') {
    try {
      fetch(debugConfig.errorHandling.serverLogEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrichedError)
      }).catch(() => {}); // Ignorar errores al enviar logs
    } catch (e) {
      // Ignorar errores al enviar logs
    }
  }
  
  return error; // Devolvemos el error para poder encadenar llamadas
};

// Función para envolver funciones asíncronas y capturar errores
export const withErrorHandling = (asyncFn, context = '') => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      return logError(error, context);
    }
  };
};

// Función para mostrar información de depuración en la interfaz
export const createDebugElement = (message, type = 'info') => {
  // Solo en desarrollo
  if (process.env.NODE_ENV !== 'development') return null;
  
  const debugElement = document.createElement('div');
  debugElement.style.position = 'fixed';
  debugElement.style.bottom = '10px';
  debugElement.style.right = '10px';
  debugElement.style.padding = '10px';
  debugElement.style.backgroundColor = type === 'error' ? '#ffcccc' : '#ccffcc';
  debugElement.style.border = `1px solid ${type === 'error' ? '#ff0000' : '#00ff00'}`;
  debugElement.style.borderRadius = '5px';
  debugElement.style.zIndex = '9999';
  debugElement.textContent = message;
  
  document.body.appendChild(debugElement);
  
  // Eliminar después de 5 segundos
  setTimeout(() => {
    document.body.removeChild(debugElement);
  }, 5000);
  
  return debugElement;
};

// Función para registrar información de rendimiento
export const measurePerformance = (label, fn) => {
  // Si la medición de rendimiento no está habilitada, ejecutar la función sin medir
  if (!debugConfig.performance.measureApiCalls) {
    return fn();
  }
  
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  const duration = end - start;
  
  // Registrar solo si supera el umbral de lentitud o estamos en desarrollo
  if (duration > debugConfig.performance.slowThreshold || debugConfig.enabled) {
    console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
    
    // Almacenar la información de rendimiento
    AppDebug.info.push({
      type: 'performance',
      name: label,
      duration,
      timestamp: new Date().toISOString(),
      slow: duration > debugConfig.performance.slowThreshold
    });
    
    // Limitar el tamaño del array de info
    if (AppDebug.info.length > AppDebug.config.maxLogEntries) {
      AppDebug.info.shift();
    }
  }
  
  return result;
};

// Función para capturar errores de red
export const captureNetworkError = (response) => {
  if (!response.ok) {
    const error = new Error(`Error de red: ${response.status} ${response.statusText}`);
    error.response = response;
    logError(error, 'Network');
    throw error;
  }
  return response;
};

// Exportar un objeto de depuración global para usar en la consola del navegador
if (typeof window !== 'undefined' && debugConfig.enabled) {
  window.AppDebug = {
    ...AppDebug,
    logError,
    showDebugMessage: createDebugElement,
    measurePerformance,
    captureNetworkError,
    // Método para mostrar todos los errores registrados
    showAllErrors: () => {
      console.table(AppDebug.errors.map(e => ({
        timestamp: e.timestamp,
        context: e.context,
        message: e.message
      })));
      return AppDebug.errors;
    },
    // Método para limpiar todos los errores
    clearErrors: () => {
      AppDebug.errors = [];
      console.log('Registro de errores limpiado');
    },
    showConfig: () => console.table(debugConfig),
    showPerformance: () => console.table(AppDebug.info.filter(i => i.type === 'performance')),
    showSlowOperations: () => console.table(AppDebug.info.filter(i => i.type === 'performance' && i.slow))
  };
}

// Exportar el objeto de depuración
export default AppDebug;