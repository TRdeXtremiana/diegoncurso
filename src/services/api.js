import { logError } from '../utils/debug';

// Servicio para manejar las peticiones AJAX a la API

// URL base de la API
const API_URL = 'https://qans224.diegoncurso.es/api';

// Función genérica para realizar peticiones fetch
const fetchData = async (endpoint, options = {}) => {
  try {
    // Importar utilidades de red
    const { handleHttpResponse, retryFetch, getNetworkErrorMessage } = await import('../utils/networkUtils');
    
    // Usar la función de reintento para manejar fallos temporales de red
    const fetchWithRetry = () => fetch(`${API_URL}/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }).then(handleHttpResponse);
    
    // Intentar la petición con reintentos
    const response = await retryFetch(fetchWithRetry, 2, 1000);
    
    // Intentar parsear la respuesta como JSON
    const data = await response.json();
    return data;
  } catch (error) {
    // Mejorar el mensaje de error con información adicional
    const enhancedError = new Error(`Error en la petición API a ${endpoint}: ${error.message}`);
    enhancedError.originalError = error;
    enhancedError.endpoint = endpoint;
    enhancedError.options = options;
    
    // Intentar obtener un mensaje de error más amigable
    try {
      const { getNetworkErrorMessage } = await import('../utils/networkUtils');
      enhancedError.userMessage = getNetworkErrorMessage(error);
    } catch (e) {
      // Si falla, usar el mensaje original
      enhancedError.userMessage = error.message;
    }
    
    // Usar la utilidad de registro de errores
    logError(enhancedError, 'API_fetchData');
    
    throw enhancedError;
  }
};

// Servicio de preguntas
export const preguntasService = {
  // Obtener todas las preguntas
  getAll: async () => await fetchData('preguntas.php'),

  // Obtener una pregunta por su ID
  getById: async (id) => await fetchData(`preguntas.php?id=${id}`),

  // Crear una nueva pregunta
  create: async (pregunta) => await fetchData('preguntas.php', {
    method: 'POST',
    body: JSON.stringify(pregunta)
  }),

  // Actualizar una pregunta existente
  update: async (id, pregunta) => await fetchData('preguntas.php', {
    method: 'PUT',
    body: JSON.stringify({ id, ...pregunta })
  }),

  // Eliminar una pregunta
  delete: async (id) => await fetchData('preguntas.php', {
    method: 'DELETE',
    body: JSON.stringify({ id })
  }),

  // Aprobar una pregunta
  aprobar: async (id) => await fetchData('preguntas.php', {
    method: 'PUT',
    body: JSON.stringify({ id, estado: 'aprobado' })
  }),

  // Rechazar una pregunta
  rechazar: async (id) => await fetchData('preguntas.php', {
    method: 'PUT',
    body: JSON.stringify({ id, estado: 'rechazado' })
  })
};

// Servicio de autenticación
export const authService = {
  // Iniciar sesión
  login: async (email, password) => {
    try {
      // Llama a la API real
      const res = await fetchData('auth.php', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res.success) return res;
      throw new Error(res.message || 'Error de autenticación');
    } catch (error) {
      logError(error, 'AUTH_login');
      throw error;
    }
  },

  // Registrar un nuevo usuario
  register: async (userData) => {
    try {
      const res = await fetchData('register.php', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      if (res.success) return res;
      throw new Error(res.message || 'Error en el registro');
    } catch (error) {
      logError(error, 'AUTH_register');
      throw error;
    }
  },

  // Verificar estado de la sesión
  checkSession: async () => {
    try {
      const res = await fetchData('session.php');
      return res.user || null;
    } catch (error) {
      logError(error, 'AUTH_checkSession');
      return null;
    }
  },

  // Cerrar sesión
  logout: async () => {
    try {
      const res = await fetchData('logout.php', { method: 'POST' });
      return res;
    } catch (error) {
      logError(error, 'AUTH_logout');
      throw error;
    }
  }
};

// Servicio de usuarios
export const usuariosService = {
  // Obtener todos los usuarios
  getAll: async () => {
    try {
      return await fetchData('usuarios.php');
    } catch (error) {
      logError(error, 'USUARIOS_getAll');
      throw error;
    }
  },

  // Obtener usuarios pendientes de aprobación
  getPendientes: async () => {
    try {
      return await fetchData('usuarios.php?pendientes=1');
    } catch (error) {
      logError(error, 'USUARIOS_getPendientes');
      throw error;
    }
  },

  // Aprobar un usuario
  aprobar: async (id) => {
    try {
      return await fetchData('usuarios.php', {
        method: 'PUT',
        body: JSON.stringify({ id, aprobado: true })
      });
    } catch (error) {
      logError(error, 'USUARIOS_aprobar');
      throw error;
    }
  },

  // Rechazar un usuario
  rechazar: async (id) => {
    try {
      return await fetchData('usuarios.php', {
        method: 'DELETE',
        body: JSON.stringify({ id })
      });
    } catch (error) {
      logError(error, 'USUARIOS_rechazar');
      throw error;
    }
  },

  // Actualizar perfil de usuario
  updateProfile: async (id, userData) => {
    try {
      return await fetchData('usuarios.php', {
        method: 'PUT',
        body: JSON.stringify({ id, ...userData })
      });
    } catch (error) {
      logError(error, 'USUARIOS_updateProfile');
      throw error;
    }
  }
};

// Servicio de categorías
export const categoriasService = {
  // Obtener todas las categorías
  getAll: async () => {
    try {
      return await fetchData('categorias.php');
    } catch (error) {
      logError(error, 'CATEGORIAS_getAll');
      throw error;
    }
  },

  // Obtener todas las categorías con sus etiquetas
  getAllWithTags: async () => {
    try {
      return await fetchData('categorias.php?conEtiquetas=1');
    } catch (error) {
      logError(error, 'CATEGORIAS_getAllWithTags');
      throw error;
    }
  },

  // Obtener etiquetas de una categoría específica
  getTagsByCategory: async (categoria) => {
    try {
      return await fetchData(`categorias.php?categoria=${encodeURIComponent(categoria)}`);
    } catch (error) {
      logError(error, 'CATEGORIAS_getTagsByCategory');
      throw error;
    }
  }
};

// Servicio de estadísticas
export const estadisticasService = {
  // Obtener estadísticas generales
  getGeneral: async () => await fetchData('estadisticas.php'),

  // Obtener estadísticas por categoría
  getPorCategoria: async () => {
    try {
      return await fetchData('estadisticas.php?porCategoria=1');
    } catch (error) {
      logError(error, 'ESTADISTICAS_getPorCategoria');
      throw error;
    }
  },

  // Obtener estadísticas de un usuario específico
  getPorUsuario: async (userId) => {
    try {
      return await fetchData(`estadisticas.php?usuario=${userId}`);
    } catch (error) {
      logError(error, 'ESTADISTICAS_getPorUsuario');
      throw error;
    }
  }
};

// Servicio de notificaciones
export const notificacionesService = {
  // Obtener notificaciones de un usuario
  getByUser: async (userId) => {
    try {
      return await fetchData(`notificaciones.php?usuario=${userId}`);
    } catch (error) {
      logError(error, 'NOTIFICACIONES_getByUser');
      throw error;
    }
  },

  // Marcar notificación como leída
  marcarLeida: async (notificacionId, userId) => {
    try {
      return await fetchData('notificaciones.php', {
        method: 'PUT',
        body: JSON.stringify({ id: notificacionId, usuario: userId, leida: true })
      });
    } catch (error) {
      logError(error, 'NOTIFICACIONES_marcarLeida');
      throw error;
    }
  },

  // Marcar todas las notificaciones como leídas
  marcarTodasLeidas: async (userId) => {
    try {
      return await fetchData('notificaciones.php', {
        method: 'PUT',
        body: JSON.stringify({ usuario: userId, todasLeidas: true })
      });
    } catch (error) {
      logError(error, 'NOTIFICACIONES_marcarTodasLeidas');
      throw error;
    }
  },

  // Eliminar una notificación
  eliminar: async (notificacionId, userId) => {
    try {
      return await fetchData('notificaciones.php', {
        method: 'DELETE',
        body: JSON.stringify({ id: notificacionId, usuario: userId })
      });
    } catch (error) {
      logError(error, 'NOTIFICACIONES_eliminar');
      throw error;
    }
  }
};

// Servicio de configuración
export const configService = {
  // Obtener configuración general de la aplicación
  getAppConfig: async () => {
    try {
      return await fetchData('config.php');
    } catch (error) {
      logError(error, 'CONFIG_getAppConfig');
      throw error;
    }
  },

  // Obtener configuración de un usuario específico
  getUserConfig: async (userId) => {
    try {
      return await fetchData(`config.php?usuario=${userId}`);
    } catch (error) {
      logError(error, 'CONFIG_getUserConfig');
      throw error;
    }
  },

  // Actualizar configuración de un usuario
  updateUserConfig: async (userId, configData) => {
    try {
      return await fetchData('config.php', {
        method: 'PUT',
        body: JSON.stringify({ usuario: userId, ...configData })
      });
    } catch (error) {
      logError(error, 'CONFIG_updateUserConfig');
      throw error;
    }
  }
};

// Servicio de búsqueda
export const searchService = {
  // Buscar preguntas por texto
  searchPreguntas: async (query, options = {}) => {
    try {
      if (!query || query.trim() === '') return [];
      return await fetchData('search.php', {
        method: 'POST',
        body: JSON.stringify({ tipo: 'preguntas', query, ...options })
      });
    } catch (error) {
      logError(error, 'SEARCH_searchPreguntas');
      throw error;
    }
  },

  // Buscar usuarios por nombre o email
  searchUsuarios: async (query, options = {}) => {
    try {
      if (!query || query.trim() === '') return [];
      return await fetchData('search.php', {
        method: 'POST',
        body: JSON.stringify({ tipo: 'usuarios', query, ...options })
      });
    } catch (error) {
      logError(error, 'SEARCH_searchUsuarios');
      throw error;
    }
  },

  // Búsqueda global (preguntas y usuarios)
  searchGlobal: async (query, options = {}) => {
    try {
      if (!query || query.trim() === '') return { preguntas: [], usuarios: [] };
      return await fetchData('search.php', {
        method: 'POST',
        body: JSON.stringify({ tipo: 'global', query, ...options })
      });
    } catch (error) {
      logError(error, 'SEARCH_searchGlobal');
      throw error;
    }
  }
};

// Exportar todos los servicios
const apiServices = {
  preguntas: preguntasService,
  auth: authService,
  usuarios: usuariosService,
  categorias: categoriasService,
  estadisticas: estadisticasService,
  notificaciones: notificacionesService,
  config: configService,
  search: searchService
};

export default apiServices;