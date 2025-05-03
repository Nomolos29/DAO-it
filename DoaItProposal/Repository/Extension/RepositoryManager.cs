using Contract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Extension
{
    public sealed class RepositoryManager : IRepositoryManager
    {
        private readonly RepositoryContext _repositoryContext;
        private readonly Lazy<IProposalRepository> _proposalRepository;
        private readonly Lazy<ICommentRepository> _commentRepository;
        private readonly Lazy<IProposalReactionRepository> _proposalReactionRepository;
        private readonly Lazy<ICommentReactionRepository> _commentReactionRepository;
        public RepositoryManager(RepositoryContext repositoryContext)
        {
            _repositoryContext = repositoryContext;
            _proposalRepository = new Lazy<IProposalRepository>(() => new ProposalRepository(repositoryContext));
            _commentRepository = new Lazy<ICommentRepository>(() => new CommentRepository(repositoryContext));
            _proposalReactionRepository = new Lazy<IProposalReactionRepository>(() => new ProposalReactionRepository(repositoryContext));
            _commentReactionRepository = new Lazy<ICommentReactionRepository>(() => new CommentReactionRepository(repositoryContext));
        }

        public IProposalRepository Proposal => _proposalRepository.Value;
        public ICommentRepository Comment => _commentRepository.Value;

        public IProposalReactionRepository ProposalReaction => _proposalReactionRepository.Value;

        public ICommentReactionRepository CommentReaction => _commentReactionRepository.Value;

        public async Task SaveAsync() => await _repositoryContext.SaveChangesAsync();
    }
}
