using AutoMapper;
using Contract;
using Entities.Exceptions;
using Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Service.Contracts;
using Shared.DataTransferObjects.Proposal;
using SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Service
{
    internal sealed class ProposalService : IProposalService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;
        private readonly IHubContext<ProposalHub> _hubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;

        public ProposalService(IRepositoryManager repositoryManager, IMapper mapper, IHubContext<ProposalHub> hubContext, Microsoft.AspNetCore.Http.IHttpContextAccessor httpContextAccessor, Microsoft.AspNetCore.Identity.UserManager<User> userManager)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
            _hubContext = hubContext;
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
        }

        public async Task<bool> CreateProposalAsync(CreateProposalDto proposal)
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new UserNotFoundException("User not found.");

            List<string> savedFilePaths = await ImageHadler(proposal);

            var proposalEnity = _mapper.Map<Proposal>(proposal);

            proposalEnity.UploadedFiles = savedFilePaths;
            proposalEnity.UserId = userId;
            _repositoryManager.Proposal.CreateProposal(proposalEnity);
            

            await _repositoryManager.SaveAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveProposalCreared", new
            {
                proposalId = proposal.ProposalId,
                proposalTitle = proposal.ProposalTitle,
                createdAt = proposal.CreatedAt,
            });

            return true;
        }

        private static async Task<List<string>> ImageHadler(CreateProposalDto proposal)
        {
            var uploadDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads");
            if (!Directory.Exists(uploadDirectory))
            {
                Directory.CreateDirectory(uploadDirectory);
            }

            var savedFilePaths = new List<string>();
            foreach (var file in proposal.Images)
            {
                if (file.Length > 0)
                {
                    var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    var filePath = Path.Combine(uploadDirectory, uniqueFileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    var relativePath = Path.Combine("Uploads", uniqueFileName).Replace("\\", "/");
                    savedFilePaths.Add(relativePath);


                }

            }

            return savedFilePaths;
        }

        public async Task<bool> DeleteProposalAsync(Guid proposalId)
        {
            var proposal = await _repositoryManager.Proposal.GetProposalAsync(proposalId);

            if (proposal == null)
                throw new ProposalNotFoundException( proposalId);

            _repositoryManager.Proposal.DeleteProposal(proposal);
            await _repositoryManager.SaveAsync();
            return true;


        }

        public async Task<IEnumerable<ProposalDto>> GetAllProposalsAsync()
        {
            IEnumerable<Proposal>? proposals = await _repositoryManager.Proposal.GetAllProposalAsync();
            var proposalDto = _mapper.Map<IEnumerable<ProposalDto>>(proposals);

            return proposalDto;
        }

        public async Task<ProposalDto> GetProposalAsync(Guid proposalId)
        {
            var proposal = await _repositoryManager.Proposal.GetProposalAsync(proposalId);
            // check if proposal is null
            var proposalDto = _mapper.Map<ProposalDto>(proposal);
            return proposalDto;
        }

        public async Task<bool> UpdateProposalAsync(Guid proposalId, UpdateProposalDto proposalDto)
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new UserNotFoundException("User not found.");

            var proposal = await _repositoryManager.Proposal.GetProposalAsync(proposalId);
            if (proposal == null)
                throw new ProposalNotFoundException(proposalId);

            List<string> savedFilePaths = await ImageHadler(proposalDto);

            var entity =_mapper.Map(proposalDto, proposal);
            entity.UserId = user.Id;
            await _repositoryManager.SaveAsync();

            return true;
        }

        private static async Task<List<string>> ImageHadler(UpdateProposalDto proposal)
        {
            var uploadDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads");
            if (!Directory.Exists(uploadDirectory))
            {
                Directory.CreateDirectory(uploadDirectory);
            }

            var savedFilePaths = new List<string>();
            foreach (var file in proposal.Images)
            {
                if (file.Length > 0)
                {
                    var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    var filePath = Path.Combine(uploadDirectory, uniqueFileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    var relativePath = Path.Combine("Uploads", uniqueFileName).Replace("\\", "/");
                    savedFilePaths.Add(relativePath);


                }

            }

            return savedFilePaths;
        }
    }
}
