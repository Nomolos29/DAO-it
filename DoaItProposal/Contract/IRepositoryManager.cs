using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contract
{
    public interface IRepositoryManager
    {
        IProposalRepository Proposal { get; }
        ICommentRepository Comment { get; }

        IProposalReactionRepository ProposalReaction { get; }
        ICommentReactionRepository CommentReaction { get; }
        Task SaveAsync();
    }
}
