using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Contracts;
using Shared.DataTransferObjects.Reaction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Presentation.Controller
{
    [ApiController]
    [Route("proposal/[controller]")]
    public class ProposalReactionController : ControllerBase
    {
        private readonly IServiceManager _serviceManager;

        public ProposalReactionController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }
        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost("react")]
        public async Task<IActionResult> ReactToProposal(ProposalReactionDto reactionDto)
        {
            var result =  await _serviceManager.ProposalReactionService.ReactToProposalAsync(reactionDto);

            

            return Ok(result);
        }
    }
}
