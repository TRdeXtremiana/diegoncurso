/**
 * Utilidades para manejar peticiones de red y errores
 */

import { logError } from './debug';

/**
 * Función para verificar la conectividad a Internet
 * @returns {Promise<boolean>} - Promesa que resuelve a true si hay conexión, false en caso contrario
 */
export const checkInternetConnection = async () => {
  try {
    // Intentar hacer una petición a un servicio confiable
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://www.google.com', { 
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    logError(error, 'checkInternetConnection');
    return false;
  }
};

/**
 * Función para manejar errores de red comunes
 * @param {Error} error - El error capturado
 * @returns {string} - Mensaje de error amigable para el usuario
 */
export const getNetworkErrorMessage = (error) => {
  // Verificar si es un error de timeout
  if (error.name === 'AbortError') {
    return 'La conexión ha tardado demasiado tiempo. Por favor, verifica tu conexión a Internet.';
  }
  
  // Verificar si es un error de red
  if (error.message && error.message.includes('NetworkError')) {
    return 'No se ha podido conectar con el servidor. Por favor, verifica tu conexión a Internet.';
  }
  
  // Verificar si es un error CORS
  if (error.message && error.message.includes('CORS')) {
    return 'Error de acceso al servidor. Por favor, contacta al administrador.';
  }
  
  // Verificar si es un error de DNS
  if (error.message && error.message.includes('DNS')) {
    return 'No se ha podido encontrar el servidor. Por favor, verifica la URL o tu conexión a Internet.';
  }
  
  // Mensaje genérico para otros errores
  return 'Ha ocurrido un error de conexión. Por favor, intenta de nuevo más tarde.';
};

/**
 * Función para reintentar una petición fallida
 * @param {Function} fetchFunction - Función que realiza la petición
 * @param {number} maxRetries - Número máximo de reintentos
 * @param {number} delayMs - Tiempo de espera entre reintentos en milisegundos
 * @returns {Promise<any>} - Promesa con el resultado de la petición
 */
export const retryFetch = async (fetchFunction, maxRetries = 3, delayMs = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetchFunction();
    } catch (error) {
      lastError = error;
      logError(error, `retryFetch_attempt_${attempt + 1}`);
      
      // Esperar antes del siguiente intento
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  // Si llegamos aquí, todos los intentos han fallado
  throw lastError;
};

/**
 * Función para manejar errores HTTP según el código de estado
 * @param {Response} response - La respuesta HTTP
 * @returns {Promise<Response>} - La respuesta si es exitosa, o lanza un error
 */
export const handleHttpResponse = async (response) => {
  if (!response.ok) {
    let errorMessage;
    
    // Intentar obtener el mensaje de error del cuerpo de la respuesta
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || `Error ${response.status}: ${response.statusText}`;
    } catch (e) {
      // Si no se puede parsear el cuerpo, usar el statusText
      errorMessage = `Error ${response.status}: ${response.statusText}`;
    }
    
    const error = new Error(errorMessage);
    error.status = response.status;
    error.statusText = response.statusText;
    error.response = response;
    
    logError(error, 'handleHttpResponse');
    throw error;
  }
  
  return response;
};