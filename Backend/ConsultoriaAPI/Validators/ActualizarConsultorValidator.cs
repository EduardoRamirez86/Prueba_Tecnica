using ConsultoriaAPI.DTOs.Consultores;
using FluentValidation;

namespace ConsultoriaAPI.Validators;

public sealed class ActualizarConsultorValidator : AbstractValidator<ActualizarConsultorDto>
{
    public ActualizarConsultorValidator()
    {
        RuleFor(x => x.NombreCompleto)
            .NotEmpty().WithMessage("El nombre completo es requerido.")
            .MaximumLength(150).WithMessage("El nombre completo no puede superar 150 caracteres.");

        RuleFor(x => x.EmailCorporativo)
            .NotEmpty().WithMessage("El email corporativo es requerido.")
            .EmailAddress().WithMessage("El email corporativo no tiene un formato válido.")
            .MaximumLength(150).WithMessage("El email corporativo no puede superar 150 caracteres.");

        RuleFor(x => x.AreaEspecializacion)
            .NotEmpty().WithMessage("El área de especialización es requerida.");

        RuleFor(x => x.TarifaHora)
            .InclusiveBetween(30.00m, 200.00m)
            .WithMessage("La tarifa por hora debe estar entre 30.00 y 200.00 USD.");

        RuleFor(x => x.CantidadProyectosActivos)
            .InclusiveBetween(0, 5)
            .WithMessage("La cantidad de proyectos activos debe estar entre 0 y 5.");
    }
}
