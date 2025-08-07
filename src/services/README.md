# API Services Documentation

## Overview

This directory contains the API services for the QAns224 application. These services handle communication with the backend API and provide a clean interface for the frontend components to interact with the data.

## Services

### 1. Questions Service (`preguntasService`)

Handles all operations related to questions in the application.

```javascript
// Examples
api.preguntas.getAll();
api.preguntas.getById(id);
api.preguntas.create(pregunta);
api.preguntas.update(id, pregunta);
api.preguntas.delete(id);
api.preguntas.aprobar(id);
api.preguntas.rechazar(id);
```

### 2. Authentication Service (`authService`)

Handles user authentication operations.

```javascript
// Examples
api.auth.login(email, password);
api.auth.register(userData);
api.auth.checkSession();
api.auth.logout();
```

### 3. Users Service (`usuariosService`)

Handles user management operations.

```javascript
// Examples
api.usuarios.getAll();
api.usuarios.getPendientes();
api.usuarios.aprobar(id);
api.usuarios.rechazar(id);
api.usuarios.updateProfile(id, userData);
```

### 4. Categories Service (`categoriasService`)

Handles operations related to categories and tags.

```javascript
// Examples
api.categorias.getAll();
api.categorias.getAllWithTags();
api.categorias.getTagsByCategory(categoria);
```

### 5. Statistics Service (`estadisticasService`)

Provides statistical data for the application.

```javascript
// Examples
api.estadisticas.getGeneral();
api.estadisticas.getPorCategoria();
api.estadisticas.getPorUsuario(userId);
```

### 6. Notifications Service (`notificacionesService`)

Handles user notifications.

```javascript
// Examples
api.notificaciones.getByUser(userId);
api.notificaciones.marcarLeida(notificacionId, userId);
api.notificaciones.marcarTodasLeidas(userId);
api.notificaciones.eliminar(notificacionId, userId);
```

### 7. Configuration Service (`configService`)

Manages application and user configuration settings.

```javascript
// Examples
api.config.getAppConfig();
api.config.getUserConfig(userId);
api.config.updateUserConfig(userId, configData);
```

### 8. Search Service (`searchService`)

Provides search functionality across the application.

```javascript
// Examples
api.search.searchPreguntas(query, options);
api.search.searchUsuarios(query, options);
api.search.searchGlobal(query, options);
```

## Error Handling

All services use a consistent error handling approach:

1. Errors are enhanced with additional context (endpoint, options, etc.)
2. User-friendly error messages are generated when possible
3. Errors are logged using the `logError` utility
4. All errors are properly propagated to the caller

## Network Utilities

The API services use several network utilities:

- `handleHttpResponse`: Processes HTTP responses and throws errors for non-2xx status codes
- `retryFetch`: Automatically retries failed requests
- `getNetworkErrorMessage`: Generates user-friendly error messages

## Usage Example

```javascript
import api from '../services/api';

async function fetchAndDisplayQuestions() {
  try {
    const questions = await api.preguntas.getAll();
    // Process and display questions
  } catch (error) {
    console.error('Error fetching questions:', error.userMessage || error.message);
    // Display error to user
  }
}
```

See the `examples/apiServicesExample.js` file for more comprehensive usage examples.