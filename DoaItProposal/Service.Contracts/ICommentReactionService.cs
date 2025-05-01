using Shared.DataTransferObjects.Reaction;

namespace Service.Contracts
{
    public interface ICommentReactionService
    {
        Task<CommentReactionResultDto> ReactToCommentAsync(CommentReactionDto reationDto);
    }
}
