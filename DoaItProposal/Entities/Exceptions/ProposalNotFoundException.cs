using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Exceptions
{
    public class ProposalNotFoundException : NotFoundException
    {
        public ProposalNotFoundException(Guid proposalId) : base("Proposal", proposalId)
        {
        }
    }
}
