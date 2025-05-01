using AutoMapper;
using Contract;
using Entities.Exceptions;
using Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Service.Contracts;
using Shared.DataTransferObjects.Comment;
using Shared.DataTransferObjects.Proposal;
using SignalR;
using System.Security.Claims;

namespace Service
{
    internal class CommentService : ICommentService
    {
        private IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;
        private readonly IHubContext<ProposalHub> _hubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;

        public CommentService(IRepositoryManager repositoryManager, IMapper mapper, IHubContext<ProposalHub> hubContext, Microsoft.AspNetCore.Http.IHttpContextAccessor httpContextAccessor, Microsoft.AspNetCore.Identity.UserManager<User> userManager)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
            _hubContext = hubContext;
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
        }

        public async Task<bool> CreateCommentAsync(Guid proposalId, CreateCommentDto createCommentDto)
        {

            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new UserNotFoundException("User not found.");
            await CheckifProposalExist(proposalId);
            var commentEntity = _mapper.Map<Comment>(createCommentDto);
            commentEntity.UserId = user.Id;
            _repositoryManager.Comment.CreateComment(proposalId, commentEntity);
            await _repositoryManager.SaveAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveCommentAdded", new
            {
               commendId = commentEntity.CommentId,
                proposalId = proposalId,
                content = createCommentDto.CommentText,
                createdAt = commentEntity.CreatedAt
                
            });

            return true;
        }

        private async Task CheckifProposalExist(Guid proposalId)
        {
            var proposal = await _repositoryManager.Proposal.GetProposalAsync(proposalId);

            if (proposal == null)
            {
                throw new ProposalNotFoundException(proposalId);
            }
        }

        public async Task<bool> DeleteCommentAsync(Guid proposalId, Guid commentId)
        {
            await CheckifProposalExist(proposalId);
            var comment = await CheckIfCommentExist(proposalId, commentId);
            _repositoryManager.Comment.DeleteComment(comment);
            await _repositoryManager.SaveAsync();
            return true;
        }

        public async Task<IEnumerable<CommentDto>> GetAllCommentsAsync(Guid proposalId)
        {
            await CheckifProposalExist(proposalId);
            var comments = await _repositoryManager.Comment.GetAllCommentAsync(proposalId);

            if (comments == null)
                throw new CommentNotFoundException(proposalId);

            var commentsDto = _mapper.Map<IEnumerable<CommentDto>>(comments);

            return commentsDto;
        }

        public async Task<CommentDto> GetCommentAsync(Guid proposalId, Guid commentId)
        {
            CheckifProposalExist(proposalId);

            var comment = await CheckIfCommentExist(proposalId, commentId);

            var commentDto = _mapper.Map<CommentDto>(comment);
            return commentDto;


        }

        private async Task<Comment> CheckIfCommentExist(Guid proposalId, Guid commentId)
        {
            var comment = await _repositoryManager.Comment.GetCommentAsync(proposalId, commentId);
            if (comment == null)
                throw new CommentNotFoundException(commentId);
            return comment;
        }

        public async Task<bool> UpdateCommentAsync(Guid proposalId, Guid commentId, UpdateCommentDto updateCommentDto)
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new UserNotFoundException("User not found.");
            await CheckifProposalExist(proposalId);
           var comment =  await CheckIfCommentExist(proposalId, commentId);
           
            var entity =_mapper.Map(updateCommentDto, comment);
            entity.UserId = user.Id;
            _repositoryManager.SaveAsync();

            return true;
        }
    }
}
