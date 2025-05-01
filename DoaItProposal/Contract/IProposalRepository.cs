using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contract
{
    public interface IProposalRepository
    {
        Task<IEnumerable<Proposal>> GetAllProposalAsync();
        Task<Proposal> GetProposalAsync(Guid proposalId);
        void CreateProposal(Proposal proposal);
       
        void DeleteProposal(Proposal proposal);

    }
}
