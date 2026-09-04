USE ConsultoriaDb;
GO

-- ============================================================================
-- 1. SEED: USUARIOS (BCrypt Hash: Factor 11)
-- Admin123* -> $2a$11$eWkZpCkgHvh7FpvyqAUpseQY5uE.yWd9e36Feqr0Z9Nl7xS9zO4eO
-- User123*  -> $2a$11$c8K8gRk5AOmgB.0uVlJ0ceGf97W2U5t0O6Uv7a7R7ZzL9T2g1MxeS
-- ============================================================================

IF NOT EXISTS (SELECT 1 FROM dbo.Usuarios WHERE Email = 'admin@consultoria.local')
BEGIN
    INSERT INTO dbo.Usuarios (Email, PasswordHash, Rol, Activo, FechaCreacion)
    VALUES ('admin@consultoria.local', '$2a$11$eWkZpCkgHvh7FpvyqAUpseQY5uE.yWd9e36Feqr0Z9Nl7xS9zO4eO', 'Admin', 1, SYSUTCDATETIME());
END

IF NOT EXISTS (SELECT 1 FROM dbo.Usuarios WHERE Email = 'user@consultoria.local')
BEGIN
    INSERT INTO dbo.Usuarios (Email, PasswordHash, Rol, Activo, FechaCreacion)
    VALUES ('user@consultoria.local', '$2a$11$c8K8gRk5AOmgB.0uVlJ0ceGf97W2U5t0O6Uv7a7R7ZzL9T2g1MxeS', 'User', 1, SYSUTCDATETIME());
END
GO

-- ============================================================================
-- 2. SEED: PAQUETES DE SERVICIO
-- ============================================================================

IF NOT EXISTS (SELECT 1 FROM dbo.Paquetes WHERE Nombre = 'Auditoría Cloud AWS/Azure')
BEGIN
    INSERT INTO dbo.Paquetes (Nombre, Descripcion, Area, Precio, Activo, FechaCreacion)
    VALUES 
    ('Auditoría Cloud AWS/Azure', 'Revisión técnica de infraestructura, costos y seguridad.', 'Cloud Computing', 3500.00, 1, SYSUTCDATETIME()),
    ('Migración a Microservicios .NET', 'Refactorización y contenedorización con Docker y Kubernetes.', 'Arquitectura Software', 7800.00, 1, SYSUTCDATETIME()),
    ('Diseño de Pipeline CI/CD', 'Automatización de builds, pruebas y despliegues con GitHub Actions.', 'DevOps', 2200.00, 1, SYSUTCDATETIME()),
    ('Consultoría Estratégica TI', 'Alineación de objetivos de negocio con hoja de ruta tecnológica.', 'Estrategia', 4500.00, 1, SYSUTCDATETIME()),
    ('Pentesting Web & API', 'Análisis de vulnerabilidades según lineamientos OWASP Top 10.', 'Ciberseguridad', 5000.00, 1, SYSUTCDATETIME());
END
GO

-- ============================================================================
-- 3. SEED: CONSULTORES
-- ============================================================================

IF NOT EXISTS (SELECT 1 FROM dbo.Consultores WHERE EmailCorporativo = 'carlos.mendoza@consultoria.local')
BEGIN
    INSERT INTO dbo.Consultores (NombreCompleto, EmailCorporativo, AreaEspecializacion, TarifaHora, CantidadProyectosActivos, Activo, FechaCreacion)
    VALUES 
    ('Carlos Mendoza', 'carlos.mendoza@consultoria.local', 'Cloud Computing', 95.00, 3, 1, SYSUTCDATETIME()),
    ('Valeria Rivas', 'valeria.rivas@consultoria.local', 'Arquitectura Software', 120.00, 4, 1, SYSUTCDATETIME()),
    ('Mauricio Gómez', 'mauricio.gomez@consultoria.local', 'DevOps', 85.00, 2, 1, SYSUTCDATETIME()),
    ('Ana Lucía Torres', 'ana.torres@consultoria.local', 'Ciberseguridad', 150.00, 1, 1, SYSUTCDATETIME()),
    ('Roberto Estrada', 'roberto.estrada@consultoria.local', 'Estrategia', 180.00, 5, 1, SYSUTCDATETIME()),
    ('Sofía Lemus', 'sofia.lemus@consultoria.local', 'Cloud Computing', 70.00, 0, 1, SYSUTCDATETIME());
END
GO