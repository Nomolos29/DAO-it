namespace Entities.Models
{
    public class ProposalReaction
    {
        public Guid ProposalReactionId { get; set; }
        public Guid ProposalId { get; set; }

        public Proposal proposal { get; set; }
        public string UserId { get; set; }

        public bool IsLike { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}