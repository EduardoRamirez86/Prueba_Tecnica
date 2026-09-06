USE ConsultoriaDb;
GO

-- ============================================================================
-- 1. SEED: USUARIOS (BCrypt Hash: Factor 11)
-- Admin123* -> $2a$11$Tst7APCt6rZZzI9TT657o.QL2ATm/oLQVoi9BDE/6eSRujHLO4Rdi
-- User123*  -> $2a$11$P8TNRSEk2oPndF/Nh8JguOg270olM5J8Lb1zllqDy1STmktozqzXq
-- ============================================================================

IF NOT EXISTS (SELECT 1 FROM dbo.Usuarios WHERE Email = 'admin@consultoria.local')
BEGIN
    INSERT INTO dbo.Usuarios (Email, PasswordHash, Rol, Activo, FechaCreacion)
    VALUES ('admin@consultoria.local', '$2a$11$Tst7APCt6rZZzI9TT657o.QL2ATm/oLQVoi9BDE/6eSRujHLO4Rdi', 'Admin', 1, SYSUTCDATETIME());
END

IF NOT EXISTS (SELECT 1 FROM dbo.Usuarios WHERE Email = 'user@consultoria.local')
BEGIN
    INSERT INTO dbo.Usuarios (Email, PasswordHash, Rol, Activo, FechaCreacion)
    VALUES ('user@consultoria.local', '$2a$11$P8TNRSEk2oPndF/Nh8JguOg270olM5J8Lb1zllqDy1STmktozqzXq', 'User', 1, SYSUTCDATETIME());
END
GO

-- ============================================================================
-- 2. SEED: PAQUETES DE SERVICIO
-- ============================================================================

IF NOT EXISTS (SELECT 1 FROM dbo.Paquetes WHERE Nombre = 'Auditoría Cloud AWS/Azure')
BEGIN
    INSERT INTO dbo.Paquetes (Nombre, Descripcion, Area, Precio, Activo, FechaCreacion)
    VALUES 
    -- Cloud Computing (2)
    ('Auditoría Cloud AWS/Azure', 'Revisión técnica de infraestructura, costos y seguridad.', 'Cloud Computing', 3500.00, 1, SYSUTCDATETIME()),
    ('Optimización de Costos FinOps', 'Análisis y reducción de gastos en nube pública.', 'Cloud Computing', 3100.00, 1, SYSUTCDATETIME()),
    
    -- Arquitectura Software (3)
    ('Migración a Microservicios .NET', 'Refactorización y contenedorización con Docker y Kubernetes.', 'Arquitectura Software', 7800.00, 1, SYSUTCDATETIME()),
    ('Diseño de API RESTful Escalable', 'Definición de contratos, versionado y seguridad de APIs.', 'Arquitectura Software', 3500.00, 1, SYSUTCDATETIME()),
    ('Auditoría de Deuda Técnica', 'Revisión de código fuente y cumplimiento de principios SOLID.', 'Arquitectura Software', 4200.00, 1, SYSUTCDATETIME()),
    
    -- Ciberseguridad (3)
    ('Pentesting Web & API', 'Análisis de vulnerabilidades según lineamientos OWASP Top 10.', 'Ciberseguridad', 5000.00, 1, SYSUTCDATETIME()),
    ('Evaluación de Cumplimiento PCI-DSS', 'Consultoría para certificar procesamiento de pagos seguros.', 'Ciberseguridad', 6000.00, 1, SYSUTCDATETIME()),
    ('Implementación de Zero Trust Architecture', 'Diseño de redes seguras asumiendo compromiso de red interna.', 'Ciberseguridad', 8500.00, 1, SYSUTCDATETIME()),
    
    -- DevOps (2)
    ('Diseño de Pipeline CI/CD', 'Automatización de builds, pruebas y despliegues con GitHub Actions.', 'DevOps', 2200.00, 1, SYSUTCDATETIME()),
    ('Automatización de Infraestructura (IaC)', 'Codificación de infraestructura usando Terraform o Bicep.', 'DevOps', 4800.00, 1, SYSUTCDATETIME()),
    
    -- Estrategia (2)
    ('Consultoría Estratégica TI', 'Alineación de objetivos de negocio con hoja de ruta tecnológica.', 'Estrategia', 4500.00, 1, SYSUTCDATETIME()),
    ('Transformación Digital y Agile', 'Adopción de metodologías ágiles a nivel empresarial.', 'Estrategia', 5500.00, 1, SYSUTCDATETIME()),
    
    -- Data & Analytics (1)
    ('Implementación de Data Lake', 'Arquitectura centralizada para big data e inteligencia de negocios.', 'Data & Analytics', 9000.00, 1, SYSUTCDATETIME());
END
GO

-- ============================================================================
-- 3. SEED: CONSULTORES
-- ============================================================================

IF NOT EXISTS (SELECT 1 FROM dbo.Consultores WHERE EmailCorporativo = 'carlos.mendoza@consultoria.local')
BEGIN
    INSERT INTO dbo.Consultores (NombreCompleto, EmailCorporativo, AreaEspecializacion, TarifaHora, CantidadProyectosActivos, Activo, FechaCreacion)
    VALUES 
    -- Existentes
    ('Carlos Mendoza', 'carlos.mendoza@consultoria.local', 'Cloud Computing', 95.00, 3, 1, SYSUTCDATETIME()),
    ('Valeria Rivas', 'valeria.rivas@consultoria.local', 'Arquitectura Software', 120.00, 4, 1, SYSUTCDATETIME()),
    ('Mauricio Gómez', 'mauricio.gomez@consultoria.local', 'DevOps', 85.00, 2, 1, SYSUTCDATETIME()),
    ('Ana Lucía Torres', 'ana.torres@consultoria.local', 'Ciberseguridad', 150.00, 1, 1, SYSUTCDATETIME()),
    ('Roberto Estrada', 'roberto.estrada@consultoria.local', 'Estrategia', 180.00, 5, 1, SYSUTCDATETIME()),
    ('Sofía Lemus', 'sofia.lemus@consultoria.local', 'Cloud Computing', 70.00, 0, 1, SYSUTCDATETIME()),
    -- Nuevos
    ('Javier Ordóñez', 'javier.ordonez@consultoria.local', 'Data & Analytics', 110.00, 3, 1, SYSUTCDATETIME()),
    ('Elena Castro', 'elena.castro@consultoria.local', 'Arquitectura Software', 140.00, 2, 1, SYSUTCDATETIME()),
    ('Luis Fernando Vargas', 'luis.vargas@consultoria.local', 'DevOps', 90.00, 1, 1, SYSUTCDATETIME()),
    ('Carmen Salinas', 'carmen.salinas@consultoria.local', 'Estrategia', 170.00, 4, 1, SYSUTCDATETIME()),
    ('Miguel Ángel Reyes', 'miguel.reyes@consultoria.local', 'Ciberseguridad', 130.00, 2, 1, SYSUTCDATETIME()),
    ('Diana Morales', 'diana.morales@consultoria.local', 'Cloud Computing', 80.00, 5, 1, SYSUTCDATETIME()),
    ('Fernando Pineda', 'fernando.pineda@consultoria.local', 'Data & Analytics', 100.00, 1, 1, SYSUTCDATETIME()),
    ('Gabriela Ortiz', 'gabriela.ortiz@consultoria.local', 'Arquitectura Software', 160.00, 3, 1, SYSUTCDATETIME()),
    ('Hugo Sánchez', 'hugo.sanchez@consultoria.local', 'Ciberseguridad', 190.00, 0, 1, SYSUTCDATETIME());
END
GO