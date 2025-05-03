
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Contracts;
using Shared.DataTransferObjects.Comment;
using Shared.DataTransferObjects.Proposal;

namespace Presentation.Controller
{
    [Route("proposal/{proposalId}/[controller]" )]
    
    public class CommentController : ControllerBase
    {
        private readonly IServiceManager _service;

        public CommentController(IServiceManager service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> CreateComment(Guid proposalId, CreateCommentDto createCommentDto)
        {
            var result = await _service.CommentService.CreateCommentAsync(proposalId, createCommentDto);

            if(!result)
                return BadRequest("Failed to create comment");

            return StatusCode(StatusCodes.Status201Created);
        }

        [HttpGet( "GetAllComment")]
        public async Task<IActionResult> GetAllComment(Guid proposalId)
        {
            var result = await _service.CommentService.GetAllCommentsAsync(proposalId);
            
            return Ok(result);
        }


        [HttpGet("GetComment")]
        public async Task<IActionResult> GetComment(Guid proposalId, Guid commentId)
        {
            var result = await _service.CommentService.GetCommentAsync(proposalId, commentId);
            
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateComment(Guid proposalId, Guid commentId, UpdateCommentDto updateCommentDto)
        {
            var result = await _service.CommentService.UpdateCommentAsync(proposalId, commentId, updateCommentDto);
            if (!result)
                return BadRequest("Failed to update comment");
            return Ok("comment updated successfully");
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteComment(Guid proposalId, Guid commentId)
        {
            var result = await _service.CommentService.DeleteCommentAsync(proposalId, commentId);
            if (!result)
                return BadRequest("Failed to delete comment");
            return Ok("comment deleted successfully");
        }
    }
}
