using AutoMapper;
using Contract;
using Entities.Exceptions;
using Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Service.Contracts;
using Shared.DataTransferObjects.Reaction;
using SignalR;
using System.Security.Claims;

namespace Service
{



    internal class CommentReactionService : ICommentReactionService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;
        private IHubContext<ProposalHub> _hubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;

        public CommentReactionService(IRepositoryManager repositoryManager, IMapper mapper, IHubContext<ProposalHub> hubContext, IHttpContextAccessor httpContextAccessor, UserManager<User> userManager)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
            _hubContext = hubContext;
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
        }



        public async Task<CommentReactionResultDto> ReactToCommentAsync(CommentReactionDto reationDto)
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new UserNotFoundException("User not found.");

            var comment = await _repositoryManager.Comment.GetCommentAsync(reationDto.proposalId, reationDto.commentId);
            if (comment == null)
            {
                throw new CommentNotFoundException(reationDto.commentId);
            }

            var reaction = await _repositoryManager.CommentReaction.GetCommentReactionAsync(reationDto.UserId, reationDto.commentId);

            if (reaction != null)
            {
                if (reaction.IsLike == reationDto.IsLike)
                {
                    // Toggle Off (remove reaction)
                    _repositoryManager.CommentReaction.DeleteCommentReaction(reaction);
                }
                else
                {
                    // Change reaction
                    reaction.IsLike = reationDto.IsLike;
                    _mapper.Map(reationDto, reaction);

                }

            }
            else
            {
                var newReaction = _mapper.Map<CommentReaction>(reationDto);
                newReaction.UserId = userId;
                _repositoryManager.CommentReaction.CreateCommentReaction(reationDto.commentId, newReaction);
            }
            await _repositoryManager.SaveAsync();

            var updatedProposal = await _repositoryManager.Comment.GetCommentAsync(reationDto.proposalId, reationDto.commentId);

            var likeCount = updatedProposal.Reactions.Count(r => r.IsLike);
            var dislikeCount = updatedProposal.Reactions.Count(r => !r.IsLike);

            await _hubContext.Clients.All.SendAsync("ReceiveReactionUpdate", new
            {

                LikeCount = likeCount,
                DislikeCount = dislikeCount
            });

            return new CommentReactionResultDto
            {

                LikeCount = likeCount,
                DislikeCount = dislikeCount
            };
        }
    }
}
