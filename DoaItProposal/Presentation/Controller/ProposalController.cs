using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Contracts;
using Shared.DataTransferObjects.Proposal;

namespace Presentation.Controller
{
    [Route("/[controller]")]
    [ApiController]
    public class ProposalController : ControllerBase
    {
        private readonly IServiceManager _service;

        public ProposalController(IServiceManager service)
        {
            _service = service;
        }


        [HttpPost("CreateProposal")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> CreateProposal(CreateProposalDto createProposalDto)
        {
            var result = await _service.ProposalService.CreateProposalAsync(createProposalDto);

            if(!result)
            {
                return BadRequest("Failed to create proposal");
            }

            return StatusCode(StatusCodes.Status201Created, "Proposal created successfully");


        }

        [HttpGet("GetAllProposals")]
        public async Task<IActionResult> GetAllProposals()
        {
            var result = await _service.ProposalService.GetAllProposalsAsync();
            
            return Ok(result);
        }

        [HttpGet("GetProposal/{proposalId:guid}")]
        public async Task<IActionResult> GetProposal(Guid proposalId)
        {
            var result = await _service.ProposalService.GetProposalAsync(proposalId);
            
            return Ok(result);
        }

        [HttpPut("UpdateProposal/{proposalId:guid}")]
        public async Task<IActionResult> UpdateProposal(Guid proposalId, UpdateProposalDto updateProposalDto)
        {
            var result = await _service.ProposalService.UpdateProposalAsync(proposalId, updateProposalDto);
           if(!result)
            {
                return BadRequest("Failed to update proposal");
            }
            return Ok("Proposal updated successfully");
        }

        [HttpDelete("DeleteProposal/{proposalId:guid}")]
        public async Task<IActionResult> DeleteProposal(Guid proposalId)
        {
            var result = await _service.ProposalService.DeleteProposalAsync(proposalId);
            if(!result)
            {
                return BadRequest("Failed to delete proposal");
            }
            return Ok("Proposal deleted successfully");
        }
    }
}
