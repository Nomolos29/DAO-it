using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Contracts;
using Shared.DataTransferObjects.Reaction;

namespace Presentation.Controller
{
    [ApiController]
    [Route("proposal/comment/[controller]")]
    public class CommentReactionController : ControllerBase
    {
        private readonly IServiceManager _serviceManager;

        public CommentReactionController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpPost("react")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> ReactToProposal(CommentReactionDto reactionDto)
        {
            var result = await _serviceManager.CommentReactionService.ReactToCommentAsync(reactionDto);



            return Ok(result);
        }
    }
}
