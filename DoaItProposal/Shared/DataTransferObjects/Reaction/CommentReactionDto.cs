namespace Shared.DataTransferObjects.Reaction
{
    public class CommentReactionDto
    {
        public Guid proposalId { get; set; }
        public Guid commentId { get; set; }

        public string UserId { get; set; }

        public bool IsLike { get; set; }
    }
}
