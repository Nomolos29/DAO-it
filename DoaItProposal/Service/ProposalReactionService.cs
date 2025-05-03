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


    internal sealed class ProposalReactionService : IProposalReactionService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;
        private readonly IHubContext<ProposalHub> _hubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;

        public ProposalReactionService(IRepositoryManager repositoryManager, IMapper mapper, IHubContext<SignalR.ProposalHub> hubContext, Microsoft.AspNetCore.Http.IHttpContextAccessor httpContextAccessor, Microsoft.AspNetCore.Identity.UserManager<User> userManager)
        {

            _repositoryManager = repositoryManager;
            _mapper = mapper;
            _hubContext = hubContext;
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
        }


        public async Task<ProposalReactionResultDto> ReactToProposalAsync(ProposalReactionDto reationDto)
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new UserNotFoundException("User not found.");
            var proposal = await _repositoryManager.Proposal.GetProposalAsync(reationDto.ProposalId);
            if (proposal == null)
            {
                throw new ProposalNotFoundException(reationDto.ProposalId);
            }

            var reaction = await _repositoryManager.ProposalReaction.GetProposalReactionAsync(reationDto.UserId, reationDto.ProposalId);

            if (reaction != null)
            {
                if (reaction.IsLike == reationDto.IsLike)
                {
                    // Toggle Off (remove reaction)
                    _repositoryManager.ProposalReaction.DeleteProposalReaction(reaction);
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
                var newReaction = _mapper.Map<ProposalReaction>(reationDto);
                newReaction.UserId = userId;
                _repositoryManager.ProposalReaction.CreateProposalReaction(reationDto.ProposalId, newReaction);
            }
            await _repositoryManager.SaveAsync();

            var updatedProposal = await _repositoryManager.Proposal.GetProposalAsync(reationDto.ProposalId);

            var likeCount = updatedProposal.Reactions.Count(r => r.IsLike);
            var dislikeCount = updatedProposal.Reactions.Count(r => !r.IsLike);

            await _hubContext.Clients.All.SendAsync("ReceiveReactionUpdate", new
            {
                ProposalId = reationDto.ProposalId,
                LikeCount = likeCount,
                DislikeCount = dislikeCount
            });

           return new ProposalReactionResultDto
           {
               ProposalId = reationDto.ProposalId,
               LikeCount = likeCount,
               DislikeCount = dislikeCount
           };   
        }




    }
}
