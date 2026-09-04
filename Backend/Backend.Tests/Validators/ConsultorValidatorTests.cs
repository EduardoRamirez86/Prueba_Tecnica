using ConsultoriaAPI.DTOs.Consultores;
using ConsultoriaAPI.Validators;
using FluentAssertions;
using FluentValidation.TestHelper;
using Xunit;

namespace Backend.Tests.Validators;

/// <summary>
/// Pruebas unitarias de FluentValidation para ConsultorValidator.
/// Patrón: Arrange - Act - Assert
/// </summary>
public sealed class ConsultorValidatorTests
{
    private readonly CrearConsultorValidator _validator = new();

    [Theory]
    [InlineData(29.99)]
    [InlineData(0)]
    [InlineData(-1)]
    public void TarifaHora_MenorA30_DebeRetornarErrorDeValidacion(decimal tarifa)
    {
        // Arrange
        var dto = new CrearConsultorDto(
            NombreCompleto: "Juan Pérez",
            EmailCorporativo: "juan@empresa.com",
            AreaEspecializacion: "DevOps",
            TarifaHora: tarifa,
            CantidadProyectosActivos: 0);

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.TarifaHora)
            .WithErrorMessage("La tarifa por hora debe estar entre 30.00 y 200.00 USD.");
    }

    [Theory]
    [InlineData(200.01)]
    [InlineData(500)]
    [InlineData(9999.99)]
    public void TarifaHora_MayorA200_DebeRetornarErrorDeValidacion(decimal tarifa)
    {
        // Arrange
        var dto = new CrearConsultorDto(
            NombreCompleto: "María García",
            EmailCorporativo: "maria@empresa.com",
            AreaEspecializacion: "Cloud Computing",
            TarifaHora: tarifa,
            CantidadProyectosActivos: 2);

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.TarifaHora)
            .WithErrorMessage("La tarifa por hora debe estar entre 30.00 y 200.00 USD.");
    }

    [Theory]
    [InlineData(30.00)]
    [InlineData(100.00)]
    [InlineData(200.00)]
    public void TarifaHora_DentroDeRango_DebeSerValida(decimal tarifa)
    {
        // Arrange
        var dto = new CrearConsultorDto(
            NombreCompleto: "Carlos López",
            EmailCorporativo: "carlos@empresa.com",
            AreaEspecializacion: "Ciberseguridad",
            TarifaHora: tarifa,
            CantidadProyectosActivos: 1);

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.TarifaHora);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(6)]
    [InlineData(10)]
    public void CantidadProyectosActivos_FueraDeRango_DebeRetornarError(int cantidad)
    {
        // Arrange
        var dto = new CrearConsultorDto(
            NombreCompleto: "Ana Torres",
            EmailCorporativo: "ana@empresa.com",
            AreaEspecializacion: "DevOps",
            TarifaHora: 100m,
            CantidadProyectosActivos: cantidad);

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.CantidadProyectosActivos)
            .WithErrorMessage("La cantidad de proyectos activos debe estar entre 0 y 5.");
    }

    [Fact]
    public void EmailCorporativo_FormatoInvalido_DebeRetornarError()
    {
        // Arrange
        var dto = new CrearConsultorDto(
            NombreCompleto: "Luis Ramos",
            EmailCorporativo: "no-es-un-email",
            AreaEspecializacion: "Estrategia",
            TarifaHora: 75m,
            CantidadProyectosActivos: 2);

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.EmailCorporativo);
    }

    [Fact]
    public void DtoCompleto_ConDatosValidos_DebePassarValidacion()
    {
        // Arrange
        var dto = new CrearConsultorDto(
            NombreCompleto: "Roberto Silva",
            EmailCorporativo: "roberto@empresa.com",
            AreaEspecializacion: "Arquitectura Software",
            TarifaHora: 150m,
            CantidadProyectosActivos: 3);

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }
}
