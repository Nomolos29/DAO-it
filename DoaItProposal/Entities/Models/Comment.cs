using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class Comment
    {
        public Guid CommentId { get; set; }
        public string? CommentText { get; set; }
        public DateTime CreatedAt { get; set; }

        public string? UserId { get; set; }

        public Guid ProposalId { get; set; }
        public Proposal? Proposal { get; set; }

        public ICollection<CommentReaction> Reactions { get; set; } = new List<CommentReaction>();
    }
}
