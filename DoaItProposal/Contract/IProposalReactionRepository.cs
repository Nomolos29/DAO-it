using Entities.Models;

namespace Contract
{
    public interface IProposalReactionRepository
    {
        void CreateProposalReaction(Guid proposalId, ProposalReaction proposalReaction);
        void DeleteProposalReaction(ProposalReaction proposalReaction);
        Task<IEnumerable<ProposalReaction>> GetAllProposalReactionsAsync(Guid proposalId);
        Task<ProposalReaction?> GetProposalReactionAsync(string userId, Guid proposalReactionId);


    }
}
