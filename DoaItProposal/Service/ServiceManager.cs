using AutoMapper;
using Contract;
using Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Service.Contracts;
using SignalR;

namespace Service
{
    public sealed class ServiceManager : IServiceManager
    {
        private readonly Lazy<IProposalService> _ProposalService;
        private readonly Lazy<ICommentService> _CommentService;
        private readonly Lazy<IProposalReactionService> _ProposalReactionService;
        private readonly Lazy<ICommentReactionService> _CommentReactionService;
        private readonly Lazy<IAuthenticationService> _AuthenticationService;
        public ServiceManager(IRepositoryManager repositoryManager, IMapper mapper, IHubContext<ProposalHub> hubContext, UserManager<User> userManager, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _CommentService = new Lazy<ICommentService>(() => new CommentService(repositoryManager, mapper, hubContext, httpContextAccessor, userManager));
            _ProposalService = new Lazy<IProposalService>(() => new ProposalService(repositoryManager, mapper, hubContext, httpContextAccessor, userManager));
            _CommentReactionService = new Lazy<ICommentReactionService>(() => new CommentReactionService(repositoryManager, mapper, hubContext, httpContextAccessor, userManager));
            _ProposalReactionService = new Lazy<IProposalReactionService>(() => new ProposalReactionService(repositoryManager, mapper, hubContext, httpContextAccessor, userManager));
            _AuthenticationService = new Lazy<IAuthenticationService>(() => new AuthenticationService(repositoryManager, userManager, configuration));
        }

        public IProposalService ProposalService => _ProposalService.Value;

        public ICommentService CommentService => _CommentService.Value;

        public IProposalReactionService ProposalReactionService => _ProposalReactionService.Value;

        public ICommentReactionService CommentReactionService => _CommentReactionService.Value;

        public IAuthenticationService AuthenticationService => _AuthenticationService.Value;
    }
}
