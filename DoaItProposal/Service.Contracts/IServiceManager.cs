using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Contracts
{
    public interface IServiceManager
    {
        IProposalService ProposalService { get; }
        ICommentService CommentService { get; }

        IProposalReactionService ProposalReactionService { get; }
        ICommentReactionService CommentReactionService { get; }

        IAuthenticationService AuthenticationService { get; }
    }
}
