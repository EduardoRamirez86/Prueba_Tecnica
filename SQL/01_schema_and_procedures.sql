IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ConsultoriaDb')
BEGIN
    CREATE DATABASE ConsultoriaDb;
END
GO
USE ConsultoriaDb;
GO

-- ============================================================================
-- 1. CREACIÓN DE TABLAS
-- ============================================================================

-- Tabla: Usuarios (Autenticación y Roles)
IF OBJECT_ID('dbo.Usuarios', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Usuarios (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Email NVARCHAR(150) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        Rol NVARCHAR(20) NOT NULL CHECK (Rol IN ('Admin', 'User')),
        Activo BIT NOT NULL DEFAULT 1,
        FechaCreacion DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

-- Tabla: Paquetes (Catálogo de servicios)
IF OBJECT_ID('dbo.Paquetes', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Paquetes (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Nombre NVARCHAR(150) NOT NULL,
        Descripcion NVARCHAR(500) NOT NULL,
        Area NVARCHAR(100) NOT NULL,
        Precio DECIMAL(12,2) NOT NULL CHECK (Precio >= 0),
        Activo BIT NOT NULL DEFAULT 1,
        FechaCreacion DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

-- Tabla: Consultores (Con validaciones de negocio estrictas)
IF OBJECT_ID('dbo.Consultores', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Consultores (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        NombreCompleto NVARCHAR(150) NOT NULL,
        EmailCorporativo NVARCHAR(150) NOT NULL UNIQUE,
        AreaEspecializacion NVARCHAR(100) NOT NULL,
        TarifaHora DECIMAL(10,2) NOT NULL CHECK (TarifaHora BETWEEN 30.00 AND 200.00),
        CantidadProyectosActivos INT NOT NULL DEFAULT 0 CHECK (CantidadProyectosActivos BETWEEN 0 AND 5),
        Activo BIT NOT NULL DEFAULT 1,
        FechaCreacion DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT UQ_Consultor_Nombre_Area UNIQUE (NombreCompleto, AreaEspecializacion)
    );
END
GO

-- ============================================================================
-- 2. PROCEDIMIENTOS ALMACENADOS: USUARIOS Y AUTH
-- ============================================================================

CREATE PROCEDURE dbo.sp_ObtenerUsuarioPorEmail
    @Email NVARCHAR(150)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Email, PasswordHash, Rol, Activo, FechaCreacion
    FROM dbo.Usuarios
    WHERE Email = @Email AND Activo = 1;
END;
GO

-- ============================================================================
-- 3. PROCEDIMIENTOS ALMACENADOS: PAQUETES
-- ============================================================================

CREATE PROCEDURE dbo.sp_ListarPaquetes
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Nombre, Descripcion, Area, Precio, Activo, FechaCreacion
    FROM dbo.Paquetes
    WHERE Activo = 1
    ORDER BY Id DESC;
END;
GO

CREATE PROCEDURE dbo.sp_ObtenerPaquetePorId
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Nombre, Descripcion, Area, Precio, Activo, FechaCreacion
    FROM dbo.Paquetes
    WHERE Id = @Id AND Activo = 1;
END;
GO

CREATE PROCEDURE dbo.sp_CrearPaquete
    @Nombre NVARCHAR(150),
    @Descripcion NVARCHAR(500),
    @Area NVARCHAR(100),
    @Precio DECIMAL(12,2)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.Paquetes (Nombre, Descripcion, Area, Precio, Activo, FechaCreacion)
    VALUES (@Nombre, @Descripcion, @Area, @Precio, 1, SYSUTCDATETIME());

    SELECT SCOPE_IDENTITY() AS Id;
END;
GO

CREATE PROCEDURE dbo.sp_ActualizarPaquete
    @Id INT,
    @Nombre NVARCHAR(150),
    @Descripcion NVARCHAR(500),
    @Area NVARCHAR(100),
    @Precio DECIMAL(12,2),
    @Activo BIT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.Paquetes
    SET Nombre = @Nombre,
        Descripcion = @Descripcion,
        Area = @Area,
        Precio = @Precio,
        Activo = @Activo
    WHERE Id = @Id;

    SELECT @@ROWCOUNT AS FilasAfectadas;
END;
GO

CREATE PROCEDURE dbo.sp_EliminarPaquete
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    -- Soft delete aplicado consistentemente
    UPDATE dbo.Paquetes
    SET Activo = 0
    WHERE Id = @Id AND Activo = 1;

    SELECT @@ROWCOUNT AS FilasAfectadas;
END;
GO

-- ============================================================================
-- 4. PROCEDIMIENTOS ALMACENADOS: CONSULTORES
-- ============================================================================

CREATE PROCEDURE dbo.sp_ListarConsultores
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, NombreCompleto, EmailCorporativo, AreaEspecializacion, TarifaHora, CantidadProyectosActivos, Activo, FechaCreacion
    FROM dbo.Consultores
    WHERE Activo = 1
    ORDER BY Id DESC;
END;
GO

CREATE PROCEDURE dbo.sp_ObtenerConsultorPorId
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, NombreCompleto, EmailCorporativo, AreaEspecializacion, TarifaHora, CantidadProyectosActivos, Activo, FechaCreacion
    FROM dbo.Consultores
    WHERE Id = @Id AND Activo = 1;
END;
GO

CREATE PROCEDURE dbo.sp_CrearConsultor
    @NombreCompleto NVARCHAR(150),
    @EmailCorporativo NVARCHAR(150),
    @AreaEspecializacion NVARCHAR(100),
    @TarifaHora DECIMAL(10,2),
    @CantidadProyectosActivos INT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.Consultores (NombreCompleto, EmailCorporativo, AreaEspecializacion, TarifaHora, CantidadProyectosActivos, Activo, FechaCreacion)
    VALUES (@NombreCompleto, @EmailCorporativo, @AreaEspecializacion, @TarifaHora, @CantidadProyectosActivos, 1, SYSUTCDATETIME());

    SELECT SCOPE_IDENTITY() AS Id;
END;
GO

CREATE PROCEDURE dbo.sp_ActualizarConsultor
    @Id INT,
    @NombreCompleto NVARCHAR(150),
    @EmailCorporativo NVARCHAR(150),
    @AreaEspecializacion NVARCHAR(100),
    @TarifaHora DECIMAL(10,2),
    @CantidadProyectosActivos INT,
    @Activo BIT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.Consultores
    SET NombreCompleto = @NombreCompleto,
        EmailCorporativo = @EmailCorporativo,
        AreaEspecializacion = @AreaEspecializacion,
        TarifaHora = @TarifaHora,
        CantidadProyectosActivos = @CantidadProyectosActivos,
        Activo = @Activo
    WHERE Id = @Id;

    SELECT @@ROWCOUNT AS FilasAfectadas;
END;
GO

CREATE PROCEDURE dbo.sp_EliminarConsultor
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    -- Soft delete aplicado consistentemente
    UPDATE dbo.Consultores
    SET Activo = 0
    WHERE Id = @Id AND Activo = 1;

    SELECT @@ROWCOUNT AS FilasAfectadas;
END;
GO

-- ============================================================================
-- 5. PROCEDIMIENTOS ALMACENADOS: REPORTES (PAGINACIÓN, FILTROS Y ORDEN)
-- ============================================================================

-- Reporte 1: Paquetes por Área (Resumen económico y conteo)
CREATE PROCEDURE dbo.sp_ReportePaquetesPorArea
    @FiltroArea NVARCHAR(100) = NULL,
    @Page INT = 1,
    @PageSize INT = 10,
    @SortBy NVARCHAR(50) = 'Area',
    @SortDir NVARCHAR(4) = 'ASC'
AS
BEGIN
    SET NOCOUNT ON;

    SET @Page = IIF(@Page < 1, 1, @Page);
    SET @PageSize = IIF(@PageSize < 1, 10, @PageSize);
    SET @SortDir = UPPER(IIF(@SortDir IN ('ASC', 'DESC'), @SortDir, 'ASC'));
    SET @SortBy = IIF(@SortBy IN ('Area', 'CantidadPaquetes', 'ValorTotalEconomico', 'PrecioPromedio'), @SortBy, 'Area');

    ;WITH Agrupado AS (
        SELECT 
            Area,
            COUNT(Id) AS CantidadPaquetes,
            SUM(Precio) AS ValorTotalEconomico,
            AVG(Precio) AS PrecioPromedio
        FROM dbo.Paquetes
        WHERE Activo = 1
          AND (@FiltroArea IS NULL OR Area LIKE '%' + @FiltroArea + '%')
        GROUP BY Area
    ),
    Total AS (
        SELECT COUNT(*) AS TotalCount FROM Agrupado
    )
    SELECT 
        A.Area,
        A.CantidadPaquetes,
        A.ValorTotalEconomico,
        A.PrecioPromedio,
        T.TotalCount
    FROM Agrupado A
    CROSS JOIN Total T
    ORDER BY 
        CASE WHEN @SortBy = 'Area' AND @SortDir = 'ASC' THEN A.Area END ASC,
        CASE WHEN @SortBy = 'Area' AND @SortDir = 'DESC' THEN A.Area END DESC,
        CASE WHEN @SortBy = 'CantidadPaquetes' AND @SortDir = 'ASC' THEN A.CantidadPaquetes END ASC,
        CASE WHEN @SortBy = 'CantidadPaquetes' AND @SortDir = 'DESC' THEN A.CantidadPaquetes END DESC,
        CASE WHEN @SortBy = 'ValorTotalEconomico' AND @SortDir = 'ASC' THEN A.ValorTotalEconomico END ASC,
        CASE WHEN @SortBy = 'ValorTotalEconomico' AND @SortDir = 'DESC' THEN A.ValorTotalEconomico END DESC,
        CASE WHEN @SortBy = 'PrecioPromedio' AND @SortDir = 'ASC' THEN A.PrecioPromedio END ASC,
        CASE WHEN @SortBy = 'PrecioPromedio' AND @SortDir = 'DESC' THEN A.PrecioPromedio END DESC
    OFFSET (@Page - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO

-- Reporte 2: Consultores Top Facturación
-- Regla de negocio documentada: Facturación estimada mensual = (TarifaHora * 160 horas estándar) * (1 + (CantidadProyectosActivos * 0.10))
CREATE PROCEDURE dbo.sp_ReporteConsultoresTopFacturacion
    @FiltroArea NVARCHAR(100) = NULL,
    @Page INT = 1,
    @PageSize INT = 10,
    @SortBy NVARCHAR(50) = 'FacturacionEstimada',
    @SortDir NVARCHAR(4) = 'DESC'
AS
BEGIN
    SET NOCOUNT ON;

    SET @Page = IIF(@Page < 1, 1, @Page);
    SET @PageSize = IIF(@PageSize < 1, 10, @PageSize);
    SET @SortDir = UPPER(IIF(@SortDir IN ('ASC', 'DESC'), @SortDir, 'DESC'));
    SET @SortBy = IIF(@SortBy IN ('FacturacionEstimada', 'NombreCompleto', 'TarifaHora', 'CantidadProyectosActivos'), @SortBy, 'FacturacionEstimada');

    ;WITH Calculado AS (
        SELECT 
            Id,
            NombreCompleto,
            EmailCorporativo,
            AreaEspecializacion,
            TarifaHora,
            CantidadProyectosActivos,
            CAST((TarifaHora * 160.0) * (1.0 + (CantidadProyectosActivos * 0.10)) AS DECIMAL(14,2)) AS FacturacionEstimada
        FROM dbo.Consultores
        WHERE Activo = 1
          AND (@FiltroArea IS NULL OR AreaEspecializacion LIKE '%' + @FiltroArea + '%')
    ),
    Total AS (
        SELECT COUNT(*) AS TotalCount FROM Calculado
    )
    SELECT 
        C.Id,
        C.NombreCompleto,
        C.EmailCorporativo,
        C.AreaEspecializacion,
        C.TarifaHora,
        C.CantidadProyectosActivos,
        C.FacturacionEstimada,
        T.TotalCount
    FROM Calculado C
    CROSS JOIN Total T
    ORDER BY 
        CASE WHEN @SortBy = 'FacturacionEstimada' AND @SortDir = 'ASC' THEN C.FacturacionEstimada END ASC,
        CASE WHEN @SortBy = 'FacturacionEstimada' AND @SortDir = 'DESC' THEN C.FacturacionEstimada END DESC,
        CASE WHEN @SortBy = 'NombreCompleto' AND @SortDir = 'ASC' THEN C.NombreCompleto END ASC,
        CASE WHEN @SortBy = 'NombreCompleto' AND @SortDir = 'DESC' THEN C.NombreCompleto END DESC,
        CASE WHEN @SortBy = 'TarifaHora' AND @SortDir = 'ASC' THEN C.TarifaHora END ASC,
        CASE WHEN @SortBy = 'TarifaHora' AND @SortDir = 'DESC' THEN C.TarifaHora END DESC,
        CASE WHEN @SortBy = 'CantidadProyectosActivos' AND @SortDir = 'ASC' THEN C.CantidadProyectosActivos END ASC,
        CASE WHEN @SortBy = 'CantidadProyectosActivos' AND @SortDir = 'DESC' THEN C.CantidadProyectosActivos END DESC
    OFFSET (@Page - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO