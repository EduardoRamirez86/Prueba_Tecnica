# Portal de Gestion de Consultoria TI

Sistema de gestion integral para una empresa de consultoria tecnologica. Administra Consultores, Catalogo de Paquetes de Servicios y genera Reportes Analiticos de Facturacion Estimada con filtrado dinamico y paginacion nativa en SQL Server.

---

## Contenido

1. [Descripcion del Proyecto y Stack Tecnologico](#1-descripcion-del-proyecto-y-stack-tecnologico)
2. [Prerrequisitos](#2-prerrequisitos)
3. [Base de Datos: Scripts y Credenciales Iniciales](#3-base-de-datos-scripts-y-credenciales-iniciales)
4. [Configuracion y Ejecucion del Backend](#4-configuracion-y-ejecucion-del-backend)
5. [Configuracion y Ejecucion del Frontend](#5-configuracion-y-ejecucion-del-frontend)
6. [Aspectos Tecnicos Destacados](#6-aspectos-tecnicos-destacados)
7. [Estructura del Repositorio](#7-estructura-del-repositorio)

---

## 1. Descripcion del Proyecto y Stack Tecnologico

### Resumen Ejecutivo

Aplicacion Full Stack basada en arquitectura Clean Architecture / N-Capas que expone una Web API RESTful y una Single Page Application (SPA) como cliente. Cubre los siguientes requerimientos de negocio:

- Gestion de Consultores: alta, edicion, desactivacion logica y consulta con validaciones estrictas de negocio (tarifa por hora entre $30.00 y $200.00, maximo 5 proyectos activos simultaneos).
- Gestion de Paquetes de Servicios: catalogo de soluciones a precio fijo agrupadas por area tecnologica.
- Reportes Analiticos paginados: Paquetes por Area (agrupacion, conteo y valorizacion economica) y Consultores Top Facturacion (ranking por facturacion estimada calculada directamente en base de datos).
- Seguridad y Control de Acceso: autenticacion stateless mediante JWT con RBAC (Admin y User). Las operaciones de mutacion (POST, PUT, DELETE) requieren rol Admin.

### Stack Tecnologico

| Capa | Tecnologia |
| :--- | :--- |
| Backend | .NET 8 Web API, Dapper, Microsoft.Data.SqlClient |
| Base de Datos | SQL Server 2019+ / LocalDB / Express |
| Seguridad | JWT Bearer, BCrypt, RBAC (Admin / User) |
| Validaciones | FluentValidation (pipeline integrado) |
| Testing | xUnit con [Theory] e [InlineData] |
| Frontend | React 18, Vite, Tailwind CSS |
| Cliente HTTP | Axios con interceptores de token y errores |

---

## 2. Prerrequisitos

- .NET SDK 8.0 o superior
- Node.js 18.x LTS o superior (incluye npm 9.x)
- SQL Server 2019+, LocalDB o SQL Server Express
- Git 2.x

Verificacion de entorno:

```bash
dotnet --version
node --version
npm --version
```

---

## 3. Base de Datos: Scripts y Credenciales Iniciales

### Estructura de Scripts

Los scripts SQL se encuentran en el directorio `SQL/`:

| Archivo | Descripcion |
| :--- | :--- |
| `SQL/01_schema_and_procedures.sql` | Crea la base de datos `ConsultoriaDb`, las tablas `Usuarios`, `Paquetes` y `Consultores`, restricciones CHECK y todos los Stored Procedures con paginacion nativa `OFFSET/FETCH`. |
| `SQL/02_seed_data.sql` | Inserta los registros iniciales de prueba (usuarios, paquetes y consultores). |

### Ejecucion de Scripts

Ejecute los scripts en orden secuencial: primero `01_schema_and_procedures.sql`, luego `02_seed_data.sql`.

**Via SSMS o Azure Data Studio:**

1. Conéctese a la instancia de SQL Server.
2. Abra y ejecute `SQL/01_schema_and_procedures.sql` (F5).
3. Abra y ejecute `SQL/02_seed_data.sql` (F5).

**Via sqlcmd:**

```bash
# Autenticacion Windows (Trusted Connection)
sqlcmd -S localhost -E -i SQL/01_schema_and_procedures.sql -C
sqlcmd -S localhost -E -i SQL/02_seed_data.sql -C

# Autenticacion SQL (usuario y contrasena)
sqlcmd -S localhost -U sa -P "TuPassword" -i SQL/01_schema_and_procedures.sql -C
sqlcmd -S localhost -U sa -P "TuPassword" -i SQL/02_seed_data.sql -C
```

### Credenciales de Prueba

Las siguientes cuentas son insertadas por `02_seed_data.sql` con hashes BCrypt precalculados:

| Rol | Email | Contrasena | Permisos |
| :--- | :--- | :--- | :--- |
| Admin | admin@consultoria.local | Admin123* | Lectura, creacion, edicion y eliminacion logica |
| User | user@consultoria.local | User123* | Solo lectura y consulta de reportes |

---

## 4. Configuracion y Ejecucion del Backend

### Cadena de Conexion

Edite el archivo `Backend/ConsultoriaAPI/appsettings.Development.json` y reemplace la seccion `ConnectionStrings` con la opcion que corresponda a su entorno:

**Instancia Local Estandar (Windows Auth):**

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=ConsultoriaDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

**Instancia Express (Windows Auth):**

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=.\\SQLEXPRESS;Database=ConsultoriaDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

**Autenticacion SQL (Usuario / Contrasena):**

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=ConsultoriaDb;User Id=sa;Password=TuPassword;TrustServerCertificate=True;"
}
```

La clave `Jwt:SecretKey` ya esta preconfigurada en `appsettings.Development.json` para entornos locales. 
### Compilacion y Ejecucion

```bash
cd Backend/ConsultoriaAPI
dotnet restore
dotnet run
```

Puntos de acceso predeterminados:

| Recurso | URL |
| :--- | :--- |
| API Base | http://localhost:5271 |
| Swagger UI | http://localhost:5271/swagger |

Para probar endpoints protegidos en Swagger UI, haga clic en el boton **Authorize** e ingrese `Bearer <token>` tras obtener el JWT desde el endpoint `POST /api/v1/auth/login`.

### Pruebas Unitarias

El proyecto de pruebas se ubica en `Backend/Backend.Tests/`. Valida las reglas de negocio criticas mediante xUnit y FluentValidation con el patron `[Theory]` e `[InlineData]`:

- Limites de `TarifaHora`: valores validos en los extremos ($30.00, $200.00) y rechazo fuera de rango ($29.99, $200.01).
- Limites de `CantidadProyectosActivos`: valores validos (0, 5) y rechazo de invalidos (-1, 6).
- Formato de correo electronico y longitudes maximas de campos de texto.
- Restriccion de `Precio` en paquetes (no negativo).

```bash
# Ejecucion estandar
dotnet test

# Salida detallada por caso de prueba
dotnet test --logger "console;verbosity=detailed"
```

### Pruebas Manuales y Coleccion Postman

Para facilitar la auditoria de la API, se provee una coleccion de pruebas exhaustiva de Postman en `docs/ConsultoriaAPI.postman_collection.json`. 

La coleccion incluye:
- Variables preconfiguradas (`baseUrl`, `adminToken`, `userToken`).
- Scripts automaticos en los endpoints de autenticacion (`POST /auth/login`) que capturan el JWT de la respuesta y lo asignan a la variable correspondiente, evitando copiado manual.
- Validaciones negativas documentadas (ej. creacion de consultores con tarifa fuera de limites, violacion de RBAC 403 Forbidden).

---

## 5. Configuracion y Ejecucion del Frontend

### Variables de Entorno

El cliente web consume por defecto `http://localhost:5271/api/v1` gracias al fallback configurado en `axiosClient.js`. Si su backend corre en un puerto distinto, copie el archivo plantilla y ajuste la variable:

```bash
cp Frontend/.env.example Frontend/.env.local
```

Contenido de `Frontend/.env.example` (plantilla rastreable por Git):

```
VITE_API_URL=http://localhost:5271/api/v1
```

El backend tiene configurada la politica CORS para aceptar solicitudes originadas en `http://localhost:5173` (puerto predeterminado de Vite). No se requiere ningun ajuste adicional para entornos locales estandar.

### Instalacion y Puesta en Marcha

```bash
cd Frontend
npm install
npm run dev
```

La aplicacion estara disponible en: `http://localhost:5173`

Orden de inicio recomendado: levante primero el backend (Seccion 4) y luego el frontend. Ingrese con las credenciales de la Seccion 3.

---

## 6. Aspectos Tecnicos Destacados

**Persistencia sin ORM: Cumplimiento de Consigna**

En cumplimiento estricto del requerimiento tecnico ("Sin ORM"), se prescindio totalmente de cualquier ORM tradicional como Entity Framework Core. La capa de datos opera sobre ejecucion directa de Stored Procedures precompilados en SQL Server mediante ADO.NET (`Microsoft.Data.SqlClient`). Dapper actua exclusivamente como un Data Mapper de alto rendimiento: su unico rol es transferir los datos del `IDataReader` devuelto por ADO.NET a entidades POCO, sin ningun tipo de abstraccion de ORM, sin Change Tracking, sin generacion dinamica de SQL y sin Identity Map en memoria. El control del plan de ejecucion permanece integro en el motor de base de datos.

**Manejo Centralizado de Excepciones (RFC 7807)**

Un middleware global (`GlobalExceptionMiddleware`) intercepta cualquier excepcion no controlada en la canalizacion HTTP y responde siempre con `application/problem+json`, siguiendo el estandar RFC 7807 (ProblemDetails). Esto evita la exposicion de stack traces y rutas internas del servidor al cliente.

**Formula de Facturacion Mensual en Base de Datos**

El reporte de Consultores Top Facturacion resuelve el calculo estimado directamente en SQL Server mediante una CTE:

```sql
CAST((TarifaHora * 160.0) * (1.0 + (CantidadProyectosActivos * 0.10)) AS DECIMAL(14,2))
    AS FacturacionEstimada
```

La base de 160 horas corresponde al estandar FTE de la industria (40 hrs/semana x 4 semanas). El factor de recargo del 10% por proyecto activo refleja el valor adicional generado por consultores con alta carga operativa concurrente.

**Desacoplamiento de Catalogos por Area Tecnologica**

Los modulos de Consultores y Paquetes se vinculan logicamente mediante el campo de texto `Area` / `AreaEspecializacion`, sin utilizar claves foraneas entre tablas. Este diseno responde a principios de Bounded Contexts (DDD), permitiendo que ambos catalogos escalen y evolucionen de forma completamente independiente.

**Soft Delete Transversal**

Las tres entidades principales (`Usuarios`, `Paquetes`, `Consultores`) implementan el campo `Activo BIT NOT NULL DEFAULT 1`. Las eliminaciones son logicas, no fisicas. Este enfoque preserva la integridad historica de los datos, habilita indices filtrados en SQL Server (`WHERE Activo = 1`) y permite la reactivacion de registros sin operaciones destructivas.

---

## 7. Estructura del Repositorio

```text
Prueba_Tecnica/
├── Backend/
│   ├── Backend.slnx
│   ├── Backend.Tests/
│   └── ConsultoriaAPI/
│       ├── Controllers/
│       ├── DTOs/
│       ├── Middlewares/
│       ├── Models/
│       ├── Repositories/
│       ├── Services/
│       ├── Validators/
│       ├── appsettings.Development.json
│       ├── appsettings.Example.json
│       ├── appsettings.json
│       ├── ConsultoriaAPI.csproj
│       ├── ConsultoriaAPI.http
│       └── Program.cs
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── .gitignore
│   ├── .oxlintrc.json
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── README.md
├── SQL/
│   ├── 01_schema_and_procedures.sql
│   └── 02_seed_data.sql
├── docs/
│   └── ConsultoriaAPI.postman_collection.json
└── README.md
```
