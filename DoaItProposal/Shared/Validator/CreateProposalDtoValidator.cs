using Entities.Enums;
using FluentValidation;
using Shared.DataTransferObjects.Proposal;

namespace Shared.Validator
{
    public class CreateProposalDtoValidator : AbstractValidator<CreateProposalDto>
    {
        public CreateProposalDtoValidator()
        {
            RuleFor(x => x.ProposalTitle)
                .NotEmpty()
                .WithMessage("Proposal title is required.")
                .MaximumLength(200)
                .WithMessage("Proposal title must not exceed 200 characters.");
            RuleFor(x => x.ProposalSummary)
                .NotEmpty()
                .WithMessage("Proposal summary is required.")
                .MinimumLength(0)
                .WithMessage("Proposal summary must exceed 250 characters.").MaximumLength(100).WithMessage("Proposal summary must not exceed 1000 characters");
            RuleFor(x => x.ProposalDetails)
                .NotEmpty()
                .WithMessage("Proposal description is required.").MinimumLength(0).WithMessage("Description must be more than 500 characters");
            RuleFor(x => x.ProposalStatus).NotNull().WithMessage("Status is required").IsInEnum().WithMessage("Invalid proposal status.");

            RuleFor(x => x.PrivateStatus).NotNull().When( x => x.ProposalStatus == ProposalStatus.Private).WithMessage("Private status is required for private proposals.").IsInEnum().WithMessage("Invalid private status.");
            RuleFor(x => x.ProposalType).NotNull().WithMessage("Proposal type is required.").IsInEnum().WithMessage("Invalid proposal type.");
            RuleFor(x => x.AdoptionOption).NotNull().When(x => x.ProposalType == ProposalType.Adoption).WithMessage("Adoption option is required for adoption proposals.").IsInEnum().WithMessage("Invalid adoption option.");
            RuleFor(x => x.FundRaiserOption).NotNull().When(x => x.ProposalType == ProposalType.FundRaiser).WithMessage("Fundraiser option is required for fundraiser proposals.").IsInEnum().WithMessage("Invalid fundraiser option.");



        }

    }
}
