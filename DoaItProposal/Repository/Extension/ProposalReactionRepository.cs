using Contract;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Extension
{
   

    public class ProposalReactionRepository : RepositoryBase<ProposalReaction>, IProposalReactionRepository
    {
        public ProposalReactionRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public void CreateProposalReaction(Guid proposalId, ProposalReaction proposalReaction)
        {
            proposalReaction.ProposalId = proposalId;
            Create(proposalReaction);
        }

        public void DeleteProposalReaction(ProposalReaction proposalReaction)
        {
            Delete(proposalReaction);
        }

        public async Task<ProposalReaction?> GetProposalReactionAsync(string userId, Guid proposalReactionId
            )
        {
            return await FindByCondition(x => x.UserId.Equals(userId) && x.ProposalReactionId.Equals(proposalReactionId)).FirstOrDefaultAsync();

        }

        public async Task<IEnumerable<ProposalReaction>> GetAllProposalReactionsAsync(Guid proposalId)
        {
            return await FindByCondition(x => x.ProposalId.Equals(proposalId)).ToListAsync();
        }


    }
}
