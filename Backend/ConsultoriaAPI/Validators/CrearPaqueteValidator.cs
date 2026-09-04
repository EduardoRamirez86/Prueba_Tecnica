using ConsultoriaAPI.DTOs.Paquetes;
using FluentValidation;

namespace ConsultoriaAPI.Validators;

public sealed class CrearPaqueteValidator : AbstractValidator<CrearPaqueteDto>
{
    private static readonly string[] AreasPermitidas =
    [
        "Cloud Computing",
        "Arquitectura Software",
        "DevOps",
        "Ciberseguridad",
        "Estrategia"
    ];

    public CrearPaqueteValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre es requerido.")
            .MaximumLength(150).WithMessage("El nombre no puede superar 150 caracteres.");

        RuleFor(x => x.Descripcion)
            .NotEmpty().WithMessage("La descripción es requerida.")
            .MaximumLength(500).WithMessage("La descripción no puede superar 500 caracteres.");

        RuleFor(x => x.Area)
            .NotEmpty().WithMessage("El área es requerida.")
            .Must(a => AreasPermitidas.Contains(a))
            .WithMessage($"El área debe ser una de: {string.Join(", ", AreasPermitidas)}.");

        RuleFor(x => x.Precio)
            .GreaterThanOrEqualTo(0).WithMessage("El precio debe ser mayor o igual a 0.");
    }
}
