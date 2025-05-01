using Shared.DataTransferObjects.Reaction;

namespace Service.Contracts
{
    public interface IProposalReactionService {
        Task<ProposalReactionResultDto> ReactToProposalAsync(ProposalReactionDto reationDto);
    }
}
