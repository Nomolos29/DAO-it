using Shared.DataTransferObjects.Proposal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Contracts
{
    public interface IProposalService
    {
        Task<IEnumerable<ProposalDto>> GetAllProposalsAsync();

        Task<ProposalDto> GetProposalAsync(Guid proposalId);

        Task<bool> CreateProposalAsync(CreateProposalDto proposal);

        Task<bool> DeleteProposalAsync(Guid proposalId);

        Task<bool> UpdateProposalAsync(Guid proposalId, UpdateProposalDto proposal);
    }
}
