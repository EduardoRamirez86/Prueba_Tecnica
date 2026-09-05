# Frontend — Portal de Gestion de Consultoria TI

Single Page Application desarrollada en React 18 con Vite como bundler y Tailwind CSS para el sistema de estilos. Consume la Web API REST del backend (.NET 8) mediante Axios y gestiona el estado de sesion a traves de React Context.

---

## Contenido

1. [Descripcion del Modulo Frontend](#1-descripcion-del-modulo-frontend)
2. [Prerrequisitos](#2-prerrequisitos)
3. [Configuracion de Entorno](#3-configuracion-de-entorno)
4. [Instalacion, Ejecucion y Scripts](#4-instalacion-ejecucion-y-scripts)
5. [Arquitectura del Proyecto y Estructura de Carpetas](#5-arquitectura-del-proyecto-y-estructura-de-carpetas)
6. [Decisiones de Diseno y Patrones Frontend](#6-decisiones-de-diseno-y-patrones-frontend)

---

## 1. Descripcion del Modulo Frontend

La SPA ofrece las siguientes vistas funcionales:

- **Consultores:** Listado paginado con operaciones de alta, edicion y desactivacion logica. Solo disponibles para el rol Admin.
- **Paquetes de Servicios:** Catalogo con filtrado y gestion de estado (activo/inactivo) a nivel de registro.
- **Reportes Analiticos:**
  - *Paquetes por Area:* Agrupacion con conteo, precio promedio y valoracion economica total.
  - *Consultores Top Facturacion:* Ranking de facturacion estimada mensual calculada en base de datos.
- **Autenticacion:** Formulario de login con almacenamiento del JWT en memoria (React Context) y proteccion de rutas por rol.

### Stack Tecnologico

| Tecnologia | Version | Proposito |
| :--- | :--- | :--- |
| React | 18.x | Libreria de UI basada en componentes |
| Vite | 6.x | Bundler y servidor de desarrollo con HMR |
| Tailwind CSS | 3.x | Utilitarios de estilos atomicos |
| React Router DOM | 6.x | Enrutamiento del lado del cliente (SPA) |
| Axios | 1.x | Cliente HTTP con soporte a interceptores |
| Lucide React | Latest | Libreria de iconos SVG optimizados |

---

## 2. Prerrequisitos

- Node.js: 18.x LTS o superior
- npm: 9.x o superior (incluido en Node.js)
- Backend (.NET 8 Web API) levantado y accesible en http://localhost:5271 antes de iniciar el frontend.

---

## 3. Configuracion de Entorno

El cliente web consume por defecto `http://localhost:5271/api/v1` gracias al fallback configurado en `axiosClient.js`. No es necesario crear un archivo de entorno para ejecutar la aplicacion con la configuracion predeterminada.

Si su backend corre en un puerto distinto al predeterminado, copie el archivo plantilla y ajuste la variable:

```bash
cp .env.example .env.local
```

Contenido de `.env.example` (rastreado por Git como plantilla):

```
VITE_API_URL=http://localhost:5271/api/v1
```

El archivo `.env.local` esta excluido del control de versiones mediante `.gitignore` para evitar la exposicion de configuraciones de entorno. El archivo `.env.example` esta rastreado por Git y sirve como referencia para otros desarrolladores o evaluadores.

**Nota sobre CORS:** El backend tiene configurada una politica de CORS que permite solicitudes originadas en `http://localhost:5173`, origen predeterminado del servidor de desarrollo de Vite. No se requiere ajuste adicional en el backend para entornos locales estandar.

---

## 4. Instalacion, Ejecucion y Scripts

Todos los comandos se ejecutan desde el directorio `Frontend/`:

```bash
# Instalar dependencias declaradas en package.json
npm install

# Iniciar el servidor de desarrollo con Hot Module Replacement
npm run dev

# Compilar la aplicacion para produccion (salida en dist/)
npm run build

# Previsualizar el build de produccion localmente
npm run preview
```

La aplicacion estara disponible en: http://localhost:5173

---

## 5. Arquitectura del Proyecto y Estructura de Carpetas

```
Frontend/src/
|
+-- api/
|   +-- axiosClient.js        # Instancia de Axios con baseURL, interceptor de token y manejo de errores 401/403.
|   +-- authService.js        # Peticion de login (POST /auth/login) y decodificacion de JWT.
|   +-- consultorService.js   # CRUD completo para el recurso /consultores.
|   +-- paqueteService.js     # CRUD completo para el recurso /paquetes.
|   +-- reporteService.js     # Endpoints de reportes paginados con filtros dinamicos.
|
+-- components/
|   +-- layout/
|   |   +-- AppLayout.jsx     # Contenedor principal: Sidebar + Navbar + area de contenido.
|   |   +-- Sidebar.jsx       # Navegacion lateral con drawer para pantallas moviles (< md).
|   |   +-- Navbar.jsx        # Barra superior con boton de hamburguesa y datos del usuario activo.
|   +-- ui/
|       +-- ...               # Componentes genericos reutilizables (alertas, spinners, badges).
|
+-- context/
|   +-- AuthContext.jsx       # Estado global de sesion: token JWT, datos del usuario y funcion de logout.
|                             # El token se almacena en memoria (no en localStorage) durante la sesion.
|
+-- pages/
|   +-- Login.jsx             # Formulario de autenticacion. Redirige segun rol tras login exitoso.
|   +-- Consultores.jsx       # Vista con tabla paginada, filtros y modales de alta/edicion.
|   +-- Paquetes.jsx          # Vista con tabla paginada, filtros y modales de alta/edicion.
|   +-- Reportes.jsx          # Dashboard con dos tabs: Paquetes por Area y Consultores Top Facturacion.
|
+-- routes/
|   +-- AppRouter.jsx         # Definicion central de rutas de la SPA.
|   +-- ProtectedRoute.jsx    # Componente guardiana: valida token activo y rol autorizado antes de renderizar.
|
+-- utils/
    +-- ...                   # Utilidades de formato (moneda, fechas) compartidas entre vistas.
```

---

## 6. Decisiones de Diseno y Patrones Frontend

### 6.1 Interceptores de Axios

`axiosClient.js` configura una instancia centralizada de Axios con dos interceptores:

- **Request Interceptor:** Antes de cada peticion, lee el token del `AuthContext` y añade el encabezado `Authorization: Bearer <token>`. De esta forma, ningun servicio necesita gestionar la autenticacion de forma individual.

- **Response Interceptor:** Ante una respuesta con codigo HTTP `401 Unauthorized`, ejecuta `window.location.href = '/login'` para redirigir al usuario y limpiar el estado de sesion. Los errores de la API siguen el estandar RFC 7807 (ProblemDetails), por lo que el interceptor lee `error.response.data.detail` para construir mensajes de feedback precisos en la UI.

### 6.2 Control de Acceso Basado en Roles (RBAC)

El JWT emitido por el backend incluye un claim `rol` con el valor `Admin` o `User`. Tras el login, `AuthContext` decodifica el payload del token y expone el rol activo a todos los componentes.

El control se aplica en dos niveles:

1. **Nivel de Ruta:** `ProtectedRoute.jsx` intercepta la navegacion y redirige a `/login` si el token no existe o ha expirado, o a una pagina de acceso denegado si el rol es insuficiente para la ruta solicitada.

2. **Nivel de Componente:** Los botones de creacion, edicion y eliminacion logica son condicionalmente visibles o habilitados segun el rol del usuario autenticado. Un usuario con rol `User` puede consultar todos los modulos, pero no vera los controles de mutacion.

### 6.3 Paginacion Delegada al Servidor

Las tablas de Consultores, Paquetes y Reportes no realizan paginacion en memoria del lado del cliente. Cada cambio de pagina o tamaño de pagina emite una nueva peticion HTTP con los parametros `page` y `pageSize`, que el backend mapea directamente a los argumentos `@Page` y `@PageSize` de los Stored Procedures. Estos a su vez ejecutan la clausula `OFFSET / FETCH NEXT` de SQL Server, garantizando que unicamente los registros del rango solicitado son transferidos a traves de la red.

Este enfoque escala correctamente cuando el volumen de registros crece, ya que el trafico HTTP y el consumo de memoria del cliente permanecen constantes independientemente del tamaño total del dataset.
