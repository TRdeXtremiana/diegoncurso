/**
 * Configuración centralizada para depuración y manejo de errores
 */

const debugConfig = {
  // Habilitar o deshabilitar características de depuración
  enabled: process.env.NODE_ENV === 'development',
  
  // Nivel de detalle de los logs
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
  
  // Opciones para el panel de depuración
  debugPanel: {
    enabled: process.env.NODE_ENV === 'development',
    position: 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    initiallyOpen: false,
    maxErrors: 50, // Número máximo de errores a almacenar
  },
  
  // Opciones para el manejo de errores
  errorHandling: {
    captureGlobalErrors: true,
    logErrorsToConsole: true,
    logErrorsToServer: false, // Para implementación futura
    serverLogEndpoint: '/api/logs', // Para implementación futura
  },
  
  // Opciones para el manejo de red
  network: {
    retryCount: 3, // Número de reintentos para peticiones fallidas
    retryDelay: 1000, // Tiempo entre reintentos en ms
    timeout: 15000, // Tiempo máximo de espera para peticiones en ms
    checkConnectionInterval: 30000, // Intervalo para verificar la conexión en ms
  },
  
  // Opciones para medición de rendimiento
  performance: {
    measureApiCalls: true,
    measureRenders: false, // Para implementación futura
    slowThreshold: 1000, // Umbral en ms para considerar una operación lenta
  }
};

export default debugConfig;