using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTransferObjects.Reaction
{
    public class ProposalReactionDto
    {
        public Guid ProposalId { get; set; }

        public string UserId { get; set; }

        public bool IsLike { get; set; }


    }
}
