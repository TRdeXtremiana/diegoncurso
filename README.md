# Diegoncurso - Aplicación de Concurso de Preguntas

Aplicación web para gestionar concursos de preguntas y respuestas, con soporte para múltiples categorías y etiquetas.

## Características

- Gestión de preguntas y respuestas
- Filtrado por categorías y etiquetas
- Panel de administración
- Interfaz de juego interactiva
- Integración con base de datos MySQL

## Requisitos previos

- Node.js (v14 o superior)
- XAMPP (o cualquier servidor que incluya MySQL/MariaDB y PHP)

## Configuración de la base de datos

1. La aplicación está configurada para usar la base de datos `qans224` en el servidor `lldb389.servidoresdns.net`
2. La base de datos ya está configurada y lista para usar
3. Si necesitas hacer cambios locales, puedes modificar el archivo `public/api/config.php`
4. Para una instalación local, importa el archivo SQL ubicado en `public/api/db.sql`

## Instalación

1. Clona este repositorio en la carpeta `htdocs` de XAMPP
2. Abre una terminal en la carpeta del proyecto
3. Instala las dependencias:

```bash
npm install
```

## Scripts disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Estructura del proyecto

- `/public/api`: Archivos PHP para la API
- `/src/components`: Componentes React
- `/src/context`: Contextos para gestión de estado
- `/src/data`: Datos estáticos (para desarrollo)
- `/src/pages`: Páginas de la aplicación
- `/src/services`: Servicios para comunicación con la API

## Uso de la API

La API está disponible en `https://qans224.diegoncurso.es/api` y proporciona los siguientes endpoints:

- `GET https://qans224.diegoncurso.es/api/preguntas.php`: Obtiene todas las preguntas
- `GET https://qans224.diegoncurso.es/api/preguntas.php?id=X`: Obtiene una pregunta específica
- `POST https://qans224.diegoncurso.es/api/preguntas.php`: Crea una nueva pregunta
- `PUT https://qans224.diegoncurso.es/api/preguntas.php`: Actualiza una pregunta existente
- `DELETE https://qans224.diegoncurso.es/api/preguntas.php`: Elimina una pregunta

## Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
