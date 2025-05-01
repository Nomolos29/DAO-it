using Contract;
using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Repository.Extension
{
    public class ProposalRepository : RepositoryBase<Proposal>, IProposalRepository
    {
        public ProposalRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public void CreateProposal(Proposal proposal) => Create(proposal);


        public void DeleteProposal(Proposal proposal) => Delete(proposal);


        public async Task<IEnumerable<Proposal>> GetAllProposalAsync() => await FindAll().ToListAsync();


        public async Task<Proposal> GetProposalAsync(Guid proposalId) => await FindByCondition(x => x.ProposalId.Equals(proposalId)).Include(r => r.Reactions).FirstOrDefaultAsync();


    }
}
