using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTransferObjects.Reaction
{
    public class ProposalReactionResultDto
    {
        public Guid ProposalId { get; set; }
        public int LikeCount { get; set; }
        public int DislikeCount { get; set; }
    }
}