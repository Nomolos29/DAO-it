namespace Entities.Models
{
    public class CommentReaction
    {
        public Guid CommentReactionId { get; set; }
        public Guid CommentId { get; set; }
        public Comment Comment { get; set; }
        public DateTime createdAt { get; set; }
        public string UserId { get; set; }
        public bool IsLike { get; set; }
    }
}
