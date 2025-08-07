// Ejemplo de uso de los servicios de API

// Importar los servicios
import api from '../services/api';

// Función asíncrona para demostrar el uso de los servicios
async function demoApiServices() {
  try {
    console.log('Iniciando demostración de servicios API...');
    
    // 1. Servicio de categorías
    console.log('\n--- Servicio de Categorías ---');
    const categorias = await api.categorias.getAll();
    console.log('Categorías disponibles:', categorias);
    
    if (categorias.length > 0) {
      const primeraCategoria = categorias[0];
      const etiquetas = await api.categorias.getTagsByCategory(primeraCategoria);
      console.log(`Etiquetas para ${primeraCategoria}:`, etiquetas);
    }
    
    const todasCategoriasConEtiquetas = await api.categorias.getAllWithTags();
    console.log('Todas las categorías con etiquetas:', todasCategoriasConEtiquetas);
    
    // 2. Servicio de estadísticas
    console.log('\n--- Servicio de Estadísticas ---');
    const estadisticasGenerales = await api.estadisticas.getGeneral();
    console.log('Estadísticas generales:', estadisticasGenerales);
    
    const estadisticasPorCategoria = await api.estadisticas.getPorCategoria();
    console.log('Estadísticas por categoría:', estadisticasPorCategoria);
    
    // Estadísticas de un usuario (usando ID 1 como ejemplo)
    const userId = 1;
    const estadisticasUsuario = await api.estadisticas.getPorUsuario(userId);
    console.log(`Estadísticas del usuario ${userId}:`, estadisticasUsuario);
    
    // 3. Servicio de notificaciones
    console.log('\n--- Servicio de Notificaciones ---');
    const notificacionesUsuario = await api.notificaciones.getByUser(userId);
    console.log(`Notificaciones del usuario ${userId}:`, notificacionesUsuario);
    
    if (notificacionesUsuario.length > 0) {
      const primeraNotificacion = notificacionesUsuario[0];
      const resultadoMarcar = await api.notificaciones.marcarLeida(primeraNotificacion.id, userId);
      console.log('Resultado de marcar notificación como leída:', resultadoMarcar);
    }
    
    const resultadoMarcarTodas = await api.notificaciones.marcarTodasLeidas(userId);
    console.log('Resultado de marcar todas las notificaciones como leídas:', resultadoMarcarTodas);
    
    // 4. Servicio de configuración
    console.log('\n--- Servicio de Configuración ---');
    const configApp = await api.config.getAppConfig();
    console.log('Configuración de la aplicación:', configApp);
    
    const configUsuario = await api.config.getUserConfig(userId);
    console.log(`Configuración del usuario ${userId}:`, configUsuario);
    
    const resultadoUpdateConfig = await api.config.updateUserConfig(userId, { tema: 'oscuro' });
    console.log('Resultado de actualizar configuración:', resultadoUpdateConfig);
    
    // 5. Servicio de búsqueda
    console.log('\n--- Servicio de Búsqueda ---');
    const resultadosBusquedaPreguntas = await api.search.searchPreguntas('ejemplo');
    console.log('Resultados de búsqueda de preguntas:', resultadosBusquedaPreguntas);
    
    const resultadosBusquedaUsuarios = await api.search.searchUsuarios('usuario');
    console.log('Resultados de búsqueda de usuarios:', resultadosBusquedaUsuarios);
    
    const resultadosBusquedaGlobal = await api.search.searchGlobal('test');
    console.log('Resultados de búsqueda global:', resultadosBusquedaGlobal);
    
    console.log('\nDemostración completada con éxito!');
  } catch (error) {
    console.error('Error en la demostración:', error);
  }
}

// Ejecutar la demostración
demoApiServices();

// Exportar la función para uso externo si es necesario
export default demoApiServices;