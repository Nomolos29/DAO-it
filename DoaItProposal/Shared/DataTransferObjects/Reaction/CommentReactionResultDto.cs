namespace Shared.DataTransferObjects.Reaction
{
    public class CommentReactionResultDto
    {
        public Guid CommentId { get; set; }

        public int LikeCount { get; set; }

        public int DislikeCount { get; set; }
    }
}
